/* Gardari circle: isolated idle-motion correction, not an accepted release. */
/* Independent rim impulse + coasting, with the accepted soft bulk motor.
 * Advanced only by the existing particle-rendering loop. No timers or rAF. */
(() => {
  'use strict';
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const limit = 40 * Math.PI / 180;
  const state = {
    angle: 0, velocity: 0, target: 0, lastDelta: 0, responses: 0,
    rimAngle: 0, rimFastVelocity: 0, rimSlowVelocity: 0, lastRimTravel: 0
  };
  const BANDS = 17, HISTORY = 256, PROPAGATION = .45;
  const FAST_TAU = .28, SLOW_TAU = 1.35, RIM_SPEED_LIMIT = 3.4, STOP_SPEED = 1e-4;
  const bands = new Float64Array(BANDS);
  const bulkBands = new Float64Array(BANDS), rimBands = new Float64Array(BANDS);
  const previousBulkBands = new Float64Array(BANDS), previousRimBands = new Float64Array(BANDS);
  const historyTime = new Float64Array(HISTORY);
  const historyAngle = new Float64Array(HISTORY);
  const historyRimAngle = new Float64Array(HISTORY);
  const sampled = { angle: 0, rimAngle: 0 };
  let historyHead = 0, historyCount = 0;
  let elapsed = 0, nextPublish = 0, wheel = null;
  const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
  const smooth = x => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };

  function pushHistory() {
    historyTime[historyHead] = elapsed;
    historyAngle[historyHead] = state.angle;
    historyRimAngle[historyHead] = state.rimAngle;
    historyHead = (historyHead + 1) % HISTORY;
    historyCount = Math.min(HISTORY, historyCount + 1);
  }
  function readHistory(time) {
    let newer = (historyHead - 1 + HISTORY) % HISTORY;
    if (!historyCount || time >= historyTime[newer]) {
      sampled.angle = state.angle; sampled.rimAngle = state.rimAngle; return;
    }
    for (let i = 1; i < historyCount; i++) {
      const older = (newer - 1 + HISTORY) % HISTORY;
      if (time >= historyTime[older]) {
        const span = historyTime[newer] - historyTime[older];
        const p = span > 0 ? clamp((time - historyTime[older]) / span, 0, 1) : 0;
        sampled.angle = historyAngle[older] + (historyAngle[newer] - historyAngle[older]) * p;
        sampled.rimAngle = historyRimAngle[older] + (historyRimAngle[newer] - historyRimAngle[older]) * p;
        return;
      }
      newer = older;
    }
    sampled.angle = historyAngle[newer]; sampled.rimAngle = historyRimAngle[newer];
  }
  function rebuildBands() {
    for (let i = 0; i < BANDS; i++) {
      const radial = smooth(i / (BANDS - 1));
      const rimWeight = smooth((177 * i / (BANDS - 1) - 130) / 47);
      readHistory(elapsed - PROPAGATION * (1 - radial));
      bulkBands[i] = sampled.angle; rimBands[i] = sampled.rimAngle;
      bands[i] = sampled.angle * (1 - rimWeight) + sampled.rimAngle * rimWeight;
    }
  }
  function clearHistory() {
    historyHead = historyCount = 0;
    historyTime.fill(0); historyAngle.fill(0); historyRimAngle.fill(0);
    pushHistory(); rebuildBands();
    previousBulkBands.set(bulkBands); previousRimBands.set(rimBands);
  }
  function rimVelocity() { return state.rimFastVelocity + state.rimSlowVelocity; }
  function rimRemaining() { return state.rimFastVelocity * FAST_TAU + state.rimSlowVelocity * SLOW_TAU; }
  function publish() {
    wheel ||= document.getElementById('gardari-wheel');
    if (!wheel) return;
    Object.assign(wheel.dataset, {
      fieldAngle: state.angle.toFixed(6), fieldTarget: state.target.toFixed(6),
      fieldVelocity: state.velocity.toFixed(6), fieldLastDelta: state.lastDelta.toFixed(6),
      fieldResponses: String(state.responses), fieldRimAngle: state.rimAngle.toFixed(6),
      fieldRimVelocity: rimVelocity().toFixed(6),
      fieldRimFastVelocity: state.rimFastVelocity.toFixed(6),
      fieldRimSlowVelocity: state.rimSlowVelocity.toFixed(6),
      fieldRimRemaining: rimRemaining().toFixed(6), fieldRimLastTravel: state.lastRimTravel.toFixed(6),
      fieldMiddleAngle: bands[(BANDS - 1) / 2].toFixed(6), fieldCoreAngle: bands[0].toFixed(6),
      fieldPropagation: String(PROPAGATION)
    });
  }
  function settle() {
    state.angle = state.target; state.velocity = 0;
    // Freeze the reached rim position: pausing never pulls it backwards.
    state.rimFastVelocity = state.rimSlowVelocity = 0;
    clearHistory();
    publish();
  }
  function reset() {
    state.angle = state.velocity = state.target = state.lastDelta = 0;
    state.rimAngle = state.rimFastVelocity = state.rimSlowVelocity = state.lastRimTravel = 0;
    state.responses = 0; elapsed = nextPublish = 0;
    clearHistory();
    publish();
  }
  function onTurn(event) {
    const delta = Number(event.detail?.delta);
    if (!Number.isFinite(delta) || Math.abs(delta) < 1e-7 || media.matches || document.hidden) return;
    state.target = state.angle + clamp(delta * .325, -limit, limit);
    if (state.velocity * delta < 0) state.velocity *= .18;
    if (rimVelocity() * delta < 0) state.rimFastVelocity = state.rimSlowVelocity = 0;
    const travel = Math.sign(delta) * Math.min(1.5, Math.abs(delta) * .95);
    state.rimFastVelocity += travel * .4 / FAST_TAU;
    state.rimSlowVelocity += travel * .6 / SLOW_TAU;
    const speed = Math.abs(rimVelocity());
    if (speed > RIM_SPEED_LIMIT) {
      const scale = RIM_SPEED_LIMIT / speed;
      state.rimFastVelocity *= scale; state.rimSlowVelocity *= scale;
    }
    state.lastRimTravel = travel;
    state.lastDelta = delta; state.responses++;
    rebuildBands(); publish();
  }
  window.addEventListener('hub:navigation-started', onTurn);
  window.addEventListener('hub:field-pause', settle);
  window.addEventListener('hub:navigation-settled', event => { if (event.detail?.interrupted) settle(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) settle(); });
  media.addEventListener('change', () => { if (media.matches) settle(); });

  function sampleBands(projectedRadius, depthFactor, bulkBands, rimBands) {
      const radius = clamp(projectedRadius, 0, 177), normalized = radius / 177;
      // Keep a subtle depth-dependent propagation offset inside, but exactly
      // zero delay at R177: its reported angle is the actual rim angle.
      const radial = (normalized - .03 * (1 - clamp(depthFactor, 0, 1)) * normalized * (1 - normalized)) * (BANDS - 1);
      const index = Math.min(BANDS - 2, Math.floor(radial)), fraction = radial - index;
      const bulkAngle = bulkBands[index] + (bulkBands[index + 1] - bulkBands[index]) * fraction;
      const rimAngle = rimBands[index] + (rimBands[index + 1] - rimBands[index]) * fraction;
      const rimWeight = smooth((radius - 130) / 47);
      return bulkAngle * (1 - rimWeight) + rimAngle * rimWeight;
  }

  window.HubFieldNavigation = {
    advance(dt) {
      // Snapshot before the step, including zero-length and interrupted steps.
      previousBulkBands.set(bulkBands); previousRimBands.set(rimBands);
      if (!Number.isFinite(dt) || dt <= 0) return state;
      dt = Math.min(dt, 1 / 30);
      if (media.matches || document.hidden) { settle(); return state; }
      state.velocity += ((state.target - state.angle) * 10 - state.velocity * 6.4) * dt;
      state.velocity = clamp(state.velocity, -1.5, 1.5);
      const remaining = state.target - state.angle, change = state.velocity * dt;
      if (remaining * change > 0 && Math.abs(change) > Math.abs(remaining)) {
        state.angle = state.target; state.velocity = 0;
      } else state.angle += change;
      if (Math.abs(state.target - state.angle) < 1e-5 && Math.abs(state.velocity) < 1e-4) {
        state.angle = state.target; state.velocity = 0;
      }
      // Integrate each exponential exactly, so its unbounded total travel is
      // velocity*tau rather than a frame-rate-dependent Euler approximation.
      const fastDecay = Math.exp(-dt / FAST_TAU), slowDecay = Math.exp(-dt / SLOW_TAU);
      state.rimAngle += state.rimFastVelocity * FAST_TAU * (1 - fastDecay)
        + state.rimSlowVelocity * SLOW_TAU * (1 - slowDecay);
      state.rimFastVelocity *= fastDecay; state.rimSlowVelocity *= slowDecay;
      if (Math.abs(state.rimFastVelocity) < STOP_SPEED) state.rimFastVelocity = 0;
      if (Math.abs(state.rimSlowVelocity) < STOP_SPEED) state.rimSlowVelocity = 0;
      elapsed += dt; pushHistory(); rebuildBands();
      if (elapsed >= nextPublish) { publish(); nextPublish = elapsed + .05; }
      return state;
    },
    sample(projectedRadius, depthFactor = .5) {
      return sampleBands(projectedRadius, depthFactor, bulkBands, rimBands);
    },
    sampleDelta(projectedRadius, depthFactor = .5) {
      // Both samples use the same current material coordinates: motion through
      // a previously twisted field cannot manufacture new angular velocity.
      return sampleBands(projectedRadius, depthFactor, bulkBands, rimBands)
        - sampleBands(projectedRadius, depthFactor, previousBulkBands, previousRimBands);
    },
    reset, settle,
    getState: () => ({ ...state, transport: 'incremental-angle', rimVelocity: rimVelocity(), rimRemaining: rimRemaining(),
      middleAngle: bands[(BANDS - 1) / 2], coreAngle: bands[0], propagationSeconds: PROPAGATION })
  };
  clearHistory();
})();

/*
 * Хаб Гардари · вариант03 · более яркая палитра и акцентные знаки.
 * Собственная реализация: ограниченные сдвиги живой объёмной базы, локальный
 * импульс жеста и затухающая пружина. Это не физическая модель жидкости.
 * Никаких сетевых зависимостей и собственного requestAnimationFrame.
 */
