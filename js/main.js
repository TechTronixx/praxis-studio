const { animate, stagger } = anime;

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.getElementById('year').textContent = new Date().getFullYear();

/* ---- scroll progress bar ---- */
const sb = document.getElementById('scrollBar');
addEventListener('scroll', () => {
  const h = document.documentElement, p = h.scrollTop / (h.scrollHeight - h.clientHeight);
  sb.style.width = (p * 100) + '%';
}, { passive: true });

/* ---- parallax: layers move at different scroll speeds ---- */
if (!reduce) {
  const pSec = document.getElementById('parallaxSec');
  if (pSec) {
    const layers = pSec.querySelectorAll('.p-layer');
    addEventListener('scroll', () => {
      const top = pSec.getBoundingClientRect().top;
      const h = pSec.offsetHeight;
      const pct = -top / h;
      layers.forEach(l => {
        const speed = parseFloat(l.dataset.speed);
        l.style.transform = `translateY(${pct * h * speed * 0.25}px)`;
      });
    }, { passive: true });
  }
}

/* ---- three.js: rotating particle network in 3D accent section ---- */
if (!reduce) {
  const canvas = document.getElementById('three-canvas');
  if (canvas) {
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 5;
    /* particle network: 80 nodes, connected within 1.5 units. reads as systems/connections. */
    const group = new THREE.Group();
    const pts = Array.from({length: 80}, () => new THREE.Vector3(
      (Math.random() - .5) * 5, (Math.random() - .5) * 5, (Math.random() - .5) * 5
    ));
    const dotGeo = new THREE.BufferGeometry().setFromPoints(pts);
    const dots = new THREE.Points(dotGeo, new THREE.PointsMaterial({ color: 0xffffff, size: .025 }));
    group.add(dots);
    const lineVerts = [];
    for (let i = 0; i < pts.length; i++)
      for (let j = i + 1; j < pts.length; j++)
        if (pts[i].distanceTo(pts[j]) < 1.5)
          lineVerts.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(lineVerts, 3));
    const lines = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: .12 }));
    group.add(lines); scene.add(group);
    const sec = document.getElementById('threeSec');
    function resize() {
      const w = sec.clientWidth, h = sec.clientHeight;
      renderer.setSize(w, h); camera.aspect = w / Math.max(h, 1); camera.updateProjectionMatrix();
    }
    resize(); new ResizeObserver(resize).observe(sec);
    function tick() {
      group.rotation.y += .002; group.rotation.x += .0007;
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    }
    tick();
    /* observe visibility: only render when in viewport */
    const visObs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) { return; }
      visObs.unobserve(sec);
      /* already ticking, no action needed */
    }, { threshold: 0.1 });
    visObs.observe(sec);
  }
}

/* ---- theme ---- */
const root = document.documentElement, tgl = document.getElementById('themeToggle');
const saved = localStorage.getItem('praxis-theme');
const initial = saved || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
setTheme(initial);
function setTheme(t){ root.setAttribute('data-theme', t); tgl.setAttribute('aria-checked', t === 'light'); }
tgl.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  setTheme(next); localStorage.setItem('praxis-theme', next);
});

/* ---- wordmark: per-character rise + magnetic ---- */
const wm = document.getElementById('wordmark');
document.querySelectorAll('#wordmark .line').forEach(line => {
  const text = line.dataset.text;
  line.innerHTML = [...text].map(c => c === ' ' ? ' ' : `<span class="ch">${c}</span>`).join('');
});
if (!reduce) {
  animate('#wordmark .ch', {
    translateY: ['110%', '0%'], opacity: [0, 1],
    duration: 900, ease: 'outExpo', delay: stagger(28, { start: 150 })
  });
  /* magnetic: subtle character follow, max 2px */
  const chars = wm.querySelectorAll('.ch');
  wm.addEventListener('mousemove', e => {
    const rect = wm.getBoundingClientRect();
    const cx = e.clientX - rect.left, cy = e.clientY - rect.top;
    chars.forEach(ch => {
      const cr = ch.getBoundingClientRect();
      const dx = (cx - (cr.left - rect.left + cr.width/2)) * 0.03;
      const dy = (cy - (cr.top - rect.top + cr.height/2)) * 0.03;
      ch.style.transform = `translate(${Math.max(-2,Math.min(2,dx))}px,${Math.max(-2,Math.min(2,dy))}px)`;
    });
  });
  wm.addEventListener('mouseleave', () => chars.forEach(ch => ch.style.transform = ''));
}

/* ---- capability cards tilt ---- */
if (!reduce && matchMedia('(pointer:fine)').matches) {
  document.querySelectorAll('.cap').forEach(cap => {
    cap.classList.add('cap-tilt');
    cap.addEventListener('mousemove', e => {
      const r = cap.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      cap.style.transform = `perspective(600px) rotateY(${x*8}deg) rotateX(${-y*8}deg)`;
    });
    cap.addEventListener('mouseleave', () => cap.style.transform = '');
  });
}

