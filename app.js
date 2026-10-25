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
    if (item.short === "Платформа инструментов") name.innerHTML = "Платформа<br>инструментов";
    else name.textContent = item.short;

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
  function renderPanel(index) {
    const item = directions[index];
    panel.dataset.direction = item.number;
    const heading = item.head.map(line => '<span class="panel-heading-line">' + escapeHtml(line) + '</span>').join(' ');
    const visual =
      '<div class="panel-visual-row">' +
        '<div class="panel-circle"><img src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.imageAlt) + '" style="object-position:' + escapeHtml(item.imagePosition) + '"></div>' +
        '<div class="panel-visual-title">' +
          '<div class="panel-context"><span>' + escapeHtml(item.number) + '</span><span>' + escapeHtml(item.category) + '</span></div>' +
          '<h2>' + heading + '</h2>' +
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
