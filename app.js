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
  const center = { x: 300, y: 300 };
  const orbitRadius = 181;
  const nodeAngles = directions.map((_, i) => -Math.PI / 2 + i * 2 * Math.PI / directions.length);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let chosen = directions.findIndex(item => item.number === "0.1");
  let renderTimer = null;
  let progress = 0;
  let lastTime = null;
  let frameId = null;
  let wheelVisible = true;
  const period = 29000;
  const dots = [];
  const dotTargets = [];
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
      const offset = Math.abs(progress - i / directions.length);
      const distance = Math.min(offset, 1 - offset);
      const strength = reducedMotion.matches ? 0 : 1 - smoothstep(distance / orbitLabelHalfWindow);
      const scale = (1 + .16 * strength).toFixed(4);
      if (scale === orbitLabelScales[i]) return;
      name.style.setProperty("--orbit-label-scale", scale);
      orbitLabelScales[i] = scale;
    });
  }

  directions.forEach((item, i) => {
    const angle = nodeAngles[i];
    const point = polar(angle, orbitRadius);
    const target = svg("g", {
      "class": "wheel-dot-target", "role": "button", "tabindex": "0",
      "aria-label": item.number + " " + item.title,
      "aria-pressed": String(i === chosen)
    }, dotsGroup);
    svg("circle", { cx: point.x, cy: point.y, r: 18, "class": "wheel-dot-hitarea" }, target);
    const dot = svg("circle", {
      cx: point.x, cy: point.y, r: 4.5,
      "class": "wheel-dot" + (i === chosen ? " is-selected" : "")
    }, target);
    dots.push(dot);
    dotTargets.push(target);
    target.addEventListener("click", () => select(i));
    target.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        select(i);
      }
    });
    // Геометрия и положение подписей отделены друг от друга.
    buttons[i].style.left = (50 + Math.cos(angle) * 40.7) + "%";
    buttons[i].style.top = (50 + Math.sin(angle) * 40.7) + "%";
    buttons[i].setAttribute("aria-label", item.number + " " + item.title);
    buttons[i].dataset.direction = item.number;
    buttons[i].querySelector(".wheel-node-number").textContent = item.number;
    const name = buttons[i].querySelector(".wheel-node-name");
    renderNavigationCaption(name, item.short);

  });

  function resizeParticleCanvas() {
    if (!particleContext) return;
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
    if (event.pointerType === "touch") return;
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

  // Paper-fold entrance and cursor refold, adapted for the existing two-line type.
  // React Bits FoldText: https://reactbits.dev/text-animations/fold-text
  // Native glyph advances are measured before splitting, preserving kerning.
  let disposeHeadingMotion = () => {};
  function attachHeadingMotion(heading) {
    if (!heading) return () => {};
    const lines = Array.from(heading.querySelectorAll('.panel-heading-line'));
    const texts = lines.map(line => line.textContent);
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
      let text = line.textContent;
      if (style.textTransform === 'lowercase') text = text.toLocaleLowerCase('ru');
      else if (style.textTransform === 'uppercase') text = text.toLocaleUpperCase('ru');
      const descent = Math.max(context.measureText(text).actualBoundingBoxDescent,
        context.measureText('р').actualBoundingBoxDescent, 0);
      const marker = document.createElement('span');
      marker.setAttribute('aria-hidden', 'true');
      marker.style.cssText = 'display:inline-block;width:0;height:0;padding:0;margin:0;border:0;vertical-align:baseline;line-height:0';
      line.append(marker);
      const baseline = marker.getBoundingClientRect().top;
      marker.remove();
      const titleBox = title.getBoundingClientRect(), headingBox = heading.getBoundingClientRect();
      const stroke = parseFloat(style.webkitTextStrokeWidth) || 0;
      rule.style.left = (headingBox.left - titleBox.left) + 'px';
      rule.style.top = (baseline - titleBox.top + descent + stroke / 2 - rule.getBoundingClientRect().height / 2) + 'px';
      // clientWidth excludes the reserved scrollbar gutter; never create horizontal scroll.
      rule.style.width = Math.max(0, document.documentElement.clientWidth - headingBox.left) + 'px';
      rule.style.visibility = 'visible';
    }
    function schedule() {
      if (!destroyed && frame === null) frame = requestAnimationFrame(measure);
    }
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(schedule) : null;
    observer?.observe(heading);
    observer?.observe(rule);
    window.addEventListener('resize', schedule, {passive:true});
    reducedMotion.addEventListener('change', schedule);
    if (document.fonts?.status !== 'loaded') document.fonts?.ready.then(schedule);
    measure();
    return () => {
      destroyed = true;
      if (frame !== null) cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener('resize', schedule);
      reducedMotion.removeEventListener('change', schedule);
    };
  }

  function renderPanel(index) {
    disposeHeadingMotion();
    disposePanelAppearance();
    disposeHeadingRule();
    const item = directions[index];
    panel.dataset.direction = item.number;
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
    const copy = '<div class="panel-description-copy">' +
      '<p class="panel-description-lead">' + escapeHtml(item.text) + '</p>' +
      '<div class="panel-description-rule" aria-hidden="true"></div>' +
      '<div class="panel-description-support"><p>' + escapeHtml(item.detail) + '</p>' + more + '</div></div>';
    if (item.number === "0.1") {
      panel.innerHTML = visual + '<div class="panel-description panel-description--author">' + copy + '</div>' +
        '<div class="panel-contact-row" role="group" aria-label="Контакты и подробности об авторе">' +
          authorContacts.map(renderContact).join('') +
          '<button type="button" class="panel-cta panel-cta--author" data-tooltip="Подробнее" aria-label="Перейти к подробностям обо мне" aria-controls="about-journey" aria-expanded="' + String(!aboutJourney.hidden) + '">' +
            '<svg class="panel-cta-chevron" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m5 9 7 7 7-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"></path></svg>' +
          '</button></div>';
    } else {
      const linkProps = 'href="' + escapeHtml(item.url) + '" target="_blank" rel="noopener noreferrer"';
      panel.innerHTML = visual + '<div class="panel-description">' + copy + '</div>' +
        '<div class="panel-route-row" role="group" aria-label="Переход в раздел ' + escapeHtml(item.short) + '">' +
          '<a class="panel-route-pill" ' + linkProps + '>' + escapeHtml(item.action) + '</a>' +
          '<a class="panel-cta panel-cta--route" ' + linkProps + ' aria-label="' + escapeHtml(item.action) + '">' +
            '<svg class="panel-cta-chevron" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m9 5 7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"></path></svg></a>' +
        '</div>';
    }
    disposeHeadingMotion = attachHeadingMotion(panel.querySelector(".panel-visual-title h2"));
    disposePanelAppearance = attachPanelAppearance(panel);
    disposeHeadingRule = attachHeadingRule(panel.querySelector(".panel-visual-title"));
  }

  panel.addEventListener("click", event => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const contact = target.closest(".contact-icon");
    if (contact && panel.contains(contact)) {
      contact.classList.remove("is-tapped");
      void contact.offsetWidth;
      contact.classList.add("is-tapped");
      window.setTimeout(() => contact.classList.remove("is-tapped"), 260);
    }
    const toggle = target.closest(".panel-cta--author");
    if (!toggle || !panel.contains(toggle)) return;
    // Продолжение располагается ПОСЛЕ главного экрана, а не внутри панели:
    // высота ряда навигационной сферы никогда не меняется при раскрытии.
    aboutJourney.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    window.requestAnimationFrame(() => aboutStart.scrollIntoView({
      behavior: reducedMotion.matches ? "auto" : "smooth", block: "start"
    }));
  });

  function select(index, immediate = false) {
    if (!Number.isInteger(index) || index < 0 || index >= directions.length) return;
    chosen = index;
    if (directions[index].number !== "0.1") aboutJourney.hidden = true;
    buttons.forEach((button, i) => button.setAttribute("aria-pressed", String(i === index)));
    dots.forEach((dot, i) => dot.classList.toggle("is-selected", i === index));
    dotTargets.forEach((target, i) => target.setAttribute("aria-pressed", String(i === index)));
    if (renderTimer) window.clearTimeout(renderTimer);
    if (immediate || reducedMotion.matches) {
      panel.classList.remove("is-leaving");
      renderPanel(index);
    } else {
      panel.classList.add("is-leaving");
      renderTimer = window.setTimeout(() => {
        renderPanel(chosen);
        panel.classList.remove("is-leaving");
        renderTimer = null;
      }, 150);
    }
    // Автоматическая орбита намеренно не сбрасывается и не останавливается.
    if (!immediate && window.innerWidth <= 1130) {
      window.setTimeout(() => panel.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" }), 190);
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
    drawParticleField(time);
    drawOrbit();
    if (wheelVisible && !document.hidden && !reducedMotion.matches) frameId = requestAnimationFrame(animate);
  }
  function beginOrbit() {
    lastTime = null;
    if (frameId === null) frameId = requestAnimationFrame(animate);
  }
  function endOrbit() {
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
    const index = directions.findIndex(item => item.number === event.detail?.number);
    select(index, true);
  });
  function revealFragment() {
    const id = location.hash.slice(1);
    if (!["about-path", "about-art", "about-thinking"].includes(id)) return;
    select(directions.findIndex(item => item.number === "0.1"), true);
    aboutJourney.hidden = false;
    panel.querySelector(".panel-cta--author")?.setAttribute("aria-expanded", "true");
    requestAnimationFrame(() => document.getElementById(id).scrollIntoView({block: "start"}));
  }
  window.addEventListener("hashchange", revealFragment);
  select(chosen, true);
  revealFragment();
  resizeParticleCanvas();
  drawOrbit();

})();