/* ---- reveal on scroll ---- */
if (reduce) {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
} else {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

/* ---- scrollytelling case study ---- */
if (!reduce) {
  const scrolly = document.getElementById('scrolly');
  if (scrolly) {
    const sSteps = scrolly.querySelectorAll('.scrolly-step');
    const sImgs = scrolly.querySelectorAll('.scrolly-visual img');
    const sBar = document.getElementById('scrollyBar');
    const sObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const step = e.target.dataset.step;
        sSteps.forEach(s => s.classList.remove('active'));
        sImgs.forEach(i => i.classList.remove('active'));
        e.target.classList.add('active');
        const img = scrolly.querySelector('.scrolly-visual img[data-step="' + step + '"]');
        if (img) img.classList.add('active');
      });
    }, { threshold: 0.5 });
    sSteps.forEach(s => sObs.observe(s));
    addEventListener('scroll', () => {
      const r = scrolly.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, -r.top / (r.height - innerHeight)));
      if (sBar) sBar.style.height = (p * 100) + '%';
    }, { passive: true });
  }
}

/* ---- count-up stats ---- */
const statObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    statObs.unobserve(e.target);
    const target = +e.target.dataset.count;
    if (reduce) { e.target.textContent = target; return; }
    const obj = { v: 0 };
    animate(obj, { v: target, duration: 1400, ease: 'outExpo', onUpdate: () => { e.target.textContent = Math.round(obj.v); } });
  });
}, { threshold: 0.6 });
document.querySelectorAll('.num[data-count]').forEach(el => statObs.observe(el));

/* ---- stats shimmer ---- */
if (!reduce) {
  const shObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      shObs.unobserve(e.target);
      e.target.querySelectorAll('.stat').forEach((st, i) => {
        setTimeout(() => st.classList.add('shimmer-flash'), 1600 + i * 100);
      });
    });
  });
  const statsRow = document.querySelector('.stats');
  if (statsRow) { statsRow.querySelectorAll('.stat').forEach(s => s.classList.add('stat-shimmer')); shObs.observe(statsRow); }
}

/* ---- work thumbnail follows cursor ---- */
const thumb = document.getElementById('thumb');
if (matchMedia('(pointer:fine)').matches) {
  document.querySelectorAll('.work-item').forEach(item => {
    item.addEventListener('mouseenter', () => { thumb.src = item.dataset.thumb; thumb.classList.add('show'); });
    item.addEventListener('mouseleave', () => thumb.classList.remove('show'));
  });
  addEventListener('mousemove', e => {
    thumb.style.left = (e.clientX + 20) + 'px';
    thumb.style.top  = (e.clientY - 75) + 'px';
  });
}

/* ---- work modals: open/close with scale+fade from body center ---- */
document.querySelectorAll('.work-item').forEach(item => {
  item.addEventListener('click', () => {
    const id = 'modal-' + item.dataset.modal;
    const dialog = document.getElementById(id);
    if (!dialog) return;
    if (reduce) { dialog.showModal(); return; }
    dialog.showModal();
    animate(dialog, { scale: [0.96, 1], opacity: [0, 1], duration: 350, ease: 'outExpo' });
  });
});
document.querySelectorAll('dialog.modal').forEach(dialog => {
  dialog.addEventListener('click', function(e) {
    if (e.target === this) this.close();
  });
  dialog.querySelector('.modal-close').addEventListener('click', () => {
    if (reduce) { dialog.close(); return; }
    animate(dialog, { scale: [1, 0.97], opacity: [1, 0], duration: 220, ease: 'inExpo', onComplete: () => dialog.close() });
  });
  dialog.addEventListener('close', () => {
    dialog.style.opacity = ''; dialog.style.transform = '';
  });
});

/* ---- UX makeover slider ---- */
if (!reduce) {
  const mHandle = document.getElementById('makeoverHandle');
  const mAfter = document.getElementById('makeoverAfter');
  if (mHandle && mAfter) {
    let dragging = false, mPct = 50;
    mHandle.addEventListener('pointerdown', e => { dragging = true; mHandle.setPointerCapture(e.pointerId); });
    addEventListener('pointermove', e => {
      if (!dragging) return;
      const r = mAfter.parentElement.getBoundingClientRect();
      mPct = Math.max(5, Math.min(95, ((e.clientX - r.left) / r.width) * 100));
      mAfter.style.clipPath = 'inset(0 0 0 ' + mPct + '%)';
      mHandle.style.left = mPct + '%';
    });
    addEventListener('pointerup', () => {
      if (!dragging) return;
      dragging = false;
      const cur = parseFloat(mHandle.style.left) || 50;
      const snap = Math.round(cur / 25) * 25;
      mPct = Math.max(5, Math.min(95, snap));
      mHandle.style.transition = 'left .4s cubic-bezier(.23,1,.32,1)';
      mAfter.style.transition = 'clip-path .4s cubic-bezier(.23,1,.32,1)';
      mHandle.style.left = mPct + '%';
      mAfter.style.clipPath = 'inset(0 0 0 ' + mPct + '%)';
      setTimeout(() => { mHandle.style.transition = ''; mAfter.style.transition = ''; }, 400);
    });
  }
}

/* ---- cookie consent ---- */
const KEY = 'praxis-consent', ck = document.getElementById('cookie');
if (!localStorage.getItem(KEY)) {
  ck.hidden = false;
  if (!reduce) animate(ck, { translateY: [24, 0], opacity: [0, 1], duration: 500, ease: 'outExpo', delay: 800 });
}
ck.addEventListener('click', e => {
  const choice = e.target.dataset && e.target.dataset.consent;
  if (!choice) return;
  localStorage.setItem(KEY, choice);
  if (reduce) { ck.hidden = true; return; }
  animate(ck, { translateY: [0, 24], opacity: [1, 0], duration: 300, ease: 'inQuad', onComplete: () => ck.hidden = true });
});
