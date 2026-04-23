/* =============================================
   AniFix // Particle + Grid Background
   ============================================= */

(function () {
  // ---- Datetime ----
  function updateTime() {
    const el = document.getElementById('datetime');
    if (!el) return;
    const now = new Date();
    el.textContent = now.toLocaleString('de-DE', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  }
  updateTime();
  setInterval(updateTime, 1000);

  // ---- Canvas Particle Background ----
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], lines = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); init(); });

  const PARTICLE_COUNT = Math.min(80, Math.floor(window.innerWidth / 16));
  const CYAN = '0, 230, 200';
  const LINE_DIST = 140;

  function randBetween(a, b) { return a + Math.random() * (b - a); }

  function createParticle() {
    return {
      x: randBetween(0, W),
      y: randBetween(0, H),
      vx: randBetween(-0.18, 0.18),
      vy: randBetween(-0.18, 0.18),
      r: randBetween(1, 2.4),
      alpha: randBetween(0.15, 0.55),
    };
  }

  function init() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(createParticle());
  }
  init();

  // Floating hex/node shapes
  const nodes = [];
  for (let i = 0; i < 5; i++) {
    nodes.push({
      x: randBetween(0.1, 0.9),
      y: randBetween(0.1, 0.9),
      r: randBetween(30, 70),
      angle: randBetween(0, Math.PI * 2),
      speed: randBetween(0.0002, 0.0006),
      alpha: randBetween(0.03, 0.07),
      sides: 6,
    });
  }

  function drawHex(cx, cy, r, angle, alpha) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i;
      ctx[i === 0 ? 'moveTo' : 'lineTo'](Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.strokeStyle = `rgba(${CYAN}, ${alpha})`;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }

  let mouseX = W / 2, mouseY = H / 2;
  document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

  let frame = 0;
  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, W, H);

    frame++;

    // Radial glow under cursor
    const grad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 320);
    grad.addColorStop(0, `rgba(${CYAN}, 0.04)`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Hex overlays
    nodes.forEach(n => {
      n.angle += n.speed;
      drawHex(n.x * W, n.y * H, n.r, n.angle, n.alpha);
    });

    // Particles
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${CYAN}, ${p.alpha})`;
      ctx.fill();
    });

    // Connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < LINE_DIST) {
          const a = (1 - d / LINE_DIST) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${CYAN}, ${a})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Horizontal scan line
    const scanY = ((frame * 0.4) % H);
    const scanGrad = ctx.createLinearGradient(0, scanY - 60, 0, scanY + 60);
    scanGrad.addColorStop(0, 'transparent');
    scanGrad.addColorStop(0.5, `rgba(${CYAN}, 0.03)`);
    scanGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = scanGrad;
    ctx.fillRect(0, scanY - 60, W, 120);
  }
  animate();

  // ---- Music Player ----
  const audio = document.getElementById('bg-audio');
  const player = document.getElementById('music-player');
  const toggle = document.getElementById('music-toggle');
  const trackLabel = document.querySelector('.music-track');

  let isPlaying = false;
  let tracks = JSON.parse(localStorage.getItem('anifix_tracks') || '[]');
  let currentTrack = 0;

  function loadStoredAvatar() {
    const stored = localStorage.getItem('anifix_avatar');
    const display = document.getElementById('avatar-display');
    if (stored && display) {
      display.innerHTML = `<img src="${stored}" alt="Avatar" />`;
    }
  }
  loadStoredAvatar();

  async function loadCurrentTrack() {
    if (!audio || tracks.length === 0) {
      if (trackLabel) trackLabel.textContent = '— keine Musik geladen —';
      return;
    }
    const t = tracks[currentTrack % tracks.length];

    if (t.type === 'youtube') {
      if (trackLabel) trackLabel.textContent = t.name + ' · laden...';
      try {
        const res = await fetch('/api/yt-audio?url=' + encodeURIComponent(t.ytUrl));
        const data = await res.json();
        if (!data.url) throw new Error(data.error || 'Kein Stream');
        audio.src = data.url;
        if (trackLabel) trackLabel.textContent = '▶ ' + t.name;
        if (isPlaying) audio.play().catch(() => {});
      } catch (e) {
        if (trackLabel) trackLabel.textContent = '⚠ ' + t.name + ' — Stream-Fehler';
        console.warn('[yt-audio]', e);
      }
    } else {
      audio.src = t.url;
      if (trackLabel) trackLabel.textContent = t.name;
      if (isPlaying) audio.play().catch(() => {});
    }
  }

  function loadTracksFromStorage() {
    tracks = JSON.parse(localStorage.getItem('anifix_tracks') || '[]');
    loadCurrentTrack();
  }
  loadTracksFromStorage();

  if (toggle) {
    toggle.addEventListener('click', async () => {
      if (!audio || tracks.length === 0) return;
      if (isPlaying) {
        audio.pause();
        isPlaying = false;
        player.classList.remove('playing');
      } else {
        // For YouTube tracks, ensure the src is fresh before playing
        const t = tracks[currentTrack % tracks.length];
        if (t && t.type === 'youtube' && !audio.src) {
          await loadCurrentTrack();
        }
        audio.play().then(() => {
          isPlaying = true;
          player.classList.add('playing');
        }).catch(() => {});
      }
    });
  }

  if (audio) {
    audio.addEventListener('ended', () => {
      currentTrack = (currentTrack + 1) % Math.max(tracks.length, 1);
      loadCurrentTrack();
    });
    // Refresh YT stream on error (URLs expire after ~6h)
    audio.addEventListener('error', () => {
      const t = tracks[currentTrack % tracks.length];
      if (t && t.type === 'youtube') loadCurrentTrack();
    });
  }

  window.addEventListener('storage', () => {
    loadTracksFromStorage();
    loadStoredAvatar();
  });
})();
