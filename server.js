/**
 * AniFix — Local server
 * Serves static files + yt-dlp API for YouTube audio streaming
 * Requires: npm install express  &&  yt-dlp in PATH
 */

'use strict';

const express  = require('express');
const { execFile } = require('child_process');
const path     = require('path');
const fs       = require('fs');
const https    = require('https');
const crypto   = require('crypto');

const app  = express();
const PORT = process.env.PORT || 3000;

// ---- Resolve yt-dlp ----
// Prefer local exe in project folder, fall back to PATH
const LOCAL_YTDLP  = path.join(__dirname, 'yt-dlp.exe');
const YTDLP_BIN    = fs.existsSync(LOCAL_YTDLP) ? LOCAL_YTDLP : 'yt-dlp';
const COOKIES_FILE = path.join(__dirname, 'cookies.txt');
console.log(`[yt-dlp] using: ${YTDLP_BIN}`);
console.log(`[yt-dlp] cookies: ${fs.existsSync(COOKIES_FILE) ? COOKIES_FILE : 'nicht gefunden'}`);

// ---- Static files ----
app.use(express.static(path.join(__dirname)));

// ---- Music download directory ----
const MUSIC_DIR = path.join(__dirname, 'public', 'music');
if (!fs.existsSync(MUSIC_DIR)) fs.mkdirSync(MUSIC_DIR, { recursive: true });

// ---- Helpers ----
const YT_HOSTS = new Set(['youtube.com', 'www.youtube.com', 'youtu.be', 'm.youtube.com', 'music.youtube.com']);

function isYouTubeUrl(rawUrl) {
  try {
    const u = new URL(rawUrl);
    // Only allow https
    if (u.protocol !== 'https:') return false;
    return YT_HOSTS.has(u.hostname);
  } catch {
    return false;
  }
}

function getYouTubeVideoId(rawUrl) {
  try {
    const url = new URL(rawUrl);
    if (!YT_HOSTS.has(url.hostname)) return null;

    if (url.hostname === 'youtu.be') {
      return url.pathname.replace(/^\//, '').trim() || null;
    }

    if (url.pathname === '/watch') {
      return url.searchParams.get('v');
    }

    if (url.pathname.startsWith('/shorts/')) {
      return url.pathname.split('/')[2] || null;
    }

    if (url.pathname.startsWith('/embed/')) {
      return url.pathname.split('/')[2] || null;
    }

    return url.searchParams.get('v');
  } catch {
    return null;
  }
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'AniFix/1.0 (+local dev server)',
        'Accept': 'application/json'
      }
    }, (response) => {
      let body = '';

      response.on('data', (chunk) => {
        body += chunk;
      });

      response.on('end', () => {
        if (response.statusCode < 200 || response.statusCode >= 300) {
          reject(new Error(`HTTP ${response.statusCode}: ${body.slice(0, 200)}`));
          return;
        }

        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
  });
}

async function getYouTubeTitle(rawUrl) {
  const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(rawUrl)}&format=json`;
  const noembedUrl = `https://noembed.com/embed?url=${encodeURIComponent(rawUrl)}`;

  try {
    const data = await fetchJson(oembedUrl);
    if (data && typeof data.title === 'string' && data.title.trim()) {
      return data.title.trim();
    }
  } catch (error) {
    console.warn('[yt-info:oembed]', error.message);
  }

  try {
    const data = await fetchJson(noembedUrl);
    if (data && typeof data.title === 'string' && data.title.trim()) {
      return data.title.trim();
    }
  } catch (error) {
    console.warn('[yt-info:noembed]', error.message);
  }

  return null;
}

