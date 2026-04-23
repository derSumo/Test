/* =============================================
   AniFix // Admin Panel Logic
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {
  const DEFAULT_HASH = 'anifix2024';
  const PW_KEY = 'anifix_pw';
  const TRACKS_KEY = 'anifix_tracks';
  const AVATAR_KEY = 'anifix_avatar';
  const SKILLS_KEY = 'anifix_skills';
  const SKILLS_HEADING_KEY = 'anifix_skills_heading';
  const NOTIFS_KEY = 'anifix_notifs';
  const TOAST_CONF_KEY = 'anifix_toast_conf';
  const PROFILE_KEY = 'anifix_profile';
  const ABOUT_KEY = 'anifix_about';
  const LOCATION_KEY = 'anifix_location';
  const HINT_KEY = 'anifix_hint';
  const SOCIALS_KEY = 'anifix_socials';
  const MANGA_KEY = 'anifix_manga';
  const FEATURES_KEY = 'anifix_features';
  const LINKS_KEY = 'anifix_links';
  const SECTION_ORDER_KEY = 'anifix_section_order';

  // FA icons available in the icon picker (solid + brands)
  const FA_ICONS_SOLID = [
    'house','gear','star','heart','bell','bookmark','check','circle-check',
    'bolt','fire','rocket','globe','envelope','phone','camera','image',
    'video','music','play','headphones','microphone','cube','database',
    'server','code','terminal','bug','wrench','screwdriver-wrench',
    'magnifying-glass','link','share-nodes','arrow-up-right-from-square',
    'download','upload','cloud','lock','unlock','key','shield-halved',
    'user','users','id-card','gamepad','chess','trophy','medal','crown',
    'flag','location-dot','compass','chart-line','chart-bar','tv','desktop',
    'laptop','mobile','wifi','network-wired','calendar','clock','infinity',
    'leaf','robot','brain','atom','flask','book-open','graduation-cap',
    'pen','palette','wand-magic-sparkles','coffee','pizza-slice',
    'shopping-cart','tag','box','gift','truck','car','plane','bitcoin-sign',
    'dollar-sign','coins','credit-card','wallet'
  ];
  const FA_ICONS_BRANDS = [
    'github','discord','youtube','twitter','instagram','tiktok','linkedin',
    'twitch','steam','spotify','reddit','telegram','whatsapp','snapchat'
  ];
  const EMOJI_ICONS = [
    '👋','🖥️','🎮','🎯','🏆','🚀','💡','🔥','⚡','🌟','❤️','💜','💙',
    '🎵','🎧','📸','🎬','📚','📖','✍️','🖊️','🎨','🏠','🌍','🗺️',
    '🔧','⚙️','🛠️','🔑','🔒','🤖','🧠','🧪','🔬','🌿','🐱','🐉',
    '⭐','🌙','☀️','❄️','🎃','🎄','🎁','📦','💎','👑','🏅','🎖️'
  ];

  const DEFAULT_SKILLS = [
    { icon: 'html', label: 'HTML5', orbit: 'inner' },
    { icon: 'css', label: 'CSS3', orbit: 'inner' },
    { icon: 'javascript', label: 'JavaScript', orbit: 'inner' },
    { icon: 'react', label: 'React', orbit: 'outer' },
    { icon: 'node', label: 'Node.js', orbit: 'outer' },
    { icon: 'tailwind', label: 'Tailwind', orbit: 'outer' },
  ];

  const DEFAULT_NOTIFS = [
    { icon: '👋', app: 'AniFix', title: 'Hey, willkommen!', sub: 'Schön, dass du vorbeischaust.', delay: 800 },
    { icon: '🖥️', app: 'Homelab', title: 'Alle Dienste online', sub: 'Proxmox · Unraid · Home Assistant', delay: 2200 },
    { icon: '🎮', app: 'Gaming', title: 'Satisfactory läuft', sub: 'Fabrik-Ausbau Stufe 7 aktiv', delay: 3800 },
  ];

  const DEFAULT_TOAST_CONF = {
    mode: 'sequential',
    animation: 'slide',
    duration: 5500,
    gap: 0
  };

  const DEFAULT_PROFILE = {
    name: 'AniFix',
    alias: 'aka Sumo',
    titles: ['\uD83C\uDFAE Gamer', '\uD83D\uDDA5\uFE0F Homelab Tinkerer', '\uD83E\uDD16 AI Developer', '\uD83D\uDD27 Bastler aus Leidenschaft']
  };

  const DEFAULT_ABOUT = {
    text: 'Bastler aus Leidenschaft. Homelab-Enthusiast und Gamer.\nVon Server-Setup bis KI-Tooling \u2014 wenn\u2019s spannend klingt, ist es einen Versuch wert.',
    tags: ['Gamer', 'Homelab', 'Tinkerer', 'AI Dev']
  };

  const DEFAULT_LOCATION = 'Ans\u00e4ssig in Deutschland \uD83C\uDDE9\uD83C\uDDEA';

  const DEFAULT_HINT = {
    title: '\u26A0\uFE0F Hinweis',
    text: 'Diese Seite ist privat. F\u00fcr den Administratorbereich hier klicken.'
  };

  const DEFAULT_SOCIALS = {
    discord: 'Sumo',
    github: 'https://github.com/'
  };

  const DEFAULT_FEATURES = {
    splashLoader: true,
    avatarGlow: true,
    homeQuickMenu: true,
    mangaTab: true,
    linkPage: true,
    notifications: true,
    musicPlayer: true,
    orbitSkills: true,
  };

  const DEFAULT_LINKS = [
    { icon: 'fa-brands fa-github', label: 'GitHub', url: 'https://github.com/', note: 'Code, Repos und Projekte' },
    { icon: 'fa-solid fa-book-open', label: 'Manga Pipeline', url: '#manga', note: 'Aktuelle Uploads und Releases' },
    { icon: 'fa-solid fa-envelope', label: 'Kontakt', url: 'mailto:hello@anifix.local', note: 'Direkte Anfragen und Feedback' },
  ];

  const DEFAULT_SECTION_ORDER = ['hero', 'skills', 'about', 'location', 'hint'];

  const SECTION_BUILDER_META = {
    hero: { title: 'Hero', description: 'Avatar, Name, Alias und Social Links' },
    skills: { title: 'Skills Orbit', description: 'Orbiting Skill Showcase mit Animation' },
    about: { title: 'About', description: 'Beschreibung und Tags' },
    location: { title: 'Standort', description: 'Standort- oder Statuszeile' },
    hint: { title: 'Hinweis', description: 'Der untere Hinweis- beziehungsweise Admin-Block' },
  };

  const DEFAULT_MANGA = [
    { manga: 'Solo Leveling', vol: 'Vol 1 \u2013 Kap 1-10', status: 'uploaded', date: '2026-03-15' },
    { manga: 'Solo Leveling', vol: 'Vol 2 \u2013 Kap 11-20', status: 'uploaded', date: '2026-03-28' },
    { manga: 'Chainsaw Man', vol: 'Vol 1 \u2013 Kap 1-7', status: 'uploaded', date: '2026-04-05' },
    { manga: 'Chainsaw Man', vol: 'Vol 2 \u2013 Kap 8-16', status: 'pending', date: '\u2014' },
    { manga: 'Jujutsu Kaisen', vol: 'Vol 1 \u2013 Kap 1-8', status: 'tl', date: '\u2014' },
    { manga: 'One Punch Man', vol: 'Vol 1 \u2013 Kap 1-9', status: 'pending', date: '\u2014' },
  ];

  // ---- Seed defaults into localStorage on first visit ----
  if (!localStorage.getItem(SKILLS_KEY)) {
    localStorage.setItem(SKILLS_KEY, JSON.stringify(DEFAULT_SKILLS));
  }
  // skills heading has no mandatory default — empty = hidden
  // skills heading has no mandatory default — empty = hidden
  if (!localStorage.getItem(NOTIFS_KEY)) {
    localStorage.setItem(NOTIFS_KEY, JSON.stringify(DEFAULT_NOTIFS));
  }
  if (!localStorage.getItem(PROFILE_KEY)) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(DEFAULT_PROFILE));
  }
  if (!localStorage.getItem(ABOUT_KEY)) {
    localStorage.setItem(ABOUT_KEY, JSON.stringify(DEFAULT_ABOUT));
  }
  if (!localStorage.getItem(LOCATION_KEY)) {
    localStorage.setItem(LOCATION_KEY, JSON.stringify(DEFAULT_LOCATION));
  }
  if (!localStorage.getItem(HINT_KEY)) {
    localStorage.setItem(HINT_KEY, JSON.stringify(DEFAULT_HINT));
  }
  if (!localStorage.getItem(SOCIALS_KEY)) {
    localStorage.setItem(SOCIALS_KEY, JSON.stringify(DEFAULT_SOCIALS));
  }
  if (!localStorage.getItem(MANGA_KEY)) {
    localStorage.setItem(MANGA_KEY, JSON.stringify(DEFAULT_MANGA));
  }
  if (!localStorage.getItem(FEATURES_KEY)) {
    localStorage.setItem(FEATURES_KEY, JSON.stringify(DEFAULT_FEATURES));
  }
  if (!localStorage.getItem(LINKS_KEY)) {
    localStorage.setItem(LINKS_KEY, JSON.stringify(DEFAULT_LINKS));
  }
  if (!localStorage.getItem(SECTION_ORDER_KEY)) {
    localStorage.setItem(SECTION_ORDER_KEY, JSON.stringify(DEFAULT_SECTION_ORDER));
  }
  if (!localStorage.getItem(TOAST_CONF_KEY)) {
    localStorage.setItem(TOAST_CONF_KEY, JSON.stringify(DEFAULT_TOAST_CONF));
  }

  // ---- UTILS ----
  function escHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function $(id) { return document.getElementById(id); }

  function parseJson(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
      return fallback;
    }
  }

  function normalizeSectionOrder(order) {
    var next = Array.isArray(order) ? order.filter(function (id) {
      return DEFAULT_SECTION_ORDER.indexOf(id) !== -1;
    }) : [];
    DEFAULT_SECTION_ORDER.forEach(function (id) {
      if (next.indexOf(id) === -1) next.push(id);
    });
    return next;
  }

  function getFeatures() {
    var stored = parseJson(FEATURES_KEY, {}) || {};
    return Object.assign({}, DEFAULT_FEATURES, stored);
  }

  function setFeatures(features) {
    localStorage.setItem(FEATURES_KEY, JSON.stringify(Object.assign({}, DEFAULT_FEATURES, features || {})));
  }

  function getLinks() {
    return parseJson(LINKS_KEY, DEFAULT_LINKS) || DEFAULT_LINKS;
  }

  function setLinks(links) {
    localStorage.setItem(LINKS_KEY, JSON.stringify(links));
  }

  function getSectionOrder() {
    return normalizeSectionOrder(parseJson(SECTION_ORDER_KEY, DEFAULT_SECTION_ORDER));
  }

  function setSectionOrder(order) {
    localStorage.setItem(SECTION_ORDER_KEY, JSON.stringify(normalizeSectionOrder(order)));
  }

  var loginSection = $('login-section');
  var adminSection = $('admin-section');

  function showScreen(el, animate) {
    if (!el) return;
    if (el._hideTimer) {
      clearTimeout(el._hideTimer);
      el._hideTimer = null;
    }
    el.style.display = '';
    if (!animate) {
      el.classList.add('is-visible');
      el.classList.remove('is-hidden');
      return;
    }
    el.classList.remove('is-visible');
    el.classList.add('is-hidden');
    requestAnimationFrame(function () {
      el.classList.add('is-visible');
      el.classList.remove('is-hidden');
    });
  }

  function hideScreen(el, animate) {
    if (!el) return;
    if (!animate) {
      el.classList.remove('is-visible');
      el.classList.add('is-hidden');
      el.style.display = 'none';
      return;
    }
    el.classList.remove('is-visible');
    el.classList.add('is-hidden');
    el._hideTimer = window.setTimeout(function () {
      el.style.display = 'none';
    }, 420);
  }

  function initAuroraBackground() {
    var container = $('aurora-bg');
    if (!container || !window.THREE) return;

    try {
      var scene = new THREE.Scene();
      var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      var renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setClearColor(0x000000, 0);
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);

      var material = new THREE.ShaderMaterial({
        transparent: true,
        uniforms: {
          iTime: { value: 0 },
          iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
        },
        vertexShader: 'void main(){gl_Position=vec4(position,1.0);}',
        fragmentShader: [
          'uniform float iTime;',
          'uniform vec2 iResolution;',
          '#define NUM_OCTAVES 3',
          'float rand(vec2 n){return fract(sin(dot(n,vec2(12.9898,4.1414)))*43758.5453);}',
          'float noise(vec2 p){vec2 ip=floor(p);vec2 u=fract(p);u=u*u*(3.0-2.0*u);float res=mix(mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);return res*res;}',
          'float fbm(vec2 x){float v=0.0;float a=0.3;vec2 shift=vec2(100.0);mat2 rot=mat2(cos(0.5),sin(0.5),-sin(0.5),cos(0.5));for(int i=0;i<NUM_OCTAVES;++i){v+=a*noise(x);x=rot*x*2.0+shift;a*=0.4;}return v;}',
          'void main(){vec2 shake=vec2(sin(iTime*1.2)*0.005,cos(iTime*2.1)*0.005);vec2 p=((gl_FragCoord.xy+shake*iResolution.xy)-iResolution.xy*0.5)/iResolution.y*mat2(6.0,-4.0,4.0,6.0);vec2 v;vec4 o=vec4(0.0);float f=2.0+fbm(p+vec2(iTime*5.0,0.0))*0.5;for(float i=0.0;i<35.0;i++){v=p+cos(i*i+(iTime+p.x*0.08)*0.025+i*vec2(13.0,11.0))*3.5+vec2(sin(iTime*3.0+i)*0.003,cos(iTime*3.5-i)*0.003);float tailNoise=fbm(v+vec2(iTime*0.5,i))*0.3*(1.0-(i/35.0));vec4 ac=vec4(0.1+0.3*sin(i*0.2+iTime*0.4),0.3+0.5*cos(i*0.3+iTime*0.5),0.7+0.3*sin(i*0.4+iTime*0.3),1.0);vec4 cc=ac*exp(sin(i*i+iTime*0.8))/length(max(v,vec2(v.x*f*0.015,v.y*1.5)));float tf=smoothstep(0.0,1.0,i/35.0)*0.6;o+=cc*(1.0+tailNoise*0.8)*tf;}o=tanh(pow(o/100.0,vec4(1.6)));gl_FragColor=o*1.15;}'
        ].join('\n')
      });

      var geometry = new THREE.PlaneGeometry(2, 2);
      var mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      function renderAurora() {
        material.uniforms.iTime.value += 0.016;
        renderer.render(scene, camera);
        requestAnimationFrame(renderAurora);
      }

      renderAurora();

      window.addEventListener('resize', function () {
        renderer.setSize(window.innerWidth, window.innerHeight);
        material.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight);
      });
    } catch (err) {
      container.innerHTML = '';
    }
  }

  // ---- Shared Icon Picker ----
  function createIconPicker(currentValue, onPick) {
    var wrap = document.createElement('div');
    wrap.className = 'ip-wrap';

    var trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'ip-trigger';
    trigger.title = 'Icon auswählen';
    trigger.innerHTML = '<i class="fa-solid fa-icons"></i>';

    var popup = document.createElement('div');
    popup.className = 'ip-popup';

    var tabs = document.createElement('div');
    tabs.className = 'ip-tabs';
    var tabDefs = [{ id: 'emoji', label: 'Emoji' }, { id: 'solid', label: 'Icons' }, { id: 'brands', label: 'Brands' }];
    var activeTab = 'emoji';

    var searchEl = document.createElement('input');
    searchEl.type = 'text';
    searchEl.className = 'ip-search';
    searchEl.placeholder = 'Suchen…';

    var grid = document.createElement('div');
    grid.className = 'ip-grid';

    function renderGrid(tab, filter) {
      grid.innerHTML = '';
      var items = [];
      if (tab === 'emoji') items = EMOJI_ICONS;
      else if (tab === 'solid') items = FA_ICONS_SOLID.map(function(n) { return 'fa-solid fa-' + n; });
      else items = FA_ICONS_BRANDS.map(function(n) { return 'fa-brands fa-' + n; });

      if (filter) {
        var f = filter.toLowerCase();
        items = items.filter(function(v) { return v.toLowerCase().includes(f); });
      }
      items.forEach(function(val) {
        var el = document.createElement('div');
        el.className = 'ip-item';
        el.title = val;
        if (tab === 'emoji') {
          el.textContent = val;
        } else {
          el.innerHTML = '<i class="' + val + '"></i>';
        }
        el.addEventListener('mousedown', function(e) {
          e.preventDefault();
          onPick(val);
          popup.classList.remove('open');
        });
        grid.appendChild(el);
      });
    }

    tabDefs.forEach(function(t) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ip-tab' + (t.id === activeTab ? ' active' : '');
      btn.textContent = t.label;
      btn.addEventListener('mousedown', function(e) {
        e.preventDefault();
        activeTab = t.id;
        tabs.querySelectorAll('.ip-tab').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        renderGrid(activeTab, searchEl.value);
      });
      tabs.appendChild(btn);
    });

    searchEl.addEventListener('input', function() { renderGrid(activeTab, searchEl.value); });

    popup.appendChild(tabs);
    popup.appendChild(searchEl);
    popup.appendChild(grid);

    trigger.addEventListener('mousedown', function(e) {
      e.preventDefault();
      var isOpen = popup.classList.contains('open');
      // close all other pickers
      document.querySelectorAll('.ip-popup.open').forEach(function(p) { p.classList.remove('open'); });
      if (!isOpen) {
        renderGrid(activeTab, '');
        popup.classList.add('open');
        setTimeout(function() { searchEl.focus(); }, 50);
      }
    });

    // Close on outside click
    document.addEventListener('mousedown', function(e) {
      if (!wrap.contains(e.target)) popup.classList.remove('open');
    }, { capture: true });

    wrap.appendChild(trigger);
    wrap.appendChild(popup);
    return wrap;
  }

  function rteWrapSelection(editor, tag, attrs) {
    var sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    var range = sel.getRangeAt(0);
    if (range.collapsed) return;
    if (!editor.contains(range.commonAncestorContainer)) return;
    var el = document.createElement(tag);
    Object.keys(attrs).forEach(function(k) { el.setAttribute(k, attrs[k]); });
    try {
      range.surroundContents(el);
    } catch(e) {
      var frag = range.extractContents();
      el.appendChild(frag);
      range.insertNode(el);
    }
    sel.removeAllRanges();
    var nr = document.createRange();
    nr.selectNodeContents(el);
    sel.addRange(nr);
  }

  function initRte() {
    var editor  = $('about-rte');
    var preview = $('about-rte-preview');
    if (!editor || !preview) return;

    function syncPreview() { preview.innerHTML = editor.innerHTML; }

    // Prevent paste of rich HTML — plain text only
    editor.addEventListener('paste', function(e) {
      e.preventDefault();
      var txt = (e.clipboardData || window.clipboardData).getData('text/plain');
      document.execCommand('insertText', false, txt);
    });

    editor.addEventListener('input', syncPreview);

    // Bold / Italic / Underline
    editor.closest ? null : null; // noop (namespace anchor)
    document.querySelectorAll('[data-cmd]').forEach(function(btn) {
      btn.addEventListener('mousedown', function(e) {
        e.preventDefault();
        document.execCommand(this.dataset.cmd, false, null);
        editor.focus();
        syncPreview();
      });
    });

    // Font family
    var ffSel = $('rte-fontfamily');
    if (ffSel) ffSel.addEventListener('change', function() {
      var v = this.value; if (!v) return;
      editor.focus();
      rteWrapSelection(editor, 'span', { style: 'font-family:' + v });
      syncPreview(); this.value = '';
    });

    // Font size
    var fsSel = $('rte-fontsize');
    if (fsSel) fsSel.addEventListener('change', function() {
      var v = this.value; if (!v) return;
      editor.focus();
      rteWrapSelection(editor, 'span', { style: 'font-size:' + v });
      syncPreview(); this.value = '';
    });

    // Text color
    var colorIn = $('rte-color');
    if (colorIn) colorIn.addEventListener('input', function() {
      document.execCommand('foreColor', false, this.value);
      editor.focus();
      syncPreview();
    });

    // Link
    var linkBtn = $('rte-link-btn');
    if (linkBtn) linkBtn.addEventListener('mousedown', function(e) {
      e.preventDefault();
      var url = prompt('URL eingeben:', 'https://');
      if (url && (url.startsWith('https://') || url.startsWith('http://'))) {
        document.execCommand('createLink', false, url);
        editor.querySelectorAll('a:not([target])').forEach(function(a) {
          a.target = '_blank'; a.rel = 'noopener noreferrer';
        });
      }
      editor.focus(); syncPreview();
    });

    // Unlink
    var unlinkBtn = $('rte-unlink-btn');
    if (unlinkBtn) unlinkBtn.addEventListener('mousedown', function(e) {
      e.preventDefault();
      document.execCommand('unlink', false, null);
      editor.focus(); syncPreview();
    });

    // Animation class
    var animSel = $('rte-animation');
    if (animSel) animSel.addEventListener('change', function() {
      var cls = this.value; if (!cls) return;
      editor.focus();
      rteWrapSelection(editor, 'span', { 'class': cls });
      syncPreview(); this.value = '';
    });

    // Clear formatting
    var clearBtn = $('rte-clear-btn');
    if (clearBtn) clearBtn.addEventListener('mousedown', function(e) {
      e.preventDefault();
      var sel = window.getSelection();
      var hasSelection = sel && !sel.isCollapsed && sel.rangeCount > 0 && editor.contains(sel.getRangeAt(0).commonAncestorContainer);
      if (hasSelection) {
        document.execCommand('removeFormat', false, null);
        // Strip animation/class spans within selection range
        var range = sel.getRangeAt(0);
        var frag = range.cloneContents();
        frag.querySelectorAll('span[class]').forEach(function(s) {
          var parent = s.parentNode;
          while (s.firstChild) parent.insertBefore(s.firstChild, s);
          parent.removeChild(s);
        });
      } else {
        // No selection: clear entire editor
        document.execCommand('selectAll', false, null);
        document.execCommand('removeFormat', false, null);
        editor.querySelectorAll('span[class],span[style]').forEach(function(s) {
          var parent = s.parentNode;
          if (!parent) return;
          while (s.firstChild) parent.insertBefore(s.firstChild, s);
          parent.removeChild(s);
        });
      }
      editor.focus(); syncPreview();
    });
  }

  function initLoginSplash() {
    var splash = $('splash');
    var features = getFeatures();
    if (!splash) return;
    if (!features.splashLoader) {
      splash.remove();
      return;
    }
    var MIN_SPLASH = 1200;
    var MAX_WAIT   = 4000; // Notfall-Fallback
    var start = performance.now();
    var done = false;
    function dismissSplash() {
      if (done) return;
      done = true;
      splash.classList.add('hide');
      setTimeout(function () { splash.remove(); }, 700);
    }
    var fallback = setTimeout(dismissSplash, MAX_WAIT);
    window.addEventListener('load', function () {
      clearTimeout(fallback);
      var elapsed = performance.now() - start;
      var remaining = Math.max(0, MIN_SPLASH - elapsed);
      setTimeout(dismissSplash, remaining);
    });
  }

  function initFloatingMenu() {
    var wrap = $('fab-wrap');
    var main = $('fab-main');
    var focusBtn = $('fab-focus-login');
    var saveBtnFab = $('fab-save');
    var logoutBtnFab = $('fab-logout');
    if (!wrap || !main) return function () {};

    function closeFab() {
      wrap.classList.remove('open');
    }

    function updateFabState() {
      var loggedIn = isLoggedIn();
      if (focusBtn) focusBtn.classList.toggle('fab-hidden', loggedIn);
      if (saveBtnFab) saveBtnFab.classList.toggle('fab-hidden', !loggedIn);
      if (logoutBtnFab) logoutBtnFab.classList.toggle('fab-hidden', !loggedIn);
    }

    main.addEventListener('click', function () {
      wrap.classList.toggle('open');
    });

    document.addEventListener('click', function (e) {
      if (!wrap.contains(e.target)) closeFab();
    });

    wrap.querySelectorAll('[data-fab-action]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var action = btn.getAttribute('data-fab-action');
        if (action === 'home') {
          location.href = 'index.html';
          return;
        }
        if (action === 'focus-login') {
          var pw = $('passwd');
          if (pw) pw.focus();
        }
        if (action === 'save') {
          var save = $('btn-save');
          if (save) save.click();
        }
        if (action === 'logout') {
          var logout = $('btn-logout');
          if (logout) logout.click();
        }
        closeFab();
      });
    });

    updateFabState();
    return updateFabState;
  }

  function initAdminGroups() {
    document.querySelectorAll('[data-group]').forEach(function (group) {
      var toggle = group.querySelector('[data-group-toggle]');
      if (!toggle) return;
      toggle.addEventListener('click', function () {
        group.classList.toggle('open');
      });
    });
  }

  function refreshAdminOverview() {
    var profileStatus = $('overview-profile-status');
    var mangaCount = $('overview-manga-count');
    var trackCount = $('overview-track-count');
    var skillCount = $('overview-skill-count');
    var features = getFeatures();
    var enabled = Object.keys(features).filter(function (key) { return !!features[key]; }).length;
    if (profileStatus) profileStatus.textContent = enabled + ' / ' + Object.keys(DEFAULT_FEATURES).length + ' aktiv';
    if (mangaCount) mangaCount.textContent = getManga().length + ' Einträge';
    if (trackCount) trackCount.textContent = tracks.length + ' Tracks';
    if (skillCount) skillCount.textContent = getSkills().length + ' Skills';
  }

  function initFeatureControls() {
    document.querySelectorAll('[data-feature-key]').forEach(function (input) {
      input.addEventListener('change', function () {
        var features = getFeatures();
        var key = input.getAttribute('data-feature-key');
        features[key] = !!input.checked;
        setFeatures(features);
        applyFeatureDim(input);
        refreshAdminOverview();
      });
    });
  }

  function applyFeatureDim(input) {
    var item = input.closest('.feature-item');
    if (!item) return;
    item.classList.toggle('is-off', !input.checked);
  }

  function refreshAllFeatureDim() {
    document.querySelectorAll('[data-feature-key]').forEach(function (input) {
      applyFeatureDim(input);
    });
  }

  function renderLinksList() {
    var links = getLinks();
    var list = $('linkpage-list');
    if (!list) return;
    list.innerHTML = '';
    if (!links.length) {
      list.innerHTML = '<p class="editor-empty">Keine Linkpage-Einträge.</p>';
      return;
    }

    links.forEach(function (link, index) {
      var div = document.createElement('div');
      div.className = 'editor-item';
      div.style.cssText = 'display:flex;flex-direction:column;gap:6px;padding:10px;border-radius:10px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);';

      // Row 1: icon preview + icon picker + label + remove
      var row1 = document.createElement('div');
      row1.style.cssText = 'display:flex;gap:6px;align-items:center;';

      var iconPreview = document.createElement('span');
      iconPreview.style.cssText = 'min-width:24px;text-align:center;display:flex;align-items:center;justify-content:center;font-size:1rem;';
      var iconVal = link.icon || 'fa-solid fa-link';
      if (iconVal.startsWith('fa-')) {
        iconPreview.innerHTML = '<i class="' + iconVal + '" style="font-size:.85rem;color:#60a5fa"></i>';
      } else {
        iconPreview.textContent = iconVal;
      }

      var picker = createIconPicker(iconVal, function(val) {
        var ld = getLinks();
        if (ld[index]) { ld[index].icon = val; setLinks(ld); renderLinksList(); }
      });

      var labelInput = document.createElement('input');
      labelInput.className = 'editor-input';
      labelInput.type = 'text';
      labelInput.value = link.label || '';
      labelInput.placeholder = 'Label';
      labelInput.style.flex = '1';
      labelInput.dataset.linkField = 'label';
      labelInput.dataset.linkIdx = String(index);

      var removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'btn-remove';
      removeBtn.title = 'Entfernen';
      removeBtn.textContent = '✕';

      row1.appendChild(iconPreview);
      row1.appendChild(picker);
      row1.appendChild(labelInput);
      row1.appendChild(removeBtn);

      // Row 2: url + note
      var row2 = document.createElement('div');
      row2.style.cssText = 'display:flex;gap:6px;';

      var urlInput = document.createElement('input');
      urlInput.className = 'editor-input';
      urlInput.type = 'text';
      urlInput.value = link.url || '';
      urlInput.placeholder = 'https://... oder #manga';
      urlInput.style.flex = '1';
      urlInput.dataset.linkField = 'url';
      urlInput.dataset.linkIdx = String(index);

      var noteInput = document.createElement('input');
      noteInput.className = 'editor-input';
      noteInput.type = 'text';
      noteInput.value = link.note || '';
      noteInput.placeholder = 'Kurzer Hinweis';
      noteInput.style.flex = '1';
      noteInput.dataset.linkField = 'note';
      noteInput.dataset.linkIdx = String(index);

      row2.appendChild(urlInput);
      row2.appendChild(noteInput);

      div.appendChild(row1);
      div.appendChild(row2);
      list.appendChild(div);

      [labelInput, urlInput, noteInput].forEach(function(input) {
        input.addEventListener('change', function() {
          var ld = getLinks();
          var idx = parseInt(input.dataset.linkIdx, 10);
          var field = input.dataset.linkField;
          if (ld[idx]) { ld[idx][field] = input.value; setLinks(ld); }
        });
      });

      removeBtn.addEventListener('click', function() {
        var ld = getLinks();
        ld.splice(index, 1);
        setLinks(ld);
        renderLinksList();
      });
    });
  }

  function renderSectionBuilder() {
    var list = $('section-builder-list');
    var order = getSectionOrder();
    if (!list) return;
    list.innerHTML = '';

    order.forEach(function (id) {
      var meta = SECTION_BUILDER_META[id];
      if (!meta) return;
      var item = document.createElement('div');
      item.className = 'builder-item';
      item.draggable = true;
      item.setAttribute('data-builder-id', id);
      item.innerHTML =
        '<span class="builder-handle"><i class="fa-solid fa-grip-vertical"></i></span>' +
        '<span class="builder-copy"><strong>' + escHtml(meta.title) + '</strong><small>' + escHtml(meta.description) + '</small></span>';
      list.appendChild(item);
    });

    var draggingEl = null;
    var placeholder = document.createElement('div');
    placeholder.className = 'builder-item builder-placeholder';
    placeholder.style.cssText = 'opacity:0.3;border:2px dashed rgba(96,165,250,.4);background:rgba(96,165,250,.05);pointer-events:none;';

    list.querySelectorAll('.builder-item').forEach(function (item) {
      item.addEventListener('dragstart', function (e) {
        draggingEl = item;
        setTimeout(function () { item.classList.add('dragging'); }, 0);
        e.dataTransfer.effectAllowed = 'move';
      });

      item.addEventListener('dragend', function () {
        item.classList.remove('dragging');
        if (placeholder.parentNode) placeholder.parentNode.removeChild(placeholder);
        // Save final DOM order
        var newOrder = [];
        list.querySelectorAll('.builder-item:not(.builder-placeholder)').forEach(function (el) {
          newOrder.push(el.getAttribute('data-builder-id'));
        });
        setSectionOrder(newOrder);
        draggingEl = null;
      });

      item.addEventListener('dragover', function (e) {
        e.preventDefault();
        if (!draggingEl || draggingEl === item) return;
        var rect = item.getBoundingClientRect();
        var after = e.clientY > rect.top + rect.height / 2;
        if (after) {
          item.parentNode.insertBefore(placeholder, item.nextSibling);
        } else {
          item.parentNode.insertBefore(placeholder, item);
        }
      });

      item.addEventListener('drop', function (e) {
        e.preventDefault();
        if (!draggingEl || draggingEl === item) return;
        var rect = item.getBoundingClientRect();
        var after = e.clientY > rect.top + rect.height / 2;
        if (after) {
          item.parentNode.insertBefore(draggingEl, item.nextSibling);
        } else {
          item.parentNode.insertBefore(draggingEl, item);
        }
      });
    });

    list.addEventListener('dragover', function (e) { e.preventDefault(); });
  }

  function initTemplates() {
    var templates = {
      'titles-builder': function () {
        var field = $('prof-titles');
        if (!field) return;
        field.value = ['🎮 Gamer', '🖥️ Homelab Tinkerer', '🤖 AI Workflow Builder', '🔧 Infrastructure Nerd'].join('\n');
      },
      'titles-pipeline': function () {
        var field = $('prof-titles');
        if (!field) return;
        field.value = ['📚 Manga Pipeline Operator', '⚙️ Automation Bastler', '🌌 UI Polish Hunter', '🛰️ Selfhosted Control Freak'].join('\n');
      },
      'about-tech': function () {
        var ed = $('about-rte'), tags = $('about-tags-input'), prev = $('about-rte-preview');
        if (ed) { ed.innerHTML = '<p>Ich baue Systeme, die im Hintergrund leise funktionieren und vorne sauber aussehen.</p><p>Von Homelab bis Frontend-Polish liegt mein Fokus auf Kontrolle, Automatisierung und sauberem Output.</p>'; if (prev) prev.innerHTML = ed.innerHTML; }
        if (tags) tags.value = 'Homelab, Automation, Frontend, Manga Pipeline';
      },
      'about-creator': function () {
        var ed = $('about-rte'), tags = $('about-tags-input'), prev = $('about-rte-preview');
        if (ed) { ed.innerHTML = '<p>Ich mische Technik mit Stil: kleine Tools, visuelle Upgrades und Workflows, die wirklich im Alltag helfen.</p><p>Wenn etwas starr aussieht, wird es umgebaut. Wenn etwas langsam ist, wird es beschleunigt.</p>'; if (prev) prev.innerHTML = ed.innerHTML; }
        if (tags) tags.value = 'Creator, UI, Workflow, Custom Setup';
      },
      'hint-private': function () {
        var title = $('hint-title-input');
        var text = $('hint-text-input');
        if (title) title.value = '⚠️ Privatbereich';
        if (text) text.value = 'Diese Seite ist privat und dient als persönliches Dashboard. Für Änderungen bitte in den Adminbereich wechseln.';
      },
      'hint-wip': function () {
        var title = $('hint-title-input');
        var text = $('hint-text-input');
        if (title) title.value = '🛠️ Work in Progress';
        if (text) text.value = 'Einige Module sind noch in Arbeit. Inhalte, Pipeline-Daten und Visuals werden laufend angepasst.';
      },
      'manga-starter': function () {
        localStorage.setItem(MANGA_KEY, JSON.stringify([
          { manga: 'Solo Leveling', vol: 'Vol 1 – Kap 1-10', status: 'uploaded', date: '2026-03-15' },
          { manga: 'Chainsaw Man', vol: 'Vol 1 – Kap 1-7', status: 'pending', date: '—' },
          { manga: 'Dandadan', vol: 'Vol 1 – Kap 1-5', status: 'tl', date: '—' }
        ]));
        renderMangaList();
      },
      'manga-release': function () {
        localStorage.setItem(MANGA_KEY, JSON.stringify([
          { manga: 'Chainsaw Man', vol: 'Vol 4 – Kap 28-36', status: 'uploaded', date: '2026-04-10' },
          { manga: 'Jujutsu Kaisen', vol: 'Vol 3 – Kap 17-25', status: 'uploaded', date: '2026-04-14' },
          { manga: 'Blue Lock', vol: 'Vol 2 – Kap 12-20', status: 'pending', date: '2026-04-22' },
          { manga: 'Dandadan', vol: 'Vol 2 – Kap 8-15', status: 'tl', date: '—' }
        ]));
        renderMangaList();
      }
    };

    document.querySelectorAll('[data-template]').forEach(function (button) {
      button.addEventListener('click', function () {
        var key = button.getAttribute('data-template');
        if (templates[key]) {
          templates[key]();
          refreshAdminOverview();
        }
      });
    });
  }

  function getStoredPw() {
    return localStorage.getItem(PW_KEY) || DEFAULT_HASH;
  }

  // ---- SESSION ----
  function isLoggedIn() {
    return sessionStorage.getItem('anifix_auth') === '1';
  }

  function showAdmin() {
    hideScreen(loginSection, true);
    showScreen(adminSection, true);
    loadAdminData();
    updateFabState();
  }

  initAuroraBackground();
  initLoginSplash();
  initRte();
  var updateFabState = initFloatingMenu();
  initAdminGroups();
  initTemplates();
  initFeatureControls();

  if (isLoggedIn()) {
    if (loginSection) loginSection.style.display = 'none';
    showScreen(adminSection, false);
    loadAdminData();
    updateFabState();
  } else {
    showScreen(loginSection, false);
    hideScreen(adminSection, false);
  }

  // ---- LOGIN ----
  var loginForm = $('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var pw = $('passwd').value;
      var errEl = $('login-error');
      if (pw === getStoredPw()) {
        sessionStorage.setItem('anifix_auth', '1');
        errEl.textContent = '';
        showAdmin();
      } else {
        errEl.textContent = '// Zugang verweigert.';
        $('passwd').value = '';
      }
    });
  }

  // ---- LOGOUT ----
  var logoutBtn = $('btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      sessionStorage.removeItem('anifix_auth');
      location.reload();
    });
  }

  // ---- LOAD ADMIN DATA ----
  function loadAdminData() {
    // Avatar
    var storedAvatar = localStorage.getItem(AVATAR_KEY);
    var preview = $('admin-avatar-preview');
    if (preview) {
      if (storedAvatar) {
        preview.innerHTML = '<img src="' + storedAvatar + '" alt="Avatar" />';
      } else {
        preview.textContent = 'AF';
      }
    }

    // Profile
    var prof = JSON.parse(localStorage.getItem(PROFILE_KEY)) || DEFAULT_PROFILE;
    var profName = $('prof-name');
    var profAlias = $('prof-alias');
    var profTitles = $('prof-titles');
    if (profName) profName.value = prof.name || '';
    if (profAlias) profAlias.value = prof.alias || '';
    if (profTitles) profTitles.value = (prof.titles || []).join('\n');

    // About
    var aboutData = JSON.parse(localStorage.getItem(ABOUT_KEY)) || DEFAULT_ABOUT;
    var aboutEditor = $('about-rte');
    var aboutTags   = $('about-tags-input');
    if (aboutEditor) {
      if (aboutData.html) {
        aboutEditor.innerHTML = aboutData.html;
      } else {
        // Convert plain text to simple HTML
        aboutEditor.innerHTML = (aboutData.text || '').split('\n')
          .filter(function(l) { return l.trim(); })
          .map(function(l) {
            return '<p>' + l.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</p>';
          }).join('');
      }
      var aboutPrev = $('about-rte-preview');
      if (aboutPrev) aboutPrev.innerHTML = aboutEditor.innerHTML;
    }
    if (aboutTags) aboutTags.value = (aboutData.tags || []).join(', ');

    // Location — flag select + text input
    var loc = JSON.parse(localStorage.getItem(LOCATION_KEY)) || DEFAULT_LOCATION;
    var locText = (typeof loc === 'string') ? loc : '';
    var locInput = $('location-input');
    var locFlagSel = $('location-flag-select');
    if (locFlagSel) {
      // Extract leading flag emoji if present (4 chars for emoji flag sequence)
      var flagMatch = locText.match(/^([\uD83C][\uDDE6-\uDDFF][\uD83C][\uDDE6-\uDDFF])\s*/u);
      if (flagMatch) {
        locFlagSel.value = flagMatch[1];
        if (locInput) locInput.value = locText.slice(flagMatch[0].length);
      } else {
        locFlagSel.value = '';
        if (locInput) locInput.value = locText;
      }
      locFlagSel.addEventListener('change', saveLocation);
    }
    if (locInput) locInput.addEventListener('change', saveLocation);

    function saveLocation() {
      var flag = locFlagSel ? locFlagSel.value : '';
      var text = locInput ? locInput.value : '';
      var combined = flag ? flag + ' ' + text : text;
      localStorage.setItem(LOCATION_KEY, JSON.stringify(combined));
    }

    // Hint
    var hint = JSON.parse(localStorage.getItem(HINT_KEY)) || DEFAULT_HINT;
    var hintTitle = $('hint-title-input');
    var hintText = $('hint-text-input');
    if (hintTitle) hintTitle.value = hint.title || '';
    if (hintText) hintText.value = hint.text || '';

    // Socials
    var soc = JSON.parse(localStorage.getItem(SOCIALS_KEY)) || DEFAULT_SOCIALS;
    var socDiscord = $('social-discord-input');
    var socGithub = $('social-github-input');
    if (socDiscord) socDiscord.value = soc.discord || '';
    if (socGithub) socGithub.value = soc.github || '';

    // Skills heading
    var skillsHeadingInput = $('skills-heading-input');
    if (skillsHeadingInput) skillsHeadingInput.value = localStorage.getItem(SKILLS_HEADING_KEY) || '';

    var features = getFeatures();
    document.querySelectorAll('[data-feature-key]').forEach(function (input) {
      var key = input.getAttribute('data-feature-key');
      input.checked = !!features[key];
    });
    refreshAllFeatureDim();

    renderTrackList();
    renderSkillList();
    renderNotifList();

    // Toast Config
    var toastConf = JSON.parse(localStorage.getItem(TOAST_CONF_KEY) || 'null') || DEFAULT_TOAST_CONF;
    var toastModeEl = $('toast-mode-select');
    var toastAnimEl = $('toast-anim-select');
    var toastDurEl = $('toast-duration-input');
    var toastGapEl = $('toast-gap-input');
    if (toastModeEl) {
      toastModeEl.value = toastConf.mode || 'sequential';
      toastModeEl.addEventListener('change', saveToastConf);
    }
    if (toastAnimEl) {
      toastAnimEl.value = toastConf.animation || 'slide';
      toastAnimEl.addEventListener('change', saveToastConf);
    }
    if (toastDurEl) {
      toastDurEl.value = toastConf.duration || 5500;
      toastDurEl.addEventListener('change', saveToastConf);
    }
    if (toastGapEl) {
      toastGapEl.value = toastConf.gap || 0;
      toastGapEl.addEventListener('change', saveToastConf);
    }

    function saveToastConf() {
      var conf = {
        mode: toastModeEl ? toastModeEl.value : 'sequential',
        animation: toastAnimEl ? toastAnimEl.value : 'slide',
        duration: toastDurEl ? (parseInt(toastDurEl.value) || 5500) : 5500,
        gap: toastGapEl ? (parseInt(toastGapEl.value) || 0) : 0
      };
      localStorage.setItem(TOAST_CONF_KEY, JSON.stringify(conf));
    }

    renderMangaList();
    renderLinksList();
    renderSectionBuilder();
    refreshAdminOverview();
  }

  // ---- AVATAR UPLOAD ----
  var avatarInput = $('avatar-input');
  if (avatarInput) {
    avatarInput.addEventListener('change', function (e) {
      var file = e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function (ev) {
        var dataUrl = ev.target.result;
        var preview = $('admin-avatar-preview');
        if (preview) preview.innerHTML = '<img src="' + dataUrl + '" alt="Avatar" />';
        localStorage.setItem(AVATAR_KEY, dataUrl);
      };
      reader.readAsDataURL(file);
    });
  }

  // ---- MUSIC TRACKS ----
  var tracks = JSON.parse(localStorage.getItem(TRACKS_KEY) || '[]');

  function normalizeLocalTracks(rawTracks) {
    var input = Array.isArray(rawTracks) ? rawTracks : [];
    return input.filter(function (track) {
      if (!track || track.type !== 'local' || typeof track.url !== 'string') return false;
      return track.url.indexOf('data:audio') === 0 || track.url.indexOf('/public/music/') === 0;
    });
  }

  // ---- YouTube download via server ----
  var ytUrlInput = $('yt-url-input');
  var ytAddBtn   = $('yt-add-btn');
  var ytStatus   = $('yt-status');

  function setYtStatus(msg, isError) {
    if (!ytStatus) return;
    ytStatus.textContent = msg;
    ytStatus.style.color = isError ? '#f87171' : '#a3e635';
  }

  function addYouTubeTrack() {
    if (!ytUrlInput) return;
    var url = ytUrlInput.value.trim();
    if (!url) { setYtStatus('Bitte eine YouTube-URL eingeben.', true); return; }
    if (ytAddBtn) ytAddBtn.disabled = true;
    setYtStatus('Wird heruntergeladen … (kann 30–90 Sek. dauern)', false);

    fetch('/api/yt-download?url=' + encodeURIComponent(url))
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.error) { setYtStatus('Fehler: ' + data.error, true); return; }
        var rawTracks = JSON.parse(localStorage.getItem(TRACKS_KEY) || '[]');
        rawTracks.push({ name: data.name, type: 'local', url: data.url });
        localStorage.setItem(TRACKS_KEY, JSON.stringify(rawTracks));
        ytUrlInput.value = '';
        setYtStatus('\u2713 ' + data.name + ' hinzugefügt.', false);
        renderTrackList();
      })
      .catch(function (err) {
        setYtStatus('Netzwerkfehler: ' + err.message, true);
      })
      .finally(function () {
        if (ytAddBtn) ytAddBtn.disabled = false;
      });
  }

  if (ytAddBtn) ytAddBtn.addEventListener('click', addYouTubeTrack);
  if (ytUrlInput) {
    ytUrlInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') addYouTubeTrack();
    });
  }

  function renderTrackList() {
    var rawTracks = JSON.parse(localStorage.getItem(TRACKS_KEY) || '[]');
    tracks = normalizeLocalTracks(rawTracks);
    if (tracks.length !== (Array.isArray(rawTracks) ? rawTracks.length : 0)) {
      localStorage.setItem(TRACKS_KEY, JSON.stringify(tracks));
    }
    var list = $('music-list');
    var empty = $('music-empty');
    if (!list) return;
    list.innerHTML = '';
    if (tracks.length === 0) {
      if (empty) empty.style.display = '';
    } else {
      if (empty) empty.style.display = 'none';
      tracks.forEach(function (t, i) {
        var li = document.createElement('li');
        li.className = 'music-item';
        var badge = '<span class="track-type-badge loc">LOC</span>';
        li.innerHTML = badge +
          '<span class="track-name">' + escHtml(t.name) + '</span>' +
          '<button type="button" class="btn-remove" data-idx="' + i + '" title="Entfernen">\u2715</button>';
        list.appendChild(li);
      });
      list.querySelectorAll('.btn-remove').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var idx = parseInt(btn.dataset.idx);
          tracks.splice(idx, 1);
          localStorage.setItem(TRACKS_KEY, JSON.stringify(tracks));
          renderTrackList();
        });
      });
    }
    refreshAdminOverview();
  }

  var musicInput = $('music-input');
  if (musicInput) {
    musicInput.addEventListener('change', function (e) {
      var files = Array.from(e.target.files);
      if (!files.length) return;
      var processed = 0;
      files.forEach(function (file) {
        var reader = new FileReader();
        reader.onload = function (ev) {
          tracks.push({ name: file.name.replace(/\.[^/.]+$/, ''), type: 'local', url: ev.target.result });
          processed++;
          if (processed === files.length) {
            localStorage.setItem(TRACKS_KEY, JSON.stringify(tracks));
            renderTrackList();
          }
        };
        reader.readAsDataURL(file);
      });
      musicInput.value = '';
    });
  }

  // ============================================
  // SKILLS MANAGEMENT
  // ============================================
  function getSkills() {
    return JSON.parse(localStorage.getItem(SKILLS_KEY) || '[]');
  }

  function renderSkillList() {
    var skills = getSkills();
    var list = $('skills-list');
    if (!list) return;
    list.innerHTML = '';
    if (skills.length === 0) {
      list.innerHTML = '<p class="editor-empty">Keine Skills konfiguriert.</p>';
      return;
    }
    skills.forEach(function (s, i) {
      var div = document.createElement('div');
      div.className = 'editor-item';
      var iconOpts = ICON_OPTIONS.map(function (ic) {
        return '<option value="' + ic + '"' + (ic === s.icon ? ' selected' : '') + '>' + ic + '</option>';
      }).join('');
      div.innerHTML =
        '<select class="editor-select" data-field="icon" data-idx="' + i + '">' + iconOpts + '</select>' +
        '<input class="editor-input" type="text" value="' + escHtml(s.label) + '" data-field="label" data-idx="' + i + '" placeholder="Label" />' +
        '<select class="editor-select" data-field="orbit" data-idx="' + i + '">' +
        '<option value="inner"' + (s.orbit === 'inner' ? ' selected' : '') + '>Inner</option>' +
        '<option value="outer"' + (s.orbit === 'outer' ? ' selected' : '') + '>Outer</option>' +
        '</select>' +
        '<button type="button" class="btn-remove" data-idx="' + i + '" title="Entfernen">\u2715</button>';
      list.appendChild(div);
    });

    list.querySelectorAll('.editor-select, .editor-input').forEach(function (el) {
      el.addEventListener('change', function () {
        var sk = getSkills();
        var idx = parseInt(el.dataset.idx);
        var field = el.dataset.field;
        if (sk[idx]) {
          sk[idx][field] = el.value;
          localStorage.setItem(SKILLS_KEY, JSON.stringify(sk));
        }
      });
    });

    list.querySelectorAll('.btn-remove').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var sk = getSkills();
        sk.splice(parseInt(btn.dataset.idx), 1);
        localStorage.setItem(SKILLS_KEY, JSON.stringify(sk));
        renderSkillList();
      });
    });
    refreshAdminOverview();
  }

  var addSkillBtn = $('add-skill-btn');
  if (addSkillBtn) {
    addSkillBtn.addEventListener('click', function () {
      var sk = getSkills();
      sk.push({ icon: 'html', label: 'Neuer Skill', orbit: 'inner' });
      localStorage.setItem(SKILLS_KEY, JSON.stringify(sk));
      renderSkillList();
    });
  }

  var resetSkillsBtn = $('reset-skills-btn');
  if (resetSkillsBtn) {
    resetSkillsBtn.addEventListener('click', function () {
      localStorage.setItem(SKILLS_KEY, JSON.stringify(DEFAULT_SKILLS));
      renderSkillList();
    });
  }

  // ============================================
  // NOTIFICATIONS MANAGEMENT
  // ============================================
  function getNotifs() {
    return parseJson(NOTIFS_KEY, DEFAULT_NOTIFS) || DEFAULT_NOTIFS;
  }

  function renderNotifList() {
    var notifs = getNotifs();
    var list = $('notifs-list');
    if (!list) return;
    list.innerHTML = '';
    if (notifs.length === 0) {
      list.innerHTML = '<p class="editor-empty">Keine Toasts konfiguriert.</p>';
      return;
    }
    notifs.forEach(function (n, i) {
      var div = document.createElement('div');
      div.className = 'editor-item notif-editor-item';
      div.style.cssText = 'display:flex;flex-direction:column;gap:6px;padding:10px;border-radius:10px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);';

      // Row 1: icon picker + app + title
      var row1 = document.createElement('div');
      row1.style.cssText = 'display:flex;gap:6px;align-items:center;';

      var iconDisplay = document.createElement('span');
      iconDisplay.style.cssText = 'font-size:1.2rem;min-width:28px;text-align:center;display:flex;align-items:center;justify-content:center;';
      var iconVal = n.icon || '📢';
      if (iconVal.startsWith('fa-')) {
        iconDisplay.innerHTML = '<i class="' + iconVal + '" style="font-size:.9rem;color:#60a5fa"></i>';
      } else {
        iconDisplay.textContent = iconVal;
      }

      var picker = createIconPicker(iconVal, function(val) {
        var nf = getNotifs();
        if (nf[i]) { nf[i].icon = val; localStorage.setItem(NOTIFS_KEY, JSON.stringify(nf)); renderNotifList(); }
      });

      var appInput = document.createElement('input');
      appInput.className = 'editor-input';
      appInput.type = 'text';
      appInput.value = n.app;
      appInput.placeholder = 'App-Name';
      appInput.style.flex = '1';
      appInput.dataset.field = 'app';
      appInput.dataset.idx = String(i);

      var delayInput = document.createElement('input');
      delayInput.className = 'editor-input editor-num';
      delayInput.type = 'number';
      delayInput.value = n.delay;
      delayInput.placeholder = 'ms';
      delayInput.step = '100';
      delayInput.min = '0';
      delayInput.style.width = '72px';
      delayInput.dataset.field = 'delay';
      delayInput.dataset.idx = String(i);

      var removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'btn-remove';
      removeBtn.title = 'Entfernen';
      removeBtn.dataset.idx = String(i);
      removeBtn.textContent = '✕';

      row1.appendChild(iconDisplay);
      row1.appendChild(picker);
      row1.appendChild(appInput);
      row1.appendChild(delayInput);
      row1.appendChild(removeBtn);

      // Row 2: title + sub
      var row2 = document.createElement('div');
      row2.style.cssText = 'display:flex;gap:6px;';

      var titleInput = document.createElement('input');
      titleInput.className = 'editor-input';
      titleInput.type = 'text';
      titleInput.value = n.title;
      titleInput.placeholder = 'Titel';
      titleInput.style.flex = '1';
      titleInput.dataset.field = 'title';
      titleInput.dataset.idx = String(i);

      var subInput = document.createElement('input');
      subInput.className = 'editor-input';
      subInput.type = 'text';
      subInput.value = n.sub;
      subInput.placeholder = 'Untertitel / Inhalt';
      subInput.style.flex = '1.5';
      subInput.dataset.field = 'sub';
      subInput.dataset.idx = String(i);

      row2.appendChild(titleInput);
      row2.appendChild(subInput);

      div.appendChild(row1);
      div.appendChild(row2);
      list.appendChild(div);

      // change handlers
      [appInput, delayInput, titleInput, subInput].forEach(function(el) {
        el.addEventListener('change', function() {
          var nf = getNotifs();
          var idx = parseInt(el.dataset.idx);
          var field = el.dataset.field;
          if (nf[idx]) {
            nf[idx][field] = field === 'delay' ? (parseInt(el.value) || 0) : el.value;
            localStorage.setItem(NOTIFS_KEY, JSON.stringify(nf));
          }
        });
      });

      removeBtn.addEventListener('click', function() {
        var nf = getNotifs();
        nf.splice(parseInt(removeBtn.dataset.idx), 1);
        localStorage.setItem(NOTIFS_KEY, JSON.stringify(nf));
        renderNotifList();
      });
    });
  }

  var addNotifBtn = $('add-notif-btn');
  if (addNotifBtn) {
    addNotifBtn.addEventListener('click', function () {
      var nf = getNotifs();
      nf.push({ icon: '📢', app: 'AniFix', title: 'Neuer Toast', sub: 'Beschreibung', delay: 1000 });
      localStorage.setItem(NOTIFS_KEY, JSON.stringify(nf));
      renderNotifList();
    });
  }

  var resetNotifsBtn = $('reset-notifs-btn');
  if (resetNotifsBtn) {
    resetNotifsBtn.addEventListener('click', function () {
      localStorage.setItem(NOTIFS_KEY, JSON.stringify(DEFAULT_NOTIFS));
      renderNotifList();
    });
  }

  var addLinkBtn = $('add-link-btn');
  if (addLinkBtn) {
    addLinkBtn.addEventListener('click', function () {
      var links = getLinks();
      links.push({ icon: 'fa-solid fa-link', label: 'Neuer Link', url: 'https://', note: 'Kurzbeschreibung' });
      setLinks(links);
      renderLinksList();
    });
  }

  var resetLinksBtn = $('reset-links-btn');
  if (resetLinksBtn) {
    resetLinksBtn.addEventListener('click', function () {
      setLinks(DEFAULT_LINKS);
      renderLinksList();
    });
  }

  var resetBuilderBtn = $('reset-builder-btn');
  if (resetBuilderBtn) {
    resetBuilderBtn.addEventListener('click', function () {
      setSectionOrder(DEFAULT_SECTION_ORDER);
      renderSectionBuilder();
    });
  }

  // ============================================
  // MANGA PIPELINE MANAGEMENT
  // ============================================
  function getManga() {
    return JSON.parse(localStorage.getItem(MANGA_KEY) || '[]');
  }

  function renderMangaList() {
    var manga = getManga();
    var list = $('manga-list');
    if (!list) return;
    list.innerHTML = '';
    if (manga.length === 0) {
      list.innerHTML = '<p class="editor-empty">Keine Manga-Eintr\u00e4ge.</p>';
      return;
    }
    manga.forEach(function (m, i) {
      var div = document.createElement('div');
      div.className = 'editor-item';
      div.style.flexWrap = 'wrap';
      var statusOpts = ['uploaded', 'pending', 'tl'].map(function (s) {
        var labels = { uploaded: 'Hochgeladen', pending: 'Ausstehend', tl: 'In Bearbeitung' };
        return '<option value="' + s + '"' + (s === m.status ? ' selected' : '') + '>' + labels[s] + '</option>';
      }).join('');
      div.innerHTML =
        '<input class="editor-input" type="text" value="' + escHtml(m.manga) + '" data-field="manga" data-idx="' + i + '" placeholder="Manga-Name" />' +
        '<input class="editor-input" type="text" value="' + escHtml(m.vol) + '" data-field="vol" data-idx="' + i + '" placeholder="Vol / Kap" style="max-width:10rem;" />' +
        '<select class="editor-select" data-field="status" data-idx="' + i + '">' + statusOpts + '</select>' +
        '<input class="editor-input" type="text" value="' + escHtml(m.date) + '" data-field="date" data-idx="' + i + '" placeholder="YYYY-MM-DD" style="max-width:7rem;" />' +
        '<button type="button" class="btn-remove" data-idx="' + i + '" title="Entfernen">\u2715</button>';
      list.appendChild(div);
    });

    list.querySelectorAll('.editor-select, .editor-input').forEach(function (el) {
      el.addEventListener('change', function () {
        var mg = getManga();
        var idx = parseInt(el.dataset.idx);
        var field = el.dataset.field;
        if (mg[idx]) {
          mg[idx][field] = el.value;
          localStorage.setItem(MANGA_KEY, JSON.stringify(mg));
        }
      });
    });

    list.querySelectorAll('.btn-remove').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var mg = getManga();
        mg.splice(parseInt(btn.dataset.idx), 1);
        localStorage.setItem(MANGA_KEY, JSON.stringify(mg));
        renderMangaList();
      });
    });
    refreshAdminOverview();
  }

  var addMangaBtn = $('add-manga-btn');
  if (addMangaBtn) {
    addMangaBtn.addEventListener('click', function () {
      var mg = getManga();
      mg.push({ manga: 'Neuer Manga', vol: 'Vol 1', status: 'pending', date: '\u2014' });
      localStorage.setItem(MANGA_KEY, JSON.stringify(mg));
      renderMangaList();
    });
  }

  var resetMangaBtn = $('reset-manga-btn');
  if (resetMangaBtn) {
    resetMangaBtn.addEventListener('click', function () {
      localStorage.setItem(MANGA_KEY, JSON.stringify(DEFAULT_MANGA));
      renderMangaList();
    });
  }

  // ---- SAVE / PW CHANGE ----
  var saveBtn = $('btn-save');
  if (saveBtn) {
    saveBtn.addEventListener('click', function () {
      var newPw = $('new-pw').value.trim();
      var newPw2 = $('new-pw2').value.trim();
      var pwErr = $('pw-error');
      var saveMsg = $('save-msg');

      if (newPw || newPw2) {
        if (newPw !== newPw2) {
          pwErr.textContent = '// Passw\u00f6rter stimmen nicht \u00fcberein.';
          return;
        }
        if (newPw.length < 6) {
          pwErr.textContent = '// Passwort zu kurz (min. 6 Zeichen).';
          return;
        }
        localStorage.setItem(PW_KEY, newPw);
        $('new-pw').value = '';
        $('new-pw2').value = '';
        pwErr.textContent = '';
      }

      // Save profile
      var profName = $('prof-name');
      var profAlias = $('prof-alias');
      var profTitles = $('prof-titles');
      if (profName && profAlias && profTitles) {
        var titlesArr = profTitles.value.split('\n').map(function(l) { return l.trim(); }).filter(Boolean);
        localStorage.setItem(PROFILE_KEY, JSON.stringify({
          name: profName.value.trim() || 'AniFix',
          alias: profAlias.value.trim() || 'aka Sumo',
          titles: titlesArr.length ? titlesArr : DEFAULT_PROFILE.titles
        }));
      }

      // Save about
      var aboutEditor = $('about-rte');
      var aboutTags   = $('about-tags-input');
      if (aboutEditor && aboutTags) {
        var tagsArr = aboutTags.value.split(',').map(function(t) { return t.trim(); }).filter(Boolean);
        var htmlContent = aboutEditor.innerHTML.trim();
        var _tmp = document.createElement('div');
        _tmp.innerHTML = htmlContent;
        var plainText = (_tmp.textContent || _tmp.innerText || '').trim();
        localStorage.setItem(ABOUT_KEY, JSON.stringify({
          text: plainText || DEFAULT_ABOUT.text,
          html: htmlContent || null,
          tags: tagsArr.length ? tagsArr : DEFAULT_ABOUT.tags
        }));
      }

      // Save location (flag + text combined)
      var locInput = $('location-input');
      var locFlagSave = $('location-flag-select');
      if (locInput) {
        var flagVal = locFlagSave ? locFlagSave.value : '';
        var locVal = flagVal ? flagVal + ' ' + locInput.value : locInput.value;
        localStorage.setItem(LOCATION_KEY, JSON.stringify(locVal || DEFAULT_LOCATION));
      }

      // Save hint
      var hintTitle = $('hint-title-input');
      var hintText = $('hint-text-input');
      if (hintTitle && hintText) {
        localStorage.setItem(HINT_KEY, JSON.stringify({
          title: hintTitle.value || DEFAULT_HINT.title,
          text: hintText.value || DEFAULT_HINT.text
        }));
      }

      // Save socials
      var socDiscord = $('social-discord-input');
      var socGithub = $('social-github-input');
      if (socDiscord && socGithub) {
        localStorage.setItem(SOCIALS_KEY, JSON.stringify({
          discord: socDiscord.value.trim() || DEFAULT_SOCIALS.discord,
          github: socGithub.value.trim() || DEFAULT_SOCIALS.github
        }));
      }

      // Save skills heading
      var skillsHeadingInput = $('skills-heading-input');
      if (skillsHeadingInput) {
        var hv = skillsHeadingInput.value.trim();
        if (hv) { localStorage.setItem(SKILLS_HEADING_KEY, hv); }
        else { localStorage.removeItem(SKILLS_HEADING_KEY); }
      }

      var features = getFeatures();
      document.querySelectorAll('[data-feature-key]').forEach(function (input) {
        features[input.getAttribute('data-feature-key')] = !!input.checked;
      });
      setFeatures(features);

      if (saveMsg) {
        saveMsg.textContent = '// Einstellungen gespeichert.';
        setTimeout(function () { saveMsg.textContent = ''; }, 3000);
      }
    });
  }
});
