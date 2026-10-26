const clamp = (n, a = 0, b = 1) => Math.max(a, Math.min(b, n));
const mix = (a, b, t) => a + (b - a) * t;
const fract = n => n - Math.floor(n);
const seed = n => fract(Math.sin(n * 127.1 + 311.7) * 43758.5453);

/** Lightweight atmospheric detail over a full-bleed Hangzhou landscape. */
export function createAtmosphere(canvas) {
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return { setState() {}, rippleAt() {}, destroy() {} };
  const state = { scene: 'westlake', time: 420, weather: 'mist', motion: true };
  const rings = [];
  let width = 1, height = 1, dpr = 1, frame = 0;
  let phase = 0, previous = 0, lastPaint = 0;
  let visible = !document.hidden, intersecting = true, dead = false;

  const daytime = () => clamp((Math.sin(state.time / 1440 * Math.PI * 2 - Math.PI / 2) + 0.2) / 0.5);
  const canAnimate = () => !dead && state.motion && visible && intersecting;

  function size() {
    if (dead) return;
    const box = canvas.getBoundingClientRect();
    width = Math.max(1, box.width);
    height = Math.max(1, box.height);
    dpr = Math.min(1.5, window.devicePixelRatio || 1);
    const pixelsW = Math.round(width * dpr);
    const pixelsH = Math.round(height * dpr);
    if (canvas.width !== pixelsW || canvas.height !== pixelsH) {
      canvas.width = pixelsW;
      canvas.height = pixelsH;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paint();
  }

  function drawWater(day) {
    if (state.scene === 'tea') return;
    const horizon = height * (state.scene === 'canal' ? 0.56 : 0.565);
    const range = height - horizon;
    // Short, broken glints leave the underlying painted water readable.
    ctx.lineCap = 'round';
    for (let i = 0; i < 25; i++) {
      const depth = seed(i + 17);
      const y = horizon + (0.03 + depth * 0.94) * range;
      const drift = Math.sin(phase * 0.13 + i * 0.9) * (4 + depth * 9);
      const x = seed(i + 91) * width + drift;
      const length = (12 + seed(i + 47) * 65) * (0.5 + depth);
      const shimmer = 0.5 + Math.sin(phase * 0.64 + i * 1.7) * 0.5;
      ctx.strokeStyle = day > 0.5
        ? `rgba(246,250,230,${0.035 + shimmer * 0.095})`
        : `rgba(174,207,220,${0.02 + shimmer * 0.065})`;
      ctx.lineWidth = 0.55 + depth * 0.5;
      ctx.beginPath();
      for (let j = 0; j <= 8; j++) {
        const px = x + j * length / 8;
        const py = y + Math.sin(j * 0.85 + phase * 0.6 + i) * (0.35 + depth * 0.6);
        j ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      }
      ctx.stroke();
    }
    // A few distant ripples, strongest when it rains.
    if (state.weather === 'rain') {
      for (let i = 0; i < 18; i++) {
        const life = fract(phase * 0.32 + seed(i + 306));
        const x = seed(i + 308) * width;
        const y = horizon + seed(i + 508) * range;
        const r = 2 + life * (8 + (y / height) * 5);
        ctx.strokeStyle = `rgba(223,234,229,${(1 - life) * 0.13})`;
        ctx.lineWidth = 0.65;
        ctx.beginPath();
        ctx.ellipse(x, y, r, r * 0.23, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  function drawBirds(day) {
    if (day < 0.25 || state.weather === 'rain') return;
    ctx.strokeStyle = `rgba(34,55,54,${day * 0.44})`;
    ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) {
      const progress = fract(phase / 48 + i * 0.075);
      const x = progress * (width + 150) - 75;
      const y = height * (0.19 + i * 0.028) + Math.sin(phase * 0.12 + i) * 8;
      const span = Math.max(2.6, Math.min(4.1, width / 330)) - i * 0.25;
      const flap = Math.sin(phase * 5.3 + i * 1.3) * 1.8;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(x - span, y - flap);
      ctx.quadraticCurveTo(x - span / 2, y - 1, x, y + 0.6);
      ctx.quadraticCurveTo(x + span / 2, y - 1, x + span, y - flap);
      ctx.stroke();
    }
  }

  function drawRain(day) {
    if (state.weather !== 'rain') return;
    const count = Math.min(155, Math.round(width * height / 7500));
    ctx.lineCap = 'butt';
    for (let i = 0; i < count; i++) {
      const depth = seed(i + 900);
      const speed = 0.25 + depth * 0.33;
      const fall = fract(seed(i + 1100) + phase * speed);
      const x = fract(seed(i + 1200) - fall * 0.055) * (width + 35) - 15;
      const y = fall * (height + 30) - 15;
      const length = 8 + depth * 17;
      ctx.strokeStyle = `rgba(220,231,230,${mix(0.11, 0.19, day) + depth * 0.12})`;
      ctx.lineWidth = 0.45 + depth * 0.45;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - length * 0.22, y + length);
      ctx.stroke();
    }
  }

  function drawMist(day) {
    if (state.weather !== 'mist' && state.weather !== 'rain') return;
    const strength = state.weather === 'mist' ? 0.1 : 0.035;
    // Large, soft fields follow the landscape horizon without blurring the image.
    for (let i = 0; i < 3; i++) {
      const x = width * (i * 0.47 - 0.1) + Math.sin(phase * 0.025 + i) * width * 0.09;
      const y = height * (0.43 + i * 0.04);
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(1, 0.16);
      const radius = Math.max(width * 0.5, 260);
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
      gradient.addColorStop(0, `rgba(219,232,226,${strength * (0.4 + day * 0.6)})`);
      gradient.addColorStop(1, 'rgba(219,232,226,0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function drawNight(day) {
    if (day > 0.65 || state.weather === 'rain') return;
    const dark = 1 - day;
    if (state.weather === 'sunny') {
      for (let i = 0; i < 28; i++) {
        const x = seed(i + 2011) * width;
        const y = seed(i + 2111) * height * 0.25;
        const alpha = dark * (0.18 + seed(i + 2211) * 0.4) * (0.8 + Math.sin(phase * 0.35 + i) * 0.2);
        ctx.fillStyle = `rgba(230,232,215,${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, 0.55 + seed(i + 2311) * 0.65, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    if (state.scene === 'tea') {
      for (let i = 0; i < 9; i++) {
        const x = seed(i + 2411) * width + Math.sin(phase * 0.19 + i) * 16;
        const y = height * (0.62 + seed(i + 2511) * 0.3) + Math.sin(phase * 0.24 + i) * 9;
        const alpha = dark * (0.18 + Math.max(0, Math.sin(phase * 0.5 + i * 1.3)) * 0.58);
        ctx.fillStyle = `rgba(225,226,139,${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, 1.15, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function drawClicks() {
    for (let i = rings.length - 1; i >= 0; i--) {
      const ring = rings[i];
      const age = phase - ring.born;
      if (age > 2.8) { rings.splice(i, 1); continue; }
      for (let k = 0; k < 3; k++) {
        const progress = age - k * 0.24;
        if (progress < 0) continue;
        const r = 5 + progress * 32;
        const alpha = clamp((1 - progress / 2.8) * 0.38);
        ctx.strokeStyle = `rgba(238,242,223,${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.ellipse(ring.x, ring.y, r, r * 0.29, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  function paint() {
    if (dead) return;
    ctx.clearRect(0, 0, width, height);
    const day = daytime();
    drawWater(day);
    drawNight(day);
    drawBirds(day);
    drawMist(day);
    drawRain(day);
    drawClicks();
  }

  function animate(now) {
    frame = 0;
    if (!canAnimate()) { previous = 0; return; }
    if (!previous) previous = now;
    phase += Math.min(0.08, (now - previous) / 1000);
    previous = now;
    if (now - lastPaint >= 1000 / 30) {
      paint();
      lastPaint = now;
    }
    frame = requestAnimationFrame(animate);
  }

  function sync() {
    if (!canAnimate()) {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
      if (visible && intersecting) paint();
    } else if (!frame) {
      previous = 0;
      frame = requestAnimationFrame(animate);
    }
  }

  function visibility() { visible = !document.hidden; sync(); }
  document.addEventListener('visibilitychange', visibility);
  const resize = typeof ResizeObserver === 'function' ? new ResizeObserver(size) : null;
  if (resize) resize.observe(canvas.parentElement || canvas);
  else window.addEventListener('resize', size, { passive: true });
  const intersection = typeof IntersectionObserver === 'function'
    ? new IntersectionObserver(entries => {
        intersecting = entries.some(entry => entry.isIntersecting);
        sync();
      }, { rootMargin: '80px' })
    : null;
  intersection?.observe(canvas);
  size();
  sync();

  return {
    setState(next = {}) {
      if (dead) return;
      if (['westlake', 'canal', 'tea'].includes(next.scene)) {
        if (state.scene !== next.scene) rings.length = 0;
        state.scene = next.scene;
      }
      if (Number.isFinite(next.time)) state.time = clamp(next.time, 0, 1439);
      if (['sunny', 'mist', 'rain'].includes(next.weather)) state.weather = next.weather;
      if (typeof next.motion === 'boolean') state.motion = next.motion;
      paint();
      sync();
    },
    rippleAt(x, y) {
      if (dead || state.scene === 'tea' || !Number.isFinite(x) || !Number.isFinite(y)) return;
      if (y < height * 0.54 || x < 0 || x > width || y > height) return;
      rings.push({ x, y, born: phase - (state.motion ? 0 : 0.25) });
      if (rings.length > 8) rings.shift();
      paint();
      sync();
    },
    destroy() {
      if (dead) return;
      dead = true;
      if (frame) cancelAnimationFrame(frame);
      resize?.disconnect();
      intersection?.disconnect();
      window.removeEventListener('resize', size);
      document.removeEventListener('visibilitychange', visibility);
      rings.length = 0;
      ctx.clearRect(0, 0, width, height);
    }
  };
}

/** Browser-generated ambience. Audio is created only after toggle() is called. */
export function createSoundscape() {
  const state = { scene: 'westlake', weather: 'mist' };
  let context, master, wind, water, rain, windFilter;
  let on = false, dead = false, sequence = 0;
  let birdTimer = 0, suspendTimer = 0;
  const sources = [];

  function ramp(parameter, value, seconds = 1.2) {
    if (!context) return;
    const now = context.currentTime;
    parameter.cancelScheduledValues(now);
    parameter.setTargetAtTime(value, now, seconds / 4);
  }

  function noise(brown = false) {
    const length = Math.floor(context.sampleRate * (brown ? 5 : 4));
    const buffer = context.createBuffer(1, length, context.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      if (brown) {
        last = (last + 0.02 * white) / 1.02;
        data[i] = last * 3.2;
      } else data[i] = white * 0.45;
    }
    // Equalize the ends of the long loop to avoid a repeating boundary click.
    const fade = Math.min(2048, length / 8);
    for (let i = 0; i < fade; i++) {
      const t = i / fade;
      const a = data[i], b = data[length - fade + i];
      data[length - fade + i] = b * (1 - t) + a * t;
    }
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    sources.push(source);
    return source;
  }

  function makeLayer(source, type, frequency, q) {
    const filter = context.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = frequency;
    filter.Q.value = q;
    const gain = context.createGain();
    gain.gain.value = 0;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    return { gain, filter };
  }

  function build() {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return false;
    context = new Audio();
    master = context.createGain();
    master.gain.value = 0;
    master.connect(context.destination);
    const brown = noise(true), white = noise(false);
    const windLayer = makeLayer(brown, 'lowpass', 520, 0.5);
    wind = windLayer.gain;
    windFilter = windLayer.filter;
    water = makeLayer(white, 'bandpass', 640, 0.45).gain;
    rain = makeLayer(white, 'highpass', 1550, 0.4).gain;
    // Very slow modulation keeps wind and water from sounding like static.
    const breathe = context.createOscillator();
    const breathGain = context.createGain();
    breathe.frequency.value = 0.075;
    breathGain.gain.value = 140;
    breathe.connect(breathGain);
    breathGain.connect(windFilter.frequency);
    breathe.start();
    sources.push(breathe);
    brown.start();
    white.start();
    update();
    return true;
  }

  function update() {
    if (!context) return;
    const wet = state.weather === 'rain';
    ramp(wind.gain, state.scene === 'tea' ? 0.22 : 0.14);
    ramp(water.gain, state.scene === 'tea' ? 0.012 : state.scene === 'canal' ? 0.105 : 0.075);
    ramp(rain.gain, wet ? 0.115 : 0.001);
    ramp(windFilter.frequency, wet ? 410 : state.scene === 'tea' ? 680 : 460);
  }

  function chirp(delay, pitch, pan) {
    if (!context || !on || context.state !== 'running') return;
    const t = context.currentTime + delay;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const panner = typeof context.createStereoPanner === 'function' ? context.createStereoPanner() : null;
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(pitch, t);
    oscillator.frequency.exponentialRampToValueAtTime(pitch * 1.48, t + 0.07);
    oscillator.frequency.exponentialRampToValueAtTime(pitch * 0.82, t + 0.2);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.018, t + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.21);
    oscillator.connect(gain);
    if (panner) {
      panner.pan.value = pan;
      gain.connect(panner);
      panner.connect(master);
    } else gain.connect(master);
    oscillator.start(t);
    oscillator.stop(t + 0.23);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); panner?.disconnect(); };
  }

  function scheduleBird() {
    clearTimeout(birdTimer);
    if (!on || dead || document.hidden) return;
    birdTimer = setTimeout(() => {
      if (on && !dead && !document.hidden && state.weather !== 'rain') {
        const pitch = 1650 + Math.random() * 800;
        const pan = Math.random() * 1.4 - 0.7;
        chirp(0, pitch, pan);
        chirp(0.29, pitch * 1.06, pan);
      }
      scheduleBird();
    }, 11000 + Math.random() * 15000);
  }

  function onVisibility() {
    if (!context || dead || !on) return;
    clearTimeout(suspendTimer);
    if (document.hidden) {
      clearTimeout(birdTimer);
      ramp(master.gain, 0, 0.25);
      suspendTimer = setTimeout(() => {
        if (!dead && document.hidden) context.suspend().catch(() => {});
      }, 350);
    } else {
      context.resume().then(() => {
        if (on && !dead) { ramp(master.gain, 0.25, 1.2); scheduleBird(); }
      }).catch(() => {});
    }
  }
  document.addEventListener('visibilitychange', onVisibility);

  return {
    async toggle() {
      if (dead) return false;
      const turn = ++sequence;
      clearTimeout(suspendTimer);
      if (on) {
        on = false;
        clearTimeout(birdTimer);
        ramp(master.gain, 0, 0.55);
        suspendTimer = setTimeout(() => {
          if (!on && !dead) context?.suspend().catch(() => {});
        }, 700);
        return false;
      }
      try {
        if (!context && !build()) return false;
        await context.resume();
        if (dead || turn !== sequence) return on;
        on = true;
        update();
        ramp(master.gain, 0.25, 1.4);
        scheduleBird();
        return true;
      } catch {
        on = false;
        return false;
      }
    },
    setState(next = {}) {
      if (dead) return;
      if (['westlake', 'canal', 'tea'].includes(next.scene)) state.scene = next.scene;
      if (['sunny', 'mist', 'rain'].includes(next.weather)) state.weather = next.weather;
      update();
    },
    get enabled() { return on; },
    destroy() {
      if (dead) return;
      dead = true;
      on = false;
      sequence++;
      clearTimeout(birdTimer);
      clearTimeout(suspendTimer);
      document.removeEventListener('visibilitychange', onVisibility);
      for (const source of sources) {
        try { source.stop(); source.disconnect(); } catch { /* already stopped */ }
      }
      context?.close().catch(() => {});
    }
  };
}