// ---- API: Download YouTube audio to public/music/ ----
// GET /api/yt-download?url=...
app.get('/api/yt-download', async (req, res) => {
  const url = req.query.url;
  if (!url || !isYouTubeUrl(url)) {
    return res.status(400).json({ error: 'Ungültige oder fehlende URL.' });
  }

  // Fetch title in parallel with download
  let name = null;
  try { name = await getYouTubeTitle(url); } catch (e) {}
  if (!name) {
    const vid = getYouTubeVideoId(url);
    name = vid ? `YouTube Track (${vid})` : 'YouTube Track';
  }

  const fileId    = crypto.randomBytes(8).toString('hex');
  const outTpl    = path.join(MUSIC_DIR, `yt_${fileId}.%(ext)s`);
  const mimeMap   = {
    webm: 'audio/webm', m4a: 'audio/mp4', mp3: 'audio/mpeg',
    ogg: 'audio/ogg', opus: 'audio/webm', flac: 'audio/flac',
    wav: 'audio/wav', aac: 'audio/aac'
  };

  const cookieArgs = fs.existsSync(COOKIES_FILE) ? ['--cookies', COOKIES_FILE] : [];
  const baseArgs = [
    '--no-playlist',
    '-f', 'bestaudio[ext=webm]/bestaudio[ext=m4a]/bestaudio[ext=mp3]/bestaudio/best',
    '--print', 'after_move:filepath',
    '-o', outTpl,
    '--', url
  ];

  const COOKIE_INVALID = /cookies are no longer valid|Sign in to confirm|cookies-from-browser/i;

  function runDownload(args, onDone) {
    execFile(YTDLP_BIN, args, { timeout: 180_000 }, onDone);
  }

  runDownload([...cookieArgs, ...baseArgs], (err, stdout, stderr) => {
    // If cookies expired → retry without them
    if (err && cookieArgs.length && COOKIE_INVALID.test(stderr)) {
      console.warn('[yt-download] Cookies ungültig — Retry ohne Cookies…');
      runDownload(baseArgs, (err2, stdout2, stderr2) => {
        if (err2) {
          console.error('[yt-download]', stderr2);
          return res.status(500).json({ error: 'Download fehlgeschlagen.', detail: stderr2.slice(0, 400) });
        }
        finalizeDownload(stdout2, stderr2);
      });
      return;
    }

    if (err) {
      console.error('[yt-download]', stderr);
      return res.status(500).json({ error: 'Download fehlgeschlagen.', detail: stderr.slice(0, 400) });
    }
    finalizeDownload(stdout, stderr);
  });

  function finalizeDownload(stdout) {
    const filePath = stdout.trim().split('\n').pop();
    if (!filePath || !fs.existsSync(filePath)) {
      return res.status(500).json({ error: 'Heruntergeladene Datei nicht gefunden.' });
    }

    const ext  = path.extname(filePath).toLowerCase().replace('.', '');
    const mime = mimeMap[ext] || 'audio/mpeg';
    // Return server-relative URL — no base64/localStorage bloat
    const relUrl = '/public/music/' + path.basename(filePath);
    console.log(`[yt-download] gespeichert: ${filePath}`);
    res.json({ name, url: relUrl, mime });
  }
});

// ---- API: Get audio stream URL ----
// GET /api/yt-audio?url=https://www.youtube.com/watch?v=...
app.get('/api/yt-audio', (req, res) => {
  const url = req.query.url;
  if (!url || !isYouTubeUrl(url)) {
    return res.status(400).json({ error: 'Ungültige oder fehlende URL.' });
  }

  // execFile is safe — no shell interpolation
  const ytAudioCookieArgs = fs.existsSync(COOKIES_FILE) ? ['--cookies', COOKIES_FILE] : [];
  const audioBaseArgs = ['-g', '-f', 'bestaudio/best', '--no-playlist', '--', url];
  const COOKIE_INVALID_RE = /cookies are no longer valid|Sign in to confirm/i;

  function tryAudio(args, cb) {
    execFile(YTDLP_BIN, args, { timeout: 30_000 }, cb);
  }

  tryAudio([...ytAudioCookieArgs, ...audioBaseArgs], (err, stdout, stderr) => {
    if (err && ytAudioCookieArgs.length && COOKIE_INVALID_RE.test(stderr)) {
      console.warn('[yt-audio] Cookies ungültig — Retry ohne Cookies…');
      tryAudio(audioBaseArgs, (err2, stdout2, stderr2) => {
        if (err2) {
          console.error('[yt-dlp]', stderr2);
          return res.status(500).json({ error: 'yt-dlp fehlgeschlagen.', detail: stderr2.slice(0, 300) });
        }
        res.json({ url: stdout2.trim().split('\n')[0] });
      });
      return;
    }
    if (err) {
      console.error('[yt-dlp]', stderr);
      return res.status(500).json({ error: 'yt-dlp fehlgeschlagen.', detail: stderr.slice(0, 300) });
    }
    res.json({ url: stdout.trim().split('\n')[0] });
  });
});

// ---- API: Fetch video title ----
// GET /api/yt-info?url=...
app.get('/api/yt-info', (req, res) => {
  const url = req.query.url;
  if (!url || !isYouTubeUrl(url)) {
    return res.status(400).json({ error: 'Ungültige oder fehlende URL.' });
  }

  getYouTubeTitle(url)
    .then((title) => {
      if (title) {
        return res.json({ title, source: 'oembed' });
      }

      const ytInfoCookieArgs = fs.existsSync(COOKIES_FILE) ? ['--cookies', COOKIES_FILE] : [];
      execFile(
        YTDLP_BIN,
        [...ytInfoCookieArgs, '--print', 'title', '--no-playlist', '--', url],
        { timeout: 30_000 },
        (err, stdout, stderr) => {
          if (err) {
            const videoId = getYouTubeVideoId(url);
            console.error('[yt-dlp]', stderr);
            if (videoId) {
              return res.json({
                title: `YouTube Track (${videoId})`,
                source: 'fallback',
                warning: 'Titel konnte nicht direkt geladen werden.'
              });
            }
            return res.status(500).json({ error: 'Titel konnte nicht geladen werden.', detail: stderr.slice(0, 300) });
          }
          res.json({ title: stdout.trim(), source: 'yt-dlp' });
        }
      );
    })
    .catch((error) => {
      console.error('[yt-info]', error);
      res.status(500).json({ error: 'Titel konnte nicht geladen werden.', detail: String(error.message || error).slice(0, 300) });
    });
});

app.listen(PORT, () => {
  console.log(`\n  AniFix läuft unter http://localhost:${PORT}\n`);
});