(() => {
  'use strict';
  const CORE = 4461, VEIL = 868, COUNT = CORE + VEIL, BOUND = 175;
  const PERIPHERAL = VEIL / 2, PERIPHERAL_START = CORE + VEIL / 2;
  const peripheralRadius = new Float32Array(PERIPHERAL), peripheralAngle = new Float32Array(PERIPHERAL);
  const peripheralPhase = new Float32Array(PERIPHERAL);
  const x = new Float32Array(COUNT), y = new Float32Array(COUNT), z = new Float32Array(COUNT);
  const homeX = new Float32Array(COUNT), homeY = new Float32Array(COUNT), homeZ = new Float32Array(COUNT);
  const particleTurn = new Float64Array(COUNT);
  const offsetX = new Float32Array(CORE), offsetY = new Float32Array(CORE), offsetZ = new Float32Array(CORE);
  const velocityX = new Float32Array(CORE), velocityY = new Float32Array(CORE), velocityZ = new Float32Array(CORE);
  const size = new Float32Array(COUNT), sprite = new Uint16Array(COUNT);
  const projectedX = new Float32Array(COUNT), projectedY = new Float32Array(COUNT), depth = new Float32Array(COUNT);
  const alphaValues = new Float32Array(COUNT), drawSizes = new Float32Array(COUNT);
  const order = new Uint16Array(COUNT), bins = new Uint8Array(COUNT), binCounts = new Uint16Array(28), binStarts = new Uint16Array(28);
  const densityGrid = new Uint16Array(10000), densityCells = new Uint16Array(COUNT);
  const options = { flow: 1, interaction: 1, veil: 1 };
  const cyrillic = 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЭЮЯабвгдежзиклмнопрстуфхцчшэюя';
  const latin = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz', digits = '0123456789';
  const glyphs = [...new Set(cyrillic + latin + digits)];
  const dots = ['#687e90', '#987467', '#708360', '#897294', '#9b8757', '#688b86'];
  const fieldPalette = ['#0072d5', '#00897b', '#118d29', '#ab7500', '#d34a00', '#c63c8a', '#8451c9', '#d02b31', '#858c00', '#c97800'];
  const colorIndex = new Uint8Array(COUNT);
  const accentIndex = new Uint8Array(COUNT);
  const glyphLookup = new Map(glyphs.map((glyph, i) => [glyph, i]));
  const ATLAS_CELL = 48, ATLAS_COLS = 16;
  const ATLAS_PAGE_HEIGHT = Math.ceil((glyphs.length + dots.length) / ATLAS_COLS) * ATLAS_CELL;
  let atlas = null, fontsRequested = false, canvasRef = null, listenersBound = false;
  let lastTime = null, simTime = 0, flowTime = 0, frame = 0, lastDiagnosticsAt = -Infinity;
  let frameDuration = 16.667, renderCost = 0, maxRadius = 0, maxDisplacement = 0, repaired = 0;
  let pointerX = 0, pointerY = 0, pointerDX = 0, pointerDY = 0, pointerActive = false;
  let lastPointerX = 0, lastPointerY = 0, lastPointerAt = -Infinity, motionReduced = false;
  let seed = 817041, coverage = {};
  let accentCount = 0, cyrillicAccentCount = 0;
  let coolYellowCount = 0, warmYellowCount = 0;
  const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value));
  const smooth = value => { value = clamp(value, 0, 1); return value * value * (3 - 2 * value); };
  function random() {
    seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5;
    return (seed >>> 0) / 4294967296;
  }
  function radicalInverse(value, base) {
    let result = 0, factor = 1 / base;
    while (value > 0) {
      result += (value % base) * factor;
      value = Math.floor(value / base); factor /= base;
    }
    return result;
  }
  function particleColor(index) {
    // Separate deterministic hashing: color never consumes the material's
    // random sequence and is not correlated with its stratified coordinates.
    let hash = Math.imul((index + 1) ^ ((index + 1) >>> 16), 0x7feb352d);
    hash = Math.imul(hash ^ (hash >>> 15), 0x846ca68b);
    const originalColor = ((hash ^ (hash >>> 16)) >>> 0) % 8;
    let yellowHash = Math.imul(index + 0x6d2b79f5, 0x7feb352d);
    yellowHash = Math.imul(yellowHash ^ (yellowHash >>> 15), 0x846ca68b);
    yellowHash = (yellowHash ^ (yellowHash >>> 16)) >>> 0;
    return yellowHash / 4294967296 < .20 ? 8 + ((yellowHash >>> 8) & 1) : originalColor;
  }
  function emphasisFraction(index) {
    let hash = Math.imul(index + 0x165667b1, 0x7feb352d);
    hash = Math.imul(hash ^ (hash >>> 15), 0x846ca68b);
    return ((hash ^ (hash >>> 16)) >>> 0) / 4294967296;
  }

  function seedField() {
    seed = 817041; maxRadius = 0; accentCount = cyrillicAccentCount = 0;
    particleTurn.fill(0);
    coolYellowCount = warmYellowCount = 0;
    for (let i = 0; i < COUNT; i++) {
      colorIndex[i] = particleColor(i);
      if (colorIndex[i] === 8) coolYellowCount++;
      else if (colorIndex[i] === 9) warmYellowCount++;
      // Low-discrepancy volume samples remove accidental holes without placing
      // glyphs on a lattice. The complete core and half of the stable population
      // fill the ball. The other half softly reinforces a broad projected band
      // 24 units wide, with its own depth: never a drawn line or a narrow rim.
      const stable = i >= CORE, index = stable ? i - CORE : i;
      const peripheral = stable && index >= VEIL / 2;
      const localIndex = peripheral ? index - VEIL / 2 : index;
      const population = stable ? VEIL / 2 : CORE;
      const radialRank = (localIndex + .5) / population;
      const radius = Math.cbrt(radialRank) * (stable ? 173 : 172);
      const directionIndex = localIndex + 1 + (stable ? peripheral ? 173 : 59 : 0);
      const vertical = radicalInverse(directionIndex, 2) * 2 - 1;
      const angle = (radicalInverse(directionIndex, 3) + (peripheral ? .173 : stable ? .417 : 0)) * Math.PI * 2;
      const horizontal = Math.sqrt(1 - vertical * vertical);
      x[i] = homeX[i] = radius * horizontal * Math.cos(angle);
      y[i] = homeY[i] = radius * vertical;
      z[i] = homeZ[i] = radius * horizontal * Math.sin(angle);
      if (peripheral) {
        // Keep all seven radial strata when the population changes. Each band
        // receives an integer, evenly balanced number of angular samples.
        const radialStratum = Math.min(6, Math.floor(localIndex * 7 / PERIPHERAL));
        const bandStart = Math.ceil(radialStratum * PERIPHERAL / 7);
        const bandEnd = Math.ceil((radialStratum + 1) * PERIPHERAL / 7);
        const angularStratum = localIndex - bandStart, angularCount = bandEnd - bandStart;
        const radialJitter = radicalInverse(angularStratum + radialStratum * 11 + 1, 2);
        const angularJitter = radicalInverse(angularStratum + radialStratum * 7 + 1, 5) - .5;
        // A continuous outward density gradient fills the last few units too;
        // the complete 24-unit band remains populated, without a thin rim.
        const projectedRadius = 153 + Math.pow((radialStratum + radialJitter) / 7, .42) * 24;
        const projectedAngle = ((angularStratum + .5 + angularJitter * .34) / angularCount
          + radialStratum * .38196601125) * Math.PI * 2;
        const depthPosition = 18 + radicalInverse(localIndex + 1, 3) * 34;
        peripheralRadius[localIndex] = projectedRadius;
        peripheralAngle[localIndex] = projectedAngle;
        peripheralPhase[localIndex] = radicalInverse(localIndex + 1, 7) * Math.PI * 2;
        x[i] = homeX[i] = Math.cos(projectedAngle) * projectedRadius * (800 - depthPosition) / 800;
        y[i] = homeY[i] = Math.sin(projectedAngle) * projectedRadius * (800 - depthPosition) / 800;
        z[i] = homeZ[i] = depthPosition;
      }
      size[i] = random(); maxRadius = Math.max(maxRadius, Math.hypot(x[i], y[i], z[i]));
      const choice = random();
      if (choice > .82) sprite[i] = glyphs.length + Math.floor(random() * dots.length);
      else {
        const alphabet = choice < .43 ? cyrillic : choice < .62 ? latin : digits;
        sprite[i] = glyphLookup.get(alphabet[Math.floor(random() * alphabet.length)]);
      }
      const isCyrillic = sprite[i] < glyphs.length && cyrillic.includes(glyphs[sprite[i]]);
      accentIndex[i] = i < CORE && sprite[i] < glyphs.length && emphasisFraction(i) < (isCyrillic ? .42 : .07) ? 1 : 0;
      if (accentIndex[i]) { accentCount++; if (isCyrillic) cyrillicAccentCount++; }
    }
    offsetX.fill(0); offsetY.fill(0); offsetZ.fill(0);
    velocityX.fill(0); velocityY.fill(0); velocityZ.fill(0);
    lastTime = null; simTime = flowTime = 0; frame = 0;
    lastDiagnosticsAt = -Infinity; repaired = 0; maxDisplacement = 0;
    pointerDX = pointerDY = 0; pointerActive = false; lastPointerAt = -Infinity;
    coverage = measureVolume();
  }

  function buildAtlas() {
    const surface = document.createElement('canvas');
    surface.width = ATLAS_CELL * ATLAS_COLS;
    surface.height = ATLAS_PAGE_HEIGHT * fieldPalette.length * 2;
    const ctx = surface.getContext('2d');
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    fieldPalette.forEach((color, page) => {
      for (let accent = 0; accent < 2; accent++) {
        const top = (page * 2 + accent) * ATLAS_PAGE_HEIGHT;
        ctx.fillStyle = color;
        ctx.font = `${accent ? 700 : 500} 24px "JetBrains Mono", monospace`;
        glyphs.forEach((glyph, i) => ctx.fillText(glyph,
          (i % ATLAS_COLS + .5) * ATLAS_CELL, top + (Math.floor(i / ATLAS_COLS) + .5) * ATLAS_CELL + .5));
        dots.forEach((_originalColor, j) => {
          const i = glyphs.length + j;
          ctx.beginPath();
          ctx.arc((i % ATLAS_COLS + .5) * ATLAS_CELL, top + (Math.floor(i / ATLAS_COLS) + .5) * ATLAS_CELL, 7, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    });
    atlas = surface;
  }

  function step(dt) {
    const nav = window.HubFieldNavigation?.advance(dt) || { angle: 0, velocity: 0 };
    simTime += dt; flowTime += dt * options.flow;
    const azimuth = flowTime * .025, elevation = .12 * Math.sin(flowTime * .11);
    const ca = Math.cos(azimuth), sa = Math.sin(azimuth), ce = Math.cos(elevation), se = Math.sin(elevation);
    const phase = flowTime * .32;
    const pulseX = pointerDX, pulseY = pointerDY, pulseSpeed = Math.hypot(pulseX, pulseY);
    pointerDX *= Math.exp(-15 * dt); pointerDY *= Math.exp(-15 * dt);
    const damping = Math.exp(-1.9 * dt), stiffness = 3.4;
    maxDisplacement = maxRadius = 0;
    for (let i = 0; i < COUNT; i++) {
      const stable = i >= CORE;
      const peripheral = i >= PERIPHERAL_START;
      let a = homeX[i], b = homeY[i], c = homeZ[i];
      // The internal shears keep the accepted living texture. Their radial
      // envelope smoothly vanishes near the outer volume, so quiet motion does
      // not repeatedly dent the silhouette. This tapered map is deliberately
      // not claimed to have an exactly unit Jacobian.
      if (!stable) {
        const envelope = 1 - smooth((Math.hypot(a, b, c) - 123) / 49);
        a += 5.3 * envelope * Math.sin(b * .027 + phase);
        b += 5.1 * envelope * Math.sin(c * .026 - phase * .81);
        c += 4.8 * envelope * Math.sin(a * .024 + phase * .67);
      }
      if (peripheral) {
        const j = i - PERIPHERAL_START;
        const angle = peripheralAngle[j] + flowTime * .007
          + .004 * Math.sin(flowTime * .16 + peripheralPhase[j]);
        c = homeZ[i] + 5.5 * Math.sin(flowTime * .13 + peripheralPhase[j]);
        const worldRadius = peripheralRadius[j] * (800 - c) / 800;
        a = Math.cos(angle) * worldRadius; b = Math.sin(angle) * worldRadius;
      } else {
        const angle = stable ? azimuth * .28 : azimuth;
        const cosAngle = stable ? Math.cos(angle) : ca, sinAngle = stable ? Math.sin(angle) : sa;
        const rotatedX = a * cosAngle - c * sinAngle;
        const rotatedZ = a * sinAngle + c * cosAngle;
        a = rotatedX;
        if (stable) c = rotatedZ;
        else { const rotatedY = b * ce - rotatedZ * se; c = b * se + rotatedZ * ce; b = rotatedY; }
      }

      // All material samples the same edge-led temporal wave. The centre may
      // still be responding after the current outer angle has settled, so sample
      // must also be called when nav.angle/velocity have already reached zero.
      const projectedRadius = Math.hypot(a, b) * 800 / (800 - c);
      const depthFactor = clamp((c + BOUND) / (2 * BOUND), 0, 1);
      const deltaTurn = window.HubFieldNavigation?.sampleDelta
        ? window.HubFieldNavigation.sampleDelta(projectedRadius, depthFactor) : 0;
      if (deltaTurn !== 0) {
        const fullTurn = Math.PI * 2;
        particleTurn[i] = ((particleTurn[i] + deltaTurn + Math.PI) % fullTurn + fullTurn) % fullTurn - Math.PI;
      }
      const turn = particleTurn[i];
      if (Math.abs(turn) > 1e-8) {
        const turnCos = Math.cos(turn), turnSin = Math.sin(turn);
        const turnedX = a * turnCos - b * turnSin;
        b = a * turnSin + b * turnCos; a = turnedX;
      }

      if (!stable) {
        let dx = offsetX[i], dy = offsetY[i], dz = offsetZ[i];
        let u = velocityX[i], v = velocityY[i], w = velocityZ[i];
        if (pulseSpeed > .2) {
          const perspective = 800 / (800 - c);
          const rx = a * perspective - pointerX, ry = b * perspective - pointerY;
          const distance2 = rx * rx + ry * ry;
          const local = Math.exp(-distance2 / 3800);
          const front = .5 + .5 * clamp((c + 150) / 300, 0, 1);
          const edge = 1 - .62 * smooth((Math.hypot(a, b, c) - 125) / 45);
          const amount = local * front * edge * options.interaction;
          const fullness = Math.max(.08, 1 - Math.hypot(dx, dy, dz) / 83);
          // Parallel impulse, not attraction to the cursor: a gesture displaces
          // a patch and rolls it in depth rather than concentrating it at a point.
          u += pulseX * amount * 7.8 * fullness * dt;
          v += pulseY * amount * 7.8 * fullness * dt;
          const perpendicular = rx * pulseY - ry * pulseX;
          w += perpendicular * amount * .065 * fullness * dt;
        }
        u = (u - dx * stiffness * dt) * damping;
        v = (v - dy * stiffness * dt) * damping;
        w = (w - dz * stiffness * dt) * damping;
        const speed = Math.hypot(u, v, w);
        if (speed > 270) { const ratio = 270 / speed; u *= ratio; v *= ratio; w *= ratio; }
        dx += u * dt; dy += v * dt; dz += w * dt;
        const displacement = Math.hypot(dx, dy, dz);
        if (displacement > 77) {
          const ratio = 77 / displacement; dx *= ratio; dy *= ratio; dz *= ratio;
          const outward = Math.max(0, (u * dx + v * dy + w * dz) / 77);
          u -= dx / 77 * outward; v -= dy / 77 * outward; w -= dz / 77 * outward;
        }
        if (!Number.isFinite(dx + dy + dz + u + v + w)) { dx = dy = dz = u = v = w = 0; repaired++; }
        offsetX[i] = dx; offsetY[i] = dy; offsetZ[i] = dz;
        velocityX[i] = u; velocityY[i] = v; velocityZ[i] = w;
        a += dx; b += dy; c += dz;
        maxDisplacement = Math.max(maxDisplacement, Math.hypot(dx, dy, dz));
      }
      const radius = Math.hypot(a, b, c);
      if (radius > BOUND) { const ratio = BOUND / radius; a *= ratio; b *= ratio; c *= ratio; }
      x[i] = a; y[i] = b; z[i] = c; maxRadius = Math.max(maxRadius, Math.min(radius, BOUND));
    }
  }

  function eigenvalues(xx, yy, zz, xy, xz, yz) {
    const a = [[xx, xy, xz], [xy, yy, yz], [xz, yz, zz]];
    for (let iteration = 0; iteration < 12; iteration++) {
      let p = 0, q = 1;
      if (Math.abs(a[0][2]) > Math.abs(a[p][q])) { p = 0; q = 2; }
      if (Math.abs(a[1][2]) > Math.abs(a[p][q])) { p = 1; q = 2; }
      if (Math.abs(a[p][q]) < 1e-7) break;
      const theta = .5 * Math.atan2(2 * a[p][q], a[q][q] - a[p][p]);
      const cs = Math.cos(theta), sn = Math.sin(theta), app = a[p][p], aqq = a[q][q], apq = a[p][q];
      a[p][p] = cs * cs * app - 2 * sn * cs * apq + sn * sn * aqq;
      a[q][q] = sn * sn * app + 2 * sn * cs * apq + cs * cs * aqq;
      a[p][q] = a[q][p] = 0;
      for (let r = 0; r < 3; r++) if (r !== p && r !== q) {
        const arp = a[r][p], arq = a[r][q];
        a[r][p] = a[p][r] = cs * arp - sn * arq;
        a[r][q] = a[q][r] = sn * arp + cs * arq;
      }
    }
    return [a[0][0], a[1][1], a[2][2]].sort((a, b) => a - b);
  }

  function measureVolume() {
    const sectors = new Uint16Array(24);
    const edgeSectors = Array.from({ length: 36 }, () => []);
    const edgeBand174 = new Uint16Array(36);
    let projectedMaximum = 0;
    let sx = 0, sy = 0, sz = 0, xx = 0, yy = 0, zz = 0, xy = 0, xz = 0, yz = 0;
    let central = 0, centralCore = 0, centralVeil = 0, sphereCore = 0, radiusSum = 0;
    let xmin = Infinity, xmax = -Infinity, ymin = Infinity, ymax = -Infinity, zmin = Infinity, zmax = -Infinity;
    for (let i = 0; i < COUNT; i++) {
      const a = motionReduced ? homeX[i] : x[i], b = motionReduced ? homeY[i] : y[i], c = motionReduced ? homeZ[i] : z[i];
      const radius = Math.hypot(a, b, c), perspective = 800 / (800 - c);
      const screenRadius = Math.hypot(a, b) * perspective;
      const angularFraction = (Math.atan2(b, a) + Math.PI) / (Math.PI * 2);
      const edgeSector = Math.min(35, Math.floor(angularFraction * 36));
      edgeSectors[edgeSector].push(screenRadius);
      if (screenRadius >= 174 && screenRadius <= 181) edgeBand174[edgeSector]++;
      projectedMaximum = Math.max(projectedMaximum, screenRadius);
      radiusSum += radius;
      if (screenRadius < 50) { central++; if (i < CORE) centralCore++; else centralVeil++; }
      if (screenRadius > 120) sectors[Math.min(23, Math.floor((Math.atan2(b, a) + Math.PI) / (Math.PI * 2) * 24))]++;
      if (i < CORE) {
        sx += a; sy += b; sz += c; xx += a*a; yy += b*b; zz += c*c; xy += a*b; xz += a*c; yz += b*c;
        if (radius < BOUND * .45) sphereCore++;
        xmin = Math.min(xmin, a); xmax = Math.max(xmax, a); ymin = Math.min(ymin, b); ymax = Math.max(ymax, b); zmin = Math.min(zmin, c); zmax = Math.max(zmax, c);
      }
    }
    const mx = sx / CORE, my = sy / CORE, mz = sz / CORE;
    const eigen = eigenvalues(xx/CORE-mx*mx, yy/CORE-my*my, zz/CORE-mz*mz, xy/CORE-mx*my, xz/CORE-mx*mz, yz/CORE-my*mz);
    const edgeRadii98 = edgeSectors.map(values => {
      values.sort((a, b) => a - b);
      const at = (values.length - 1) * .98, lower = Math.floor(at), fraction = at - lower;
      return values.length ? values[lower] * (1 - fraction) + values[Math.min(lower + 1, values.length - 1)] * fraction : 0;
    });
    const edgeMean = edgeRadii98.reduce((sum, value) => sum + value, 0) / edgeRadii98.length;
    const edgeDeviation = Math.sqrt(edgeRadii98.reduce((sum, value) => sum + (value - edgeMean) ** 2, 0) / edgeRadii98.length);
    return {
      angularSectors: [...sectors].filter(value => value >= 6).length, angularSectorsTotal: 24,
      minimumSectorPopulation: Math.min(...sectors), centralParticles: central, centralCoreParticles: centralCore,
      centralVeilParticles: centralVeil, coreInnerSphereFraction: +(sphereCore / CORE).toFixed(4),
      principalAxes: eigen.map(value => +Math.sqrt(Math.max(0, value)).toFixed(2)),
      axisRatio: +Math.sqrt(eigen[0] / eigen[2]).toFixed(4),
      axisSpans: [xmax-xmin, ymax-ymin, zmax-zmin].map(value => +value.toFixed(2)),
      meanRadius: +(radiusSum / COUNT).toFixed(2), centre: [mx, my, mz].map(value => +value.toFixed(2)),
      edgeSectorCount: 36, edgeQuantile: .98, edgeRadii98: edgeRadii98.map(value => +value.toFixed(2)),
      edgeMeanRadius98: +edgeMean.toFixed(2), edgeMinRadius98: +Math.min(...edgeRadii98).toFixed(2),
      edgeMaxRadius98: +Math.max(...edgeRadii98).toFixed(2),
      edgeRange98: +(Math.max(...edgeRadii98) - Math.min(...edgeRadii98)).toFixed(2),
      edgeCV98: +(edgeDeviation / edgeMean).toFixed(5), projectedMaximum: +projectedMaximum.toFixed(2),
      edgeBand174Count: edgeBand174.reduce((sum, value) => sum + value, 0),
      edgeBand174Minimum: Math.min(...edgeBand174),
      edgeBand174OccupiedSectors: [...edgeBand174].filter(value => value > 0).length
    };
  }

  function pointerMove(event) {
    if (!canvasRef || motionReduced) return;
    const rect = canvasRef.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const px = (event.clientX - rect.left) * 600 / rect.width - 300;
    const py = (event.clientY - rect.top) * 600 / rect.height - 300, now = performance.now();
    if (pointerActive && now - lastPointerAt < 200) {
      const elapsed = Math.max(8, now - lastPointerAt) / 1000;
      pointerDX = pointerDX * .32 + clamp((px-lastPointerX)/elapsed, -950, 950) * .68;
      pointerDY = pointerDY * .32 + clamp((py-lastPointerY)/elapsed, -950, 950) * .68;
    }
    pointerX = lastPointerX = px; pointerY = lastPointerY = py;
    pointerActive = true; lastPointerAt = now;
  }
  function bindPointer() {
    if (listenersBound) return;
    const wheel = document.getElementById('gardari-wheel');
    if (!wheel) return;
    for (const event of ['pointermove', 'pointerenter', 'pointerdown']) wheel.addEventListener(event, pointerMove, { passive: true });
    for (const event of ['pointerleave', 'pointercancel']) wheel.addEventListener(event, () => { pointerActive = false; }, { passive: true });
    listenersBound = true;
  }

  function draw(ctx, canvas, reduced) {
    const scale = canvas.width / 600;
    ctx.setTransform(scale, 0, 0, scale, 0, 0); ctx.clearRect(0, 0, 600, 600);
    binCounts.fill(0); densityGrid.fill(0);
    for (let i = 0; i < COUNT; i++) {
      const a = reduced ? homeX[i] : x[i], b = reduced ? homeY[i] : y[i], c = reduced ? homeZ[i] : z[i];
      const perspective = 800 / (800 - c), d = clamp((c + BOUND) / (BOUND * 2), 0, 1);
      projectedX[i] = 300 + a * perspective; projectedY[i] = 300 + b * perspective; depth[i] = d;
      const cell = clamp(Math.floor(projectedX[i] / 6), 0, 99) + clamp(Math.floor(projectedY[i] / 6), 0, 99) * 100;
      densityCells[i] = cell; densityGrid[cell]++;
      const bin = Math.min(27, Math.floor(d * 28)); bins[i] = bin; binCounts[bin]++;
    }
    let sum = 0;
    for (let i = 0; i < 28; i++) { binStarts[i] = sum; sum += binCounts[i]; }
    for (let i = 0; i < COUNT; i++) order[binStarts[bins[i]]++] = i;
    // Field visibility is a small optical adjustment. Even its minimum cannot remove
    // the volume's stable population or turn it into a vanishing outline.
    const visibility = (options.veil - .3) / 1.5;
    for (let j = 0; j < COUNT; j++) {
      const i = order[j], d = depth[i], stable = i >= CORE, dot = sprite[i] >= glyphs.length;
      let alpha = stable ? .20 + d * .28 : .08 + Math.pow(d, 1.65) * .70;
      alpha *= .88 + size[i] * .12;
      if (stable) alpha *= .80 + visibility * .20;
      else alpha *= .94 + visibility * .06;
      if (accentIndex[i]) alpha = Math.min(.96, alpha * 1.55 + .06 + d * .10);
      // Reduce excessive overprinting in a gesture's fold, keeping every cell
      // legible instead of allowing a black knot to accumulate.
      alpha *= Math.max(.52, 1 / Math.sqrt(Math.max(1, densityGrid[densityCells[i]] / 7)));
      if (dot) alpha *= .95;
      let fontSize = (stable ? 5.3 : 5.2) + d * 3.0 + size[i] * .70;
      if (accentIndex[i]) fontSize *= 1.08 + size[i] * .06;
      const side = dot ? (2.1 + d * 1.4 + size[i] * .55) * 3.2 : fontSize * 2;
      alphaValues[i] = alpha; drawSizes[i] = side;
      ctx.globalAlpha = Math.min(accentIndex[i] ? .94 : .85, alpha);
      ctx.drawImage(atlas, sprite[i] % ATLAS_COLS * ATLAS_CELL, Math.floor(sprite[i] / ATLAS_COLS) * ATLAS_CELL + (colorIndex[i] * 2 + accentIndex[i]) * ATLAS_PAGE_HEIGHT,
        ATLAS_CELL, ATLAS_CELL, projectedX[i]-side/2, projectedY[i]-side/2, side, side);
    }
    ctx.globalAlpha = 1;
  }

  function render({ canvas, ctx, time, reducedMotion = false }) {
    if (!canvas || !ctx || !Number.isFinite(time)) return;
    const started = performance.now(); canvasRef = canvas; bindPointer();
    canvas.dataset.fieldTransport = 'incremental-angle';
    canvas.dataset.fieldColorCount = String(fieldPalette.length);
    canvas.dataset.fieldAccentCount = String(accentCount);
    canvas.dataset.fieldCyrillicAccentCount = String(cyrillicAccentCount);
    canvas.dataset.fieldYellowCount = String(coolYellowCount + warmYellowCount);
    canvas.dataset.fieldCoolYellowCount = String(coolYellowCount);
    canvas.dataset.fieldWarmYellowCount = String(warmYellowCount);
    if (!atlas) buildAtlas();
    if (!fontsRequested && document.fonts) {
      fontsRequested = true;
      document.fonts.ready.then(() => {
        buildAtlas();
        window.dispatchEvent(new CustomEvent('hub:field-redraw'));
      });
    }
    const reduced = typeof reducedMotion === 'object' ? !!reducedMotion.matches : !!reducedMotion;
    const elapsed = lastTime === null ? 1/60 : Math.max(0, (time-lastTime)/1000);
    if (elapsed > .002 && elapsed < .1) frameDuration += (elapsed*1000-frameDuration)*.055;
    lastTime = time;
    if (!reduced) {
      const dt = elapsed > .2 || motionReduced ? 1/60 : Math.min(elapsed, 1/30);
      const steps = dt > .019 ? 2 : 1;
      for (let i = 0; i < steps; i++) if (dt > 0) step(dt/steps);
    } else { pointerDX = pointerDY = 0; pointerActive = false; }
    motionReduced = reduced; draw(ctx, canvas, reduced); frame++;
    renderCost += (performance.now()-started-renderCost)*.09;
    if (time-lastDiagnosticsAt >= 1000) {
      coverage = measureVolume();
      Object.assign(canvas.dataset, {
        trialParticles: String(COUNT), trialFrameMs: renderCost.toFixed(2), trialFinite: String(repaired === 0),
        trialMaxRadius: maxRadius.toFixed(2), trialMaxDisplacement: maxDisplacement.toFixed(2),
        trialSectors: `${coverage.angularSectors}/24`, trialCentral: String(coverage.centralParticles),
        trialCentralCore: String(coverage.centralCoreParticles), trialAxisRatio: String(coverage.axisRatio),
        trialInnerMass: String(coverage.coreInnerSphereFraction), trialMeanRadius: String(coverage.meanRadius),
        trialEdgeMean: String(coverage.edgeMeanRadius98), trialEdgeRange: String(coverage.edgeRange98),
        trialEdgeCV: String(coverage.edgeCV98), trialEdgeMin: String(coverage.edgeMinRadius98),
        trialEdgeMax: String(coverage.edgeMaxRadius98), trialProjectedMax: String(coverage.projectedMaximum),
        trialEdgeBandMin: String(coverage.edgeBand174Minimum),
        trialEdgeBandSectors: `${coverage.edgeBand174OccupiedSectors}/36`
      });
      lastDiagnosticsAt = time;
    }
  }
  seedField();
  window.HubFluidField = {
    render, reset: seedField,
    setOptions(next = {}) {
      for (const name of ['flow', 'interaction', 'veil']) if (typeof next[name] === 'number' && Number.isFinite(next[name])) options[name] = clamp(next[name], .3, 1.8);
      return { ...options };
    },
    getStats() {
      return {
        implementation: 'circle-color-emphasis-03', navigationTransport: 'incremental-angle', particles: COUNT, coreParticles: CORE, veilParticles: VEIL,
        accentParticles: accentCount, cyrillicAccentParticles: cyrillicAccentCount,
        coolYellowParticles: coolYellowCount, warmYellowParticles: warmYellowCount,
        frames: frame, simulationSeconds: +simTime.toFixed(2), fps: +(1000/frameDuration).toFixed(1), renderMilliseconds: +renderCost.toFixed(2),
        maxRadius: +maxRadius.toFixed(2), maxDisplacement: +maxDisplacement.toFixed(2), repairedNonFinite: repaired,
        reducedMotion: motionReduced, pointerActive, options: { ...options }, ...measureVolume()
      };
    }
  };
})();

window.HubFluidField.setOptions({flow:0.9, interaction:1, veil:0.3});

/* Paper-fold behavior adapted from React Bits FoldText (David Haz).
MIT + Commons Clause License Condition v1.0

Copyright (c) 2026 David Haz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, and distribute the Software **as part of an application, website, or product**, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

## Commons Clause Restriction

You may use this Software, including for any commercial purpose, **so long as you do not sell, sublicense, or redistribute the components themselves-whether alone, in a bundle, or as a ported version.**

The same restriction covers the React Bits tools (Background Studio, Texture Lab, Shape Magic, Center Stage, Sound Lab and any tools added later) and the sounds in the sound library. **You may not sell, sublicense, or redistribute the tools or the sounds themselves, or offer the tools or a substantially similar copy of them as a hosted service-whether alone, in a bundle, or as a ported version.**

What you make with the tools is yours to use. You can use exported code, images, videos, and audio files in any personal or commercial application, website, or product, including paid ones. **You may not sell or redistribute the exports on their own, either individually or as the product itself, such as a sound, texture, background, or template pack.**

## No Warranty

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/
(() => {
  "use strict";

  // Единая конфигурация направлений. Неопубликованные адреса — пилотные маршруты.
  const directions = window.GARDARI_HUB_CONTENT.directions;
  const directionComposition = window.GARDARI_HUB_CONTENT.features?.directionComposition === true;

  const ns = "http://www.w3.org/2000/svg";
  const wheel = document.getElementById("gardari-wheel");
  const buttons = Array.from(wheel.querySelectorAll(".wheel-node"));
  const dotsGroup = document.getElementById("wheel-dots");
  const particleCanvas = document.getElementById("wheel-particles");
  const particleContext = particleCanvas.getContext("2d", { alpha: true });
  const orbiter = document.getElementById("wheel-orbiter");
  const halo = wheel.querySelector(".wheel-orbiter-halo");
  const panel = document.getElementById("direction-panel");
  const aboutJourney = document.getElementById("about-journey");
  const aboutStart = document.getElementById("about-path");
  const aboutEnabled = window.GARDARI_HUB_CONTENT.features?.aboutJourney !== false &&
    Boolean(aboutJourney && aboutStart);
  const center = { x: 300, y: 300 };
  const orbitRadius = 181;
  const fullCircle = 2 * Math.PI;
  const nodeAngles = directions.map((_, i) => -Math.PI / 2 + i * fullCircle / directions.length);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const phoneMedia = window.matchMedia("(max-width: 700px)");
  const originalWheelLabel = wheel.getAttribute("aria-label");
  let phoneUtility = null;
  let chosen = directions.findIndex(item => item.number === "0.1");
  let panelScrollTimer = null;
  let progress = 0;
  let lastTime = null;
  let frameId = null;
  let wheelVisible = true;
  const period = 29000;
  let navigationOffset = -Math.max(0, chosen) * fullCircle / directions.length;
  let navigationTurn = null;
  const dots = [];
  const dotTargets = [];
  const hitAreas = [];
  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0, strength: 0, active: false };
  let particleStride = 1;
  let nextWordAt = Infinity;
  let wordStartedAt = -Infinity;
  let wordSceneIndex = -1;
  let activeWordScene = null;

  // Детерминированное распределение по сфере и устойчивые знаки: буквы преобладают над цифрами.
  function random01(seed) {
    const n = Math.sin(seed * 127.1 + 78.233) * 43758.5453123;
    return n - Math.floor(n);
  }
  const cyrillicLetters = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя";
  const latinLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";
  // Сдержанная палитра принадлежит только точкам: буквенно-цифровая ткань остаётся графитовой.
  const dotColors = ["#758fa1", "#aa786b", "#788d68", "#9278a1", "#a28e5a", "#6f9c9a", "#a07e89"];
  const glyphInk = "#202124";
  function particleGlyph(index) {
    const alphabetChoice = random01(index + 8219);
    const alphabet = alphabetChoice < .45 ? cyrillicLetters : alphabetChoice < .8 ? latinLetters : digits;
    return alphabet[Math.floor(random01(index + 9487) * alphabet.length)];
  }
  const particleCount = 1850;
  const particles = Array.from({ length: particleCount }, (_, i) => {
    const y = 1 - (i + .5) * 2 / particleCount;
    const angle = i * Math.PI * (3 - Math.sqrt(5)) + (random01(i + 17) - .5) * .25;
    const circle = Math.sqrt(Math.max(0, 1 - y * y));
    const glyph = particleGlyph(i);
    return {
      x: circle * Math.cos(angle), y, z: circle * Math.sin(angle),
      phase: random01(i + 307) * Math.PI * 2,
      size: random01(i + 941),
      radialJitter: (random01(i + 1301) - .5) * 8,
      glyph,
      glyphChance: random01(i + 10751),
      dotColor: Math.floor(random01(i + 15101) * dotColors.length),
      accentLetter: cyrillicLetters.includes(glyph) && random01(i + 16901) < .29
    };
  });
  // Короткие слова складываются из уже существующих кириллических частиц, а не из текста поверх сферы.
  const wordScenes = ["СМЫСЛ", "ОБРАЗ", "МЫСЛЬ", "ЖИЗНЬ", "ФОРМА", "СВЯЗЬ"].map(word => {
    const used = new Set();
    const slots = new Map();
    for (let position = 0; position < word.length; position++) {
      const letter = word[position];
      let bestIndex = -1;
      let bestScore = -Infinity;
      particles.forEach((particle, i) => {
        if (particle.glyph !== letter || particle.glyphChance < .25 || used.has(i)) return;
        const score = particle.size * .3 + particle.glyphChance * .3 + random01(i + position * 109 + 24613) * .4;
        if (score > bestScore) {
          bestIndex = i;
          bestScore = score;
        }
      });
      if (bestIndex === -1) return { word, slots: new Map() };
      used.add(bestIndex);
      slots.set(bestIndex, position);
    }
    return { word, slots };
  }).filter(scene => scene.slots.size === scene.word.length);

  function smoothstep(value) {
    const t = Math.max(0, Math.min(1, value));
    return t * t * (3 - 2 * t);
  }
  // Едва заметная граница — точки того же поля, без отдельной SVG-окружности.
  const boundaryDots = Array.from({ length: 216 }, (_, i) => ({
    angle: -Math.PI / 2 + i * Math.PI * 2 / 216 + (random01(i + 2053) - .5) * .014,
    radius: orbitRadius + (random01(i + 3301) - .5) * 4,
    phase: random01(i + 4601) * Math.PI * 2,
    size: random01(i + 5903),
    opacity: random01(i + 7109),
    dotColor: Math.floor(random01(i + 8101) * dotColors.length)
  }));

  function svg(tag, attrs, parent) {
    const el = document.createElementNS(ns, tag);
    Object.keys(attrs).forEach(name => el.setAttribute(name, String(attrs[name])));
    parent.appendChild(el);
    return el;
  }
  function polar(angle, radius) {
    return { x: center.x + Math.cos(angle) * radius, y: center.y + Math.sin(angle) * radius };
  }

  // Warm monochrome mapped from the unmodified Publications photograph.
  // The source JPEGs, the two color images and the reference stay untouched.
  const photoDefinitions = svg("defs", {}, wheel.querySelector(".wheel-geometry"));
  const photoTone = svg("filter", { id: "hub-warm-mono", "color-interpolation-filters": "sRGB" }, photoDefinitions);
  svg("feColorMatrix", { type: "matrix", values: "0.2250935 0.7572288 0.0764428 0 -0.0323302 0.2104422 0.7079411 0.0714672 0 0.0082152 0.1971864 0.6633476 0.0669655 0 0.0138209 0 0 0 1 0" }, photoTone);

  // Подписи остаются редактируемым short; переносы задаются самими данными.
  function splitNavigationCaption(short) {
    const text = String(short ?? "").trim();
    const explicitLines = text.split(/\r?\n/);
    if (explicitLines.length > 1) {
      return [explicitLines[0].trim(), explicitLines.slice(1).join(" ").trim()];
    }
    const words = text.split(/\s+/).filter(Boolean);
    if (words.length < 2) return [text, ""];
    let splitAt = 1;
    let smallestDifference = Infinity;
    for (let i = 1; i < words.length; i += 1) {
      const difference = Math.abs(words.slice(0, i).join(" ").length - words.slice(i).join(" ").length);
      if (difference < smallestDifference) {
        smallestDifference = difference;
        splitAt = i;
      }
    }
    return [words.slice(0, splitAt).join(" "), words.slice(splitAt).join(" ")];
  }

  function renderNavigationCaption(name, short) {
    const lines = splitNavigationCaption(short).map(text => {
      const line = document.createElement("span");
      line.className = "wheel-node-name-line";
      line.textContent = text;
      return line;
    });
    name.replaceChildren(lines[0], document.createTextNode("\n"), lines[1]);
  }

  const orbitLabelNodes = buttons.map(button => button.querySelector(".wheel-node-name"));
  const orbitLabelScales = orbitLabelNodes.map(() => "1.0000");
  const orbitLabelHalfWindow = 750 / period;

  function updateOrbitLabelEmphasis() {
    orbitLabelNodes.forEach((name, i) => {
      const nodeProgress = ((i / directions.length + navigationOffset / fullCircle) % 1 + 1) % 1;
      const offset = Math.abs(progress - nodeProgress);
      const distance = Math.min(offset, 1 - offset);
      const strength = reducedMotion.matches ? 0 : 1 - smoothstep(distance / orbitLabelHalfWindow);
      const scale = (1 + .16 * strength).toFixed(4);
      if (scale === orbitLabelScales[i]) return;
      name.style.setProperty("--orbit-label-scale", scale);
      orbitLabelScales[i] = scale;
    });
  }

  // Координаты движутся по общей окружности; сами подписи не поворачиваются.
  function drawNavigationPositions() {
    buttons.forEach((button, i) => {
      const angle = nodeAngles[i] + navigationOffset;
      const point = polar(angle, orbitRadius);
      button.style.left = (50 + Math.cos(angle) * (window.innerWidth <= 700 ? 45 : 40.7)) + "%";
      button.style.top = (50 + Math.sin(angle) * (window.innerWidth <= 700 ? 45 : 40.7)) + "%";
      for (const circle of [dots[i], hitAreas[i]]) {
        circle.setAttribute("cx", point.x);
        circle.setAttribute("cy", point.y);
      }
    });
  }

  function navigationDestination(from, index, count = directions.length) {
    const base = -index * fullCircle / count;
    const delta = ((base - from + Math.PI) % fullCircle + fullCircle) % fullCircle - Math.PI;
    // Floating-point remnants at the top must not become an extra full turn.
    return Math.abs(delta) < 1e-7 ? from : from + delta;
  }

  function settleNavigationTurn(interrupted = false) {
    if (!navigationTurn) return;
    const turn = navigationTurn;
    navigationOffset = turn.to;
    navigationTurn = null;
    drawNavigationPositions();
    buttons.forEach((button, i) => button.classList.toggle("is-top", i === turn.index));
    wheel.dataset.turnState = "idle";
    wheel.dataset.topDirection = directions[turn.index].number;
    updateOrbitLabelEmphasis();
    window.dispatchEvent(new CustomEvent("hub:navigation-settled", {
      detail: { number: directions[turn.index].number, interrupted: interrupted || reducedMotion.matches || !wheelVisible || document.hidden }
    }));
  }

  function updateNavigationTurn(time) {
    if (!navigationTurn) return;
    if (reducedMotion.matches || !wheelVisible || document.hidden) {
      settleNavigationTurn();
      return;
    }
    if (navigationTurn.startedAt === null) navigationTurn.startedAt = time;
    const elapsed = Math.max(0, time - navigationTurn.startedAt);
    if (elapsed >= navigationTurn.duration) {
      settleNavigationTurn();
      return;
    }
    navigationOffset = navigationTurn.from + (navigationTurn.to - navigationTurn.from) *
      smoothstep(elapsed / navigationTurn.duration);
    drawNavigationPositions();
  }

  function turnNavigationTo(index, immediate = false) {
    const instant = immediate || reducedMotion.matches || !wheelVisible || document.hidden;
    if (navigationTurn?.index === index) {
      if (instant) settleNavigationTurn(true);
      return;
    }
    // Retarget from the last drawn angle, never from the previous destination.
    const destination = navigationDestination(navigationOffset, index);
    navigationTurn = {
      from: navigationOffset, to: destination, index, startedAt: null,
      duration: 1250 + 650 * Math.abs(navigationOffset - destination) / fullCircle
    };
    if (instant || destination === navigationOffset) {
      settleNavigationTurn(instant);
      return;
    }
    buttons.forEach(button => button.classList.remove("is-top"));
    wheel.dataset.turnState = "turning";
    delete wheel.dataset.topDirection;
    window.dispatchEvent(new CustomEvent("hub:navigation-started", {
      detail: { number: directions[index].number, from: navigationTurn.from, to: navigationTurn.to,
        delta: navigationTurn.to - navigationTurn.from, duration: navigationTurn.duration }
    }));
    beginOrbit();
  }

  directions.forEach((item, i) => {
    const angle = nodeAngles[i] + navigationOffset;
    const point = polar(angle, orbitRadius);
    const target = svg("g", {
      "class": "wheel-dot-target", "role": "button", "tabindex": "0",
      "aria-label": item.number + " " + item.title,
      "aria-pressed": String(i === chosen)
    }, dotsGroup);
    const hitArea = svg("circle", { cx: point.x, cy: point.y, r: 18, "class": "wheel-dot-hitarea" }, target);
    const dot = svg("circle", {
      cx: point.x, cy: point.y, r: 4.5,
      "class": "wheel-dot" + (i === chosen ? " is-selected" : "")
    }, target);
    dots.push(dot);
    dotTargets.push(target);
    hitAreas.push(hitArea);
    target.addEventListener("click", () => select(i));
    target.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        select(i);
      }
    });
    // Геометрия и положение подписей отделены друг от друга.
    buttons[i].style.left = (50 + Math.cos(angle) * (window.innerWidth <= 700 ? 45 : 40.7)) + "%";
    buttons[i].style.top = (50 + Math.sin(angle) * (window.innerWidth <= 700 ? 45 : 40.7)) + "%";
    buttons[i].setAttribute("aria-label", item.number + " " + item.title);
    buttons[i].dataset.direction = item.number;
    buttons[i].querySelector(".wheel-node-number").textContent = item.number;
    const name = buttons[i].querySelector(".wheel-node-name");
    renderNavigationCaption(name, item.short);

  });

  function resizeParticleCanvas() {
    if (!particleContext) return;
    drawNavigationPositions();
    const size = wheel.getBoundingClientRect().width;
    const pixelSize = Math.max(1, Math.round(size * Math.min(window.devicePixelRatio || 1, 2)));
    if (particleCanvas.width !== pixelSize || particleCanvas.height !== pixelSize) {
      particleCanvas.width = pixelSize;
      particleCanvas.height = pixelSize;
    }
    particleStride = size < 410 ? 2 : 1;
    drawParticleField(lastTime || 0);
  }

  // Единая живая поверхность: край образован теми же точками, что и внутренность.
  function drawParticleField(time) {
    if (phoneMedia.matches) return;
    if (window.HubFluidField) {
      window.HubFluidField.render({canvas: particleCanvas, ctx: particleContext, time, reducedMotion: reducedMotion.matches});
      return;
    }
    if (!particleContext) return;
    const ctx = particleContext;
    const scale = particleCanvas.width / 600;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.clearRect(0, 0, 600, 600);

    const azimuth = time * .000082 + pointer.x * .62;
    const elevation = -.18 + Math.sin(time * .00016) * .09 - pointer.y * .42;
    const cosA = Math.cos(azimuth), sinA = Math.sin(azimuth);
    const cosE = Math.cos(elevation), sinE = Math.sin(elevation);
    const shiftX = pointer.x * 12, shiftY = pointer.y * 12;
    const cursorX = 300 + pointer.x * 167, cursorY = 300 + pointer.y * 167;
    ctx.fillStyle = glyphInk;

    // Слово плавно собирается, остаётся читаемым на короткое время и затем растворяется в движении.
    if (!reducedMotion.matches && pointer.active && wordScenes.length && time >= nextWordAt) {
      wordSceneIndex = (wordSceneIndex + 1) % wordScenes.length;
      activeWordScene = wordScenes[wordSceneIndex];
      wordStartedAt = time;
      nextWordAt = time + 6900;
    }
    const wordAge = time - wordStartedAt;
    const wordStrength = activeWordScene && !reducedMotion.matches
      ? smoothstep(wordAge / 1350) * (1 - smoothstep((wordAge - 2850) / 1750)) * pointer.strength
      : 0;
    const wordSlots = wordStrength > .01 ? activeWordScene.slots : null;
    const cursorRadius = Math.hypot(cursorX - 300, cursorY - 300);
    const wordAnchorScale = Math.min(1, 103 / Math.max(1, cursorRadius));
    const wordX = 300 + (cursorX - 300) * wordAnchorScale;
    const wordY = 286 + (cursorY - 300) * wordAnchorScale;

    // Контур почти растворён в облаке: низкая плотность чернил, неровная орбита и мягкий дрейф.
    for (const dot of boundaryDots) {
      const angle = dot.angle + Math.sin(time * .00021 + dot.phase) * .003;
      const radius = dot.radius + Math.sin(time * .00039 + dot.phase) * .65;
      const px = 300 + Math.cos(angle) * radius + pointer.x * pointer.strength * 2.4;
      const py = 300 + Math.sin(angle) * radius + pointer.y * pointer.strength * 2.4;
      ctx.fillStyle = dotColors[dot.dotColor];
      ctx.globalAlpha = .42 + dot.opacity * .12;
      ctx.beginPath();
      ctx.arc(px, py, .7 + dot.size * .28, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    let lastGlyphFontSize = 0;
    for (let i = 0; i < particles.length; i++) {
      if (i % particleStride && !wordSlots?.has(i)) continue;
      const p = particles[i];
      const x = p.x * cosA - p.z * sinA;
      const z = p.x * sinA + p.z * cosA;
      const y = p.y * cosE - z * sinE;
      const depthZ = p.y * sinE + z * cosE;
      const depth = (depthZ + 1) * .5;
      const breathing = 1 + .035 * Math.sin(time * .00072 + p.phase + y * 3)
        + .016 * Math.cos(time * .0004 + p.phase * .7 + x * 4);
      const radius = (174 + p.radialJitter) * breathing * (1 + depthZ * .055);
      let px = 300 + x * radius + shiftX;
      let py = 300 + y * radius + shiftY;

      // Курсор мягко притягивает близлежащие точки; поле не блокирует навигацию.
      if (pointer.strength > .01) {
        const dx = cursorX - px, dy = cursorY - py;
        const distance = Math.hypot(dx, dy);
        if (distance < 105) {
          const pull = (1 - distance / 105) ** 2 * pointer.strength * .22;
          px += dx * pull;
          py += dy * pull;
        }
      }

      const wordPosition = wordSlots ? wordSlots.get(i) : undefined;
      if (wordPosition !== undefined) {
        const spacing = 15;
        const targetX = wordX + (wordPosition - (activeWordScene.word.length - 1) / 2) * spacing;
        px += (targetX - px) * wordStrength;
        py += (wordY - py) * wordStrength;
      }

      const distanceFromCenter = Math.hypot(px - 300, py - 300);
      const edgePresence = Math.max(0, Math.min(1, (distanceFromCenter - 137) / 43));
      const fadeStart = Math.max(0, Math.min(1, (distanceFromCenter - 181) / 14));
      const outerFade = 1 - fadeStart * fadeStart * (3 - 2 * fadeStart);
      const pointRadius = (.58 + depth * .78 + p.size * .42) * (1 + edgePresence * .08);
      const inkAlpha = (.12 + depth * .42) * (1 + edgePresence * .24) * outerFade;
      if ((pointRadius > 1.17 && p.glyphChance > .24) || wordPosition !== undefined) {
        // Лишь часть кириллицы чуть крупнее, а у курсора мягко возрастает без скачков размера.
        const baseFontSize = Math.min(10, Math.max(5, Math.round(3.3 + pointRadius * 2.9)));
        const cursorDistance = Math.hypot(cursorX - px, cursorY - py);
        const proximity = Math.max(0, 1 - cursorDistance / 115);
        const letterScale = p.accentLetter ? 1.22 + proximity * proximity * pointer.strength * .63 : 1;
        const normalSize = Math.min(17, baseFontSize * letterScale);
        const fontSize = Math.round((wordPosition !== undefined
          ? normalSize * (1 - wordStrength) + 12.5 * wordStrength
          : normalSize) * 10) / 10;
        if (fontSize !== lastGlyphFontSize) {
          ctx.font = `500 ${fontSize}px "JetBrains Mono", monospace`;
          lastGlyphFontSize = fontSize;
        }
        ctx.fillStyle = glyphInk;
        ctx.globalAlpha = wordPosition !== undefined
          ? Math.min(.55, inkAlpha * .92 + wordStrength * .06)
          : inkAlpha * .92;
        ctx.fillText(p.glyph, px, py);
      } else {
        ctx.fillStyle = dotColors[p.dotColor];
        ctx.globalAlpha = Math.min(.8, inkAlpha * 1.35);
        ctx.beginPath();
        ctx.arc(px, py, pointRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  function trackPointer(event) {
    if (phoneMedia.matches || event.pointerType === "touch") return;
    const rect = wheel.getBoundingClientRect();
    if (!pointer.active) nextWordAt = performance.now() + 1600;
    pointer.targetX = Math.max(-1, Math.min(1, (event.clientX - rect.left - rect.width / 2) / (rect.width * .34)));
    pointer.targetY = Math.max(-1, Math.min(1, (event.clientY - rect.top - rect.height / 2) / (rect.height * .34)));
    pointer.active = true;
  }
  wheel.addEventListener("pointerenter", trackPointer, { passive: true });
  wheel.addEventListener("pointermove", trackPointer, { passive: true });
  wheel.addEventListener("pointerleave", () => {
    pointer.targetX = 0;
    pointer.targetY = 0;
    pointer.active = false;
    nextWordAt = Infinity;
  });
  if ("ResizeObserver" in window) new ResizeObserver(resizeParticleCanvas).observe(wheel);
  else window.addEventListener("resize", resizeParticleCanvas, { passive: true });

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, ch => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[ch]);
  }

  // Одна контактная строка пока только в 0.1. Рабочие адреса из публичных ресурсов Гардари;
  // контакты мастерской и галереи обозначены по принадлежности и нуждаются в актуализации.
  const authorContacts = window.GARDARI_HUB_CONTENT.contacts;
  // Монохромные SVG: узнаваемые знаки платформ и стандартные символы почты/телефона.
  const contactGlyphs = {
    telegram: { viewBox: "0 0 24 24", path: "M21.84 2.58c.36-.16.76.14.7.53l-3.3 16.1c-.07.37-.47.57-.81.37l-5.33-3.94-2.7 2.64c-.31.3-.83.09-.83-.35v-3.32L18 6.84 7.41 13.4l-5.24-1.62c-.46-.14-.48-.75-.04-.94L21.84 2.58Z" },
    email: { viewBox: "0 0 24 24", path: "M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6M20 6L12 11L4 6H20M20 18H4V8L12 13L20 8V18Z" },
    instagram: { viewBox: "0 0 24 24", path: "M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z" },
    vk: { viewBox: "0 0 448 512", path: "M31.4907 63.4907C0 94.9813 0 145.671 0 247.04V264.96C0 366.329 0 417.019 31.4907 448.509C62.9813 480 113.671 480 215.04 480H232.96C334.329 480 385.019 480 416.509 448.509C448 417.019 448 366.329 448 264.96V247.04C448 145.671 448 94.9813 416.509 63.4907C385.019 32 334.329 32 232.96 32H215.04C113.671 32 62.9813 32 31.4907 63.4907ZM75.6 168.267H126.747C128.427 253.76 166.133 289.973 196 297.44V168.267H244.16V242C273.653 238.827 304.64 205.227 315.093 168.267H363.253C359.313 187.435 351.46 205.583 340.186 221.579C328.913 237.574 314.461 251.071 297.733 261.227C316.41 270.499 332.907 283.63 346.132 299.751C359.357 315.873 369.01 334.618 374.453 354.747H321.44C316.555 337.262 306.614 321.61 292.865 309.754C279.117 297.899 262.173 290.368 244.16 288.107V354.747H238.373C136.267 354.747 78.0267 284.747 75.6 168.267Z" },
    phone: { viewBox: "0 0 24 24", path: "M20,15.5C18.8,15.5 17.5,15.3 16.4,14.9C16.3,14.9 16.2,14.9 16.1,14.9C15.8,14.9 15.6,15 15.4,15.2L13.2,17.4C10.4,15.9 8,13.6 6.6,10.8L8.8,8.6C9.1,8.3 9.2,7.9 9,7.6C8.7,6.5 8.5,5.2 8.5,4C8.5,3.5 8,3 7.5,3H4C3.5,3 3,3.5 3,4C3,13.4 10.6,21 20,21C20.5,21 21,20.5 21,20V16.5C21,16 20.5,15.5 20,15.5M5,5H6.5C6.6,5.9 6.8,6.8 7,7.6L5.8,8.8C5.4,7.6 5.1,6.3 5,5M19,19C17.7,18.9 16.4,18.6 15.2,18.2L16.4,17C17.2,17.2 18.1,17.4 19,17.4V19Z" }
  };
  function renderContact(contact) {
    const glyph = contactGlyphs[contact.icon];
    const icon = '<svg viewBox="' + glyph.viewBox + '" aria-hidden="true" focusable="false"><path d="' + glyph.path + '"></path></svg>';
    const props = ' class="contact-icon" data-contact="' + contact.icon + '" data-tooltip="' + escapeHtml(contact.label) + '" aria-label="' + escapeHtml(contact.label) + '"';
    const external = contact.url.startsWith("http") ? ' target="_blank" rel="noopener noreferrer"' : '';
    return '<a' + props + ' href="' + escapeHtml(contact.url) + '"' + external + '>' + icon + '</a>';
  }
  // Photo, introduction and supporting paragraphs share the title's time scale.
  let disposePanelAppearance = () => {};
  function attachPanelAppearance(root) {
    const stage = root.querySelector('.photo-reveal-stage');
    const cover = root.querySelector('.photo-reveal-cover');
    const image = stage?.querySelector('img');
    const lead = root.querySelector('.panel-description-lead');
    const supporting = Array.from(root.querySelectorAll('.panel-description-support p'));
    if (!stage || !cover || !image || !lead) return () => {};
    if (reducedMotion.matches) {
      root.dataset.entryState = 'still';lead.dataset.introState = 'complete';
      return () => {};
    }
    const count = root.querySelectorAll('.panel-visual-title h2 .heading-fold-piece').length;
    const duration = Math.max(950, Math.min(1800, 650 + Math.max(0, count - 1) * 45));
    const text = lead.textContent;
    const glyphs = typeof Intl.Segmenter === 'function'
      ? Array.from(new Intl.Segmenter('ru',{granularity:'grapheme'}).segment(text),item=>item.segment)
      : Array.from(text);
    const box = lead.getBoundingClientRect(), style = getComputedStyle(lead);
    const verticalEdges = ['paddingTop','paddingBottom','borderTopWidth','borderBottomWidth']
      .reduce((sum,key)=>sum+(parseFloat(style[key])||0),0);
    // Measure the final native line wrapping once. Reveal that layout rather
    // than repeatedly laying out a growing prefix (which can move whole words).
    const textNode = lead.firstChild, range = document.createRange();
    const originX=box.left+(parseFloat(style.paddingLeft)||0)+(parseFloat(style.borderLeftWidth)||0);
    const originY=box.top+(parseFloat(style.paddingTop)||0)+(parseFloat(style.borderTopWidth)||0);
    let offset=0,previousCut={x:0,top:0,bottom:0};
    const cuts=glyphs.map(glyph=>{
      range.setStart(textNode,offset);offset+=glyph.length;range.setEnd(textNode,offset);
      const r=range.getBoundingClientRect();
      if(!r.height)return previousCut;
      previousCut={x:Math.max(0,r.right-originX),top:Math.max(0,r.top-originY),bottom:Math.max(0,r.bottom-originY)};
      return previousCut;
    });
    lead.dataset.revealHeight = String(box.height);
    lead.style.setProperty('--intro-reserved-height', Math.max(0,box.height-verticalEdges)+'px');
    const accessible = document.createElement('span');
    accessible.className = 'visually-hidden';accessible.textContent = text;
    const grid = document.createElement('span');grid.className = 'intro-type-grid';
    const ghost = document.createElement('span');ghost.className = 'intro-type-ghost';ghost.textContent = text;
    const typed = document.createElement('span');typed.className = 'intro-type-copy';typed.textContent=text;typed.dataset.visibleCharacters='0';
    typed.style.clipPath='inset(0 100% 100% 0)';
    ghost.setAttribute('aria-hidden','true');typed.setAttribute('aria-hidden','true');
    grid.append(ghost,typed);lead.replaceChildren(accessible,grid);
    lead.dataset.introState = 'typing';
    root.dataset.entryDuration = String(duration);root.dataset.entryState = 'entering';
    cover.style.opacity = '1';stage.style.filter = 'blur(4px)';
    supporting.forEach(paragraph=>{paragraph.style.opacity='0';});
    let frame = null, destroyed = false, finished = false, restored = false, lastCount = -1;
    const started = performance.now();
    let photoStart = image.complete && image.naturalWidth > 0 ? started + 40 : null;
    let photoFailed = image.complete && !image.naturalWidth;
    const clamp = value => Math.max(0,Math.min(1,value));
    function restoreText() {
      if (restored) return;
      restored = true;lead.textContent = text;
      lead.style.removeProperty('--intro-reserved-height');
      lead.dataset.introState = 'complete';
    }
    function finish() {
      finished = true;
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;restoreText();
      cover.style.opacity = '0';stage.style.removeProperty('filter');
      supporting.forEach(paragraph=>paragraph.style.removeProperty('opacity'));
      root.dataset.entryState = 'complete';
    }
    function schedule() {
      if (!destroyed && !finished && frame === null && root.isConnected) frame=requestAnimationFrame(draw);
    }
    function draw(now) {
      frame = null;
      if (destroyed || finished || !root.isConnected) return;
      if (reducedMotion.matches) {finish();return;}
      const elapsed = now-started;
      const progress = clamp((elapsed-60)/Math.max(1,duration-60));
      const visible = Math.floor(glyphs.length*progress);
      if (!restored && visible !== lastCount) {
        const cut=cuts[visible-1];
        typed.style.clipPath=cut
          ? 'polygon(0 0,100% 0,100% '+cut.top+'px,'+cut.x+'px '+cut.top+'px,'+cut.x+'px '+cut.bottom+'px,0 '+cut.bottom+'px)'
          : 'inset(0 100% 100% 0)';
        typed.dataset.visibleCharacters=String(visible);lastCount=visible;
      }
      if (progress >= 1) restoreText();
      let supportDone = true;
      supporting.forEach((paragraph,index)=>{
        const p=clamp((elapsed-duration*.28-index*80)/700);
        paragraph.style.opacity=String(1-Math.pow(1-p,3));
        if(p<1)supportDone=false;
      });
      let photoDone = photoFailed;
      if(photoStart !== null){
        const p=clamp((now-photoStart)/duration),smooth=p*p*(3-2*p);
        cover.style.opacity=String(1-smooth);
        stage.style.filter='blur('+(4*(1-smooth))+'px)';
        photoDone=p>=1;
      }else if(photoFailed){cover.style.opacity='0';stage.style.removeProperty('filter');}
      if(progress>=1 && supportDone && photoDone){finish();return;}
      root.dataset.entryState=progress>=1&&supportDone&&photoStart===null?'waiting-image':'entering';
      // Do not spin while an uncached photo is loading; its load handler resumes.
      if(progress<1 || !supportDone || photoStart!==null&&!photoDone)schedule();
    }
    const ready = () => {
      if(destroyed || finished || photoStart!==null || !image.naturalWidth)return;
      photoStart=performance.now()+40;photoFailed=false;schedule();
    };
    const failed = () => {if(!destroyed&&!finished){photoFailed=true;schedule();}};
    const resized = () => {if(!destroyed)finish();};
    const motion = () => {if(reducedMotion.matches&&!destroyed)finish();};
    image.addEventListener('load',ready,{once:true});image.addEventListener('error',failed,{once:true});
    if(!image.complete && typeof image.decode==='function')image.decode().then(ready).catch(()=>{});
    window.addEventListener('resize',resized,{passive:true});
    reducedMotion.addEventListener('change',motion);
    // A font swap may change paragraph height. System fonts do not wait for the
    // unrelated navigation font, so the normal entrance keeps its full duration.
    if(document.fonts){
      try{
        if(!document.fonts.check(style.fontWeight+' '+style.fontSize+' '+style.fontFamily))
          document.fonts.ready.then(()=>{if(!destroyed)finish();});
      }catch{}
    }
    schedule();
    return () => {
      destroyed=true;finish();
      image.removeEventListener('load',ready);image.removeEventListener('error',failed);
      window.removeEventListener('resize',resized);reducedMotion.removeEventListener('change',motion);
    };
  }

  // Align the visible first glyph, not its font's invisible side bearing.
  function alignOpticalLeft(element, axis, context) {
    if (!element) return;
    // Always measure the native position; previous corrections must not accumulate.
    element.style.setProperty('--heading-optical-shift', '0px');
    if (!context) return;
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    let textNode = null, offset = -1, candidate;
    while ((candidate = walker.nextNode())) {
      // The phone number now lives in its badge; hidden inline labels have no optical edge.
      if (!candidate.parentElement?.getClientRects().length) continue;
      offset = candidate.textContent.search(/\S/u);
      if (offset !== -1) {textNode = candidate;break;}
    }
    if (!textNode) return;
    const glyph = Array.from(textNode.textContent.slice(offset))[0];
    const style = getComputedStyle(textNode.parentElement || element);
    let visibleGlyph = glyph;
    if (style.textTransform === 'lowercase') visibleGlyph = glyph.toLocaleLowerCase('ru');
    else if (style.textTransform === 'uppercase') visibleGlyph = glyph.toLocaleUpperCase('ru');
    context.font = [style.fontStyle, style.fontWeight, style.fontSize, style.fontFamily].join(' ');
    const metrics = context.measureText(visibleGlyph);
    if (!Number.isFinite(metrics.actualBoundingBoxLeft)) return;
    const range = document.createRange();
    range.setStart(textNode, offset);range.setEnd(textNode, offset + glyph.length);
    const origin = range.getBoundingClientRect().left;
    const stroke = parseFloat(style.webkitTextStrokeWidth) || 0;
    const shift = axis - origin + metrics.actualBoundingBoxLeft + stroke / 2;
    element.style.setProperty('--heading-optical-shift', shift + 'px');
  }

  function alignHeadingLines(heading, lines, context) {
    const axis = heading.getBoundingClientRect().left;
    lines.forEach(line => alignOpticalLeft(line, axis, context));
  }

  // Fit native phone title lines before the fold animation measures their glyphs.
  function fitPhoneHeading(heading, lines) {
    heading.style.removeProperty('--phone-heading-size');
    heading.style.removeProperty('--phone-heading-tracking');
    if (window.innerWidth > 700) return;
    const photo = heading.closest('.direction-panel')?.querySelector('.panel-circle');
    if (!photo) return;
    const photoBox = photo.getBoundingClientRect(), headingBox = heading.getBoundingClientRect();
    const style = getComputedStyle(heading), requested = parseFloat(style.fontSize);
    // Preserve the accepted heading size: size fitting uses the former photo boundary.
    const formerPhotoLeft = photoBox.right - photoBox.width / 1.15;
    const formerBudget = Math.max(1, formerPhotoLeft - headingBox.left - 6);
    const stroke = parseFloat(style.webkitTextStrokeWidth) || 0;
    const widths = () => lines.map(line => {
      const range = document.createRange(); range.selectNodeContents(line);
      return range.getBoundingClientRect().width + stroke;
    });
    const longest = Math.max(1, ...widths());
    if (longest > formerBudget && Number.isFinite(requested))
      heading.style.setProperty('--phone-heading-size', (requested * formerBudget / longest).toFixed(4) + 'px');
    // Keep authored40px and other sizes; only tracking clears the enlarged circle.
    const budget = Math.max(1, photoBox.left - headingBox.left - 6);
    for (let pass = 0; pass < 3; pass++) {
      const actual = getComputedStyle(heading), tracking = parseFloat(actual.letterSpacing) || 0;
      const actualSize = parseFloat(actual.fontSize) || requested;
      const measured = widths();
      const reduction = Math.max(0, ...measured.map((width, index) =>
        (width - budget) / Math.max(1, Array.from(lines[index].textContent).length)));
      if (reduction <= .01) break;
      const next = Math.max(-actualSize * .13, tracking - reduction - .02);
      if (next >= tracking - .001) break;
      heading.style.setProperty('--phone-heading-tracking', next.toFixed(6) + 'px');
    }
  }

  // Paper-fold entrance and cursor refold, adapted for the existing two-line type.
  // React Bits FoldText: https://reactbits.dev/text-animations/fold-text
  // Native glyph advances are measured before splitting, preserving kerning.
  let disposeHeadingMotion = () => {};
  function attachHeadingMotion(heading) {
    if (!heading) return () => {};
    const lines = Array.from(heading.querySelectorAll('.panel-heading-line'));
    const texts = lines.map(line => line.textContent);
    const opticalContext = document.createElement('canvas').getContext('2d');
    heading.setAttribute('aria-label', texts.join(' '));
    let pieces = [], frame = null, resizeFrame = null, pointer = null;
    let start = performance.now(), lastFrame = start, entrance = true, destroyed = false;
    const clamp01 = value => Math.max(0, Math.min(1, value));
    function draw(time) {
      frame = null;
      if (destroyed || !heading.isConnected || reducedMotion.matches) return;
      const step = Math.min(64, Math.max(0, time - lastFrame)) / 1000;
      lastFrame = time;
      const box = heading.getBoundingClientRect();
      let moving = false, opening = false, folded = false;
      pieces.forEach((piece, index) => {
        const t = entrance ? clamp01((time - start - index * 45) / 650) : 1;
        const progress = 1 - Math.pow(1 - t, 4);
        if (t < 1) {moving = true;opening = true;}
        const distance = pointer ? Math.hypot(box.left + piece.x - pointer.x, box.top + piece.y - pointer.y) / 140 : 1;
        const aim = distance < 1 ? 1 - distance * distance * (3 - 2 * distance) : 0;
        const rate = aim > piece.hover ? 14 : 6;
        piece.hover += (aim - piece.hover) * (1 - Math.exp(-rate * step));
        if (Math.abs(aim - piece.hover) > .001) moving = true;
        else piece.hover = aim;
        const tilt = piece.hover * 45;
        if (tilt > .05) folded = true;
        piece.node.style.transform = 'rotateX(' + (-((1 - progress) * 92 + tilt)) + 'deg)';
        piece.node.style.opacity = String(progress);
        piece.node.style.setProperty('--heading-crease', String(.55 * clamp01(1 - progress + tilt / 90)));
      });
      heading.dataset.foldState = opening ? 'entering' : folded ? 'hover' : 'idle';
      if (moving) frame = requestAnimationFrame(draw);
    }
    function schedule() {
      if (!destroyed && !reducedMotion.matches && frame === null) {
        lastFrame = performance.now();
        frame = requestAnimationFrame(draw);
      }
    }
    function build(play) {
      if (destroyed || !heading.isConnected) return;
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;pieces = [];
      lines.forEach((line, index) => {line.textContent = texts[index];});
      fitPhoneHeading(heading, lines);
      alignHeadingLines(heading, lines, opticalContext);
      if (reducedMotion.matches) {heading.dataset.foldState = 'still';return;}
      const headingBox = heading.getBoundingClientRect();
      lines.forEach((line, lineIndex) => {
        const text = texts[lineIndex], textNode = line.firstChild;
        if (!textNode || !text) return;
        const glyphs = typeof Intl.Segmenter === 'function'
          ? Array.from(new Intl.Segmenter('ru', {granularity:'grapheme'}).segment(text), item => ({text:item.segment, offset:item.index}))
          : Array.from(text).reduce((items, glyph) => {items.push({text:glyph,offset:items.reduce((n,item)=>n+item.text.length,0)});return items;}, []);
        const ranges = glyphs.map(glyph => {
          const range = document.createRange();range.setStart(textNode,glyph.offset);range.setEnd(textNode,glyph.offset+glyph.text.length);
          return range.getBoundingClientRect();
        });
        // Leave unusual right-to-left runs as native text rather than distorting them.
        if (ranges.some((rect,index) => index && rect.left < ranges[index-1].left)) return;
        const fragment = document.createDocumentFragment();
        glyphs.forEach((glyph, index) => {
          const segment = document.createElement('span'), piece = document.createElement('span');
          segment.className = 'heading-fold-segment';segment.setAttribute('aria-hidden','true');
          segment.style.width = Math.max(0, (ranges[index+1]?.left ?? ranges[index].right) - ranges[index].left) + 'px';
          piece.className = 'heading-fold-piece';piece.textContent = glyph.text;piece.dataset.foldText = glyph.text;
          if (play) {piece.style.opacity = '0';piece.style.transform = 'rotateX(-92deg)';}
          segment.append(piece);fragment.append(segment);
          pieces.push({node:piece,segment,hover:0,x:0,y:0});
        });
        line.replaceChildren(fragment);
      });
      pieces.forEach(piece => {
        const rect = piece.segment.getBoundingClientRect();
        piece.x = rect.left - headingBox.left + rect.width/2;
        piece.y = rect.top - headingBox.top + rect.height/2;
      });
      entrance = play;start = performance.now();lastFrame = start;
      heading.dataset.foldState = play ? 'entering' : 'idle';
      schedule();
    }
    const move = event => {if (event.pointerType === 'touch') return;pointer={x:event.clientX,y:event.clientY};schedule();};
    const leave = () => {pointer=null;schedule();};
    const scroll = () => {if(pointer)schedule();};
    const resize = () => {
      if (resizeFrame !== null) cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {resizeFrame=null;build(false);});
    };
    heading.addEventListener('pointermove',move,{passive:true});
    heading.addEventListener('pointerleave',leave);
    window.addEventListener('resize',resize,{passive:true});
    window.addEventListener('scroll',scroll,{passive:true,capture:true});
    reducedMotion.addEventListener('change',resize);
    build(true);
    if (document.fonts?.status !== 'loaded') document.fonts?.ready.then(() => {if(!destroyed)build(false);});
    return () => {
      destroyed=true;
      if(frame!==null)cancelAnimationFrame(frame);
      if(resizeFrame!==null)cancelAnimationFrame(resizeFrame);
      heading.removeEventListener('pointermove',move);heading.removeEventListener('pointerleave',leave);
      window.removeEventListener('resize',resize);window.removeEventListener('scroll',scroll,{capture:true});
      reducedMotion.removeEventListener('change',resize);
    };
  }

  // The word list reuses the title's paper-fold kinetics with row-local timing.
  let disposeWordBlockMotion = () => {};
  function attachWordBlockMotion(scope) {
    const list = scope?.querySelector('.author-disciplines[data-hub-copy="disciplines"]');
    if (!list) return () => {};
    const rows = Array.from(list.children).map(row => {
      const word = row.querySelector('.author-discipline-word');
      const fill = row.querySelector('.author-discipline-fill');
      return word && fill ? {row, word, fill, text:word.textContent,
        fillStyles:['opacity','transform','--word-fold-crease'].map(name=>[name,fill.style.getPropertyValue(name),fill.style.getPropertyPriority(name)]),
        label:row.getAttribute('aria-label'), width:word.style.getPropertyValue('width'),
        widthPriority:word.style.getPropertyPriority('width')} : null;
    }).filter(Boolean);
    if (!rows.length) return () => {};
    let pieces = [], frame = null, resizeFrame = null, pointer = null;
    let start = performance.now(), lastFrame = start, entrance = true, destroyed = false;
    let building = false, measuredSignature = '';
    const clamp01 = value => Math.max(0, Math.min(1, value));
    const notify = () => window.dispatchEvent(new CustomEvent('hub:word-fold-frame', {
      detail:{number:scope.dataset.direction, state:list.dataset.wordFoldState}
    }));
    const signature = () => {
      const style = getComputedStyle(list), box = list.getBoundingClientRect();
      return [box.width.toFixed(3),style.fontFamily,style.fontSize,style.fontWeight,
        style.lineHeight,style.letterSpacing,style.webkitTextStrokeWidth].join('|');
    };
    function restoreNative() {
      rows.forEach(item => {
        item.word.textContent = item.text;
        item.fillStyles.forEach(([name,value,priority])=>{
          if(value)item.fill.style.setProperty(name,value,priority);
          else item.fill.style.removeProperty(name);
        });
        if (item.width) item.word.style.setProperty('width',item.width,item.widthPriority);
        else item.word.style.removeProperty('width');
        if (item.label === null) item.row.removeAttribute('aria-label');
        else item.row.setAttribute('aria-label',item.label);
      });
      list.classList.remove('word-fold-ready'); pieces = [];
    }
    function draw(time) {
      frame = null;
      if (destroyed || !list.isConnected) return;
      if (reducedMotion.matches) {build(false);return;}
      const step = Math.min(64, Math.max(0,time-lastFrame))/1000;
      lastFrame = time;
      const box = list.getBoundingClientRect();
      let moving = false, opening = false, folded = false;
      pieces.forEach(piece => {
        const t = entrance ? clamp01((time-start-piece.delay)/650) : 1;
        const progress = 1-Math.pow(1-t,4);
        if (t < 1) {moving=true;opening=true;}
        // A solid fill is one sheet; its nearest horizontal point keeps its
        // whole width responsive to the same 140px proximity as a title glyph.
        const x = box.left+piece.x;
        const hitX = pointer && piece.fill
          ? Math.max(x-piece.width/2,Math.min(x+piece.width/2,pointer.x)) : x;
        const distance = pointer ? Math.hypot(hitX-pointer.x,box.top+piece.y-pointer.y)/140 : 1;
        const aim = distance < 1 ? 1-distance*distance*(3-2*distance) : 0;
        const rate = aim > piece.hover ? 14 : 6;
        piece.hover += (aim-piece.hover)*(1-Math.exp(-rate*step));
        if (Math.abs(aim-piece.hover) > .001) moving=true;
        else piece.hover=aim;
        const tilt = piece.hover*45;
        if (tilt > .05) folded=true;
        piece.node.style.setProperty('transform',(piece.fill?'perspective(700px) ':'')+'rotateX('+(-((1-progress)*92+tilt))+'deg)');
        piece.node.style.setProperty('opacity',String(progress));
        piece.node.style.setProperty('--word-fold-crease',String(.55*clamp01(1-progress+tilt/90)));
      });
      list.dataset.wordFoldState = opening ? 'entering' : folded ? 'hover' : 'idle';
      notify();
      if (moving) frame=requestAnimationFrame(draw);
    }
    function schedule() {
      if (!destroyed && !reducedMotion.matches && frame === null) {
        lastFrame=performance.now();frame=requestAnimationFrame(draw);
      }
    }
    function build(play) {
      if (destroyed || !list.isConnected) return;
      building=true;
      if (frame !== null) cancelAnimationFrame(frame);
      frame=null;restoreNative();
      // Native text is restored before the accepted sizing/height-fit pass.
      alignAuthorComposition(scope);
      if (reducedMotion.matches) {
        pointer=null;entrance=false;list.dataset.wordFoldState='still';
        list.dataset.wordFoldDuration='0';list.dataset.wordFoldPieceCount='0';
        measuredSignature=signature();building=false;notify();return;
      }
      rows.forEach((item,rowIndex) => {
        const textNode=item.word.firstChild, wordBox=item.word.getBoundingClientRect();
        if (!textNode || !item.text) return;
        const glyphs=typeof Intl.Segmenter === 'function'
          ? Array.from(new Intl.Segmenter('ru',{granularity:'grapheme'}).segment(item.text),part=>({text:part.segment,offset:part.index}))
          : Array.from(item.text).reduce((items,text)=>{items.push({text,offset:items.reduce((sum,part)=>sum+part.text.length,0)});return items;},[]);
        const ranges=glyphs.map(glyph=>{
          const range=document.createRange();range.setStart(textNode,glyph.offset);range.setEnd(textNode,glyph.offset+glyph.text.length);
          return range.getBoundingClientRect();
        });
        if (ranges.some((rect,index)=>index && rect.left < ranges[index-1].left)) return;
        const fragment=document.createDocumentFragment();
        glyphs.forEach((glyph,charIndex)=>{
          const segment=document.createElement('span'), piece=document.createElement('span');
          segment.className='word-fold-segment';segment.setAttribute('aria-hidden','true');
          segment.style.width=Math.max(0,(ranges[charIndex+1]?.left ?? ranges[charIndex].right)-ranges[charIndex].left)+'px';
          piece.className='word-fold-piece';piece.textContent=glyph.text;piece.dataset.foldText=glyph.text;
          segment.append(piece);fragment.append(segment);
          pieces.push({node:piece,segment,hover:0,x:0,y:0,width:0,fill:false,delay:rowIndex*45+charIndex*45});
        });
        item.row.setAttribute('aria-label',item.text);
        item.word.replaceChildren(fragment);
        // Keep the existing flex width and fill endpoint independent of glyph splitting.
        item.word.style.width=wordBox.width+'px';
        pieces.push({node:item.fill,segment:item.fill,hover:0,x:0,y:0,width:0,fill:true,delay:rowIndex*45+glyphs.length*45});
      });
      list.classList.add('word-fold-ready');
      const maximum=Math.max(0,...pieces.map(piece=>piece.delay));
      const staggerScale=maximum>850 ? 850/maximum : 1;
      const box=list.getBoundingClientRect();
      pieces.forEach(piece=>{
        piece.delay*=staggerScale;
        const rect=piece.segment.getBoundingClientRect();
        piece.x=rect.left-box.left+rect.width/2;piece.y=rect.top-box.top+rect.height/2;piece.width=rect.width;
        piece.node.style.setProperty('opacity',play?'0':'1');
        piece.node.style.setProperty('transform',(piece.fill?'perspective(700px) ':'')+(play?'rotateX(-92deg)':'rotateX(0deg)'));
      });
      entrance=play;start=performance.now();lastFrame=start;
      list.dataset.wordFoldState=play?'entering':'idle';
      list.dataset.wordFoldDuration=String(650+maximum*staggerScale);
      list.dataset.wordFoldPieceCount=String(pieces.length);
      measuredSignature=signature();building=false;notify();schedule();
    }
    function rebuild() {
      if (destroyed || building || resizeFrame !== null) return;
      resizeFrame=requestAnimationFrame(()=>{resizeFrame=null;build(false);});
    }
    const move=event=>{if(event.pointerType==='touch')return;pointer={x:event.clientX,y:event.clientY};schedule();};
    const leave=()=>{pointer=null;schedule();};
    const scroll=()=>{if(pointer)schedule();};
    const changed=()=>{if(!destroyed && !building && signature()!==measuredSignature)rebuild();};
    list.addEventListener('pointermove',move,{passive:true});list.addEventListener('pointerleave',leave);
    window.addEventListener('resize',rebuild,{passive:true});window.addEventListener('scroll',scroll,{passive:true,capture:true});
    reducedMotion.addEventListener('change',rebuild);
    build(true);
    const observer=typeof ResizeObserver==='function'?new ResizeObserver(changed):null;
    observer?.observe(list);
    const styleObserver=typeof MutationObserver==='function'?new MutationObserver(changed):null;
    styleObserver?.observe(scope,{attributes:true,attributeFilter:['style']});
    styleObserver?.observe(list,{attributes:true,attributeFilter:['style']});
    if(document.fonts?.status!=='loaded')document.fonts?.ready.then(()=>{if(!destroyed)rebuild();});
    return ()=>{
      destroyed=true;if(frame!==null)cancelAnimationFrame(frame);if(resizeFrame!==null)cancelAnimationFrame(resizeFrame);
      observer?.disconnect();styleObserver?.disconnect();
      list.removeEventListener('pointermove',move);list.removeEventListener('pointerleave',leave);
      window.removeEventListener('resize',rebuild);window.removeEventListener('scroll',scroll,{capture:true});
      reducedMotion.removeEventListener('change',rebuild);restoreNative();
      for(const key of ['wordFoldState','wordFoldDuration','wordFoldPieceCount'])delete list.dataset[key];
    };
  }

  // The first paragraph keeps its accepted top while the larger photo enters its first line.
  function wrapPhonePhoto(photo, first) {
    let spacer = first.querySelector('.phone-photo-wrap');
    if (!spacer) {
      spacer = document.createElement('span'); spacer.className = 'phone-photo-wrap';
      spacer.setAttribute('aria-hidden', 'true'); first.prepend(spacer);
    }
    const p = first.getBoundingClientRect(), image = photo.getBoundingClientRect();
    const clearance = 6, radius = image.width / 2 + clearance;
    const tail = Math.max(0, image.bottom + clearance - p.top);
    if (tail <= .01) {spacer.remove(); return;}
    const width = Math.max(1, p.right - image.left + clearance);
    const centerX = image.left + image.width / 2 - (p.right - width);
    const centerY = image.top + image.height / 2 - p.top;
    spacer.style.width = width.toFixed(4) + 'px';
    spacer.style.height = tail.toFixed(4) + 'px';
    spacer.style.shapeOutside = 'circle(' + radius.toFixed(4) + 'px at ' + centerX.toFixed(4) + 'px ' + centerY.toFixed(4) + 'px)';
    spacer.dataset.photoWrap = 'circle';
  }

  function alignPhotoCopyGap(scope) {
    const photo = scope?.querySelector('.panel-circle');
    const title = scope?.querySelector('.panel-visual-title h2');
    const row = scope?.querySelector('.panel-visual-row');
    const copy = scope?.querySelector('.panel-description');
    const first = copy?.querySelector('.panel-description-copy p');
    if (!photo || !title || !row) return;
    const photoBox = photo.getBoundingClientRect();
    const titleBox = title.getBoundingClientRect();
    const mobile = window.innerWidth <= 700;
    const card = mobile ? scope.querySelector('.mobile-card') || scope : scope;
    const horizontal = Math.max(0, mobile ? photoBox.left - titleBox.right : titleBox.left - photoBox.right);
    if (mobile) {
      const radius = photoBox.width / 2 + card.getBoundingClientRect().right - photoBox.right;
      scope.style.setProperty('--phone-card-corner', radius.toFixed(4) + 'px');
      const contactsBody = scope.querySelector('.mobile-contacts-body');
      if (contactsBody) contactsBody.style.setProperty('--contacts-group-right-air', getComputedStyle(card).paddingRight);
      if (scope.style.getPropertyValue('--photo-copy-gap') !== '14px') scope.style.setProperty('--photo-copy-gap', '14px');
      if (first) wrapPhonePhoto(photo, first);
      return;
    }
    if (!copy || !first) return;
    first.querySelector('.phone-photo-wrap')?.remove();
    scope.style.removeProperty('--phone-card-corner');
    const rowExtra = row.getBoundingClientRect().bottom - photoBox.bottom;
    const textInset = first.getBoundingClientRect().top - copy.getBoundingClientRect().top;
    const value = Math.max(0, horizontal - rowExtra - textInset).toFixed(4) + 'px';
    if (scope.style.getPropertyValue('--photo-copy-gap') !== value) scope.style.setProperty('--photo-copy-gap', value);
  }

  function alignPhoneWordAction(scope) {
    const synthesis = scope?.querySelector('.author-synthesis');
    const action = synthesis?.querySelector('.mobile-word-cta');
    const photo = scope?.querySelector('.panel-circle');
    const list = synthesis?.querySelector('.author-disciplines');
    if (!action || !photo || !list) return;
    const keys = ['--word-action-left', '--word-action-top', '--word-action-size', '--word-action-halo'];
    if (window.innerWidth > 700) {
      keys.forEach(key => synthesis.style.removeProperty(key));
      return;
    }
    const photoBox = photo.getBoundingClientRect(), box = synthesis.getBoundingClientRect();
    const listBox = list.getBoundingClientRect(), rows = Array.from(list.children);
    const fill = rows[0]?.querySelector('.author-discipline-fill');
    const step = rows.length > 1 ? rows[1].offsetTop - rows[0].offsetTop : 0;
    const stripe = fill ? parseFloat(getComputedStyle(fill).height) || 0 : 0;
    const halo = Math.max(0, step - stripe);
    const lower = scope.querySelector('.panel-cta');
    if (!lower) return;
    const size = (photoBox.width + lower.getBoundingClientRect().width) / 2;
    const sizeValue = size.toFixed(4) + 'px';
    if (synthesis.style.getPropertyValue('--word-action-size') !== sizeValue)
      synthesis.style.setProperty('--word-action-size', sizeValue);
    const actionBox = action.getBoundingClientRect();
    const values = [photoBox.right - actionBox.width - box.left,
      listBox.top - box.top + (listBox.height - actionBox.height) / 2,
      size, halo];
    keys.forEach((key, index) => {
      const value = values[index].toFixed(4) + 'px';
      if (synthesis.style.getPropertyValue(key) !== value) synthesis.style.setProperty(key, value);
    });
  }

  // Contact stripes start at lowercase x-height and extend down to the underline.
  function alignMobileContactRules(scope) {
    if (window.innerWidth > 700 || scope?.dataset.direction !== '0.8') return;
    const ink = document.createElement('canvas').getContext('2d');
    if (!ink) return;
    scope.querySelectorAll('.mobile-contact-link').forEach(row => {
      const word = row.querySelector('.mobile-contact-value');
      if (!word || !row.querySelector('.mobile-contact-fill')) return;
      const style = getComputedStyle(word), size = parseFloat(style.fontSize) || 28 * 2 / 3;
      ink.font = [style.fontStyle, style.fontWeight, style.fontSize, style.fontFamily].join(' ');
      const xHeight = ink.measureText('х').actualBoundingBoxAscent || ink.measureText('x').actualBoundingBoxAscent || size * .5;
      const marker = document.createElement('span'); marker.setAttribute('aria-hidden', 'true');
      marker.style.cssText = 'display:inline-block;width:0;height:0;padding:0;margin:0;border:0;vertical-align:baseline;line-height:0';
      word.append(marker);
      const rowStyle = getComputedStyle(row);
      const origin = row.getBoundingClientRect().top + (parseFloat(rowStyle.paddingTop) || 0) + (parseFloat(rowStyle.borderTopWidth) || 0);
      const top = marker.getBoundingClientRect().top - origin - xHeight;
      marker.remove();
      const underlineOffset = parseFloat(style.textUnderlineOffset) || 3;
      const underlineThickness = parseFloat(style.textDecorationThickness) || 1;
      const values = {'--contact-rule-top':top, '--contact-rule-height':xHeight + underlineOffset + underlineThickness};
      Object.entries(values).forEach(([key, value]) => {
        const pixels = value.toFixed(4) + 'px';
        if (row.style.getPropertyValue(key) !== pixels) row.style.setProperty(key, pixels);
      });
    });
  }

  // The author split shares the actual heading axis at every viewport width.
  function alignAuthorComposition(scope) {
    alignPhotoCopyGap(scope);
    alignMobileContactRules(scope);
    const heading = scope?.querySelector('.panel-visual-title h2');
    const synthesis = scope?.querySelector('.author-synthesis');
    if (!heading || !synthesis) return;
    const style = getComputedStyle(heading);
    const gap = parseFloat(getComputedStyle(synthesis).columnGap) || 0;
    // The phone list keeps its accepted type size independently of the new title axis.
    const column = window.innerWidth <= 700
      ? Math.max(0, scope.querySelector('.panel-circle').getBoundingClientRect().width / 1.3225 + 14 - gap)
      : Math.max(0, heading.getBoundingClientRect().left - synthesis.getBoundingClientRect().left - gap);
    const value = column.toFixed(4) + 'px';
    if (scope.style.getPropertyValue('--author-axis-column') !== value) scope.style.setProperty('--author-axis-column', value);
    scope.style.setProperty('--author-display-font', style.fontFamily);
    scope.style.setProperty('--author-display-weight', style.fontWeight);
    scope.style.setProperty('--author-display-stroke', String((parseFloat(style.webkitTextStrokeWidth) || 0) / (parseFloat(style.fontSize) || 1)));
    // Fill each word's remaining row with the same yellow as the navigation.
    const list = synthesis.querySelector('.author-disciplines');
    list.style.removeProperty('font-size');
    const ink = document.createElement('canvas').getContext('2d');
    if (window.innerWidth <= 700) {
      const card = scope.querySelector('.mobile-card') || scope;
      // Phone words keep the fitted baseline; the second pass reduces the first pass by 30%.
      const phoneStyle = getComputedStyle(list);
      const legacySize = Math.max(12, Math.min(column * .14, 22));
      const legacyTracking = (parseFloat(phoneStyle.letterSpacing) || 0) /
        (parseFloat(phoneStyle.fontSize) || legacySize) * legacySize;
      ink.font = [phoneStyle.fontStyle, phoneStyle.fontWeight, legacySize + 'px', phoneStyle.fontFamily].join(' ');
      const legacyLongest = Math.max(1, ...directions.flatMap(item => item.disciplines || []).map(word =>
        ink.measureText(word).width + legacyTracking * word.length));
      const legacyBudget = Math.max(1, column - legacySize * .18 - 4);
      const legacyFitted = legacyLongest > legacyBudget
        ? Math.max(10, legacySize * legacyBudget / legacyLongest) : legacySize;
      list.style.setProperty('--phone-discipline-size', (legacyFitted * 1.4).toFixed(4) + 'px');
      list.style.setProperty('--phone-list-right-air', getComputedStyle(card).paddingRight);
      synthesis.style.setProperty('--phone-card-left-air', getComputedStyle(card).paddingLeft);
      synthesis.style.setProperty('--phone-card-right-air', getComputedStyle(card).paddingRight);
    } else {
      list.style.removeProperty('--phone-discipline-size');
      list.style.removeProperty('--phone-list-right-air');
      synthesis.style.removeProperty('--phone-card-left-air');
      synthesis.style.removeProperty('--phone-card-right-air');
    }
    let wordStyle = getComputedStyle(list);
    const setInkFont = () => { ink.font = [wordStyle.fontStyle, wordStyle.fontWeight, wordStyle.fontSize, wordStyle.fontFamily].join(' '); };
    setInkFont();
    const fontSize = parseFloat(wordStyle.fontSize) || 22;
    const tracking = parseFloat(wordStyle.letterSpacing) || 0;
    const words = directions.flatMap(item => item.disciplines || []);
    const longest = Math.max(1, ...words.map(word => ink.measureText(word).width + tracking * word.length));
    const budget = Math.max(1, list.getBoundingClientRect().width - fontSize * .18 - 4);
    if (longest > budget) {
      list.style.fontSize = Math.max(10, fontSize * budget / longest).toFixed(4) + 'px';
      wordStyle = getComputedStyle(list); setInkFont();
    }
    const wordStroke = parseFloat(wordStyle.webkitTextStrokeWidth) || 0;
    const reference = ink.measureText('семиотика');
    const ascent = reference.actualBoundingBoxAscent || parseFloat(wordStyle.fontSize) * .54;
    const height = ascent + (reference.actualBoundingBoxDescent || 0) + wordStroke;
    list.querySelectorAll('.author-discipline-word').forEach(word => {
      const marker = document.createElement('span');
      marker.setAttribute('aria-hidden', 'true');
      marker.style.cssText = 'display:inline-block;width:0;height:0;padding:0;margin:0;border:0;vertical-align:baseline;line-height:0';
      word.append(marker);
      const top = marker.getBoundingClientRect().top - word.getBoundingClientRect().top - ascent - wordStroke / 2;
      marker.remove();
      word.parentElement.style.setProperty('--word-fill-height', height + 'px');
      word.parentElement.style.setProperty('--word-fill-top', Math.max(0, top) + 'px');
    });
    alignPhoneWordAction(scope);
    const lead = synthesis.querySelector('.panel-description-lead');
    if (!lead) return;
    const clearFit = () => {
      lead.style.removeProperty('line-height');
      for (const name of ['heightFit', 'heightFitLines', 'heightFitTarget', 'heightFitInk', 'heightFitMode', 'heightFitMin']) delete lead.dataset[name];
    };
    if (window.innerWidth <= 700) { clearFit(); return; }
    const fullCopy = lead.querySelector('.intro-type-ghost') || lead;
    const range = document.createRange(); range.selectNodeContents(fullCopy);
    const tops = [];
    for (const rect of range.getClientRects()) {
      if (rect.width > 0 && rect.height > 0 && !tops.some(top => Math.abs(top - rect.top) < .5)) tops.push(rect.top);
    }
    if (!tops.length) { clearFit(); return; }
    const targetHeight = list.getBoundingClientRect().height;
    if (!Number.isFinite(targetHeight) || targetHeight <= 0) { clearFit(); return; }
    const leadStyle = getComputedStyle(lead);
    ink.font = [leadStyle.fontStyle, leadStyle.fontWeight, leadStyle.fontSize, leadStyle.fontFamily].join(' ');
    const bounds = ink.measureText(fullCopy.textContent);
    const inkHeight = (bounds.actualBoundingBoxAscent || 0) + (bounds.actualBoundingBoxDescent || 0);
    const minimum = Math.max((parseFloat(leadStyle.fontSize) || 19) * 1.02, inkHeight + 1.5);
    const ideal = targetHeight / tops.length;
    const fitted = Math.max(ideal, minimum);
    lead.style.setProperty('line-height', fitted.toFixed(6) + 'px', 'important');
    lead.dataset.heightFit = 'desktop'; lead.dataset.heightFitLines = String(tops.length);
    lead.dataset.heightFitTarget = targetHeight.toFixed(6); lead.dataset.heightFitInk = String(inkHeight);
    lead.dataset.heightFitMin = String(minimum); lead.dataset.heightFitMode = ideal >= minimum ? 'exact' : 'readable';
  }

  // The hairline follows the font's descender, rather than a guessed panel offset.
  let disposeHeadingRule = () => {};
  function attachHeadingRule(title) {
    const heading = title?.querySelector('h2');
    const rule = title?.querySelector('.panel-heading-rule');
    if (!heading || !rule) return () => {};
    const context = document.createElement('canvas').getContext('2d');
    let frame = null, destroyed = false;
    function measure() {
      frame = null;
      if (destroyed || !title.isConnected) return;
      const line = heading.querySelector('.panel-heading-line:last-child');
      if (!line) return;
      const style = getComputedStyle(heading);
      context.font = [style.fontStyle, style.fontWeight, style.fontSize, style.fontFamily].join(' ');
      const descent = context.measureText('р').actualBoundingBoxDescent || 0;
      const marker = document.createElement('span');
      marker.setAttribute('aria-hidden', 'true');
      marker.style.cssText = 'display:inline-block;width:0;height:0;padding:0;margin:0;border:0;vertical-align:baseline;line-height:0';
      line.append(marker);
      const baseline = marker.getBoundingClientRect().top;
      marker.remove();
      const titleBox = title.getBoundingClientRect(), headingBox = heading.getBoundingClientRect();
      const stroke = parseFloat(style.webkitTextStrokeWidth) || 0;
      const mobile = window.innerWidth <= 700;
      const labelAxis = headingBox.left;
      alignOpticalLeft(title.querySelector('.panel-context'), labelAxis, context);
      alignOpticalLeft(title.querySelector('.panel-info-eyebrow'), labelAxis, context);
      alignAuthorComposition(title.closest('.direction-panel'));
      rule.style.left = (headingBox.left - titleBox.left) + 'px';
      rule.style.top = (baseline - titleBox.top + descent + stroke / 2 - rule.getBoundingClientRect().height / 2) + 'px';
      // clientWidth excludes the reserved scrollbar gutter; never create horizontal scroll.
      let rightEdge = document.documentElement.clientWidth;
      if (mobile) {
        const photo = title.closest('.direction-panel').querySelector('.panel-circle').getBoundingClientRect();
        const radius = photo.width / 2, cx = photo.left + radius, cy = photo.top + photo.height / 2;
        const lineY = baseline + descent + stroke / 2;
        const dy = lineY - cy;
        const intersects = Math.abs(dy) <= radius;
        rightEdge = intersects ? cx - Math.sqrt(Math.max(0, radius * radius - dy * dy)) : photo.left;
        rule.dataset.photoContact = intersects ? 'circle' : 'outside';
      } else delete rule.dataset.photoContact;
      rule.style.width = Math.max(0, rightEdge - headingBox.left) + 'px';
      rule.style.visibility = 'visible';
    }
    function schedule() {
      if (!destroyed && frame === null) frame = requestAnimationFrame(measure);
    }
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(schedule) : null;
    observer?.observe(heading);
    observer?.observe(rule);
    const visualRow = title.closest('.panel-visual-row');
    if (visualRow) observer?.observe(visualRow);
    const photo = visualRow?.querySelector('.panel-circle');
    if (photo) observer?.observe(photo);
    const contactRows = title.closest('.direction-panel').querySelectorAll('.mobile-contact-link');
    contactRows.forEach(row => {
      observer?.observe(row);
      const word = row.querySelector('.mobile-contact-value'); if (word) observer?.observe(word);
    });
    const contactStyles = contactRows.length && typeof MutationObserver === 'function' ? new MutationObserver(schedule) : null;
    contactStyles?.observe(document.head, {childList:true, subtree:true, characterData:true});
    if (contactRows.length) document.fonts?.addEventListener('loadingdone', schedule);
    window.addEventListener('resize', schedule, {passive:true});
    reducedMotion.addEventListener('change', schedule);
    if (document.fonts?.status !== 'loaded') document.fonts?.ready.then(schedule);
    measure();
    return () => {
      destroyed = true;
      if (frame !== null) cancelAnimationFrame(frame);
      observer?.disconnect(); contactStyles?.disconnect();
      if (contactRows.length) document.fonts?.removeEventListener('loadingdone', schedule);
      window.removeEventListener('resize', schedule);
      reducedMotion.removeEventListener('change', schedule);
    };
  }

  function directionCompositionMarkup(item) {
    const sid = 'd' + item.number.replace('.', '');
    const paragraph = (key, text, className = '') => {
      let copy = escapeHtml(text || '');
      // Keep the editor's plain source text; only the two gallery labels are bold.
      if (item.number === '0.3' && key === 'detail') {
        copy = copy.replace(/(^|\r?\n)(Живое пространство:|Интернет-галерея:)/g, '$1<strong>$2</strong>')
          .replace(/\r?\n/g, '<br>');
      }
      return '<p' + (className ? ' class="' + className + '"' : '') +
        ' data-hub-copy="' + key + '" data-hub-text="' + sid + '-' + key + '">' + copy + '</p>';
    };
    const wordLink = item.number === '0.1'
      ? 'href="' + (phoneMedia.matches ? '#contacts' : '#hub-contact-links') + '" data-phone-contacts="true" aria-label="Контакты для связи"'
      : 'href="' + escapeHtml(item.url) + '" target="_blank" rel="noopener noreferrer" aria-label="' + escapeHtml(item.action) + '"';
    const wordAction = '<a class="mobile-word-cta" ' + wordLink + '>' +
      '<svg class="mobile-word-chevron" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m9 5 7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"></path></svg></a>';
    return '<div class="panel-description-copy author-composition">' +
      '<div class="panel-description-support author-opening">' + paragraph('detail', item.detail) + paragraph('more0', item.more?.[0]) + '</div>' +
      '<div class="author-synthesis">' +
        '<ul class="author-disciplines" data-hub-copy="disciplines" aria-label="Направления">' +
          (item.disciplines || []).map(word => '<li><span class="author-discipline-word">' + escapeHtml(word) + '</span><span class="author-discipline-fill" aria-hidden="true"></span></li>').join('') + '</ul>' + wordAction +
        paragraph('text', item.text, 'panel-description-lead') +
      '</div>' +
      '<div class="panel-description-support author-closing">' + paragraph('more1', item.more?.[1]) + '</div></div>';
  }

  // A phone-only utility page leaves the seven canonical directions intact.
  function mobileContactsMarkup(item) {
    const heading = item.head.map((line, index) => '<span class="panel-heading-line" data-hub-text="d08-head' + index + '">' + escapeHtml(line) + '</span>').join(' ');
    const groups = item.groups.map(group => '<section class="mobile-contact-group" data-contact-group="' + escapeHtml(group.id) + '">' +
      '<h3 data-hub-text="d08-group-' + escapeHtml(group.id) + '"><span>' + escapeHtml(group.title) + '</span></h3>' +
      '<div class="mobile-contact-list">' + group.items.map(entry => {
        const key = group.id + '.' + entry.id, field = 'd08-' + group.id + '-' + entry.id;
        const external = /^https?:\/\//.test(entry.url) ? ' target="_blank" rel="noopener noreferrer"' : '';
        return '<a class="mobile-contact-link" data-mobile-contact="' + escapeHtml(key) + '" href="' + escapeHtml(entry.url) + '"' + external + '>' +
          '<span class="mobile-contact-label" data-hub-text="' + field + '-label">' + escapeHtml(entry.label) + '</span>' +
          '<span class="mobile-contact-value" data-hub-text="' + field + '-text">' + escapeHtml(entry.text) + '</span><span class="mobile-contact-fill" aria-hidden="true"></span></a>';
      }).join('') + '</div></section>').join('');
    return '<div class="mobile-card" role="region" aria-label="' + escapeHtml(item.title) + '">' +
      '<div class="panel-visual-row"><div class="panel-circle panel-image-frame"><div class="photo-reveal-stage">' +
      '<img data-hub-image="contacts" src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.imageAlt) + '" style="object-position:' + escapeHtml(item.imagePosition) + ';filter:url(#hub-warm-mono)"></div><span class="photo-reveal-cover" aria-hidden="true"></span></div>' +
      '<div class="panel-visual-title"><div class="panel-context"><span>' + escapeHtml(item.number) + '</span><span data-hub-text="d08-category">' + escapeHtml(item.category) + '</span></div>' +
      '<h2 data-hub-text="d08-heading">' + heading + '</h2>' +
      '<span class="panel-heading-rule hub-line" aria-hidden="true"></span></div></div>' +
      '<div class="mobile-contacts-body">' + groups + '</div></div>' +
      '<span class="mobile-panel-number" aria-label="Раздел 0.8">0.8</span>' +
      '<div class="mobile-contacts-actions"><button type="button" class="mobile-contacts-back" data-phone-contact-action="back">В РАЗДЕЛ 0.1 ДЕНИС ГАРДАРИ</button>' +
      '<button type="button" class="mobile-contacts-top" data-phone-contact-action="top" aria-label="Наверх к меню" aria-controls="gardari-wheel">' +
      '<svg class="mobile-contacts-chevron" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m5 15 7-7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"></path></svg></button></div>';
  }

  function panelMarkup(item) {
    const monochrome = ["0.2", "0.4", "0.6", "0.7"].includes(item.number);
    const photoFilter = monochrome ? ";filter:url(#hub-warm-mono)" + (item.number === "0.2" ? " brightness(1.04)" : "") : "";
    const heading = item.head.map(line => '<span class="panel-heading-line">' + escapeHtml(line) + '</span>').join(' ');
    const visual =
      '<div class="panel-visual-row">' +
        '<div class="panel-circle"><div class="photo-reveal-stage"><img src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.imageAlt) + '" style="object-position:' + escapeHtml(item.imagePosition) + photoFilter + '"></div><span class="photo-reveal-cover" aria-hidden="true"></span></div>' +
        '<div class="panel-visual-title">' +
          '<div class="panel-context"><span>' + escapeHtml(item.number) + '</span><span>' + escapeHtml(item.category) + '</span></div>' +
          '<h2>' + heading + '</h2>' +
          '<span class="panel-heading-rule hub-line" data-hub-line="heading" data-hub-line-label="Линия под названием" data-hub-line-scope="direction" aria-hidden="true"></span>' +
          '<span class="panel-info-eyebrow">' + escapeHtml(item.subtitle) + '</span></div>' +
      '</div>';
    const more = item.more ? item.more.map(paragraph => '<p>' + escapeHtml(paragraph) + '</p>').join('') : '';
    const legacyCopy = '<div class="panel-description-copy">' +
      '<p class="panel-description-lead">' + escapeHtml(item.text) + '</p>' +
      '<div class="panel-description-rule" aria-hidden="true"></div>' +
      '<div class="panel-description-support"><p>' + escapeHtml(item.detail) + '</p>' + more + '</div></div>';
    const copy = directionComposition ? directionCompositionMarkup(item) : legacyCopy;
    const card = '<div class="mobile-card">' + visual + '<div class="panel-description' + (item.number === "0.1" ? ' panel-description--author' : '') + '">' + copy + '</div></div>' +
      '<span class="mobile-panel-number" aria-label="Раздел ' + escapeHtml(item.number) + '">' + escapeHtml(item.number) + '</span>';
    if (item.number === "0.1") {
      const authorButtonAttributes = aboutEnabled
        ? 'data-tooltip="Подробнее" aria-label="Перейти к подробностям обо мне" aria-controls="about-journey" aria-expanded="' + String(!aboutJourney.hidden) + '"'
        : 'data-tooltip="Концепт Бюро" aria-label="Перейти к разделу 0.2" aria-controls="direction-panel"';
      const authorChevron = aboutEnabled ? 'm5 9 7 7 7-7' : 'm9 5 7 7-7 7';
      return card +
        '<div id="hub-contact-links" class="panel-contact-row" role="group" aria-label="' + (aboutEnabled ? 'Контакты и подробности об авторе' : 'Контакты и переход к следующему разделу') + '">' +
          authorContacts.map(renderContact).join('') +
          '<button type="button" class="panel-cta panel-cta--author" ' + authorButtonAttributes + '>' +
            '<svg class="panel-cta-chevron" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="' + authorChevron + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"></path></svg>' +
          '</button></div>';
    } else {
      const linkProps = 'href="' + escapeHtml(item.url) + '" target="_blank" rel="noopener noreferrer"';
      return card +
        '<div class="panel-route-row" role="group" aria-label="Переход в раздел ' + escapeHtml(item.short) + '">' +
          '<a class="panel-route-pill" ' + linkProps + '>' + escapeHtml(item.action) + '</a>' +
          '<a class="panel-cta panel-cta--route" ' + linkProps + ' aria-label="' + escapeHtml(item.action) + '">' +
            '<svg class="panel-cta-chevron" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m9 5 7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"></path></svg></a>' +
        '</div>';
    }
  }

  // The same seven canonical controls become phone tiles; utilities are separate actions.
  function setupPhoneNavigation() {
    buttons.forEach(button => {
      button.classList.add('mobile-matrix-tile');
      const face = document.createElement('span'); face.className = 'mobile-tile-face';
      face.append(button.querySelector('.wheel-node-number'), button.querySelector('.wheel-node-name'));
      button.replaceChildren(face);
    });
    const utility = (id, number, caption, link) => {
      const node = document.createElement(link ? 'a' : 'button');
      node.id = id; node.className = 'mobile-matrix-tile mobile-nav-utility';
      if (link) {node.href = link; node.target = '_blank'; node.rel = 'noopener noreferrer';}
      else node.type = 'button';
      node.setAttribute('aria-label', caption.replace(/\n/g, ' '));
      const face = document.createElement('span'); face.className = 'mobile-tile-face';
      const badge = document.createElement('span'); badge.className = 'wheel-node-number'; badge.textContent = number;
      const name = document.createElement('span'); name.className = 'wheel-node-name'; renderNavigationCaption(name, caption);
      face.append(badge, name); node.append(face); wheel.append(node); return node;
    };
    const contacts = utility('mobile-contact-tile', '0.8', 'Контакты\nдля связи');
    const telegram = utility('mobile-telegram-tile', '0.9', 'Телеграм\nканал', 'https://t.me/gardariart');
    contacts.addEventListener('click', event => {
      if (!phoneMedia.matches || event.defaultPrevented) return;
      event.preventDefault();
      openMobileContacts();
    });
    telegram.addEventListener('click', event => {
      if (!phoneMedia.matches || event.defaultPrevented) return;
      phoneUtility = 'telegram'; syncPhoneNavigationState();
    });
    wheel.dataset.phoneNavReady = 'true';
  }

  // The accepted outline is an overlay, so the original editable border and fill stay native.
  function setupPhoneTileOutlines() {
    const faces = Array.from(wheel.querySelectorAll('.mobile-tile-face'));
    const records = faces.map(face => {
      const outline = document.createElementNS(ns, 'svg');
      outline.classList.add('phone-tile-outline'); outline.setAttribute('aria-hidden', 'true');
      outline.setAttribute('focusable', 'false'); outline.setAttribute('preserveAspectRatio', 'none');
      const mask = document.createElementNS(ns, 'rect'), body = document.createElementNS(ns, 'path');
      outline.append(mask, body); face.prepend(outline); return {face, outline, mask, body};
    });
    function draw() {
      if (!phoneMedia.matches) return;
      records.forEach(({face, outline, mask, body}) => {
        const box = face.getBoundingClientRect();
        if (box.width < 1 || box.height < 1) return;
        const badge = face.querySelector('.wheel-node-number').getBoundingClientRect(), style = getComputedStyle(face);
        const border = side => Math.max(0, parseFloat(style['border' + side + 'Width']) || 0);
        const bL = border('Left'), bR = border('Right'), bT = border('Top'), bB = border('Bottom');
        const stroke = ['none', 'hidden'].includes(style.borderTopStyle) ? 0 : bT;
        const edge = stroke / 2, right = box.width - edge, bottom = box.height - edge;
        const normal = Math.max(1, Math.min(parseFloat(style.borderTopRightRadius) || 12, Math.min(box.width, box.height) / 3));
        const radius = Math.max(0, normal - edge), notch = badge.width / 2 + 6.5 + edge;
        const cx = badge.left - box.left + badge.width / 2, cy = badge.top - box.top + badge.height / 2, sum = notch + radius;
        const top = {x:cx + Math.sqrt(Math.max(0, sum * sum - (edge + radius - cy) ** 2)), y:edge + radius};
        const left = {x:edge + radius, y:cy + Math.sqrt(Math.max(0, sum * sum - (edge + radius - cx) ** 2))};
        const tangent = point => ({x:cx + notch / sum * (point.x - cx), y:cy + notch / sum * (point.y - cy)});
        const tt = tangent(top), tl = tangent(left);
        outline.style.left = -bL + 'px'; outline.style.top = -bT + 'px';
        outline.style.width = 'calc(100% + ' + (bL + bR) + 'px)';
        outline.style.height = 'calc(100% + ' + (bT + bB) + 'px)';
        outline.setAttribute('viewBox', '0 0 ' + box.width + ' ' + box.height);
        mask.setAttribute('width', box.width); mask.setAttribute('height', box.height); mask.setAttribute('fill', 'var(--paper)');
        body.setAttribute('d', ['M ' + top.x + ' ' + edge, 'H ' + (right - radius),
          'A ' + radius + ' ' + radius + ' 0 0 1 ' + right + ' ' + (edge + radius),
          'V ' + (bottom - radius), 'A ' + radius + ' ' + radius + ' 0 0 1 ' + (right - radius) + ' ' + bottom,
          'H ' + (edge + radius), 'A ' + radius + ' ' + radius + ' 0 0 1 ' + edge + ' ' + (bottom - radius),
          'V ' + left.y, 'A ' + radius + ' ' + radius + ' 0 0 1 ' + tl.x + ' ' + tl.y,
          'A ' + notch + ' ' + notch + ' 0 0 0 ' + tt.x + ' ' + tt.y,
          'A ' + radius + ' ' + radius + ' 0 0 1 ' + top.x + ' ' + edge, 'Z'].join(' '));
        body.setAttribute('fill', style.backgroundColor); body.setAttribute('stroke', stroke > 0 ? style.borderTopColor : 'none');
        body.setAttribute('stroke-width', String(stroke));
        if (stroke > 0 && style.borderTopStyle === 'dashed') {
          body.setAttribute('stroke-dasharray', (stroke * 3) + ' ' + (stroke * 2)); body.setAttribute('stroke-linecap', 'butt');
        } else if (stroke > 0 && style.borderTopStyle === 'dotted') {
          body.setAttribute('stroke-dasharray', '0 ' + (stroke * 2)); body.setAttribute('stroke-linecap', 'round');
        } else {
          body.removeAttribute('stroke-dasharray'); body.removeAttribute('stroke-linecap');
        }
        outline.dataset.normalRadius = String(normal); outline.dataset.filletRadius = String(radius); outline.dataset.gap = '6.5';
      });
    }
    const observer = new ResizeObserver(draw); records.forEach(record => observer.observe(record.face));
    const styles = new MutationObserver(draw);
    styles.observe(document.head, {childList:true, subtree:true, characterData:true});
    records.forEach(record => styles.observe(record.face, {attributes:true, attributeFilter:['style', 'class']}));
    window.addEventListener('resize', draw, {passive:true}); phoneMedia.addEventListener('change', draw);
    window.addEventListener('hub:mobile-ui-updated', draw); document.fonts?.ready.then(draw); draw();
  }

  function syncPhoneNavigationState() {
    const phone = phoneMedia.matches;
    buttons.forEach((button, index) => {
      const active = index === chosen && (!phone || phoneUtility === null);
      button.setAttribute('aria-pressed', String(active));
      button.classList.toggle('is-mobile-active', phone && active);
    });
    for (const [id, key] of [['mobile-contact-tile', 'contacts'], ['mobile-telegram-tile', 'telegram']]) {
      const node = document.getElementById(id);
      if (!node) continue;
      const active = phone && phoneUtility === key;
      node.classList.toggle('is-mobile-active', active);
      if (node.tagName === 'BUTTON') node.setAttribute('aria-pressed', String(active));
    }
    wheel.setAttribute('aria-label', phone ? 'Семь разделов, контакты и Телеграм-канал' : originalWheelLabel);
  }

  function syncPhonePanelControls() {
    const item = directions[chosen];
    const cta = panel.querySelector('.panel-cta');
    if (!cta || !item) return;
    const path = cta.querySelector('.panel-cta-chevron path');
    if (phoneMedia.matches) {
      cta.dataset.mobileTop = 'true'; delete cta.dataset.mobileNext;
      cta.setAttribute('aria-label', 'Наверх к меню');
      cta.setAttribute('aria-controls', 'direction-panel');
      cta.removeAttribute('aria-expanded');
      cta.setAttribute('data-tooltip', 'Наверх к меню');
      path?.setAttribute('d', 'm5 15 7-7 7 7');
      if (cta.tagName === 'A') {cta.setAttribute('href', '#main'); cta.removeAttribute('target'); cta.removeAttribute('rel');}
    } else {
      delete cta.dataset.mobileTop; delete cta.dataset.mobileNext;
      if (item.number === '0.1') {
        cta.setAttribute('aria-label', aboutEnabled ? 'Перейти к подробностям обо мне' : 'Перейти к разделу 0.2');
        cta.setAttribute('data-tooltip', aboutEnabled ? 'Подробнее' : 'Концепт Бюро');
        cta.setAttribute('aria-controls', aboutEnabled ? 'about-journey' : 'direction-panel');
        if (aboutEnabled) cta.setAttribute('aria-expanded', String(!aboutJourney.hidden));
        path?.setAttribute('d', aboutEnabled ? 'm5 9 7 7 7-7' : 'm9 5 7 7-7 7');
      } else {
        cta.setAttribute('aria-label', item.action); cta.removeAttribute('aria-controls'); cta.removeAttribute('data-tooltip');
        cta.setAttribute('href', item.url); cta.setAttribute('target', '_blank'); cta.setAttribute('rel', 'noopener noreferrer');
        path?.setAttribute('d', 'm9 5 7 7-7 7');
      }
    }
    window.dispatchEvent(new CustomEvent('hub:mobile-ui-updated', {detail:{phone:phoneMedia.matches,number:item.number}}));
  }

  // Measure all seven natural panels at the real column width. Scoped copies of
  // the author CSS keep per-section edits effective without duplicating DOM IDs.
  let panelMeasureFrame = null;
  function measurePanelEnvelope() {
    panelMeasureFrame = null;
    const grid = panel.parentElement;
    if (window.innerWidth <= 1130) {
      grid.style.removeProperty('--hub-panel-height');
      return;
    }
    const stage = document.createElement('div');
    stage.id = 'hub-layout-probes';
    stage.setAttribute('aria-hidden', 'true');
    stage.inert = true;
    stage.style.cssText = 'position:absolute;left:-100000px;top:0;visibility:hidden;pointer-events:none';
    const scoped = document.createElement('style');
    for (const sheet of document.styleSheets) {
      if (!sheet.href || !new URL(sheet.href).pathname.endsWith('/hub-editor.css')) continue;
      for (const rule of sheet.cssRules) {
        if (rule.cssText.includes('#direction-panel')) {
          scoped.textContent += rule.cssText.replaceAll('#direction-panel', '#hub-layout-probes .direction-panel') + '\n';
        }
      }
    }
    stage.append(scoped);
    const tracks = getComputedStyle(grid).gridTemplateColumns.trim().split(/\s+/);
    const columnWidth = parseFloat(tracks[tracks.length - 1]) || panel.getBoundingClientRect().width;
    stage.style.width = columnWidth + 'px';
    const probes = directions.map(item => {
      const probe = document.createElement('div');
      probe.className = 'direction-panel';
      probe.dataset.direction = item.number;
      probe.innerHTML = panelMarkup(item);
      stage.append(probe);
      return probe;
    });
    grid.append(stage);
    try {
      probes.forEach(alignAuthorComposition);
      const heights = probes.map(probe => probe.getBoundingClientRect().height);
      const height = Math.ceil(Math.max(...heights));
      grid.style.setProperty('--hub-panel-height', height + 'px');
      grid.dataset.longestDirection = directions[heights.indexOf(Math.max(...heights))].number;
    } finally {
      stage.remove();
    }
  }
  function schedulePanelEnvelope() {
    if (panelMeasureFrame === null) panelMeasureFrame = requestAnimationFrame(measurePanelEnvelope);
  }
  window.addEventListener('resize', schedulePanelEnvelope, {passive: true});
  document.fonts?.ready.then(schedulePanelEnvelope);
  let lastPanelWidth = 0;
  const panelWidthObserver = typeof ResizeObserver === 'function' ? new ResizeObserver(entries => {
    const width = entries[0].contentRect.width;
    if (Math.abs(width - lastPanelWidth) > .5) {
      lastPanelWidth = width;
      schedulePanelEnvelope();
    }
  }) : null;
  panelWidthObserver?.observe(panel);
  schedulePanelEnvelope();

  function renderPanel(index) {
    disposeWordBlockMotion();
    disposeHeadingMotion();
    disposePanelAppearance();
    disposeHeadingRule();
    const item = directions[index];
    panel.dataset.direction = item.number;
    panel.innerHTML = panelMarkup(item);
    syncPhonePanelControls();
    disposeHeadingMotion = attachHeadingMotion(panel.querySelector(".panel-visual-title h2"));
    alignAuthorComposition(panel);
    disposePanelAppearance = attachPanelAppearance(panel);
    disposeHeadingRule = attachHeadingRule(panel.querySelector(".panel-visual-title"));
    disposeWordBlockMotion = attachWordBlockMotion(panel);
  }

  function clearContactsFragment() {
    if (location.hash === '#contacts') history.replaceState(null, '', location.pathname + location.search);
  }

  function openMobileContacts(immediate = false) {
    const item = window.GARDARI_HUB_CONTENT.mobileContacts;
    if (!phoneMedia.matches || !item) return;
    if (panelScrollTimer !== null) window.clearTimeout(panelScrollTimer);
    panelScrollTimer = null; phoneUtility = 'contacts';
    disposeWordBlockMotion(); disposeHeadingMotion(); disposePanelAppearance(); disposeHeadingRule();
    panel.dataset.direction = '0.8'; panel.innerHTML = mobileContactsMarkup(item);
    if (aboutJourney) aboutJourney.hidden = true;
    syncPhoneNavigationState();
    disposeHeadingMotion = attachHeadingMotion(panel.querySelector('.panel-visual-title h2'));
    alignAuthorComposition(panel); disposePanelAppearance = attachPanelAppearance(panel);
    disposeHeadingRule = attachHeadingRule(panel.querySelector('.panel-visual-title'));
    if (location.hash !== '#contacts') history.replaceState(null, '', location.pathname + location.search + '#contacts');
    window.dispatchEvent(new CustomEvent('hub:mobile-ui-updated', {detail:{phone:true, number:'0.8'}}));
    if (!immediate) panelScrollTimer = setTimeout(() => {
      panelScrollTimer = null;
      if (phoneMedia.matches && panel.dataset.direction === '0.8') panel.scrollIntoView({behavior:reducedMotion.matches ? 'auto' : 'smooth', block:'start'});
    }, 30);
  }

  function scrollPhoneToMenu() {
    if (panelScrollTimer !== null) window.clearTimeout(panelScrollTimer);
    panelScrollTimer = null;
    window.scrollTo({top:0, behavior:'instant'});
  }

  panel.addEventListener("click", event => {
    const target = event.target;
    if (event.defaultPrevented || !(target instanceof Element)) return;
    const contactAction = target.closest('[data-phone-contact-action]');
    if (phoneMedia.matches && contactAction && panel.contains(contactAction)) {
      event.preventDefault();
      if (contactAction.dataset.phoneContactAction === 'back') select(0);
      else if (contactAction.dataset.phoneContactAction === 'top') scrollPhoneToMenu();
      return;
    }
    const contacts = target.closest('.mobile-word-cta[data-phone-contacts]');
    if (phoneMedia.matches && contacts && panel.contains(contacts)) {
      event.preventDefault(); openMobileContacts();
      return;
    }
    const top = target.closest(".panel-cta");
    if (phoneMedia.matches && top && panel.contains(top)) {
      event.preventDefault(); scrollPhoneToMenu(); return;
    }
    const contact = target.closest(".contact-icon");
    if (contact && panel.contains(contact)) {
      contact.classList.remove("is-tapped");
      void contact.offsetWidth;
      contact.classList.add("is-tapped");
      window.setTimeout(() => contact.classList.remove("is-tapped"), 260);
    }
    const toggle = target.closest(".panel-cta--author");
    if (!toggle || !panel.contains(toggle)) return;
    if (!aboutEnabled) {
      select(directions.findIndex(item => item.number === "0.2"));
      return;
    }
    // Продолжение располагается ПОСЛЕ главного экрана, а не внутри панели:
    // высота ряда навигационной сферы никогда не меняется при раскрытии.
    aboutJourney.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    window.requestAnimationFrame(() => aboutStart.scrollIntoView({
      behavior: reducedMotion.matches ? "auto" : "smooth", block: "start"
    }));
  });

  function select(index, immediate = false, animateNavigation = !immediate) {
    if (!Number.isInteger(index) || index < 0 || index >= directions.length) return;
    if (panelScrollTimer !== null) window.clearTimeout(panelScrollTimer);
    panelScrollTimer = null;
    if (panel.dataset.direction === '0.8') clearContactsFragment();
    chosen = index;
    phoneUtility = null;
    turnNavigationTo(index, !animateNavigation || phoneMedia.matches);
    if (directions[index].number !== "0.1" && aboutJourney) aboutJourney.hidden = true;
    buttons.forEach((button, i) => button.setAttribute("aria-pressed", String(i === index)));
    dots.forEach((dot, i) => dot.classList.toggle("is-selected", i === index));
    dotTargets.forEach((target, i) => target.setAttribute("aria-pressed", String(i === index)));
    panel.classList.remove("is-leaving");
    renderPanel(index);
    syncPhoneNavigationState();
    // Автоматическая орбита намеренно не сбрасывается и не останавливается.
    if (!immediate && phoneMedia.matches) {
      panelScrollTimer = window.setTimeout(() => {
        panelScrollTimer = null;
        if (chosen === index && phoneMedia.matches) panel.scrollIntoView({behavior: reducedMotion.matches ? "auto" : "smooth", block: "start"});
      }, 30);
    } else if (!immediate && window.innerWidth <= 1130) {
      let delay = 190;
      if (navigationTurn) {
        const elapsed = navigationTurn.startedAt === null ? 0 :
          Math.max(0, (lastTime ?? navigationTurn.startedAt) - navigationTurn.startedAt);
        delay = Math.max(0, navigationTurn.duration - elapsed) + 60;
      }
      function scrollToChosen() {
        panelScrollTimer = null;
        if (chosen !== index || window.innerWidth > 1130) return;
        const rimSpeed = Math.abs(window.HubFieldNavigation?.getState?.().rimVelocity || 0);
        if (navigationTurn?.index === index || rimSpeed > .045) {
          panelScrollTimer = window.setTimeout(scrollToChosen, 60);
          return;
        }
        panel.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
      }
      panelScrollTimer = window.setTimeout(scrollToChosen, delay);
    }
  }
  buttons.forEach(button => button.addEventListener("click", () => select(Number(button.dataset.index))));

  function drawOrbit() {
    const a = -Math.PI / 2 + progress * 2 * Math.PI;
    const point = polar(a, orbitRadius);
    orbiter.setAttribute("cx", point.x);
    orbiter.setAttribute("cy", point.y);
    halo.setAttribute("cx", point.x);
    halo.setAttribute("cy", point.y);
    updateOrbitLabelEmphasis();
  }
  function animate(time) {
    frameId = null;
    if (lastTime === null) lastTime = time;
    const dt = Math.min(80, Math.max(0, time - lastTime));
    lastTime = time;
    if (!reducedMotion.matches && wheelVisible && !document.hidden) {
      progress = (progress + dt / period) % 1;
      pointer.x += (pointer.targetX - pointer.x) * .065;
      pointer.y += (pointer.targetY - pointer.y) * .065;
      pointer.strength += ((pointer.active ? 1 : 0) - pointer.strength) * .055;
    }
    updateNavigationTurn(time);
    drawParticleField(time);
    drawOrbit();
    if (!phoneMedia.matches && wheelVisible && !document.hidden && !reducedMotion.matches) frameId = requestAnimationFrame(animate);
  }
  function beginOrbit() {
    if (phoneMedia.matches || frameId !== null || !wheelVisible || document.hidden || reducedMotion.matches) return;
    lastTime = null;
    frameId = requestAnimationFrame(animate);
  }
  function endOrbit() {
    settleNavigationTurn();
    window.dispatchEvent(new CustomEvent("hub:field-pause"));
    if (frameId !== null) cancelAnimationFrame(frameId);
    frameId = null;
    lastTime = null;
  }
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      wheelVisible = entries[0].isIntersecting;
      if (wheelVisible && !document.hidden && !reducedMotion.matches) beginOrbit();
      else endOrbit();
    }, { threshold: .02 });
    observer.observe(wheel);
  } else {
    beginOrbit();
  }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) endOrbit();
    else if (wheelVisible && !reducedMotion.matches) beginOrbit();
  });
  reducedMotion.addEventListener("change", () => {
    updateOrbitLabelEmphasis();
    if (reducedMotion.matches) endOrbit();
    else if (wheelVisible && !document.hidden) beginOrbit();
  });

  // The source-owned editor bridge uses the same renderer as the public site.
  window.addEventListener("hub:select", event => {
    if (event.detail?.number === '0.8') {openMobileContacts(true); return;}
    const index = directions.findIndex(item => item.number === event.detail?.number);
    select(index, true, event.detail?.animate === true);
  });
  function revealFragment() {
    if (location.hash === '#contacts' && phoneMedia.matches) {
      openMobileContacts(true); requestAnimationFrame(() => panel.scrollIntoView({block:'start'})); return;
    }
    if (!aboutEnabled) return;
    const id = location.hash.slice(1);
    if (!["about-path", "about-art", "about-thinking"].includes(id)) return;
    select(directions.findIndex(item => item.number === "0.1"), true);
    aboutJourney.hidden = false;
    panel.querySelector(".panel-cta--author")?.setAttribute("aria-expanded", "true");
    requestAnimationFrame(() => document.getElementById(id).scrollIntoView({block: "start"}));
  }
  window.addEventListener("hashchange", revealFragment);
  setupPhoneNavigation();
  setupPhoneTileOutlines();
  phoneMedia.addEventListener('change', () => {
    const hadContacts = panel.dataset.direction === '0.8';
    phoneUtility = null;
    if (hadContacts && !phoneMedia.matches) {clearContactsFragment(); renderPanel(chosen);}
    if (phoneMedia.matches) {
      endOrbit(); pointer.active = false; pointer.targetX = pointer.targetY = pointer.x = pointer.y = pointer.strength = 0;
      nextWordAt = Infinity;
    } else if (wheelVisible && !document.hidden && !reducedMotion.matches) beginOrbit();
    syncPhoneNavigationState(); syncPhonePanelControls(); alignAuthorComposition(panel);
  });
  select(chosen, true);
  document.body.classList.add('phone-ui-ready');
  if (phoneMedia.matches) endOrbit();
  revealFragment();
  window.addEventListener("hub:field-redraw", () => drawParticleField(performance.now()));
  resizeParticleCanvas();
  drawOrbit();

})();
