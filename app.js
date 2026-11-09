/* Hub legacy history and accepted family runtime. */
(()=>{
if(!document.documentElement.hasAttribute('data-hub-family')){document.querySelectorAll('link[rel=stylesheet]').forEach(link=>{if(new URL(link.href).pathname.endsWith('/styles.css'))link.disabled=true;});const legacyStyle=document.createElement('style');legacyStyle.textContent="@font-face {\n  font-family: \"JetBrains Mono\";\n  src: url(\"./assets/JetBrainsMono-cyrillic-400-500.woff2\") format(\"woff2\");\n  font-weight: 400 500;\n  font-style: normal;\n  font-display: swap;\n  unicode-range: U+0400-052F, U+2DE0-2DFF, U+A640-A69F;\n}\n@font-face {\n  font-family: \"JetBrains Mono\";\n  src: url(\"./assets/JetBrainsMono-latin-400-500.woff2\") format(\"woff2\");\n  font-weight: 400 500;\n  font-style: normal;\n  font-display: swap;\n}\n:root {\n  --paper: #fff;\n  --ink: #202124;\n  --body: #565c62;\n  --line: #a6abb1;\n  --almost: #f8f9fa;\n  --accent: #d8c62a;\n  --blue-deep: #21669b;\n  --label-font: \"JetBrains Mono\", \"SFMono-Regular\", Consolas, monospace;\n  --ease: cubic-bezier(.22,.61,.36,1);\n  color-scheme: light;\n}\n\n/* Проба 0.1: исходные абзацы, направления и перемещённая крупная фраза. */\n.panel-description .author-composition { gap: 24px; max-width: calc(680px - var(--panel-right-air)); }\n.author-opening { gap: var(--paragraph-gap); }\n.author-synthesis {\n  display: grid;\n  grid-template-columns: var(--author-axis-column, minmax(max-content, .94fr)) minmax(0, 1fr);\n  column-gap: clamp(10px, 1.3vw, 23px);\n  align-items: start;\n}\n.author-disciplines {\n  margin: 0; padding: 0; list-style: none;\n  font-family: var(--author-display-font, Arial, Helvetica, sans-serif);\n  font-weight: var(--author-display-weight, 700);\n  font-size: clamp(12px, calc(var(--author-axis-column, 150px) * .14), 22px);\n  line-height: 1.02;\n  letter-spacing: -.055em;\n  text-align: left;\n  text-transform: lowercase;\n  color: var(--ink);\n  -webkit-text-stroke: calc(1em * var(--author-display-stroke, .03)) currentColor;\n}\n.author-disciplines li { display: flex; align-items: flex-start; gap: .18em; white-space: nowrap; }\n.author-discipline-word { flex: 0 0 auto; }\n.author-discipline-fill {\n  flex: 1 1 0; min-width: 0;\n  height: var(--word-fill-height, .75em);\n  margin-top: var(--word-fill-top, .2em);\n  background: var(--accent);\n}\n.author-synthesis .panel-description-lead { margin-bottom: 0; min-width: 0; }\n@media(max-width:560px) {\n  .panel-description .author-composition { gap: 22px; }\n  .author-synthesis { row-gap: 18px; }\n}\n*, *::before, *::after { box-sizing: border-box; }\nhtml { scroll-behavior: smooth; scrollbar-gutter: stable; }\nbody { margin: 0; background: var(--paper); color: var(--ink); font: 18px/1.5 Arial, Helvetica, sans-serif; letter-spacing: -.015em; -webkit-font-smoothing: antialiased; }\nbutton, a { -webkit-tap-highlight-color: transparent; }\nbutton { font: inherit; color: inherit; cursor: pointer; }\na { color: inherit; text-decoration: none; }\nimg { display: block; width: 100%; height: auto; }\nh1, h2, p { margin: 0; }\nh2 { font-weight: 700; line-height: 1.04; letter-spacing: -.055em; text-wrap: balance; }\np { text-wrap: pretty; }\n::selection { background: var(--accent); color: var(--ink); }\n:focus-visible { outline: 2px solid var(--blue-deep); outline-offset: 5px; }\n.visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }\n.skip-link { position: absolute; z-index: 100; left: 12px; top: 8px; padding: 12px 18px; background: var(--ink); color: white; border-radius: 8px; transform: translateY(-160%); }\n.skip-link:focus { transform: none; }\n\n/* Главный экран остаётся самостоятельным и не меняет геометрию при открытии продолжения. */\n.site-shell {\n  --hub-side-gutter: clamp(32px, 4.3vw, 86px);\n  display: flex;\n  align-items: stretch;\n  max-width: 1920px;\n  min-height: 100svh;\n  margin: 0 auto;\n  padding: clamp(25px, 4vh, 58px) var(--hub-side-gutter);\n}\n.hub-grid {\n  display: grid;\n  grid-template-columns: minmax(0, 1.04fr) minmax(0, .96fr);\n  align-items: stretch;\n  gap: clamp(36px, 5vw, 104px);\n  width: 100%;\n}\n.wheel-column { min-width: 0; display: flex; align-items: center; justify-content: center; }\n.wheel { position: relative; width: min(90%, 648px, calc((100svh - 70px) * .9)); aspect-ratio: 1; margin: 0 auto; isolation: isolate; }\n.wheel-particles { position: absolute; z-index: 0; inset: 0; display: block; width: 100%; height: 100%; pointer-events: none; }\n.wheel-geometry { position: absolute; z-index: 3; inset: 0; display: block; width: 100%; height: 100%; pointer-events: none; overflow: visible; }\n.wheel-dot-target { pointer-events: all; cursor: pointer; outline: none; }\n.wheel-dot-hitarea { fill: transparent; stroke: none; }\n.wheel-dot { pointer-events: none; stroke: var(--ink); stroke-width: .7; fill: var(--accent); opacity: 1; transform-box: fill-box; transform-origin: center; transition: transform .2s var(--ease), stroke-width .2s; }\n.wheel-dot-target:hover .wheel-dot, .wheel-dot-target:focus-visible .wheel-dot { transform: scale(1.26); stroke-width: 1.15; }\n.wheel-dot-target:active .wheel-dot { transform: scale(1.06); }\n.wheel-dot.is-selected { stroke-width: 1.05; }\n.wheel-orbiter-halo {\n  fill: var(--accent); opacity: .12; filter: blur(2px);\n  transform-box: fill-box; transform-origin: center;\n  animation: orbiter-halo-pulse 4.8s ease-in-out infinite;\n}\n.wheel-orbiter { fill: var(--accent); stroke: var(--ink); stroke-width: .7; }\n@keyframes orbiter-halo-pulse {\n  0%, 100% { opacity: .1; transform: scale(1); }\n  50% { opacity: .22; transform: scale(1.36); }\n}\n.wheel-node {\n  position: absolute; top: 50%; left: 50%; z-index: 2;\n  width: 150px; min-height: 52px; border: 0; border-radius: 0;\n  padding: 5px 1px; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 3px;\n  text-align: center; transform: translate(-50%,-50%);\n  background: transparent; touch-action: manipulation;\n  font: 400 11px/1.26 var(--label-font); letter-spacing: .008em;\n}\n.wheel-node-number { display: block; font: 400 10px/1.2 var(--label-font); color: var(--body); transform: scale(var(--top-label-scale, 1)); transition: transform .18s; }\n.wheel-node-name { display: block; font: 400 11px/1.25 var(--label-font); text-transform: uppercase; letter-spacing: .008em; transform: scale(max(var(--orbit-label-scale, 1), var(--top-label-scale, 1))); transition: color .18s, transform .18s; }\n.wheel-node-name-line { display: block; white-space: nowrap; }\n.wheel-node:hover .wheel-node-name, .wheel-node:focus-visible .wheel-node-name { transform: scale(max(1.12, var(--orbit-label-scale, 1), var(--top-label-scale, 1))); color: var(--blue-deep); }\n.wheel-node[aria-pressed=\"true\"] .wheel-node-name { font-weight: 500; }\n.wheel-node[aria-pressed=\"true\"] .wheel-node-number { color: var(--ink); }\n.wheel-node.is-top { --top-label-scale: 1.07; }\n.wheel-node.is-top .wheel-node-name, .wheel-node.is-top .wheel-node-number { font-weight: 700; }\n\n/* Три круга задают композицию: навигация, изображение, действие. */\n.direction-panel { --panel-right-air: calc(var(--hub-side-gutter) * .3); padding-right: var(--panel-right-air); min-width: 0; align-self: start; padding-top: clamp(14px, 3.5vh, 39px); transition: opacity .16s ease, transform .16s ease; }\n.direction-panel.is-leaving { opacity: 0; transform: translateY(7px); }\n.panel-visual-row { --photo-column: clamp(210px, 19.5vw, 295px); --photo-title-row-gap: clamp(22px, 2.3vw, 44px); display: grid; grid-template-columns: var(--photo-column) minmax(0, 1fr); align-items: start; gap: var(--photo-title-row-gap); }\n.panel-circle { width: 65.61%; aspect-ratio: 1; overflow: hidden; border: 1px solid var(--line); border-radius: 50%; background: var(--almost); transform: translateX(-20%); }\n.panel-circle img { display: block; width: 100%; height: 100%; object-fit: cover; }\n/* Заголовок приближен к фотокругу; середина двух строк совмещена с центром фото. */\n.panel-visual-title { --title-pull: clamp(105px, 9.65vw, 158px); --photo-title-current-gap: calc(var(--photo-column) * .47512 + var(--photo-title-row-gap) - var(--title-pull)); --photo-title-extra: calc(var(--photo-title-current-gap) * .75); min-width: 0; width: calc(100% + var(--title-pull) - var(--photo-title-extra)); height: calc(var(--photo-column) * .6561); display: grid; grid-template-rows: minmax(0, 1fr) auto minmax(0, 1fr); align-items: stretch; transform: translateX(calc(-1 * var(--title-pull) + var(--photo-title-extra))); }\n.panel-context { display: flex; align-items: baseline; align-self: end; flex-wrap: nowrap; gap: 8px 16px; min-height: 1.3em; margin: 0 0 clamp(6px, .7vw, 10px); white-space: nowrap; font: 400 10px/1.3 var(--label-font); letter-spacing: .02em; color: var(--body); }\n.panel-context span:first-child { color: var(--ink); }\n.panel-info-eyebrow { display: block; align-self: start; margin-top: clamp(15px, 1.5vw, 23px); font: 400 10px/1.55 var(--label-font); color: var(--body); }\n.panel-visual-title h2 { width: 100%; align-self: center; margin: 0; padding: 0; text-indent: 0; font-size: clamp(47.3px, 4.015vw, 74.8px); line-height: .86; hyphens: none; overflow-wrap: normal; text-transform: lowercase; -webkit-text-stroke: 1.5px currentColor; }\n.panel-heading-line { display: block; white-space: nowrap; }\n.panel-visual-title .panel-heading-line,\n.panel-visual-title .panel-context,\n.panel-visual-title .panel-info-eyebrow { transform: translateX(var(--heading-optical-shift, 0px)); }\n.panel-description { min-height: 325px; margin-top: var(--photo-copy-gap, clamp(36px, 5vh, 66px)); }\n.panel-description-copy { display: flex; flex-direction: column; gap: 0; }\n.panel-description p { max-width: calc(680px - var(--panel-right-air)); color: var(--body); }\n.panel-description-lead { font-size: clamp(15px, 1.24vw, 18px); line-height: 1.4; margin-bottom: .4em; }\n.panel-description p.panel-description-lead { color: #000; }\n.panel-description-rule { height: 0; margin-bottom: clamp(13px, 1.42vw, 19px); background: none; }\n.panel-description-support { display: flex; flex-direction: column; gap: clamp(8px, .87vw, 12px); }\n.panel-description-support p { font-size: clamp(13px, 1.06vw, 16px); line-height: 1.344; }\n.panel-cta { display: flex; justify-content: center; align-items: center; width: 66.6667%; aspect-ratio: 1; padding: 8px; border: 1px solid var(--ink); border-radius: 50%; background: var(--accent); transform: translate(-75%, 75%); transition: transform .18s var(--ease), background .18s; }\n.panel-cta:hover { transform: translate(-75%, calc(75% - 4px)); background: #e4d454; }\n.panel-cta-chevron { display: block; width: clamp(20px, 2vw, 27px); height: auto; }\n\n/* Единый ритм нижней строки; в 0.1 контакты, в остальных — две ссылки на один раздел. */\n.panel-contact-row, .panel-route-row {\n  --author-action: clamp(66px, 5.8vw, 78px);\n  display: flex; align-items: center; flex-wrap: nowrap;\n  gap: clamp(7px, .85vw, 13px);\n  margin-top: clamp(24px, 3.5vh, 36px);\n}\n.contact-icon {\n  position: relative; display: inline-flex; flex: 0 0 auto;\n  align-items: center; justify-content: center;\n  width: calc(var(--author-action) * 2 / 3); height: calc(var(--author-action) * 2 / 3);\n  border: 1px solid #8e9398; border-radius: 50%; background: transparent;\n  color: #565c62; padding: 0; cursor: pointer;\n  transition: transform .13s var(--ease), background-color .13s var(--ease), border-color .13s var(--ease);\n}\n.contact-icon svg { display: block; width: 42%; height: 42%; fill: currentColor; }\n.contact-icon[data-contact=\"telegram\"] svg { width: 44%; height: 44%; }\n.contact-icon[data-contact=\"vk\"] svg { width: 37%; height: 37%; }\n.contact-icon:hover, .contact-icon:focus-visible { transform: translateY(-3px); background: var(--almost); border-color: var(--blue-deep); }\n.contact-icon:active { transform: scale(.93); }\n.contact-icon.is-tapped { animation: contact-press .24s var(--ease); }\n.contact-icon::after, .panel-cta[data-tooltip]::after, .mobile-contacts-top[data-tooltip]::after {\n  position: absolute; z-index: 5; left: 50%; bottom: calc(100% + 11px);\n  content: attr(data-tooltip); width: max-content; max-width: 240px;\n  padding: 8px 13px; border: none; border-radius: 999px;\n  background: rgb(231 234 237 / 91%);\n  color: var(--ink); font: 400 10px/1.35 var(--label-font);\n  letter-spacing: .005em; text-align: center;\n  box-shadow: 0 5px 16px rgb(32 33 36 / 5%);\n  opacity: 0; visibility: hidden; pointer-events: none;\n  transform: translate(-50%, 4px);\n  transition: opacity .14s var(--ease), transform .14s var(--ease), visibility .14s;\n}\n.contact-icon:hover::after, .contact-icon:focus-visible::after, .contact-icon.is-tapped::after {\n  opacity: 1; visibility: visible; transform: translate(-50%, 0);\n}\n@keyframes contact-press { 0% { transform: scale(1); } 42% { transform: scale(.91); } 100% { transform: scale(1); } }\n.panel-cta--author {\n  position: relative; cursor: pointer;\n  flex: 0 0 auto;\n  width: calc(var(--author-action) * 2 / 3); height: calc(var(--author-action) * 2 / 3);\n  padding: 8px; transform: none; margin-left: clamp(2px, .6vw, 9px);\n}\n.panel-cta--author:hover { transform: translateY(-3px); }\n.panel-cta--author:active { transform: scale(.95); }\n\n.panel-route-pill {\n  display: inline-flex; flex: 0 1 auto; width: max-content;\n  min-width: 0; height: calc(var(--author-action) * 2 / 3);\n  align-items: center; justify-content: center; text-align: center;\n  padding: 0 clamp(16px, 1.7vw, 24px);\n  border: 1px solid #8e9398; border-radius: 999px;\n  color: #000; background: transparent;\n  font: 400 clamp(9px, .77vw, 11px)/1.3 var(--label-font); letter-spacing: -.01em;\n  white-space: nowrap;\n  transition: transform .13s var(--ease), background-color .13s var(--ease), border-color .13s var(--ease);\n}\n.panel-route-pill:hover, .panel-route-pill:focus-visible { transform: translateY(-3px); background: var(--almost); border-color: var(--blue-deep); }\n.panel-route-pill:active { transform: scale(.985); }\n.panel-cta--route {\n  flex: 0 0 auto;\n  width: calc(var(--author-action) * 2 / 3); height: calc(var(--author-action) * 2 / 3);\n  margin-left: clamp(2px, .6vw, 9px); padding: 8px; transform: none; border-color: #8e9398;\n}\n.panel-cta.panel-cta--route { width: calc(var(--author-action) * 2 / 3); }\n.panel-cta--route:hover { transform: translateY(-3px); }\n.panel-cta--route:active { transform: scale(.95); }\n\n/* Новые экраны «Об авторе»: визуальный язык светло-серых разделов КБ Гардари. */\n.about-journey[hidden] { display: none; }\n.about-journey { display: block; }\n.about-screen {\n  min-height: calc(100svh - 24px);\n  margin: 12px;\n  border: 1px solid #e0e3e5;\n  border-radius: 22px;\n  background: #eceeef;\n  scroll-margin-top: 0;\n}\n.about-screen-inner {\n  display: grid;\n  grid-template-columns: minmax(0, .87fr) minmax(0, 1.13fr);\n  grid-template-rows: minmax(0, 1fr) auto;\n  column-gap: clamp(46px, 6vw, 122px);\n  max-width: 1920px;\n  min-height: calc(100svh - 26px);\n  margin: 0 auto;\n  padding: clamp(58px, 7vh, 96px) clamp(42px, 4.1vw, 92px) 28px;\n}\n.about-screen-intro { display: flex; flex-direction: column; align-items: flex-start; min-width: 0; }\n.about-screen-kicker, .about-screen-footer, .about-milestone-number, .about-practice-index,\n.about-art-figure figcaption, .about-screen-next, .about-back-link, .about-source-link {\n  font-family: var(--label-font);\n  letter-spacing: .015em;\n}\n.about-screen-kicker { color: var(--ink); font-size: 11px; line-height: 1.45; }\n.about-screen-heading {\n  margin: clamp(38px, 5vh, 70px) 0 30px;\n  font: 800 clamp(50px, 5vw, 93px)/.91 Arial, Helvetica, sans-serif;\n  letter-spacing: -.075em;\n  text-wrap: balance;\n  overflow-wrap: normal;\n  -webkit-text-stroke: .85px currentColor;\n}\n.about-screen-deck {\n  max-width: 440px;\n  color: var(--body);\n  font-size: clamp(17px, 1.38vw, 21px);\n  line-height: 1.49;\n  letter-spacing: -.022em;\n}\n.about-screen-next, .about-back-link, .about-source-link {\n  display: inline-flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 25px;\n  min-height: 51px;\n  padding: 0 19px;\n  border: 1px solid var(--ink);\n  border-radius: 12px;\n  font-size: 10px;\n  line-height: 1.3;\n  transition: background .2s var(--ease), color .2s var(--ease), transform .2s var(--ease);\n}\n.about-screen-next { margin-top: auto; margin-bottom: 33px; background: var(--ink); color: white; }\n.about-screen-next:hover, .about-back-link:hover { background: var(--accent); color: var(--ink); transform: translateY(-3px); }\n.about-screen-next span, .about-back-link span, .about-source-link span { font: 400 21px/1 Arial, sans-serif; }\n.about-screen-footer {\n  grid-column: 1 / -1;\n  display: flex;\n  justify-content: space-between;\n  border-top: 1px solid #c8cdd0;\n  padding-top: 15px;\n  color: #737a80;\n  font-size: 10px;\n}\n.about-milestones { align-self: start; border-top: 1px solid #aeb4b9; }\n.about-milestone { display: grid; grid-template-columns: 50px minmax(0, 1fr); gap: 20px; padding: clamp(19px, 2.6vh, 29px) 0; border-bottom: 1px solid #bfc4c8; }\n.about-milestone-number { padding-top: 4px; color: #8c9398; font-size: 12px; }\n.about-milestone h3, .about-practice h3 { margin: 0 0 11px; font-size: clamp(21px, 1.72vw, 28px); font-weight: 700; line-height: 1.14; letter-spacing: -.045em; }\n.about-milestone p, .about-practice p { max-width: 650px; color: var(--body); font-size: clamp(15px, 1.12vw, 18px); line-height: 1.5; }\n.about-art-content { display: flex; flex-direction: column; gap: clamp(20px, 3vh, 36px); align-self: start; min-width: 0; }\n.about-art-figure { margin: 0; }\n.about-art-figure img { width: 100%; height: min(42vh, 380px); object-fit: cover; object-position: center 47%; border-radius: 6px; }\n.about-art-figure figcaption { margin-top: 10px; color: #777e83; font-size: 10px; }\n.about-art-notes { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(18px, 2vw, 36px); padding-top: 22px; border-top: 1px solid #bfc4c8; }\n.about-art-notes p { color: var(--body); font-size: clamp(15px, 1.1vw, 18px); line-height: 1.54; }\n.about-practices { align-self: start; border-top: 1px solid #aeb4b9; }\n.about-practice { padding: clamp(19px, 2.3vh, 28px) 0; border-bottom: 1px solid #bfc4c8; }\n.about-practice-index { display: block; margin-bottom: 14px; color: #747b80; font-size: 10px; }\n.about-practices-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 13px; padding-top: 28px; }\n.about-back-link { background: var(--ink); color: white; }\n.about-source-link { border-color: #858b90; color: var(--body); }\n.about-source-link:hover { background: white; transform: translateY(-3px); }\n\n@media (max-width: 1120px) {\n  .hub-grid { gap: 30px; grid-template-columns: minmax(0,1.06fr) minmax(0,.94fr); }\n  .wheel-node { width: 132px; }\n}\n@media (max-width: 1130px) {\n  .site-shell { --hub-side-gutter: 24px; display: block; padding: 30px var(--hub-side-gutter) 64px; }\n  .hub-grid { grid-template-columns: 1fr; gap: 30px; }\n  .wheel { width: min(90%, 585px); }\n  .direction-panel { width: min(100%, 720px); margin: 0 auto; padding-top: 0; scroll-margin-top: 20px; }\n  /* Ось вертикальной композиции проходит точно посередине зазора между фотокругом и заголовком. */\n  .panel-visual-row { --photo-column: 260px; --paired-photo: calc(var(--photo-column) * .6561); --paired-gap: calc(var(--photo-column) * .1539 + 10.5px); grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); justify-content: stretch; gap: var(--paired-gap); }\n  .panel-circle { width: var(--paired-photo); justify-self: end; transform: none; }\n  .panel-visual-title { width: min(420px, calc(50vw - var(--paired-gap) / 2 - 16px)); justify-self: start; height: var(--paired-photo); transform: none; }\n  .panel-visual-title h2 { font-size: clamp(41.8px, 5.5vw, 63.8px); }\n  .panel-description { min-height: 0; }\n  .panel-contact-row, .panel-route-row { justify-content: center; }\n}\n@media (max-width: 1600px) {:where(html[data-hub-compact=\"true\"]) .site-shell{ --hub-side-gutter: 14px; padding: 18px var(--hub-side-gutter) 48px; }:where(html[data-hub-compact=\"true\"]) .hub-grid{ gap: 16px; }:where(html[data-hub-compact=\"true\"]) .wheel{ width: min(90%, 432px); }:where(html[data-hub-compact=\"true\"]) .wheel-node{ width: 104px; min-height: 44px; padding: 3px 0; gap: 2px; }:where(html[data-hub-compact=\"true\"]) .wheel-node-number{ font-size: 9px; }:where(html[data-hub-compact=\"true\"]) .wheel-node-name{ font-size: 9px; line-height: 1.16; }:where(html[data-hub-compact=\"true\"]) .panel-visual-row{ --photo-column: calc((100vw - 28px) * .43); --paired-gap: calc(var(--photo-column) * .1539 + 6px); }:where(html[data-hub-compact=\"true\"]) .panel-context{ display: grid; grid-template-columns: max-content minmax(0, 1fr); align-items: start; column-gap: 9px; min-height: 2.6em; white-space: normal; font-size: 9px; margin-bottom: 6px; }:where(html[data-hub-compact=\"true\"]) .panel-info-eyebrow{ font-size: 9px; line-height: 1.35; margin-top: 13px; }:where(html[data-hub-compact=\"true\"]) .panel-visual-title h2{ font-size: clamp(28px, 7.2vw, 44px); }:where(html[data-hub-compact=\"true\"]) .panel-description{ margin-top: var(--photo-copy-gap, 32px); }:where(html[data-hub-compact=\"true\"]) .panel-description-lead{ font-size: 15px; }:where(html[data-hub-compact=\"true\"]) .panel-description-support p{ font-size: 14px; }:where(html[data-hub-compact=\"true\"]) .panel-cta{ width: 60px; justify-self: end; margin-right: clamp(30px, 9vw, 70px); transform: translateY(10px); }:where(html[data-hub-compact=\"true\"]) .panel-cta:hover{ transform: translateY(6px); }:where(html[data-hub-compact=\"true\"]) .panel-contact-row,:where(html[data-hub-compact=\"true\"]) .panel-route-row{ --author-action: 65px; gap: 6px; margin-top: 25px; }:where(html[data-hub-compact=\"true\"]) .panel-cta--author{ width: calc(var(--author-action) * 2 / 3); height: calc(var(--author-action) * 2 / 3); justify-self: auto; margin: 0 0 0 4px; transform: none; }:where(html[data-hub-compact=\"true\"]) .panel-cta--author:hover{ transform: translateY(-3px); }:where(html[data-hub-compact=\"true\"]) .panel-route-pill{ padding-inline: 15px; font-size: 10px; }:where(html[data-hub-compact=\"true\"]) .panel-cta--route{ margin: 0 0 0 4px; transform: none; }:where(html[data-hub-compact=\"true\"]) .panel-cta--route:hover{ transform: translateY(-3px); }:where(html[data-hub-compact=\"true\"]) .about-screen{ margin: 8px; border-radius: 16px; }:where(html[data-hub-compact=\"true\"]) .about-screen-inner{ display: flex; flex-direction: column; min-height: calc(100svh - 18px); padding: 42px 25px 20px; gap: 39px; }:where(html[data-hub-compact=\"true\"]) .about-screen-heading{ margin: 27px 0 22px; font-size: clamp(49px, 10vw, 79px); }:where(html[data-hub-compact=\"true\"]) .about-screen-deck{ font-size: 17px; }:where(html[data-hub-compact=\"true\"]) .about-screen-next{ margin-top: 30px; margin-bottom: 0; }:where(html[data-hub-compact=\"true\"]) .about-screen-footer{ margin-top: auto; font-size: 9px; }:where(html[data-hub-compact=\"true\"]) .about-milestone{ gap: 11px; grid-template-columns: 35px 1fr; }:where(html[data-hub-compact=\"true\"]) .about-milestone h3,:where(html[data-hub-compact=\"true\"]) .about-practice h3{ font-size: 21px; }:where(html[data-hub-compact=\"true\"]) .about-milestone p,:where(html[data-hub-compact=\"true\"]) .about-practice p{ font-size: 15px; }:where(html[data-hub-compact=\"true\"]) .about-art-figure img{ height: min(48vh, 330px); }:where(html[data-hub-compact=\"true\"]) .about-art-notes{ grid-template-columns: 1fr; }\n}\n@media (max-width: 420px) {\n  .site-shell { --hub-side-gutter: 13px; padding-inline: var(--hub-side-gutter); }\n  .panel-visual-row { --photo-column: calc((100vw - 26px) * .43); }\n  .wheel { width: min(90%, calc(100vw - 28px)); }\n  .wheel-node { width: 88px; }\n  .wheel-node-number { font-size: 8.5px; }\n  .wheel-node-name { font-size: 8px; }\n  .panel-visual-title h2 { font-size: clamp(22px, 6.6vw, 29px); }\n  .panel-cta { width: 54px; padding: 6px; }\n  .panel-cta-chevron { width: 20px; }\n  .panel-contact-row, .panel-route-row { --author-action: 57px; gap: 5px; }\n  .panel-cta--author { width: calc(var(--author-action) * 2 / 3); height: calc(var(--author-action) * 2 / 3); }\n  .contact-icon { width: calc(var(--author-action) * 2 / 3); height: calc(var(--author-action) * 2 / 3); }\n  .panel-route-pill { font-size: 9px; }\n  .about-screen-inner { padding: 34px 18px 18px; }\n  .about-screen-heading { font-size: clamp(46px, 10vw, 58px); }\n  .about-screen-footer { gap: 10px; font-size: 8px; }\n  .about-practices-actions { align-items: stretch; flex-direction: column; }\n  .about-back-link, .about-source-link { width: 100%; }\n}\n@media (prefers-reduced-motion: reduce) {\n  html { scroll-behavior: auto; }\n  *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }\n  .wheel-orbiter-halo { animation: none; opacity: .14; transform: none; }\n}\n\n/* FoldText paper panels, scoped strictly to the large right-hand heading. */\n.panel-visual-title h2 .heading-fold-segment { display:inline-block;vertical-align:baseline;perspective:700px;white-space:pre; }\n.panel-visual-title h2 .heading-fold-piece { position:relative;display:inline-block;line-height:inherit;white-space:pre;transform-origin:50% 0%;backface-visibility:hidden; }\n.panel-visual-title h2 .heading-fold-piece::after { content:attr(data-fold-text);position:absolute;inset:0;pointer-events:none;color:transparent;-webkit-text-fill-color:transparent;background-image:linear-gradient(180deg,rgba(0,0,0,.58),rgba(0,0,0,.22) 42%,rgba(255,255,255,.26));-webkit-background-clip:text;background-clip:text;opacity:var(--heading-crease,0); }\n@media(prefers-reduced-motion:reduce){.panel-visual-title h2 .heading-fold-piece{transform:none!important;opacity:1!important}.panel-visual-title h2 .heading-fold-piece::after{opacity:0!important}}\n\n/* New entrance affects only the photo, introduction and supporting copy. */\n.panel-circle{position:relative}\n.photo-reveal-stage{position:absolute;inset:0}\n.photo-reveal-cover{position:absolute;inset:0;background:var(--paper);pointer-events:none;opacity:0}\n.intro-type-grid{display:grid;grid-template-columns:minmax(0,1fr);height:var(--intro-reserved-height);overflow:clip}\n.intro-type-ghost,.intro-type-copy{grid-area:1/1;min-width:0;align-self:start}\n.intro-type-ghost{visibility:hidden;user-select:none}\n@media(prefers-reduced-motion:reduce){.photo-reveal-stage{filter:none!important}.photo-reveal-cover{opacity:0!important}}\n\n/* Title hairline: no flow space, anchored to the last line descender. */\n.panel-visual-title { position: relative; }\n.hub-line { display: block; height: 1px; background: #000; pointer-events: none; }\n.panel-heading-rule { position: absolute; visibility: hidden; }\n\n@media(max-width:1130px){\n  .panel-visual-row { margin-right: calc(-1 * var(--panel-right-air)); }\n  .panel-visual-title { padding-right: var(--panel-right-air); }\n}\n\n/* One shared paragraph rhythm, including sections with an intentionally empty paragraph. */\n.direction-panel { --paragraph-gap: 12px; --lead-gap: 16px; }\n.panel-description { min-height: 0; }\n.panel-description-lead { margin-bottom: var(--lead-gap); }\n.panel-description-rule { display: none; }\n.panel-description-support { gap: var(--paragraph-gap); }\n.panel-description-support p:empty { display: none; }\n\n/* Clip every composited photo layer before blur/filter animation starts. */\n.panel-circle { isolation: isolate; clip-path: circle(50%); }\n.panel-circle img, .photo-reveal-stage, .photo-reveal-cover {\n  border-radius: 50%; clip-path: circle(50%); overflow: hidden;\n}\n\n@media (min-width: 1131px) {\n  .site-shell { align-items: center; }\n  .hub-grid { min-height: var(--hub-panel-height, 0px); }\n}\n\n/* The mobile card preserves the photo + complete title block side by side. */\n@media (max-width: 1600px) {:where(html[data-hub-compact=\"true\"]) .site-shell{ padding-bottom: 24px; }:where(html[data-hub-compact=\"true\"]) .hub-grid{ gap: 22px; }:where(html[data-hub-compact=\"true\"]) .direction-panel{\n    --panel-right-air: 0px;\n    --mobile-photo: clamp(91px, 26vw, 130px);\n    width: 100%; margin: 0; padding: 20px 16px 24px;\n    border: 1px solid var(--ink); border-radius: 20px;\n    background: transparent; overflow: clip;\n  }:where(html[data-hub-compact=\"true\"]) .panel-visual-row{\n    display: grid; grid-template-columns: var(--mobile-photo) minmax(0, 1fr);\n    align-items: center; gap: 14px; margin-right: 0;\n  }:where(html[data-hub-compact=\"true\"]) .panel-circle{ width: 100%; transform: none; justify-self: start; }:where(html[data-hub-compact=\"true\"]) .direction-panel .panel-visual-title{\n    display: grid; grid-template-rows: auto auto auto; gap: 8px;\n    width: 100%; height: auto; min-height: var(--mobile-photo);\n    transform: none; padding: 0;\n  }:where(html[data-hub-compact=\"true\"]) .panel-context{\n    display: flex; align-items: baseline; align-self: end;\n    min-height: 0; gap: 8px; margin: 0; white-space: normal;\n  }:where(html[data-hub-compact=\"true\"]) .panel-context span:last-child{ min-width: 0; }:where(html[data-hub-compact=\"true\"]) .panel-visual-title h2{\n    width: 100%; margin: 0; font-size: clamp(24px, 6.8vw, 42px);\n    -webkit-text-stroke: 0;\n  }:where(html[data-hub-compact=\"true\"]) .panel-info-eyebrow{ white-space: normal; line-height: 1.35; }:where(html[data-hub-compact=\"true\"]) .panel-description{ margin-top: var(--photo-copy-gap, 24px); }:where(html[data-hub-compact=\"true\"]) .panel-contact-row,:where(html[data-hub-compact=\"true\"]) .panel-route-row{ margin-top: 24px; }:where(html[data-hub-compact=\"true\"]) .wheel-node{ width: 78px; }\n}\n\n@media(max-width:1600px){:where(html[data-hub-compact=\"true\"]) .wheel-particles,:where(html[data-hub-compact=\"true\"]) .wheel-geometry{transform:scale(.90);transform-origin:center}}\n\n@media (min-width: 701px) {:where(html[data-hub-layout=\"desktop\"]) .panel-description .author-composition{ gap: var(--paragraph-gap); }\n}\n\n\n/* Word blocks share the header's paper folds; existing outer row geometry stays native. */\n.author-disciplines .word-fold-segment{display:inline-block;vertical-align:baseline;perspective:700px;white-space:pre;line-height:inherit}\n.author-disciplines .word-fold-piece{position:relative;display:inline-block;line-height:inherit;white-space:pre;transform-origin:50% 0%;backface-visibility:hidden}\n.author-disciplines .word-fold-piece::after{content:attr(data-fold-text);position:absolute;inset:0;pointer-events:none;color:transparent;-webkit-text-fill-color:transparent;background-image:linear-gradient(180deg,rgba(0,0,0,.58),rgba(0,0,0,.22) 42%,rgba(255,255,255,.26));-webkit-background-clip:text;background-clip:text;opacity:var(--word-fold-crease,0)}\n.author-disciplines.word-fold-ready .author-discipline-fill{position:relative;transform-origin:50% 0%;backface-visibility:hidden}\n.author-disciplines.word-fold-ready .author-discipline-fill::after{content:'';position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(180deg,rgba(0,0,0,.58),rgba(0,0,0,.22) 42%,rgba(255,255,255,.26));opacity:var(--word-fold-crease,0)}\n@media(prefers-reduced-motion:reduce){.author-disciplines .word-fold-piece,.author-disciplines.word-fold-ready .author-discipline-fill{transform:none!important;opacity:1!important}.author-disciplines .word-fold-piece::after,.author-disciplines.word-fold-ready .author-discipline-fill::after{opacity:0!important}}\n\n\n/* Phone-only author refinements; tablet and desktop retain their existing geometry. */\n@media (max-width: 1600px) {:where(html[data-hub-compact=\"true\"]) .wheel-particles{ transform: scale(.972); }:where(html[data-hub-compact=\"true\"]) .author-synthesis{ grid-template-columns: minmax(0, 1fr); row-gap: 18px; }:where(html[data-hub-compact=\"true\"]) .author-disciplines{\n    min-width: 0; width: calc(100% + var(--phone-list-right-air, 16px));\n    font-size: var(--phone-discipline-size, clamp(16.8px, calc(var(--author-axis-column, 150px) * .196), 30.8px));\n    -webkit-text-stroke: 0;\n  }:where(html[data-hub-compact=\"true\"]) .panel-visual-title h2{ font-size: clamp(27.72px, 7.854vw, 48.51px); -webkit-text-stroke: .25px currentColor; }:where(html[data-hub-compact=\"true\"]) .direction-panel .contact-icon,:where(html[data-hub-compact=\"true\"]) .direction-panel .panel-cta--author,:where(html[data-hub-compact=\"true\"]) .direction-panel .panel-cta--route{\n    width: calc(var(--author-action) * .72);\n    height: calc(var(--author-action) * .72);\n  }:where(html[data-hub-compact=\"true\"]) .panel-cta-chevron{ width: 21.6px; }\n}\n\n\n/* The phone summary spans the card; type/color remain editable mobile source styles. */\n@media (max-width: 1600px) {:where(html[data-hub-compact=\"true\"]) .direction-panel .author-synthesis .panel-description-lead{\n    width: calc(100% + var(--phone-card-left-air, 16px) + var(--phone-card-right-air, 16px));\n    max-width: none;\n    margin-left: calc(-1 * var(--phone-card-left-air, 16px));\n    padding: 14px var(--phone-card-right-air, 16px) 14px var(--phone-card-left-air, 16px);\n  }:where(html[data-hub-compact=\"true\"]) .panel-contact-row{ gap: 8px; }\n}\n@media (max-width: 420px) {\n  .panel-contact-row { gap: 7px; }\n}\n@media (max-width: 340px) {\n  #direction-panel[data-direction=\"0.6\"] .panel-visual-title h2 { letter-spacing: -.07em; }\n}\n\n\n/* Phone variant: title first, circular photo on the right, rubric below its rule. */\n@media (max-width: 1600px) {:where(html[data-hub-compact=\"true\"]) .direction-panel{\n    --mobile-photo: clamp(104.65px, 29.9vw, 149.5px);\n    padding-top: 16px;\n    border-top-right-radius: var(--phone-card-corner, calc(var(--mobile-photo) * .5 + 17px));\n  }:where(html[data-hub-compact=\"true\"]) .panel-visual-row{\n    grid-template-columns: minmax(0, 1fr) var(--mobile-photo);\n    align-items: start;\n  }:where(html[data-hub-compact=\"true\"]) .panel-circle{\n    grid-column: 2; grid-row: 1; justify-self: end;\n    transform: none;\n  }:where(html[data-hub-compact=\"true\"]) .direction-panel .panel-visual-title{\n    grid-column: 1; grid-row: 1;\n    display: flex; flex-direction: column; justify-content: center;\n    gap: 0; min-height: var(--mobile-photo); text-align: left;\n  }:where(html[data-hub-compact=\"true\"]) .panel-visual-title h2{\n    order: 1; flex: none; align-self: flex-start;\n    font-size: var(--phone-heading-size, clamp(27.72px, 7.854vw, 48.51px));\n  }:where(html[data-hub-compact=\"true\"]) .panel-context{\n    order: 2; align-self: stretch; margin: 8px 0 0;\n  }:where(html[data-hub-compact=\"true\"]) .panel-info-eyebrow{ display: none; }\n}\n\n\n/* Phone matrix and outside actions reuse the canonical seven controls and links. */\n.mobile-card,.mobile-tile-face{display:contents}\n.mobile-panel-number,.mobile-nav-utility{display:none}\n@media(max-width:1600px){:where(html[data-hub-compact=\"true\"]) body:not(.phone-ui-ready) .site-shell{visibility:hidden}:where(html[data-hub-compact=\"true\"]) main{position:relative;z-index:1}:where(html[data-hub-compact=\"true\"]) .wheel-column{display:block}:where(html[data-hub-compact=\"true\"]) .wheel{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;width:100%;max-width:none;aspect-ratio:auto;margin:0;isolation:auto}:where(html[data-hub-compact=\"true\"]) .wheel>.wheel-particles,:where(html[data-hub-compact=\"true\"]) .wheel>.wheel-geometry{display:none}:where(html[data-hub-compact=\"true\"]) .wheel .mobile-matrix-tile{position:static;display:block;width:100%;height:auto;min-height:0;aspect-ratio:1;margin:0;padding:0;border:0;border-radius:0;background:transparent;transform:none;touch-action:manipulation;cursor:pointer}:where(html[data-hub-compact=\"true\"]) .wheel .mobile-matrix-tile .mobile-tile-face{position:relative;display:flex;align-items:flex-end;justify-content:center;width:100%;height:100%;aspect-ratio:1;padding:0 5px 13px;border:1px solid var(--ink);border-radius:var(--phone-corner-radius,20px);border-top-left-radius:clamp(68px,20vw,75px);background:var(--paper)}:where(html[data-hub-compact=\"true\"]) .wheel .mobile-matrix-tile .wheel-node-name{display:block;width:100%;font:700 3.4vw/1.05 Arial,Helvetica,sans-serif;letter-spacing:-.03em;text-transform:lowercase;transform:none;color:var(--ink)}:where(html[data-hub-compact=\"true\"]) .wheel .mobile-matrix-tile .wheel-node-name-line{white-space:nowrap}:where(html[data-hub-compact=\"true\"]) .wheel .mobile-matrix-tile .wheel-node-number{position:absolute;left:-1px;top:-1px;z-index:2;display:grid;place-items:center;width:clamp(22px,6vw,24px);height:clamp(22px,6vw,24px);border-radius:50%;background:#d2d5d8;color:var(--ink);font:400 9px/1 var(--label-font);transform:none}:where(html[data-hub-compact=\"true\"]) .wheel .mobile-matrix-tile.is-mobile-active .wheel-node-number{background:var(--accent)}:where(html[data-hub-compact=\"true\"]) .wheel .mobile-nav-utility{display:block}:where(html[data-hub-compact=\"true\"]) .direction-panel{position:relative;padding:0;border:0;border-radius:0;overflow:visible;background:transparent;--phone-action-size:clamp(52px,14vw,60px)}:where(html[data-hub-compact=\"true\"]) .direction-panel .mobile-card{display:block;width:100%;padding:16px 16px 24px;border:1px solid var(--ink);border-radius:var(--phone-corner-radius,20px);border-top-right-radius:var(--phone-card-corner,calc(var(--mobile-photo) * .5 + 17px));background:var(--paper);overflow:clip}:where(html[data-hub-compact=\"true\"]) .mobile-panel-number{position:absolute;right:0;top:0;z-index:3;display:grid;place-items:center;width:clamp(22px,6vw,24px);height:clamp(22px,6vw,24px);border-radius:50%;background:var(--accent);color:var(--ink);font:400 9px/1 var(--label-font)}:where(html[data-hub-compact=\"true\"]) .panel-context span:first-child,:where(html[data-hub-compact=\"true\"]) .panel-heading-rule{display:none}:where(html[data-hub-compact=\"true\"]) .direction-panel .panel-contact-row{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));width:100%;gap:clamp(8px,2.5vw,12px);margin-top:12px}:where(html[data-hub-compact=\"true\"]) .direction-panel .panel-contact-row .contact-icon[data-contact=\"phone\"]{display:none}:where(html[data-hub-compact=\"true\"]) .direction-panel .panel-contact-row .contact-icon,:where(html[data-hub-compact=\"true\"]) .direction-panel .panel-contact-row .panel-cta--author{width:100%;max-width:68px;height:auto;aspect-ratio:1;margin:0;padding:0;justify-self:center;border-color:var(--ink);background:var(--paper);transform:none}:where(html[data-hub-compact=\"true\"]) .direction-panel .panel-contact-row .panel-cta--author{background:var(--accent)}:where(html[data-hub-compact=\"true\"]) .direction-panel .panel-route-row{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:12px;width:100%;margin-top:12px}:where(html[data-hub-compact=\"true\"]) .direction-panel .panel-route-row .panel-route-pill{width:100%;max-width:none;height:var(--phone-action-size);padding:0 16px;border-color:#000;background:#000;color:#fff;font-size:clamp(10.5px,2.8vw,13px);line-height:1.2;white-space:normal;text-wrap:balance;transform:none}:where(html[data-hub-compact=\"true\"]) .direction-panel .panel-route-row .panel-cta--route{width:var(--phone-action-size);height:var(--phone-action-size);margin:0;padding:0;border-color:var(--ink);background:var(--accent);transform:none}:where(html[data-hub-compact=\"true\"]) .direction-panel .panel-contact-row .panel-cta-chevron,:where(html[data-hub-compact=\"true\"]) .direction-panel .panel-route-row .panel-cta-chevron{width:42%;height:auto}:where(html[data-hub-compact=\"true\"]) .direction-panel .panel-contact-row .contact-icon::after,:where(html[data-hub-compact=\"true\"]) .direction-panel .panel-contact-row .panel-cta--author::after{display:none}\n}\n\n\n/* Enlarged phone photo overflows only its former header reserve; copy top is unchanged. */\n.phone-photo-wrap{display:none}\n@media(max-width:1600px){:where(html[data-hub-compact=\"true\"]) .direction-panel{\n    --phone-photo-baseline:clamp(104.65px,29.9vw,149.5px);\n    --mobile-photo:clamp(120.3475px,34.385vw,171.925px);\n  }:where(html[data-hub-compact=\"true\"]) .panel-visual-row{height:var(--phone-photo-baseline);grid-template-rows:var(--phone-photo-baseline);column-gap:6px}:where(html[data-hub-compact=\"true\"]) .direction-panel .panel-visual-title{height:var(--phone-photo-baseline);min-height:var(--phone-photo-baseline)}:where(html[data-hub-compact=\"true\"]) .panel-visual-title h2{letter-spacing:var(--phone-heading-tracking,-.055em)}:where(html[data-hub-compact=\"true\"]) .phone-photo-wrap{display:block;float:right;margin:0;padding:0;border:0;pointer-events:none;user-select:none;shape-margin:0}\n}\n@media(max-width:340px){\n  #direction-panel[data-direction=\"0.6\"] .panel-visual-title h2{letter-spacing:var(--phone-heading-tracking,-.07em)}\n}\n\n/* Phone typography follows the original orbit labels and the author's saved button. */\n@media(max-width:1600px){:where(html[data-hub-compact=\"true\"]) .wheel .mobile-matrix-tile .wheel-node-name{font-family:var(--label-font);font-weight:500;text-align:center}:where(html[data-hub-compact=\"true\"]) .wheel .mobile-matrix-tile .wheel-node-number,:where(html[data-hub-compact=\"true\"]) .mobile-panel-number{font-size:10px;letter-spacing:-.09em}:where(html[data-hub-compact=\"true\"]) .wheel .mobile-matrix-tile .wheel-node-number{background:var(--ink);color:#e4e6e8}:where(html[data-hub-compact=\"true\"]) .wheel .mobile-matrix-tile.is-mobile-active .wheel-node-number{background:var(--accent);color:var(--ink)}:where(html[data-hub-compact=\"true\"]) .panel-context span:first-child{display:inline-block}:where(html[data-hub-compact=\"true\"]) #direction-panel[data-direction=\"0.3\"] [data-hub-copy=\"detail\"] strong{color:#000}\n}\n\n/* Phone word-field action borrows the photo geometry; its halo masks only the bars. */\n.mobile-word-cta{display:none}\n@media(max-width:1600px){:where(html[data-hub-compact=\"true\"]) .author-synthesis{position:relative}:where(html[data-hub-compact=\"true\"]) .mobile-word-cta{position:absolute;z-index:2;display:grid;place-items:center;left:var(--word-action-left);top:var(--word-action-top);width:var(--word-action-size);height:var(--word-action-size);padding:0;border:1px solid var(--ink);border-radius:50%;background:var(--accent);color:var(--ink);box-shadow:0 0 0 var(--word-action-halo,5px) var(--paper);touch-action:manipulation;cursor:pointer;transform:none}:where(html[data-hub-compact=\"true\"]) .mobile-word-chevron{display:block;width:42%;height:auto;pointer-events:none}:where(html[data-hub-compact=\"true\"]) .mobile-word-cta:active{filter:brightness(.97)}\n}\n\n\n/* The accepted concave phone outline paints over the retained editable border box. */\n.phone-tile-outline{display:none}\n@media(max-width:1600px){:where(html[data-hub-compact=\"true\"]) .wheel .mobile-matrix-tile .mobile-tile-face>.phone-tile-outline{display:block;position:absolute;left:0;top:0;width:100%;height:100%;z-index:0;pointer-events:none;overflow:visible}:where(html[data-hub-compact=\"true\"]) .wheel .mobile-matrix-tile .mobile-tile-face>.wheel-node-name{z-index:1}:where(html[data-hub-compact=\"true\"]) .phone-tile-outline path{stroke-linejoin:round}:where(html[data-hub-compact=\"true\"]) .mobile-contacts-body{margin-top:calc(var(--mobile-photo) - var(--phone-photo-baseline) + 14px)}:where(html[data-hub-compact=\"true\"]) .direction-panel[data-contact-page=\"true\"]{--contacts-group-gap:32px}:where(html[data-hub-compact=\"true\"]) .direction-panel[data-contact-page=\"true\"] .mobile-card{padding-bottom:var(--contacts-group-gap,32px)}:where(html[data-hub-compact=\"true\"]) .mobile-contact-group + .mobile-contact-group{margin-top:var(--contacts-group-gap,32px)}:where(html[data-hub-compact=\"true\"]) .mobile-contact-group h3{display:block;margin:0 0 10px;color:var(--ink);font:700 21.6px/1.3 Arial,Helvetica,sans-serif;letter-spacing:var(--phone-heading-tracking,-.055em);text-transform:lowercase}:where(html[data-hub-compact=\"true\"]) .mobile-contact-list{display:grid;gap:calc(12.533333px * .7);width:calc(100% + var(--contacts-group-right-air,16px))}:where(html[data-hub-compact=\"true\"]) .mobile-contact-link{display:flex;align-items:baseline;min-width:0;min-height:0;padding:0;color:var(--ink);text-decoration:none;touch-action:manipulation}:where(html[data-hub-compact=\"true\"]) .mobile-contact-label{flex:none;width:var(--contacts-label-width,auto);margin-right:16px;font:400 calc(14px / 1.5)/1.3 var(--label-font);color:var(--body);white-space:nowrap;text-transform:uppercase}:where(html[data-hub-compact=\"true\"]) .mobile-contact-label::after{content:':'}:where(html[data-hub-compact=\"true\"]) .mobile-contact-value{flex:0 1 auto;min-width:0;overflow-wrap:anywhere;font:400 16.8px/1.35 Arial,Helvetica,sans-serif;color:var(--blue-deep);text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:1px}:where(html[data-hub-compact=\"true\"]) .mobile-contact-fill{display:block;flex:1 0 12px;align-self:flex-start;min-width:12px;margin-left:8px;margin-top:var(--contact-rule-top,0);height:var(--contact-rule-height,.5em);background:var(--accent)}:where(html[data-hub-compact=\"true\"]) .mobile-contact-link:focus-visible{outline:2px solid var(--ink);outline-offset:3px}:where(html[data-hub-compact=\"true\"]) .mobile-contacts-actions{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:12px;width:100%;margin-top:12px}:where(html[data-hub-compact=\"true\"]) .mobile-contacts-actions :is(button,a){display:flex;align-items:center;justify-content:center;height:var(--phone-action-size);padding:0 16px;border:1px solid var(--ink);border-radius:999px;color:var(--ink);background:var(--paper);font:400 clamp(10.5px,2.8vw,13px)/1.2 var(--label-font);touch-action:manipulation;cursor:pointer}:where(html[data-hub-compact=\"true\"]) .mobile-contacts-actions .mobile-contacts-back{min-width:0;width:100%;border-color:#000;background:#000;color:#fff}:where(html[data-hub-compact=\"true\"]) .mobile-contacts-actions .mobile-contacts-top{width:var(--phone-action-size);padding:0;border-radius:50%;background:var(--accent)}:where(html[data-hub-compact=\"true\"]) .mobile-contacts-chevron{display:block;width:42%;height:auto;pointer-events:none}\n}\n\n/* Phone chevrons share the soft corners of the controls. */\n@media(max-width:1600px){:where(html[data-hub-compact=\"true\"]) .mobile-word-chevron path,:where(html[data-hub-compact=\"true\"]) .direction-panel .panel-cta-chevron path,:where(html[data-hub-compact=\"true\"]) .mobile-contacts-chevron path{stroke-linecap:round;stroke-linejoin:round}\n}\n\n/* Phone controls move without changing the surrounding layout. */\n@media(max-width:1600px){:where(html[data-hub-compact=\"true\"]) #gardari-wheel .mobile-matrix-tile,:where(html[data-hub-compact=\"true\"]) #direction-panel :is(.mobile-word-cta,.panel-cta,.contact-icon,.panel-route-pill,.mobile-contacts-actions :is(button,a)){\n    transform:none;\n    translate:0 0;\n    scale:1;\n    transform-origin:50% 50%;\n    transition:scale 85ms ease-out,translate 85ms ease-out,filter 85ms ease-out,opacity 85ms ease-out;\n  }:where(html[data-hub-compact=\"true\"]) #direction-panel .contact-icon.is-tapped{animation:none}:where(html[data-hub-compact=\"true\"]) #gardari-wheel .mobile-matrix-tile:is(:active,.is-phone-pressed),:where(html[data-hub-compact=\"true\"]) #direction-panel :is(.mobile-word-cta,.panel-cta,.contact-icon,.panel-route-pill,.mobile-contacts-actions :is(button,a)):is(:active,.is-phone-pressed){\n    translate:0 2px;\n    scale:.97;\n    filter:brightness(.97);\n  }\n}\n@media(max-width:1600px) and (prefers-reduced-motion:reduce){:where(html[data-hub-compact=\"true\"]) #gardari-wheel .mobile-matrix-tile,:where(html[data-hub-compact=\"true\"]) #direction-panel :is(.mobile-word-cta,.panel-cta,.contact-icon,.panel-route-pill,.mobile-contacts-actions :is(button,a)){\n    translate:none;\n    scale:none;\n  }:where(html[data-hub-compact=\"true\"]) #gardari-wheel .mobile-matrix-tile:is(:active,.is-phone-pressed),:where(html[data-hub-compact=\"true\"]) #direction-panel :is(.mobile-word-cta,.panel-cta,.contact-icon,.panel-route-pill,.mobile-contacts-actions :is(button,a)):is(:active,.is-phone-pressed){\n    translate:none;\n    scale:none;\n    opacity:.72;\n  }\n}\n\n\n/* Unified tablet family: the same portrait card in either orientation. */\n:where(html[data-hub-layout^=\"tablet-\"]) #gardari-wheel{\n  grid-template-columns: repeat(9, minmax(0, 1fr));\n  gap: 4px;\n}:where(html[data-hub-layout^=\"tablet-\"]) #gardari-wheel .mobile-matrix-tile .mobile-tile-face{\n  padding-inline: 3px;\n}:where(html[data-hub-layout^=\"tablet-\"]) #gardari-wheel .mobile-matrix-tile .wheel-node-name{\n  font-size: clamp(10px, 1.3vw, 13px);\n}:where(html[data-hub-layout^=\"tablet-\"]) .direction-panel .panel-description .author-composition{\n  max-width: none;\n}:where(html[data-hub-layout^=\"tablet-\"]){\n  --tablet-body: 18px;\n  --tablet-title: 72px;\n  --tablet-author-title: 81px;\n  --tablet-small: 12px;\n  --tablet-rubric: 10px;\n  --tablet-words: 26px;\n  --tablet-action-label: 16px;\n  --tablet-contact-group: 27px;\n  --tablet-contact-value: 21px;\n}:where(html[data-hub-layout^=\"tablet-\"]) #direction-panel[data-direction] .mobile-panel-number{\n  width: 28px;\n  height: 28px;\n  font-size: var(--tablet-small);\n}:where(html[data-hub-layout^=\"tablet-\"]) #direction-panel .mobile-card{\n  padding: 20px 20px 28px;\n}:where(html[data-hub-layout^=\"tablet-\"]) #direction-panel .panel-visual-title h2{\n  font-size: var(--phone-heading-size, var(--tablet-title));\n  line-height: .86;\n  font-weight: 700;\n  -webkit-text-stroke: 1.5px currentColor;\n}:where(html[data-hub-layout^=\"tablet-\"]) #direction-panel[data-direction=\"0.1\"] .panel-visual-title h2{\n  font-size: var(--phone-heading-size, var(--tablet-author-title));\n}:where(html[data-hub-layout^=\"tablet-\"]) #direction-panel[data-direction] .panel-context{\n  font-size: var(--tablet-rubric);\n  line-height: 1.3;\n  margin-top: 20px;\n}:where(html[data-hub-layout^=\"tablet-\"]) #direction-panel .panel-description-support p,:where(html[data-hub-layout^=\"tablet-\"]) #direction-panel[data-direction] [data-hub-copy=\"text\"]{\n  font-size: var(--tablet-body);\n  line-height: 1.45;\n}:where(html[data-hub-layout^=\"tablet-\"]) #direction-panel[data-direction] .author-disciplines{\n  font-size: var(--tablet-words);\n  line-height: 1.04;\n}:where(html[data-hub-layout^=\"tablet-\"]) #direction-panel{\n  --phone-action-size: 66px;\n}:where(html[data-hub-layout^=\"tablet-\"]) #direction-panel .panel-route-row .panel-route-pill,:where(html[data-hub-layout^=\"tablet-\"]) #direction-panel .mobile-contacts-actions :is(button,a){\n  font-size: var(--tablet-action-label);\n  line-height: 1.25;\n}:where(html[data-hub-layout^=\"tablet-\"]) #direction-panel[data-contact-page=\"true\"]{\n  --contacts-group-gap: 40px;\n}:where(html[data-hub-layout^=\"tablet-\"]) #direction-panel .mobile-contact-group h3{\n  font-size: var(--tablet-contact-group);\n  line-height: 1.2;\n  margin-bottom: 14px;\n}:where(html[data-hub-layout^=\"tablet-\"]) #direction-panel .mobile-contact-label{\n  font-size: var(--tablet-small);\n  line-height: 1.4;\n}:where(html[data-hub-layout^=\"tablet-\"]) #direction-panel .mobile-contact-value{\n  font-size: var(--tablet-contact-value);\n  line-height: 1.4;\n}:where(html[data-hub-layout^=\"tablet-\"]) #direction-panel .mobile-contact-list{\n  gap: 12px;\n}:where(html[data-hub-layout^=\"tablet-\"]) #direction-panel{\n  --mobile-photo: 197.71375px;\n  --phone-photo-baseline: 178px;\n}:where(html[data-hub-layout^=\"tablet-\"]) #direction-panel[data-direction=\"0.1\"] .panel-contact-row{\n  display: flex;\n  justify-content: flex-end;\n  gap: 12px;\n}:where(html[data-hub-layout^=\"tablet-\"]) #direction-panel[data-direction=\"0.1\"] .panel-contact-row :is(.contact-icon, .panel-cta--author){\n  width: 68px;\n  height: 68px;\n  flex: 0 0 68px;\n}\n\n/* The active face stays white. Existing editor backgrounds remain authoritative. */\nhtml[data-hub-compact=\"true\"] .wheel .mobile-matrix-tile .mobile-tile-face {background:var(--almost)}\nhtml[data-hub-compact=\"true\"] .wheel .mobile-matrix-tile.is-mobile-active .mobile-tile-face {background:var(--paper)}\n/* At narrow phone-landscape widths, keep readable tablet tiles in a contained row. */\n@media(max-width:700px){\n html[data-hub-layout=\"tablet-portrait\"] #gardari-wheel{grid-template-columns:repeat(9,78.666667px);overflow-x:auto;overflow-y:hidden;padding-block:1px}\n html[data-hub-layout=\"tablet-portrait\"] #gardari-wheel .wheel-node-name{font-size:10px}\n}\n/* Fixed left matrix and independent right-card scrolling. */\nhtml[data-hub-layout=\"tablet-landscape\"],html[data-hub-layout=\"tablet-landscape\"] body{height:100%;overflow:hidden}\nhtml[data-hub-layout=\"tablet-landscape\"] .site-shell{height:100dvh;min-height:0;max-width:none;padding:18px 14px;display:block}\nhtml[data-hub-layout=\"tablet-landscape\"] .hub-grid{height:100%;min-height:0;grid-template-columns:244px minmax(0,1fr);gap:12px;align-items:start}\nhtml[data-hub-layout=\"tablet-landscape\"] .wheel-column{height:100%;min-height:0;align-self:start}\nhtml[data-hub-layout=\"tablet-landscape\"] #gardari-wheel{width:244px;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px}\nhtml[data-hub-layout=\"tablet-landscape\"] #gardari-wheel .mobile-matrix-tile{height:78.666667px;aspect-ratio:1}\nhtml[data-hub-layout=\"tablet-landscape\"] #gardari-wheel .wheel-node-name{font-size:10px}\nhtml[data-hub-layout=\"tablet-landscape\"] #direction-panel{height:100%;min-height:0;max-height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:none;padding:0 0 18px;scroll-margin-top:0}\nhtml[data-hub-layout=\"tablet-landscape\"] #direction-panel::-webkit-scrollbar{width:0;height:0}\nhtml[data-hub-layout=\"tablet-landscape\"] #direction-panel .panel-description{margin-top:var(--sidebar-copy-gap,var(--photo-copy-gap,14px))}\n\n\n/* Unaccepted desktop pilot from Denis's pencil sketch. Compact layouts stay native. */\n.desktop-card-outline { display: none; }\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] {\n  scrollbar-gutter: auto;\n  --pilot-photo: calc(clamp(210px, 19.5vw, 295px) * .78732);\n  --pilot-inset: clamp(22px, 1.8vw, 34px);\n  --pilot-title-offset: calc(var(--pilot-photo) * .694 + 23.8px - var(--pilot-inset) * .3);\n  --pilot-matrix-width: clamp(300px, 25vw, 378px);\n  --pilot-nav-gap: clamp(28px, 3vw, 52px);\n}\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .site-shell {\n  display: block;\n  max-width: none;\n  padding-top: clamp(82px, 11vh, 116px);\n  padding-bottom: 40px;\n}\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .hub-grid {\n  --pilot-matrix-used: min(var(--pilot-matrix-width), calc(50vw - var(--pilot-inset) - var(--pilot-title-offset) - var(--hub-side-gutter) - var(--pilot-nav-gap)));\n  grid-template-columns: calc(50vw - var(--pilot-inset) - var(--pilot-title-offset) - var(--hub-side-gutter)) calc(var(--pilot-inset) * 2 + var(--pilot-title-offset) * 2 + var(--pilot-nav-gap) + var(--pilot-matrix-used) * .78);\n  align-items: start;\n  gap: 0;\n  min-height: 0;\n  --phone-corner-radius: 12px;\n}\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .wheel-column {\n  display: block;\n  position: sticky;\n  top: 28px;\n  align-self: start;\n  margin-top: var(--pilot-nav-offset, 250px);\n  padding-right: var(--pilot-nav-gap);\n}\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] #gardari-wheel {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 10px;\n  width: var(--pilot-matrix-width);\n  max-width: 100%;\n  aspect-ratio: auto;\n  margin: 0 0 0 auto;\n  isolation: auto;\n  scale: .78;\n  transform-origin: top right;\n}\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .wheel > :is(.wheel-particles,.wheel-geometry) { display: none; }\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .wheel .mobile-matrix-tile {\n  position: static;\n  display: block;\n  width: 100%;\n  height: auto;\n  min-height: 0;\n  aspect-ratio: 1;\n  margin: 0;\n  padding: 0;\n  border: 0;\n  border-radius: 0;\n  background: transparent;\n  transform: none;\n  touch-action: manipulation;\n  transition: scale 85ms ease-out, translate 85ms ease-out;\n}\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .wheel .mobile-tile-face {\n  position: relative;\n  display: flex;\n  align-items: flex-end;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n  aspect-ratio: 1;\n  padding: 0 5px 13px;\n  border: 1px solid var(--ink);\n  border-radius: 12px;\n  border-top-left-radius: 75px;\n  background: var(--almost);\n}\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .wheel .is-mobile-active .mobile-tile-face { background: var(--paper); }\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .wheel .mobile-matrix-tile .wheel-node-name {\n  z-index: 1;\n  width: 100%;\n  font: 500 13px/1.05 var(--label-font);\n  font-size: clamp(8.5px, calc(var(--pilot-matrix-used) * .036111111), 13px) !important;\n  letter-spacing: -.03em;\n  text-transform: uppercase;\n  text-align: center;\n  color: var(--ink);\n  transform: none;\n}\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .wheel-node-name-line { white-space: nowrap; }\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .wheel .wheel-node-number {\n  position: absolute;\n  left: -1px;\n  top: -1px;\n  z-index: 2;\n  display: grid;\n  place-items: center;\n  width: 24px;\n  height: 24px;\n  border-radius: 50%;\n  background: var(--ink);\n  color: #e4e6e8;\n  font: 400 10px/1 var(--label-font);\n  letter-spacing: -.09em;\n  transform: none;\n}\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .wheel .is-mobile-active .wheel-node-number { background: var(--accent); color: var(--ink); }\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .phone-tile-outline {\n  display: block;\n  position: absolute;\n  inset: 0;\n  z-index: 0;\n  width: 100%;\n  height: 100%;\n  pointer-events: none;\n  overflow: visible;\n}\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .phone-tile-outline path { stroke-linejoin: round; }\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .wheel .mobile-matrix-tile:is(:active,.is-phone-pressed) { scale: .97; translate: 0 2px; }\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .direction-panel {\n  position: relative;\n  margin: 0;\n  padding: 0;\n  min-width: 0;\n  --panel-right-air: 0px;\n}\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .mobile-card {\n  position: relative;\n  display: block;\n  width: 100%;\n  padding: var(--pilot-inset) var(--pilot-inset) 28px;\n  isolation: isolate;\n  border: 0;\n  background: var(--paper);\n  overflow: visible;\n}\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .desktop-card-outline {\n  display: block;\n  position: absolute;\n  left: 0;\n  top: 0;\n  z-index: -1;\n  width: 100%;\n  height: 100%;\n  overflow: visible;\n  pointer-events: none;\n}\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .desktop-card-outline path { fill: var(--paper); stroke: var(--ink); stroke-width: 1; vector-effect: non-scaling-stroke; }\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .panel-visual-row {\n  position: static;\n  grid-template-columns: var(--pilot-title-offset) minmax(0, 1fr);\n  gap: 0;\n  margin: 0;\n}\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .panel-circle {\n  position: absolute;\n  left: calc(var(--pilot-photo) * -.32);\n  top: calc(var(--pilot-photo) * -.12);\n  width: var(--pilot-photo);\n  height: var(--pilot-photo);\n  transform: none;\n}\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .panel-visual-title {\n  grid-column: 2;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  width: auto;\n  height: calc(var(--pilot-photo) * .8);\n  min-width: 0;\n  padding: 0;\n  transform: none;\n}\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .panel-context {\n  position: absolute;\n  top: calc(-1 * var(--pilot-inset) - 26px + (26px - 1.3em) * .3);\n  left: 0;\n  margin: 0;\n}\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .panel-context span:first-child { display: inline-block; }\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .panel-visual-title h2 { flex: 0 0 auto; font-size: clamp(47.3px, 4.015vw, 74.8px); }\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .panel-heading-rule {\n  left: var(--pilot-rule-left,0px) !important;\n  width: var(--pilot-rule-width,100%) !important;\n  max-width: 100%;\n}\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .panel-description,\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .panel-description .author-composition,\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .panel-description p { max-width: none; }\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .mobile-word-cta { display: none; }\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .mobile-panel-number {\n  position: absolute;\n  right: 0;\n  top: 0;\n  display: grid;\n  place-items: center;\n  width: 24px;\n  height: 24px;\n  border-radius: 50%;\n  background: var(--accent);\n  color: var(--ink);\n  font: 400 10px/1 var(--label-font);\n  letter-spacing: -.09em;\n}\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] :is(.panel-contact-row,.panel-route-row) { margin-top: 18px; padding-inline: var(--pilot-inset); justify-content: flex-start; }\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .panel-route-pill { background: #000; border-color: #000; color: #fff; font-weight: 700; }\n/* The ninth and eighth tiles are functional; contacts use the established content. */\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .mobile-contacts-body { margin-top: 50px; }\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .mobile-contact-group + .mobile-contact-group { margin-top: 32px; }\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .mobile-contact-group h3 { margin: 0 0 10px; font: 700 27px/1.3 Arial,Helvetica,sans-serif; letter-spacing: -.055em; text-transform: lowercase; }\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .mobile-contact-list { display: grid; gap: 12px; }\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .mobile-contact-link { display: flex; align-items: baseline; min-width: 0; min-height: 28px; }\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .mobile-contact-label { flex: none; width: var(--contacts-label-width,auto); margin-right: 16px; font: 400 12px/1.3 var(--label-font); text-transform: uppercase; }\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .mobile-contact-label::after { content: ':'; }\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .mobile-contact-value { flex: 0 1 auto; min-width: 0; overflow-wrap: anywhere; font: 400 21px/1.35 Arial,Helvetica,sans-serif; color: var(--blue-deep); text-decoration: underline; text-underline-offset: 3px; }\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .mobile-contact-fill { flex: 1 0 12px; min-width: 12px; margin-left: 8px; align-self: flex-start; margin-top: var(--contact-rule-top,0); height: var(--contact-rule-height,.5em); background: var(--accent); }\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .mobile-contacts-actions { display: flex; gap: 12px; margin-top: 18px; }\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .mobile-contacts-actions :is(button,a) { min-height: 52px; padding: 0 20px; border: 1px solid var(--ink); border-radius: 999px; font: 400 13px/1.2 var(--label-font); }\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .mobile-contacts-back { flex: 1; color: white; background: black; }\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .mobile-contacts-top { width: 52px; padding: 0 !important; background: var(--accent); }\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .mobile-contacts-chevron { width: 24px; height: 24px; }\n@media (prefers-reduced-motion: reduce) {\n  html[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .wheel .mobile-matrix-tile { transition: none; }\n}\n\n\n/* r06: author controls, inactive choice feedback, and tablet contact measures. */\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] #gardari-wheel .mobile-matrix-tile .wheel-node-number {\n  width: 31.2px;\n  height: 31.2px;\n  font-size: 13px;\n}\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] #direction-panel[data-direction=\"0.3\"] [data-hub-copy=\"detail\"] strong {\n  color: #000;\n}\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] #gardari-wheel .mobile-matrix-tile:not(.is-mobile-active):is(:hover,:focus-visible) .mobile-tile-face {\n  background: #e6f1f8;\n}\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] #gardari-wheel .mobile-matrix-tile:not(.is-mobile-active):is(:hover,:focus-visible) .phone-tile-outline path {\n  fill: #e6f1f8;\n}\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] #direction-panel[data-contact-page=\"true\"] .mobile-contact-group + .mobile-contact-group {\n  margin-top: 40px;\n}\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] #direction-panel[data-contact-page=\"true\"] .mobile-contact-group h3 {\n  margin-bottom: 14px;\n  font-size: 27px;\n  line-height: 1.2;\n}\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] #direction-panel[data-contact-page=\"true\"] .mobile-contact-label {\n  font-size: 12px;\n  line-height: 1.4;\n}\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] #direction-panel[data-contact-page=\"true\"] .mobile-contact-value {\n  font-size: 21px;\n  line-height: 1.4;\n}\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] #direction-panel[data-contact-page=\"true\"] .mobile-contacts-actions {\n  padding-inline: var(--pilot-inset);\n}\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] #direction-panel[data-contact-page=\"true\"] .mobile-contacts-actions :is(button,a) {\n  min-height: 66px;\n  font-size: 16px;\n  line-height: 1.25;\n}\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] #direction-panel[data-contact-page=\"true\"] .mobile-contacts-top {\n  flex: 0 0 66px;\n  width: 66px;\n  height: 66px;\n}\n\n\n/* r07: compact desktop contacts and a larger card number. */\n.desktop-contacts-triad { display: none; }\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] #direction-panel .mobile-panel-number {\n  width: 31.2px;\n  height: 31.2px;\n  font-size: 13px;\n}\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] #direction-panel[data-contact-page=\"true\"] .desktop-contacts-triad {\n  display: block;\n  margin-top: 13px;\n  color: var(--ink);\n  font: 400 12px/1.55 var(--label-font);\n}\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] #direction-panel[data-contact-page=\"true\"] .mobile-contacts-body {\n  display: grid;\n  grid-template-columns: repeat(2,minmax(0,1fr));\n  column-gap: 28px;\n  row-gap: 24px;\n  align-items: start;\n}\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] #direction-panel[data-contact-page=\"true\"] .mobile-contacts-body > .mobile-contact-group {\n  min-width: 0;\n  margin: 0;\n}\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] #direction-panel[data-contact-page=\"true\"] [data-contact-group=\"personal\"] { grid-column: 1; grid-row: 1; }\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] #direction-panel[data-contact-page=\"true\"] [data-contact-group=\"club\"] { grid-column: 1; grid-row: 2; }\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] #direction-panel[data-contact-page=\"true\"] [data-contact-group=\"bureau\"] { grid-column: 2; grid-row: 1; }\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] #direction-panel[data-contact-page=\"true\"] [data-contact-group=\"gallery\"] { grid-column: 2; grid-row: 2; }\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] #direction-panel[data-contact-page=\"true\"] .mobile-contact-list { gap: 6px; }\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] #direction-panel[data-contact-page=\"true\"] .mobile-contact-link { min-height: 0; }\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] #direction-panel[data-contact-page=\"true\"] .mobile-contact-value {\n  font: 400 12px/1.4 var(--label-font);\n  letter-spacing: inherit;\n}\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] #direction-panel[data-contact-page=\"true\"] .mobile-contact-fill { display: none; }\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] #direction-panel[data-contact-page=\"true\"] .mobile-contacts-actions {\n  --author-action: clamp(66px,5.8vw,78px);\n  align-items: center;\n  gap: clamp(7px,.85vw,13px);\n}\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] #direction-panel[data-contact-page=\"true\"] .mobile-contacts-actions :is(button,a) {\n  min-height: 0;\n  height: calc(var(--author-action) * 2 / 3);\n}\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] #direction-panel[data-contact-page=\"true\"] .mobile-contacts-back {\n  flex: 0 1 auto;\n  width: max-content;\n  padding: 0 clamp(16px,1.7vw,24px);\n  font: 700 clamp(9px,.77vw,11px)/1.3 var(--label-font);\n  letter-spacing: -.01em;\n  white-space: nowrap;\n}\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] #direction-panel[data-contact-page=\"true\"] .mobile-contacts-actions .mobile-contacts-back {\n  font: 700 clamp(9px,.77vw,11px)/1.3 var(--label-font);\n}\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] #direction-panel[data-contact-page=\"true\"] .mobile-contacts-top {\n  flex: 0 0 auto;\n  width: calc(var(--author-action) * 2 / 3);\n  margin-left: clamp(2px,.6vw,9px);\n}\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] #direction-panel[data-contact-page=\"true\"] .mobile-contacts-chevron {\n  width: clamp(20px,2vw,27px);\n  height: auto;\n}\n\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] #direction-panel[data-contact-page=\"true\"] .panel-heading-rule { height: .25px; background: #202124; }\n\n\n/* 3.3 shared boundary standard: one CSS pixel, including the scaled matrix. */\n:root { --hub-boundary-width: 1px; }\n.panel-circle,.contact-icon,.panel-cta,.panel-route-pill,.mobile-contacts-actions :is(button,a) { border-width: var(--hub-boundary-width); }\nhtml[data-hub-compact=\"true\"] #direction-panel .mobile-card { border-width: var(--hub-boundary-width); }\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] #gardari-wheel .mobile-tile-face { border-width: var(--hub-boundary-width); }\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] #gardari-wheel .phone-tile-outline path { vector-effect: non-scaling-stroke; }\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] .desktop-card-outline path { stroke-width: var(--hub-boundary-width); }\n.mobile-contacts-actions .mobile-contacts-back { display: inline-flex; align-items: center; justify-content: center; text-align: center; }\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] #direction-panel[data-contact-page=\"true\"] .mobile-contact-value { font-size: 13.2px; }\n/* Add half the measured 3.3 bottom blank (54.09375px); wrapped content keeps 1.5× padding. */\nhtml[data-hub-desktop=\"true\"][data-hub-layout=\"desktop\"] #direction-panel[data-contact-page=\"true\"] .mobile-card {\n  min-height: calc(var(--pilot-inset) + var(--pilot-photo) * .8 + 425.8125px);\n  padding-bottom: 42px;\n}\n\n/* Footer explanations share the author-contact capsule; pointer hover never sticks on touch. */\n#direction-panel :is(.panel-cta,.mobile-contacts-top)[data-tooltip] { position: relative; }\n#direction-panel :is(.panel-cta,.mobile-contacts-top)[data-tooltip]::after { display: none; }\n@media (hover: hover) and (pointer: fine) {\n  #direction-panel :is(.panel-cta,.mobile-contacts-top)[data-tooltip]::after { display: block; }\n  #direction-panel :is(.panel-cta,.mobile-contacts-top)[data-tooltip]:is(:hover,:focus-visible)::after {\n    opacity: 1; visibility: visible; transform: translate(-50%, 0);\n  }\n  html[data-hub-compact=\"true\"] #direction-panel :is(.panel-cta,.mobile-contacts-top)[data-tooltip]::after,\n  #direction-panel .mobile-contacts-top[data-tooltip]::after {\n    left: auto; right: 0; transform: translateY(4px);\n  }\n  html[data-hub-compact=\"true\"] #direction-panel :is(.panel-cta,.mobile-contacts-top)[data-tooltip]:is(:hover,:focus-visible)::after,\n  #direction-panel .mobile-contacts-top[data-tooltip]:is(:hover,:focus-visible)::after {\n    transform: translateY(0);\n  }\n}\n\n/* Approved compact transition window. */\n.hub-exit-dialog {\n  --exit-circle: 68px;\n  position: fixed;\n  inset: 0;\n  box-sizing: border-box;\n  width: min(440px, calc(100% - 32px));\n  max-height: calc(100dvh - 32px);\n  margin: auto;\n  padding: 30px 24px 26px;\n  overflow: auto;\n  overscroll-behavior: contain;\n  border: 1px solid var(--ink);\n  border-radius: 20px;\n  background: #eef0f2;\n  color: var(--ink);\n  text-align: center;\n  box-shadow: none;\n}\n.hub-exit-dialog::backdrop { background: rgb(32 33 36 / 23%); }\n.hub-exit-question {\n  margin: 0;\n  color: var(--ink);\n  font: 700 30px/1.06 Arial, Helvetica, sans-serif;\n  letter-spacing: -.055em;\n  text-wrap: balance;\n}\n.hub-exit-question span { display: block; }\n.hub-exit-description {\n  margin: 18px 0 0;\n  color: var(--body);\n  font: 400 13px/1.45 var(--label-font);\n  letter-spacing: -.035em;\n  text-wrap: balance;\n}\n.hub-exit-actions { display: flex; justify-content: center; gap: 22px; margin-top: 26px; }\n.hub-exit-choice {\n  display: grid;\n  place-items: center;\n  box-sizing: border-box;\n  flex: 0 0 var(--exit-circle);\n  width: var(--exit-circle);\n  height: var(--exit-circle);\n  margin: 0;\n  padding: 0;\n  border: 1px solid var(--ink);\n  border-radius: 50%;\n  color: var(--ink);\n  background: var(--accent);\n  font: 400 14px/1 var(--label-font);\n  letter-spacing: 0;\n  text-decoration: none;\n  text-transform: uppercase;\n  cursor: pointer;\n  touch-action: manipulation;\n  -webkit-tap-highlight-color: transparent;\n  transition: transform .14s var(--ease);\n}\n.hub-exit-no { background: #000; color: #fff; border-color: #000; }\n.hub-exit-choice:active { transform: scale(.94); }\n.hub-exit-choice:focus-visible { outline: 2px solid var(--ink); outline-offset: 4px; }\n.hub-exit-dialog[open] { animation: exit-appear .16s var(--ease); }\n@keyframes exit-appear { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: translateY(0); } }\n@media (min-width: 701px) {\n  .hub-exit-dialog { --exit-circle: 76px; padding: 34px 30px 30px; }\n  .hub-exit-question { font-size: 34px; }\n  .hub-exit-description { font-size: 14px; }\n  .hub-exit-actions { margin-top: 30px; gap: 24px; }\n}\n@media (prefers-reduced-motion: reduce) {\n  .hub-exit-dialog[open] { animation: none; }\n  .hub-exit-choice { transition: none; }\n}\n\n\n/* Author section only: Gallery mark, visible size 42% of the unchanged badge. */\n#direction-panel[data-direction=\"0.1\"] .mobile-panel-number--brand {\n  background: #000 url(\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgMTI4IDEyOCI+PGRlZnM+PGZpbHRlciBpZD0iaW5rIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiPjxmZUZsb29kIGZsb29kLWNvbG9yPSIjZmZmZmZmIiByZXN1bHQ9InBhaW50Ii8+PGZlQ29tcG9zaXRlIGluPSJwYWludCIgaW4yPSJTb3VyY2VBbHBoYSIgb3BlcmF0b3I9ImluIi8+PC9maWx0ZXI+PC9kZWZzPjxjaXJjbGUgY3g9IjY0IiBjeT0iNjQiIHI9IjY0IiBmaWxsPSIjMDAwMDAwIi8+PGltYWdlIHg9IjM0LjEzMzMzMzMzMzMzMzM0IiB5PSIzNC4xMzMzMzMzMzMzMzMzNCIgd2lkdGg9IjU5LjczMzMzMzMzMzMzMzMzIiBoZWlnaHQ9IjU5LjczMzMzMzMzMzMzMzMzIiBocmVmPSJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUxRQUFBQzBDQVFBQUFDWHhNNjVBQUFUWEVsRVFWUjQydTJkYVpBa1IzWEhmeSt6K3BqNzJQdmUxYTVXN0VwYW5TdExJQVFXbHhBS0RGZzJHTXRJNGNCR29aQk5JQ0JNaEEzQkVmZ0RYMnhzSW13Y0RnY09mN0tOUDloaEV3YmJHSXpET01BY090SHVDcTEyWjFhejJ0MjV6KzZ1cXZTSHF1cGpPdnZ1bWVtZXFmL0V4blpYVlZkbi9TcjdWZWJMbHkvRkVHczlwRGE2QUZ0Rk1laDFVZ3g2blJTRFhpZkZvTmRKTWVoMVVneDZuUlNEWGljNTVac1NzMTZTK1NvZEdhT0hrditsZnB0WGFwM2NZenNIbUdXRUxBbm1tZVlJS3hnbUVZUWxRS0hvWllRcHB1Z2x5UkhPTThrSSsxbGhnaU5NTTQzRERzNXpIUk1rRUR3R09jOTl2Q2pYNUxiVXN6M1Q1dnIrYmEvLy9xR2RtZVBEVis2OWVFdFdpK2NCQ29OZlZCYUZDdC83Z0FBYUlUZ1NmQ1Q4UDlnckdBd2FNQ2h5Q0ZBZ292TkgrQmhVZUpUR1JXTkU5L3F2WmErckE3US9hSkIwTllBK3VTRVN0VEVuMlZaeXNlMlJBRTVDSFRmOS9rbmVwWkl6dlpQSFZNKzAveFBISGNvbHdLQkRZS3JvMndNb3dhZWpMUWJKMzQ1Z3I4bnZJWHdYYlplaUV2Z29QQ1E4bjhuZlBqLzYxTDd5VWx0QW00eWthbDJzeVVpTnZydWhsME1VMTRPVzhTcEp5VTYxSi9lQXZ1SDVvU3UzTE9nZnBIT0RScTdpbzNESjVXK0RDVkVWZjNjQm5vU0lQUVFwdVJYUmJZaGVlUkFlSVNVbE1TRm1FNTVCOGpmREJPOHpkWUZXK1VKVnVtUlo5Yk8wZy9aSjRiVUhjcThNcnh6MTcxODhuSHZMYksvcTh4SnpDb0VNVVkwS2Z2cW1xRVpLbFd1UW9ob3ErU05MSVJlMkZMWkhWMWE4cGJEZFI1QmduK1dyYmFaajFRK2xIR0h0WjZpaGoxdVpRYmRHV0xGZERubW5adS9PdnYyRllaUHlOWTZReStNTmJyaWc4TU5iWDZobnJMS3JCVGpCSi8zdzJNSTFsVi9sNmpOVWd5MWw0R3VDTnRUNndkZFRuNjJucmwrYUhmckUxRjBMOTErOUs5dURJenA0N1BoNTAxQU1NRzhicTF5c0tYdTNHcktwNHpPVkNkV2kxaEtOU2pJa3VLNVpzNkhvbDVNTDkweStjKzcyc1dHampKajhRODEyY2QyaU5RRk5aS3Nha3lMbEh6TnY1TjRyYjc2d3g4MmZKZmlKcS9DOHBkOFNxQnVBcndub2RPUE51Z1FEM0wzMHRoZmZkdTNHRElLUXdNc2JncUNsV213SnUwOXJBTnJoTkM4MWNMeWt2Rkh2b2R6RDEyN0o3UExDam9QQkxiSjZwVTB3S3J6cmJLMEJhTjJBZFpZZXN6Lzc0S1ZmbmJ3bDJ4ZjBya3hadTNWenFPMmdEYU4xSFNkSWo3L2IvZURLSTB0SHZKUVhOZ1NqRm5BMzFkWDYxSGJRbzNWWlo5SGVZZmVYbHorY3ZkN0hEVHZOR3MvUy90MHNhak5vdzV2NG54ckhLUFNobGJmUFA3bDh5c3ZYWFIrREc1NWg4MEdHdG9QZVFiYnFmazNpNE95Ymx4NjcraVpYMlRxeW14TXl0Qm0wNFhUVng1alROL09XekJNWDM3R0VSdWVkTVZ0RGJRV2RKRU5QaFgwYU9aMzkwSXVQcmZSck5NYUlGTHQyTnI4c29FV1grckJzRW0wc2ZxVytDcC9SNkIzVEg3cnk0Y25YZWFHUHpVamdvOWpTb0hYTmRvTll1dGdlVlBpY1l1bXRyejQrL1o1bEhiaGdvZFMxdmpWa014MVBTa3F5Vk90MnBKMVg5T1hpRFRsMk1HbkJwa2p1dnZ5UjhRL05YT2VFQTBPQnRwSjFEbVFEL2RYSU5XNkhJYUZIdWdCdGtmME1NMTEycENiN2l4Yy9QdkdBcTFNWTQwbWhLN0oxVEVha05qd01sN21EUGt0OVZvTkxqMTc3M1psajRCaFhqTmg4d0Z0SExZSVdsdGpPall5dnNzK0NPbkgxRTJQdnl3eUQ0TlVhWU53Q2FnbTBzTWhOOU9LdHdxenhIdjc1Sjl6VE9lWGdicWxHWEdXMUJIcVpPempKdWRXMWVYanF3d3NmWDlxdDBjYmZpdWJZcWhaQWV5VFlSM0pWNjhUWlBmZWxtZmQ0QXduQUYvc1ExRlpVMDZCZEJxSGNhTng1NXROTEQycEg0VytwN2todE5RbmFaUWREWlEwNjlTdlBmZXJ5clVxQnQybjl5czJxQ2RBR0dHWjdPTmhVa1B6RzR1Zm5Ea2NSYTNGdExsVVRvSWZZaXgvR3BCV2tIdU1ML241bEFydHN0bURmcjdvYUJOM1B3VEFpclZUK0V4Yys3ZS8yRWRtNlhaTHFxaHUwME1NUlhJc1hPYUhQUFhYbVV3dWpPcTdGVlZRWGFFMkNvM2pobUY2eEJCS1pQM2orcVpYK09LSzl1bXFDZHRBY3c2L2d5NVBreTU5ODdoTzVYb1UydnNRMXVyS3FnRFlrRUk1UjJXR2FTcHo1eU1RbnM3MEtneHRqcnFvS29BMCtDWTZWQkdvWDd3VXdTZjNJeTU5eGh4TDVFTVFZZEdWWjQ2Tjkrb0ZEQUJVaW5CMUl6RHh5N1V2K05tMXA2c1VxbHdYMElCNDNrQzdya0JTazJNdmNPODU5Y1dtYlExeVQ2NU1GOUkyQVd6VStRN0gwdXZIZlc5NHRnVWZEaU1UdDVscXlnTTdWK0lqQzMvLzhGOGZ1alNiU21QZ3hXSWNhYlA0YXdFdU5mMnpzZlFabkN3OU1OUzViWEVlVnd6VXBmZW5oeTQ5cVdJTVpoSnRaMXVsdmxXVG93VGs5L1puY05sVXkveTZ1MGJWbEFWMDVua09SMjNQcFkxUEhTK2RseFE3UmVtUUJQVkxoVUNHanh6NTQ0VDEreWRUZnVEN1hKd3Zvb1lxSFR2N0NwZC9KSlhYZWFNU0k2MWVkelRzaHllTGVzeDlkUHFRUkk1allYalFvQytpZFpWdUVESmZFdlBPVmQwTUFPVzQ1TnlvTDZQNnlMWUxpNnNtckh6TnAxYVpwOUZ0UGRUWHZCRE93K09pbEd3c1R5MlBMMGFnc29NK1ViVWt5ZE1mRVIweCtCbUZzT0JxWEJmUkMyUlkxZXY2eCtVRWRwZ09KYTNNenNvRGV0bnFEZXZXTlQ3OC95aU1VTit1YWszVnFSYW44Z2NuSDNMUVQ0MjFKRnRCOUplK01Hci9ucFljU3NRdXBSZFgwM3ZucGN4OTFIYlVxSjFhc1JtVUJQVlB5enIxejdDMFFwQ0NMclhQenNvQitydmhOWXVGSk55SGhJekEySDgzTEFybzR0MkRtcHNzUDZEQ1BYTnlzYTBVVzBQY1h2ZjdXYnpHZ1M3TEJ4R3BPRnRDeitWY3lPdmsyUDhwT3VORWw3WEpaUVA4dy95cjM2NU43QzNubFlyVWlXN2JkOEgvTmErOXlleFhFa3lUYW9DcERXU3ZIRm02SUduWGQwL0V1dFBRM3FzMXYvMTRMNkpNQWFKNSt4TjBWK0o4N0hYRTBGbC9JU1ZxY0tiU1FISGF0cTRzUWRPeVVKU20wQmZSS3NDTXhkaysycHp1OGRaRnBDM0xtU1ZnNURJcFVqaW5YQlBsNDEzNjhYZ0VLMzFGejVmc3NvQ2NBMEtlbWpwWm1NZWhVRldwdzVDVFErSXhNSkg4Nk5YWDNUODZPWGZaVmVDdWlPcjkySmZIeFJUbHFzWHlmQmZScmdERDk5c1ZkQ2g4bnpON1Z1WW9BQmdrS25TWHZtYUV6OHkvc1BEdnlnNFdySjNJdmIzVHhRam4yVGJwMzd2UktYNUQxdm5OcnRPUXorUXVRWE5qeDdNQzNGMStZZkg3Zy9NcGNqaHlHVE1lVXZzTGdySE9RSXlKK2hZai9qVlgwb05OaFZ3cVNKTWFULzVyKzkrR2Y3WGptMVE0TmpLOHdsSlc2YVdWbjV4VTJValI4SE9SREh6Zzc4cy8rTjdJL2RxWmQzQTZzR0lHc0dkRVZyOTYxT05xcGJlZmlwUTZjcVcxZkgvbWFlVGEzc055UlpTM0laanBFRDAyYzhGUFFtWTcrb0pYaDRiRHJ1N04vMmZ1TjFOUmlCNVp5dFN5Z3J3akhGNDZLZEpvclNlVVg0QUREOE56ZXZ6NzBsZStlODAzblF3WXI2Q2wyN3MyTnVDWHAwenBCSmh3Mjl2SFJZL3MrMS9mMTN0bE9LbDkxV1VCbmVpN2R1amlrT25TTTBFWFk5ZjNjNXhQLzRlVTY5Y0Zua3lXOC8zYjZoendkamFsMGt2RUl1dFhIdm5ueWNmMU5VMnRPVTRmSkF0by94UW1US0YxZFoyTWw0Wi9HWTgvLzNmN1IxRE5kWXBpTFpERWQzN2xkM2FqRXR0N1V4a25ob1lDZThmMmZUWitkQ2FiZHJjczNSKzRxQ1pjNWExWVcwTWNUTHlYYzhCbmZLYUNEUmNRME8vN08rYzlYak9GMUNLbTJseTI2WXNtMzFYMUd1Si96ekRIR01UVFBOSTNhQW5wZ2g1TW9OaGtiLzBDTW5oZXBNd04vS2tzK1VmZTdkUld1elpEZ09LK1JZdzhYdUlNSlhzWXd3QUVjZ2dTMndnQWpwUEhEWDFmNThqc3UyZkRJdWtDZnVjc2RVSlE2enpkU0VpNGFrczd1K3dzOTBaNXpCczZvUG01aWxtdEFnbTJNRTVnSUJlZzh5dEpxSnZrL0tBY3RaY2NYWkFIdHB0eU9TaWRqOEZFWVJuNnEvOFprVE5GV0g5MXd2ZFlZQnRsSEJvL01PbnBHYkhOWVpNeDBqZ2NzMytIMnQzOHRQV3ZDOFIrQUZXWTVBZVRRTlgzbTBjS212VnhIa2lGZVliMS9xUmJRMC90Y2gzQ053STFYdEZMVzZQbWQzMDVuYlNWU0xIRzJSbG5UYUlaSk1jZ3l6b1o0K0N5ZzUvWUhmdWhPd0Z3WVVCMzVKN21VcTNDRVI3SktkaEZCdUkwRGZKZU5ERDYyelRQMFllTWZnUVVKUGtrMy9ZL3pDNVV4N1dhUnliS21sNHZnbzFBMThvK3NoNnc1bGFRRG1uU1JnbzVUK214bW90cHZiQmxoRzhYejJEMnk3R09GbFE2NUVtc2dlbWZGSmZrSU83ODMrbHJ0OFhpRkRsZk16VERFQ0Evd1E3SWQ0VVNvdU9ac1o4bXc5enVqYzdWSDR4VkxwRWl3eEY1T3M1TWNxa013cjlsU3FPMlRBR0ltTHM3VzVVY1MraGxnaExlU1lxbWpMcTZUeW1LVkFRNmVUVS9YNXhVVkZqakVuU1EzL09HM1doMFBHbURIajN1dUxkZGxCRHhHdVptZU5tSVdrbWhIT2ZUb0dkMkNWZTE0MEFKY3pQYjU5VjNqSFBjeXpHSkxsbGtoSkFmMUxZemdLZkhTNS9kUDdsMUttSUdaUyticHhJcFNVU2VxM05laGdwQ2VoQ3p4emRWbjdYalFCdUZLM1M2Tmc0eTIwTTV3ZXRScFBicHdhMjdvcFpINXU4Mm84VmZrWW5LbDMzZkE1MVd1VGFzVjBjYjRJZ1pMMGhJZlR3UWNtZUZvMmJrM0dtUnROZko3UGNSaHBoc0dMYWc5aVp2TUd5NmRXTHJaRzE3WTQvSXlRVzlpSmU5YkVUeHlJM1dlYjdCOFd4ZUFybC9IdUlHRkJqQWJOQnA5WCs3ZTJUZXZIRjIrYmlZZk94c05BQlMzM2V2cnhBa2dTK1hidXdDMHFyc0ROY0krWnVvR0xhU0dKOTgxOTlEc25mNlJuRjVBb1JBY3ZOQ3hieWhkcWFDMXBBTmRBTHBlek1lNG8rNzZMS2orN0NOekgxdzY0VzJQMWl3d1lhQlo4WGhrZVRZMFUrTzhEVGordTFWOTdLcXJQZ3M2N2I1Nzd2SFoyOXhoRmRiYmFLV04rbkEybzAwRCtucnVZNzRPekFydnZvdFBqYi9lM3hHTWFSY2pObXZvVHRzMG9KT01GazFGclNRNXVQakV4R081bmE0NEtBd0ZzMEhKcS9acms0QytubmN3WC9Nby84SHgzNSs4M1UwTGdsZVc3Mnh0Z3lzMkNXaE5QM05WajVEKzNCT3puMXpjRnZVeUNralhKem56cGdCOWxGK3FVWi9Od2ZPZm12cE5OeFUxMjlaZm13SzBRNEpNbGYzbW52SFB2WG8vT2xGbFpISHR5OWoxT3N6RGxoUnllUW4zdUg4MmZrclkyUFJiSFJVcTA5d0ZwS3Z0RnQ3Zy83bHpTb3pDMjlDUi9hNEh2WS8zczJqZEl3am1adjlQdUJsRXZBM09vdFAxcHNNbGE0bldFQXhaa3YyWFA1dTVUZUViTm53Qmt5NEg3VERBVkZHWVdDQkRMem1lR2NoKzVxV0hYQlNJckhFcnVaNlNkclVHZWREcWZ4YTAwbzgvOTZTWFdKKzhCclhWMVRiYVlSZjJzVVJONXZTRlI3MTBJYTlCYkRwYTBDRHZaTHFzcmhnVXVhR25uM3J0UnJVT1BveDYxZFdnVnl6MkdVRHpzdy84N0FHZmhESGlzdkdRb2F0Qk8remppaVV5V3JGODhOeXZaUVlGWHpvQmNWVGFybFdTRTVZUkZVTktYL3ZBekYzU1FhSEgwTldnd2JNVVgzQVBYbnV2MjZQV3pJVmZXM1ZtQ2VzV0NRT1dpS1FrbCs5YlBCN2xDMnNINnNZZnBUYUwxY1dnVjhpVkxjNGp1RVBqNzE0YWFUNzB1REFIUHJoVnZqRWkrVUd2NkZ2c2locVJxVlQ1dnE0Rm5lQ1VaVmFWWnZyVTVWT3RMWnl0ODFPTHdFT0xGODZiVmZsUnhVb3pENklVV2tuTFFyMWRDMXB6Z1BJNEZaR1plMWIyRnBLdU5ZTmI0MkZ3Z1FUcGEvckNubk1YejJWVkVKUG5WYzB5SllCQ1Vzb3lDdEcxb0gzbUxhc2NlZHNYNy9aNmRVdWpLQWFEVHcvYi9uZnVSOFAvdmZEOHlKV3hlU1BGRXptclNiRGZpeTRHUFZsMlBSNDd0L3NIRE0wTVZ4VVEraWgyL0dEbjM0NysyOU1Ya3ZPWTlpeGExYldnb1R4ZGxlSGFQZk9Id0d1aVBrZDVSWDNFSkw5eTRLK2NGeExaZG80dWRpMW96ZjVWdlVKQk9lZFB6bXdQMXNOdEZKRkNHVjhFTUY5UWYrVE10THV6MDdXZ2N5eXRzdEV1Ui9UaXdIbHBMdG9vakZqSzZqL2tqek96N1ovNDJhV2dIVzR1YTBNcnh2WmZ1aUY0M1RocWd4R0hnVy9OZnRYVURuaHFxc1JkS1pjWGJTaEgvUkdOd205aUtyTGdrYjUyNHNzL3VydzIwNHk2RkxSZzZSTmdqR2RNazY0a1FUSDRiT0xadFNweGw0Sk84dDZ5VnJSbVFYOWZYYmJlZ3RyeWNOd0RmOC8wNlRDTGVydlQzM1lwYUdGN21TZGFrekNKcHBzS2dwTVorN2xUa3FoaU1HN2UyYm9rMFpibVdyK0czVCtYTTI1SjM2K2RRN3BkQzlxemRjQmJxb0V5MFpjdE5SZENadFZpODgyclMwSGJzdlZIN2VmbVBIZUNxMno1MDBlWkptRWRtV3hNWFFwYTZDK3owUTZ0Sks0MWlDanJHR09hVVpaYlh1bWdTMEVieGl3UHc0V3F3YnZWSmZnVlRJOUhrajFjeG0reVBST29TMEZuK1pjeUtJTFBJaTBFbWxmOG9FOVBpTHA1ZFNsb3cxU0ZQV3NUL09XUlpnK1h5VFlkMnRYVklXSHJLWThVdTFwSTVSYURybHNlUGV4cGV0NUFERG92cWZubjBjdWUvREtFalNrRzNaQmNldG5kMUlNdEJ0MmdYUHJZMHdUcUdIVERjdWxqYjhOdDZoaDBFM0xwWlYrRHFHUFFUU2xBM1FpOEdIU1RjdWxoZndQNFl0Qk55Nk9IQTNYM1JHUFFMY2dqeGNFNmo0MUJ0eVNmRklmck9qSUczYUo4RW5XaGprRzNMRk1YNmhoMEcxUVA2aGgwVzJSd09GelZyeGVEYnBzY0RsWGQyNld5T1NzTjdRa2FiMVlPQnhtcjBMSzJMcVpRWFBSNjFNZ0FmM1JzWVphSnJNb0JhaXZQNnIwcEhyR0VoTTN6UFNaV2hjQVV6N0V5VFlZaTFLOEUreG12ZDU1aG9hRFJZbk8xQ2hkTWtxbG5qY0ZnU2xrNHNTeWNWQmF0QTFycHMrVXhIQWJGUXRtZ2ttSVp2K3piQ3Q5WHEwSVlNUzFQYVRZa09HUk5kR2dETGFVNVp1c1o4RlRocW1tMUN4cE5INU5WUytWVm5ZaWpWdWNlei9JUDFwUDdvb3JLSzJGcVlqLzhWM2xkYUJOY1JCdGtFR3hwcGkyZ05UN0dqMmJWMVhmeTJtdWtGQ0Q1K2FHaFhMaWNYYlg2TElneXVoeENoWUFXVVJnL1NnMGZyQ3JraDc4NFUvVGJzRVFXS0VuS0dqWU5iTXZzdldDYzRpbDg5U0tzTC9tSWh3a3pOZnY1dWwwdEs3TkJldlZaeVpadnQyaE96cEpncG1BQ29wUW9FZ2JqUnJIVDVRR1NrakpQRnhieGE3ODZLTkhDNWxiY2psNG54YURYU1RIb2RWSU1lcDBVZzE0bnhhRFhTVEhvZFZJTWVwMzAvMGtYNGttZGpmWVVBQUFBQUVsRlRrU3VRbUNDIiBmaWx0ZXI9InVybCgjaW5rKSIvPjwvc3ZnPgo=\") center / 100% 100% no-repeat !important;\n  color: transparent !important;\n  font-size: 0 !important;\n}\n";document.head.append(legacyStyle);
/* One responsive owner for the sphere, phone and both tablet compositions. */
(() => {
  const root = document.documentElement;
  const enabled = window.GARDARI_HUB_CONTENT?.features?.adaptiveLayout === true;
  const desktopLayoutEnabled = window.GARDARI_HUB_CONTENT?.features?.desktopLayout === true || Boolean(root.dataset.desktopPilot);
  root.dataset.hubDesktop = String(desktopLayoutEnabled);
  // Use the primary pointer: a touch-capable laptop still owns a mouse layout.
  const touch = window.matchMedia('(pointer: coarse)');
  let previewDevice = null;
  const media = new EventTarget();
  let mode = 'desktop';
  function classify(width, height, coarse = false, adaptive = true, desktop = desktopLayoutEnabled) {
    if (!adaptive) return width <= 700 ? 'phone' : 'desktop';
    // Computer windows retain the authored desktop composition until genuinely narrow.
    // Physical touch devices and historical sources keep their accepted geometry.
    if (desktop && !coarse) return width >= 900 ? 'desktop' : 'tablet-portrait';
    const landscape = width > height;
    const turnedPhone = landscape && height <= 700 && width <= 1366;
    if (turnedPhone) return 'tablet-portrait';
    if (width <= 700) return 'phone';
    const shortSide=Math.min(width,height), longSide=Math.max(width,height);
    const tablet = shortSide <= 1180 && longSide <= 1366;
    if (!tablet) return 'desktop';
    return landscape && width >= 1024 ? 'tablet-landscape' : 'tablet-portrait';
  }
  const api = {
    get mode() { return mode; },
    isCompact: () => mode !== 'desktop',
    // The old API name remains compatible with saved pilot/editor bridges.
    isDesktopPilot: () => desktopLayoutEnabled && mode === 'desktop',
    isMatrixNavigation: () => api.isCompact() || api.isDesktopPilot(),
    isTablet: () => mode.startsWith('tablet-'),
    isSidebar: () => mode === 'tablet-landscape',
    media, classify,
    // An editor's chosen device is ephemeral and never enters content or history.
    setPreviewDevice(value) {
      if (![null, 1440, 768, 1024, 390].includes(value) || !isLocalAuthoringFrame()) return false;
      if (previewDevice === value) return true;
      previewDevice = value;
      apply();
      // Existing type fitting and compact UI owners also listen for resize.
      window.dispatchEvent(new Event('resize'));
      return true;
    },
    scrollTop(behavior = 'instant') {
      if (api.isSidebar()) document.getElementById('direction-panel')?.scrollTo({top:0,behavior});
      window.scrollTo({top:0,behavior});
    },
    scrollPanelTop(behavior = 'auto') {
      const panel = document.getElementById('direction-panel');
      if (api.isSidebar()) panel?.scrollTo({top:0,behavior});
      else panel?.scrollIntoView({block:'start',behavior});
    }
  };
  Object.defineProperty(media, 'matches', {get:api.isCompact});
  window.GARDARI_HUB_LAYOUT = api;
  function isLocalAuthoringFrame() {
    if (window.parent === window || !['localhost', '127.0.0.1', '::1', '[::1]'].includes(location.hostname)) return false;
    try { return window.parent.location.origin === location.origin; }
    catch { return false; }
  }
  function apply() {
    const previous = mode, wasCompact = api.isCompact(), wasSidebar = api.isSidebar();
    const panel = document.getElementById('direction-panel');
    const oldScroll = wasSidebar ? (panel?.scrollTop || 0) : Math.max(0,window.scrollY - (panel?.offsetTop || 0));
    const coarse = previewDevice === null ? touch.matches : previewDevice !== 1440;
    mode = classify(window.innerWidth, window.innerHeight, coarse, enabled);
    root.dataset.hubLayout = mode;
    root.dataset.hubCompact = String(api.isCompact());
    if(panel) {if(api.isSidebar()) {panel.tabIndex=0;panel.dataset.sidebarFocusable='true';}
      else if(panel.dataset.sidebarFocusable) {panel.removeAttribute('tabindex');delete panel.dataset.sidebarFocusable;}}
    if (mode !== previous) {
      if (wasCompact !== api.isCompact()) media.dispatchEvent(new Event('change'));
      window.dispatchEvent(new CustomEvent('hub:layout-change',{detail:{mode,previous}}));
      if (wasSidebar !== api.isSidebar()) requestAnimationFrame(() => {
        if (api.isSidebar()) {window.scrollTo({top:0,behavior:'instant'}); if(panel)panel.scrollTop=oldScroll;}
        else if (wasSidebar && panel) window.scrollTo({top:panel.offsetTop+oldScroll,behavior:'instant'});
      });
    }
  }
  apply();
  window.addEventListener('resize',apply,{passive:true});
  touch.addEventListener('change',apply);
})();

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
  // Resolve contact identity from the saved data so undo can reopen both schemas.
  const contactsNumber = window.GARDARI_HUB_CONTENT.mobileContacts?.number || "0.8";
  const hasHomoCogitans = directions.some(item => item.number === "0.8");
  const showLegacyTelegram = directions.length < 8;
  const directionComposition = window.GARDARI_HUB_CONTENT.features?.directionComposition === true;
  const homeButtonsEnabled = window.GARDARI_HUB_CONTENT.features?.homeButtons === true;
  const introNextEnabled = homeButtonsEnabled && window.GARDARI_HUB_CONTENT.features?.introNext === true;

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
  const phoneMedia = window.GARDARI_HUB_LAYOUT.media;
  const isDesktopMatrix = () => window.GARDARI_HUB_LAYOUT.isDesktopPilot();
  const isMatrixNavigation = () => window.GARDARI_HUB_LAYOUT.isMatrixNavigation();
  const originalWheelLabel = wheel.getAttribute("aria-label");
  let phoneUtility = null;
  let chosen = Math.max(0, directions.findIndex(item => item.number ===
    (location.hash === "#homo-cogitans" && hasHomoCogitans ? "0.8" : "0.1")));
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
    if (isDesktopMatrix()) {
      orbitLabelNodes.forEach((name, index) => {name.style.removeProperty('--orbit-label-scale'); orbitLabelScales[index] = '1.0000';});
      buttons.forEach(button => button.classList.remove('is-top'));
      return;
    }
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
      if (isDesktopMatrix()) {
        button.style.removeProperty("left"); button.style.removeProperty("top");
      } else {
        button.style.left = (50 + Math.cos(angle) * (window.GARDARI_HUB_LAYOUT.isCompact() ? 45 : 40.7)) + "%";
        button.style.top = (50 + Math.sin(angle) * (window.GARDARI_HUB_LAYOUT.isCompact() ? 45 : 40.7)) + "%";
      }
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
    buttons.forEach((button, i) => button.classList.toggle("is-top", !isDesktopMatrix() && i === turn.index));
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
    const instant = immediate || isMatrixNavigation() || reducedMotion.matches || !wheelVisible || document.hidden;
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
    if (!isDesktopMatrix()) {
      buttons[i].style.left = (50 + Math.cos(angle) * (window.GARDARI_HUB_LAYOUT.isCompact() ? 45 : 40.7)) + "%";
      buttons[i].style.top = (50 + Math.sin(angle) * (window.GARDARI_HUB_LAYOUT.isCompact() ? 45 : 40.7)) + "%";
    }
    buttons[i].setAttribute("aria-label", item.number + " " + item.title);
    buttons[i].dataset.direction = item.number;
    buttons[i].querySelector(".wheel-node-number").textContent = item.number;
    const name = buttons[i].querySelector(".wheel-node-name");
    renderNavigationCaption(name, item.short);

  });

  function resizeParticleCanvas() {
    if (!particleContext) return;
    drawNavigationPositions();
    if (isMatrixNavigation()) return;
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
    if (isMatrixNavigation()) return;
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
    if (isMatrixNavigation() || event.pointerType === "touch") return;
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
    if (heading.dataset.tabletFontFit) {heading.style.removeProperty('font-size');delete heading.dataset.tabletFontFit;}
    heading.style.removeProperty('--phone-heading-size');
    heading.style.removeProperty('--phone-heading-tracking');
    if (!window.GARDARI_HUB_LAYOUT.isCompact()) return;
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
    if (longest > formerBudget && Number.isFinite(requested)) {
      const size = (requested * formerBudget / longest).toFixed(4) + 'px';
      heading.style.setProperty('--phone-heading-size', size);
      if (window.GARDARI_HUB_LAYOUT.isTablet()) {heading.style.setProperty('font-size',size,'important');heading.dataset.tabletFontFit='true';}
    }
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

  function alignSidebarFirstParagraph(scope, copy, first) {
    if (!copy || !first) return;
    if (!window.GARDARI_HUB_LAYOUT.isSidebar()) {copy.style.removeProperty('--sidebar-copy-gap');return;}
    const ink = document.createElement('canvas').getContext('2d');
    const style = getComputedStyle(first);
    ink.font = [style.fontStyle,style.fontWeight,style.fontSize,style.fontFamily].join(' ');
    // Measure the first rendered line, including punctuation and bold opening labels.
    let ascent=0, lineTop=null;
    const measureRoot=first.querySelector('.intro-type-ghost')||first;
    const walker=document.createTreeWalker(measureRoot,NodeFilter.SHOW_TEXT);
    let textNode, finished=false;
    while(!finished && (textNode=walker.nextNode())) {
      if(textNode.parentElement.closest('.visually-hidden'))continue;
      if(measureRoot===first && textNode.parentElement.closest('[aria-hidden="true"]'))continue;
      const textStyle=getComputedStyle(textNode.parentElement);
      ink.font=[textStyle.fontStyle,textStyle.fontWeight,textStyle.fontSize,textStyle.fontFamily].join(' ');
      for(let index=0;index<textNode.length;index++) {
        const range=document.createRange();range.setStart(textNode,index);range.setEnd(textNode,index+1);
        const rect=range.getBoundingClientRect();if(rect.width<.01)continue;
        if(lineTop===null)lineTop=rect.top;
        if(rect.top>lineTop+2){finished=true;break;}
        ascent=Math.max(ascent,ink.measureText(textNode.data[index]).actualBoundingBoxAscent||0);
      }
    }
    ascent=ascent||parseFloat(style.fontSize)*.72;
    const marker = document.createElement('span'); marker.setAttribute('aria-hidden','true');
    marker.style.cssText='display:inline-block;width:0;height:0;padding:0;margin:0;border:0;vertical-align:baseline;line-height:0';
    first.prepend(marker);
    const inkTop = marker.getBoundingClientRect().top - ascent;
    marker.remove();
    const matrixBottom = document.getElementById('gardari-wheel').getBoundingClientRect().bottom;
    const gap = Math.max(0,(parseFloat(getComputedStyle(copy).marginTop)||0)+matrixBottom-inkTop-scope.scrollTop);
    const pixels=gap.toFixed(4)+'px';
    if(copy.style.getPropertyValue('--sidebar-copy-gap')!==pixels)copy.style.setProperty('--sidebar-copy-gap',pixels);
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
    const mobile = window.GARDARI_HUB_LAYOUT.isCompact();
    const card = mobile ? scope.querySelector('.mobile-card') || scope : scope;
    const horizontal = Math.max(0, mobile ? photoBox.left - titleBox.right : titleBox.left - photoBox.right);
    if (mobile) {
      const radius = photoBox.width / 2 + card.getBoundingClientRect().right - photoBox.right;
      scope.style.setProperty('--phone-card-corner', radius.toFixed(4) + 'px');
      const contactsBody = scope.querySelector('.mobile-contacts-body');
      if (contactsBody) contactsBody.style.setProperty('--contacts-group-right-air', getComputedStyle(card).paddingRight);
      if (scope.style.getPropertyValue('--photo-copy-gap') !== '14px') scope.style.setProperty('--photo-copy-gap', '14px');
      if (first) {alignSidebarFirstParagraph(scope,copy,first);wrapPhonePhoto(photo,first);}
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
    if (!window.GARDARI_HUB_LAYOUT.isCompact()) {
      keys.forEach(key => synthesis.style.removeProperty(key));
      return;
    }
    const photoBox = photo.getBoundingClientRect(), box = synthesis.getBoundingClientRect();
    // Row boxes and computed fill metrics stay fixed while the fill itself folds.
    // Anchor the white halo to the first and last stripe centres, not line-box edges.
    const stripes = Array.from(list.children).map(row => {
      const fill = row.querySelector('.author-discipline-fill');
      if (!fill) return null;
      const rowBox = row.getBoundingClientRect(), style = getComputedStyle(fill);
      const height = parseFloat(style.height) || 0;
      return {top:rowBox.top - box.top, center:rowBox.top - box.top + (parseFloat(style.marginTop) || 0) + height / 2, height};
    }).filter(Boolean);
    if (!stripes.length) return;
    const first = stripes[0], last = stripes[stripes.length - 1];
    const step = stripes.length > 1 ? stripes[1].top - first.top : 0;
    const halo = Math.max(0, step - first.height);
    const span = last.center - first.center;
    const lower = scope.querySelector('.panel-cta');
    const fallback = (photoBox.width + (lower?.offsetWidth || photoBox.width)) / 2;
    const size = span > 2 * halo ? span - 2 * halo : fallback;
    const values = [photoBox.right - size - box.left,
      (first.center + last.center - size) / 2,
      size, halo];
    keys.forEach((key, index) => {
      const value = values[index].toFixed(4) + 'px';
      if (synthesis.style.getPropertyValue(key) !== value) synthesis.style.setProperty(key, value);
    });
  }

  // Contact stripes start at lowercase x-height and extend down to the underline.
  function alignMobileContactRules(scope) {
    if (!isMatrixNavigation() || scope?.dataset.contactPage !== 'true') return;
    const ink = document.createElement('canvas').getContext('2d');
    if (!ink) return;
    // Reserve one shared label column using natural text metrics, independent of prior widths.
    const contactsBody = scope.querySelector('.mobile-contacts-body');
    const labelWidths = Array.from(scope.querySelectorAll('.mobile-contact-label')).map(label => {
      const style = getComputedStyle(label);
      ink.font = [style.fontStyle, style.fontWeight, style.fontSize, style.fontFamily].join(' ');
      let text = label.textContent.trim();
      if (style.textTransform === 'uppercase') text = text.toLocaleUpperCase('ru');
      else if (style.textTransform === 'lowercase') text = text.toLocaleLowerCase('ru');
      text += ':';
      return ink.measureText(text).width + (parseFloat(style.letterSpacing) || 0) * text.length;
    });
    if (contactsBody && labelWidths.length) {
      const measured = Math.max(...labelWidths);
      // A small desktop clearance prevents the widest label and its colon wrapping.
      const width = (isDesktopMatrix() ? Math.ceil(measured) + 1 : measured).toFixed(4) + 'px';
      if (contactsBody.style.getPropertyValue('--contacts-label-width') !== width)
        contactsBody.style.setProperty('--contacts-label-width', width);
    }
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
    const column = window.GARDARI_HUB_LAYOUT.isCompact()
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
    if (window.GARDARI_HUB_LAYOUT.isCompact()) {
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
    // Desktop: retain accepted typography wherever it already fits the word column.
    // Only an overflowing lead receives the smallest necessary font reduction.
    // Reset only our own temporary font override, including on compact layouts.
    if (lead.dataset.desktopFontFit) {
      lead.style.removeProperty('font-size');
      delete lead.dataset.desktopFontFit;
    }
    if (window.GARDARI_HUB_LAYOUT.isCompact()) { clearFit(); return; }
    {
      const copy = lead.querySelector('.intro-type-ghost') || lead;
      const availableHeight = list.getBoundingClientRect().height;
      const baseSize = parseFloat(getComputedStyle(lead).fontSize);
      const fits = () => {
        const measureRange = document.createRange(); measureRange.selectNodeContents(copy);
        const rows = [];
        for (const rect of measureRange.getClientRects()) {
          if (rect.width > 0 && rect.height > 0 && !rows.some(top => Math.abs(top - rect.top) < .5)) rows.push(rect.top);
        }
        const copyStyle = getComputedStyle(lead);
        ink.font = [copyStyle.fontStyle, copyStyle.fontWeight, copyStyle.fontSize, copyStyle.fontFamily].join(' ');
        const bounds = ink.measureText(copy.textContent);
        const minimumLine = Math.max(parseFloat(copyStyle.fontSize) * 1.02,
          (bounds.actualBoundingBoxAscent || 0) + (bounds.actualBoundingBoxDescent || 0) + 1.5);
        return rows.length > 0 && rows.length * minimumLine <= availableHeight;
      };
      if (baseSize > 0 && availableHeight > 0 && !fits()) {
        let low = Math.min(baseSize, 16), high = baseSize;
        lead.style.setProperty('font-size', low + 'px', 'important');
        if (fits()) {
          for (let attempt = 0; attempt < 9; attempt++) {
            const middle = (low + high) / 2;
            lead.style.setProperty('font-size', middle + 'px', 'important');
            if (fits()) low = middle; else high = middle;
          }
          const fittedSize = Math.floor(low * 100) / 100;
          lead.style.setProperty('font-size', fittedSize + 'px', 'important');
          lead.dataset.desktopFontFit = String(fittedSize);
        } else {
          // Never force illegibly small text at an unexpected width.
          lead.style.removeProperty('font-size');
        }
      }
    }
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
      const mobile = window.GARDARI_HUB_LAYOUT.isCompact();
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

  // A phone-only utility page leaves the eight canonical directions intact.
  function mobileContactsMarkup(item) {
    const fieldPrefix = 'd' + String(item.number).replace('.', '') + '-';
    const heading = item.head.map((line, index) => '<span class="panel-heading-line" data-hub-text="' + fieldPrefix + 'head' + index + '">' + escapeHtml(line) + '</span>').join(' ');
    const groups = item.groups.map(group => '<section class="mobile-contact-group" data-contact-group="' + escapeHtml(group.id) + '">' +
      '<h3 data-hub-text="' + fieldPrefix + 'group-' + escapeHtml(group.id) + '"><span>' + escapeHtml(group.title) + '</span></h3>' +
      '<div class="mobile-contact-list">' + group.items.map(entry => {
        const key = group.id + '.' + entry.id, field = fieldPrefix + group.id + '-' + entry.id;
        const external = /^https?:\/\//.test(entry.url) ? ' target="_blank" rel="noopener noreferrer"' : '';
        return '<a class="mobile-contact-link" data-mobile-contact="' + escapeHtml(key) + '" href="' + escapeHtml(entry.url) + '"' + external + '>' +
          '<span class="mobile-contact-label" data-hub-text="' + field + '-label">' + escapeHtml(entry.label) + '</span>' +
          '<span class="mobile-contact-value" data-hub-text="' + field + '-text">' + escapeHtml(entry.text) + '</span><span class="mobile-contact-fill" aria-hidden="true"></span></a>';
      }).join('') + '</div></section>').join('');
    const actionLabel = item.action || 'В РАЗДЕЛ 0.1 ДЕНИС ГАРДАРИ';
    const action = item.url
      ? '<a class="mobile-contacts-back" data-hub-text="' + fieldPrefix + 'action" href="' + escapeHtml(item.url) + '">' + escapeHtml(actionLabel) + '</a>'
      : '<button type="button" class="mobile-contacts-back" data-hub-text="' + fieldPrefix + 'action" data-phone-contact-action="back">' + escapeHtml(actionLabel) + '</button>';
    const topAttributes = homeButtonsEnabled
      ? ' data-hub-home="true" data-tooltip="В раздел 0.1 — Денис Гардари" aria-label="В раздел 0.1 — Денис Гардари" aria-controls="direction-panel"'
      : ' data-tooltip="Наверх к меню" aria-label="Наверх к меню" aria-controls="gardari-wheel"';
    return '<div class="mobile-card" role="region" aria-label="' + escapeHtml(item.title) + '">' +
      '<div class="panel-visual-row"><div class="panel-circle panel-image-frame"><div class="photo-reveal-stage">' +
      '<img data-hub-image="contacts" src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.imageAlt) + '" style="object-position:' + escapeHtml(item.imagePosition) + ';filter:url(#hub-warm-mono)"></div><span class="photo-reveal-cover" aria-hidden="true"></span></div>' +
      '<div class="panel-visual-title"><div class="panel-context"><span>' + escapeHtml(item.number) + '</span><span data-hub-text="' + fieldPrefix + 'category">' + escapeHtml(item.category) + '</span></div>' +
      '<h2 data-hub-text="' + fieldPrefix + 'heading">' + heading + '</h2>' +
      '<span class="panel-heading-rule hub-line" aria-hidden="true"></span>' +
      '<span class="panel-info-eyebrow desktop-contacts-triad" data-hub-text="' + fieldPrefix + 'subtitle">' + escapeHtml(item.subtitle || '') + '</span></div></div>' +
      '<div class="mobile-contacts-body">' + groups + '</div></div>' +
      '<span class="mobile-panel-number" aria-label="Раздел ' + escapeHtml(item.number) + '">' + escapeHtml(item.number) + '</span>' +
      '<div class="mobile-contacts-actions">' + action +
      '<button type="button" class="mobile-contacts-top" data-phone-contact-action="top"' + topAttributes + '>' +
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
      '<span class="mobile-panel-number' + (item.number === '0.1' ? ' mobile-panel-number--brand' : '') + '" aria-label="Раздел ' + escapeHtml(item.number) + '">' + escapeHtml(item.number) + '</span>';
    if (item.number === "0.1") {
      const authorButtonAttributes = introNextEnabled
        ? 'data-hub-next="true" data-tooltip="Следующий раздел" aria-label="Следующий раздел" aria-controls="direction-panel"'
        : homeButtonsEnabled
          ? 'data-hub-home="true" data-tooltip="В раздел 0.1 — Денис Гардари" aria-label="В раздел 0.1 — Денис Гардари" aria-controls="direction-panel"'
        : aboutEnabled
          ? 'data-tooltip="Подробнее" aria-label="Перейти к подробностям обо мне" aria-controls="about-journey" aria-expanded="' + String(!aboutJourney.hidden) + '"'
          : 'data-tooltip="Концепт Бюро" aria-label="Перейти к разделу 0.2" aria-controls="direction-panel"';
      const authorChevron = homeButtonsEnabled ? 'm5 15 7-7 7 7' : aboutEnabled ? 'm5 9 7 7 7-7' : 'm9 5 7 7-7 7';
      return card +
        '<div id="hub-contact-links" class="panel-contact-row" role="group" aria-label="' + (aboutEnabled ? 'Контакты и подробности об авторе' : 'Контакты и переход к следующему разделу') + '">' +
          authorContacts.map(renderContact).join('') +
          '<button type="button" class="panel-cta panel-cta--author" ' + authorButtonAttributes + '>' +
            '<svg class="panel-cta-chevron" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="' + authorChevron + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"></path></svg>' +
          '</button></div>';
    } else {
      const linkProps = 'href="' + escapeHtml(item.url) + '" target="_blank" rel="noopener noreferrer"';
      const ctaProps = homeButtonsEnabled
        ? 'href="#main" data-hub-home="true" data-tooltip="В раздел 0.1 — Денис Гардари" aria-controls="direction-panel"'
        : linkProps;
      const ctaLabel = homeButtonsEnabled ? 'В раздел 0.1 — Денис Гардари' : item.action;
      const ctaChevron = homeButtonsEnabled ? 'm5 15 7-7 7 7' : 'm9 5 7 7-7 7';
      return card +
        '<div class="panel-route-row" role="group" aria-label="Переход в раздел ' + escapeHtml(item.short) + '">' +
          '<a class="panel-route-pill" ' + linkProps + '>' + escapeHtml(item.action) + '</a>' +
          '<a class="panel-cta panel-cta--route" ' + ctaProps + ' aria-label="' + escapeHtml(ctaLabel) + '">' +
            '<svg class="panel-cta-chevron" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="' + ctaChevron + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"></path></svg></a>' +
        '</div>';
    }
  }

  // The same eight canonical controls become phone tiles; utilities are separate actions.
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
    const contacts = utility('mobile-contact-tile', contactsNumber, 'Контакты\nдля связи');
    contacts.addEventListener('click', event => {
      if (!isMatrixNavigation() || event.defaultPrevented) return;
      event.preventDefault();
      openMobileContacts();
    });
    // History before the eighth direction retains the former ninth Telegram tile.
    if (showLegacyTelegram) {
      const telegram = utility('mobile-telegram-tile', '0.9', 'Телеграм\nканал', 'https://t.me/gardariart');
      telegram.addEventListener('click', event => {
        if (!isMatrixNavigation() || event.defaultPrevented) return;
        phoneUtility = 'telegram'; syncPhoneNavigationState();
      });
    }
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
      if (!isMatrixNavigation()) return;
      records.forEach(({face, outline, mask, body}) => {
        // Layout metrics stay stable while the whole control is visually pressed.
        const style = getComputedStyle(face), badgeStyle = getComputedStyle(face.querySelector('.wheel-node-number'));
        const box = {width:parseFloat(style.width) || face.offsetWidth, height:parseFloat(style.height) || face.offsetHeight};
        if (box.width < 1 || box.height < 1) return;
        const badge = {left:parseFloat(badgeStyle.left) || 0, top:parseFloat(badgeStyle.top) || 0,
          width:parseFloat(badgeStyle.width) || 0, height:parseFloat(badgeStyle.height) || 0};
        const border = side => Math.max(0, parseFloat(style['border' + side + 'Width']) || 0);
        const bL = border('Left'), bR = border('Right'), bT = border('Top'), bB = border('Bottom');
        const stroke = ['none', 'hidden'].includes(style.borderTopStyle) ? 0 : bT;
        const edge = stroke / 2, right = box.width - edge, bottom = box.height - edge;
        const normal = Math.max(1, Math.min(parseFloat(style.borderTopRightRadius) || 12, Math.min(box.width, box.height) / 3));
        const radius = Math.max(0, normal - edge), notch = badge.width / 2 + 6.5 + edge;
        const cx = bL + badge.left + badge.width / 2, cy = bT + badge.top + badge.height / 2, sum = notch + radius;
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
    const phone = isMatrixNavigation();
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
    wheel.setAttribute('aria-label', phone
      ? (showLegacyTelegram ? 'Семь разделов, контакты и Телеграм-канал' : 'Восемь разделов и контакты')
      : originalWheelLabel);
    window.dispatchEvent(new CustomEvent('hub:mobile-ui-updated'));
  }

  function syncPhonePanelControls() {
    const item = directions[chosen];
    const wordContacts = panel.querySelector('.mobile-word-cta[data-phone-contacts]');
    if (wordContacts) wordContacts.setAttribute('href', phoneMedia.matches ? '#contacts' : '#hub-contact-links');
    const cta = panel.querySelector('.panel-cta');
    if (!cta || !item) return;
    const path = cta.querySelector('.panel-cta-chevron path');
    if (homeButtonsEnabled) {
      const next = introNextEnabled && item.number === '0.1';
      if (next) { cta.dataset.hubNext = 'true'; delete cta.dataset.hubHome; }
      else { cta.dataset.hubHome = 'true'; delete cta.dataset.hubNext; }
      delete cta.dataset.mobileTop; delete cta.dataset.mobileNext;
      const label = next ? 'Следующий раздел' : 'В раздел 0.1 — Денис Гардари';
      cta.setAttribute('aria-label', label);
      cta.setAttribute('aria-controls', 'direction-panel');
      cta.setAttribute('data-tooltip', label);
      cta.removeAttribute('aria-expanded');
      path?.setAttribute('d', 'm5 15 7-7 7 7');
      if (cta.tagName === 'A') {cta.setAttribute('href', '#main'); cta.removeAttribute('target'); cta.removeAttribute('rel');}
    } else if (phoneMedia.matches) {
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
    if (window.GARDARI_HUB_LAYOUT.isCompact() || window.innerWidth <= 1130) {
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
    delete panel.dataset.contactPage;
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
    if (!isMatrixNavigation() || !item) return;
    if (panelScrollTimer !== null) window.clearTimeout(panelScrollTimer);
    panelScrollTimer = null; phoneUtility = 'contacts';
    disposeWordBlockMotion(); disposeHeadingMotion(); disposePanelAppearance(); disposeHeadingRule();
    panel.dataset.contactPage = 'true';
    panel.dataset.direction = item.number; panel.innerHTML = mobileContactsMarkup(item);
    if (aboutJourney) aboutJourney.hidden = true;
    syncPhoneNavigationState();
    disposeHeadingMotion = attachHeadingMotion(panel.querySelector('.panel-visual-title h2'));
    alignAuthorComposition(panel); disposePanelAppearance = attachPanelAppearance(panel);
    disposeHeadingRule = attachHeadingRule(panel.querySelector('.panel-visual-title'));
    if (location.hash !== '#contacts') history.replaceState(null, '', location.pathname + location.search + '#contacts');
    window.dispatchEvent(new CustomEvent('hub:mobile-ui-updated', {detail:{phone:phoneMedia.matches, number:item.number}}));
    if (!immediate && phoneMedia.matches) panelScrollTimer = setTimeout(() => {
      panelScrollTimer = null;
      if (phoneMedia.matches && panel.dataset.contactPage === 'true') window.GARDARI_HUB_LAYOUT.scrollPanelTop(reducedMotion.matches ? 'auto' : 'smooth');
    }, 30);
  }

  function scrollPhoneToMenu() {
    if (panelScrollTimer !== null) window.clearTimeout(panelScrollTimer);
    panelScrollTimer = null;
    window.GARDARI_HUB_LAYOUT.scrollTop('instant');
  }

  function goHome() {
    const index = directions.findIndex(item => item.number === '0.1');
    if (index < 0) return;
    if (panelScrollTimer !== null) window.clearTimeout(panelScrollTimer);
    panelScrollTimer = null;
    if (panel.dataset.direction !== '0.1') select(index, true);
    window.GARDARI_HUB_LAYOUT.scrollTop('instant');
  }

  // The author follows the current editable order instead of a fixed section number.
  function goNext() {
    const index = directions.findIndex(item => item.number === '0.1');
    if (index < 0 || directions.length < 2) return;
    if (panelScrollTimer !== null) window.clearTimeout(panelScrollTimer);
    panelScrollTimer = null;
    select((index + 1) % directions.length, true);
    window.GARDARI_HUB_LAYOUT.scrollTop('instant');
  }

  panel.addEventListener("click", event => {
    const target = event.target;
    if (event.defaultPrevented || !(target instanceof Element)) return;
    const next = target.closest('[data-hub-next]');
    if (introNextEnabled && next && panel.contains(next)) {
      event.preventDefault(); goNext(); return;
    }
    const home = target.closest('[data-hub-home]');
    if (homeButtonsEnabled && home && panel.contains(home)) {
      event.preventDefault(); goHome(); return;
    }
    const contactAction = target.closest('[data-phone-contact-action]');
    if (isMatrixNavigation() && contactAction && panel.contains(contactAction)) {
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
    if (panel.dataset.contactPage === 'true') clearContactsFragment();
    if (directions[index].number === '0.8') {
      if (location.hash !== '#homo-cogitans') history.replaceState(null, '', location.pathname + location.search + '#homo-cogitans');
    } else if (location.hash === '#homo-cogitans') {
      history.replaceState(null, '', location.pathname + location.search);
    }
    chosen = index;
    phoneUtility = null;
    turnNavigationTo(index, !animateNavigation || isMatrixNavigation());
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
        if (chosen === index && phoneMedia.matches) window.GARDARI_HUB_LAYOUT.scrollPanelTop(reducedMotion.matches ? "auto" : "smooth");
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
    if (isDesktopMatrix()) {updateOrbitLabelEmphasis(); return;}
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
    if (isMatrixNavigation()) {endOrbit(); return;}
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
    if (!isMatrixNavigation() && wheelVisible && !document.hidden && !reducedMotion.matches) frameId = requestAnimationFrame(animate);
  }
  function beginOrbit() {
    if (isMatrixNavigation() || frameId !== null || !wheelVisible || document.hidden || reducedMotion.matches) return;
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
    if (event.detail?.number === contactsNumber) {openMobileContacts(true); return;}
    const index = directions.findIndex(item => item.number === event.detail?.number);
    select(index, true, event.detail?.animate === true);
  });
  function revealFragment() {
    if (location.hash === '#homo-cogitans' && hasHomoCogitans) {
      select(directions.findIndex(item => item.number === '0.8'), true); return;
    }
    if (location.hash === '#contacts' && isMatrixNavigation()) {
      openMobileContacts(true); requestAnimationFrame(() => window.GARDARI_HUB_LAYOUT.scrollPanelTop()); return;
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
    const hadContacts = panel.dataset.contactPage === 'true';
    phoneUtility = hadContacts && isMatrixNavigation() ? 'contacts' : null;
    if (hadContacts && !isMatrixNavigation()) {clearContactsFragment(); renderPanel(chosen);}
    if (isMatrixNavigation()) {
      endOrbit(); pointer.active = false; pointer.targetX = pointer.targetY = pointer.x = pointer.y = pointer.strength = 0;
      nextWordAt = Infinity;
    } else if (wheelVisible && !document.hidden && !reducedMotion.matches) beginOrbit();
    syncPhoneNavigationState(); syncPhonePanelControls(); alignAuthorComposition(panel);
  });
  select(chosen, true);
  document.body.classList.add('phone-ui-ready');
  if (isMatrixNavigation()) endOrbit();
  revealFragment();
  window.addEventListener("hub:field-redraw", () => drawParticleField(performance.now()));
  resizeParticleCanvas();
  drawOrbit();

})();

/* A short retained state makes quick phone taps visible without delaying actions. */
(() => {
  const phone = window.GARDARI_HUB_LAYOUT.media;
  const matrixNavigation = () => window.GARDARI_HUB_LAYOUT.isMatrixNavigation();
  const selector = '#gardari-wheel .mobile-matrix-tile,#direction-panel .mobile-word-cta,#direction-panel .panel-cta,#direction-panel .contact-icon,#direction-panel .panel-route-pill,#direction-panel .mobile-contacts-actions :is(button,a)';
  const timers = new Map();
  const minimumPress = 120;
  let pointer = null, keyboard = null;
  function control(event) {
    if (!matrixNavigation() || !(event.target instanceof Element)) return null;
    const node = event.target.closest(selector);
    return node && !node.disabled && node.getAttribute('aria-disabled') !== 'true' ? node : null;
  }
  function held(node) {return pointer?.node === node || keyboard?.node === node;}
  function press(node) {
    clearTimeout(timers.get(node)); timers.delete(node);
    node.classList.add('is-phone-pressed');
  }
  function release(state, cancel = false) {
    if (!state || held(state.node)) return;
    const node = state.node;
    clearTimeout(timers.get(node)); timers.delete(node);
    const remaining = cancel ? 0 : Math.max(0, minimumPress - (performance.now() - state.started));
    if (!remaining) {node.classList.remove('is-phone-pressed'); return;}
    timers.set(node, setTimeout(() => {
      timers.delete(node);
      if (!held(node)) node.classList.remove('is-phone-pressed');
    }, remaining));
  }
  function endPointer(cancel = false) {
    const old = pointer; pointer = null; release(old, cancel);
  }
  function endKeyboard(cancel = false) {
    const old = keyboard; keyboard = null; release(old, cancel);
  }
  function clearAll() {
    endPointer(true); endKeyboard(true);
    timers.forEach((timer, node) => {clearTimeout(timer); node.classList.remove('is-phone-pressed');});
    timers.clear();
  }
  document.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return;
    const node = control(event); if (!node) return;
    endPointer(true);
    pointer = {node, id:event.pointerId, x:event.clientX, y:event.clientY, started:performance.now()};
    press(node);
  }, {capture:true, passive:true});
  document.addEventListener('pointermove', event => {
    if (pointer && pointer.id === event.pointerId && Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y) > 10) endPointer(true);
  }, {capture:true, passive:true});
  document.addEventListener('pointerup', event => {
    if (pointer?.id === event.pointerId) endPointer();
  }, {capture:true, passive:true});
  document.addEventListener('pointercancel', event => {
    if (pointer?.id === event.pointerId) endPointer(true);
  }, {capture:true, passive:true});
  document.addEventListener('keydown', event => {
    if (event.repeat || (event.key !== 'Enter' && event.key !== ' ')) return;
    const node = control(event);
    if (!node || (event.key === ' ' && node.tagName !== 'BUTTON' && node.getAttribute('role') !== 'button')) return;
    endKeyboard(true); keyboard = {node, key:event.key, started:performance.now()}; press(node);
  }, true);
  document.addEventListener('keyup', event => {
    if (keyboard?.key === event.key) endKeyboard();
  }, true);
  document.addEventListener('focusout', event => {
    if (keyboard?.node === event.target) endKeyboard(true);
  }, true);
  document.addEventListener('click', event => {
    if (event.detail !== 0) return;
    const node = control(event); if (!node || held(node)) return;
    press(node); release({node, started:performance.now()});
  }, true);
  window.addEventListener('scroll', () => {if (pointer) endPointer(true);}, {capture:true,passive:true});
  window.addEventListener('blur', clearAll);
  document.addEventListener('visibilitychange', () => {if (document.hidden) clearAll();});
  phone.addEventListener('change', () => {if (!matrixNavigation()) clearAll();});
})();


/* Candidate-only outline and placement; no source data, editor state or history writes. */
(() => {
  'use strict';
  const root = document.documentElement;
  const panel = document.getElementById('direction-panel');
  const grid = document.querySelector('.hub-grid');
  const svgNS = 'http://www.w3.org/2000/svg';
  const contactInk = document.createElement('canvas').getContext('2d');
  let scheduled = false;
  let observedCard = null;
  const resize = new ResizeObserver(schedule);
  const n = value => Number(value.toFixed(4));
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; update(); });
  }
  function update() {
    if (root.dataset.hubLayout !== 'desktop' || root.dataset.hubDesktop !== 'true') {
      resize.disconnect();
      observedCard = null;
      grid.style.removeProperty('--pilot-nav-offset');
      return;
    }
    const card = panel.querySelector('.mobile-card');
    const photo = card?.querySelector('.panel-circle');
    if (!card || !photo) return;
    let outline = card.querySelector('.desktop-card-outline');
    if (!outline) {
      outline = document.createElementNS(svgNS, 'svg');
      outline.classList.add('desktop-card-outline');
      outline.setAttribute('aria-hidden', 'true');
      outline.setAttribute('focusable', 'false');
      outline.setAttribute('preserveAspectRatio', 'none');
      outline.append(document.createElementNS(svgNS, 'path'));
      card.prepend(outline);
    }
    const box = card.getBoundingClientRect(), image = photo.getBoundingClientRect();
    const width = box.width, height = box.height;
    if (width < 1 || height < 1 || image.width < 1) return;
    const cx = image.left + image.width / 2 - box.left;
    const cy = image.top + image.height / 2 - box.top;
    const radius = image.width / 2 + 20;
    const corner = 12, edge = .5;
    // External tangencies join the photo circle to the straight top/left edges.
    const leftJoin = cy + Math.sqrt(Math.max(0, (radius + corner) ** 2 - (cx + corner - edge) ** 2));
    const topJoin = cx + Math.sqrt(Math.max(0, (radius + corner) ** 2 - (cy + corner - edge) ** 2));
    const leftTangent = {
      x: cx + (edge - corner - cx) * radius / (radius + corner),
      y: cy + (leftJoin - cy) * radius / (radius + corner)
    };
    const topTangent = {
      x: cx + (topJoin - cx) * radius / (radius + corner),
      y: cy + (edge - corner - cy) * radius / (radius + corner)
    };
    // Reuse the accepted number/notch relationship in the upper right corner.
    const badge = panel.querySelector('.mobile-panel-number')?.getBoundingClientRect();
    const badgeX = badge ? badge.left + badge.width / 2 - box.left : width - 12;
    const badgeY = badge ? badge.top + badge.height / 2 - box.top : 12;
    const notch = (badge?.width || 24) / 2 + 6.5 + edge;
    const topNotch = badgeX - Math.sqrt(Math.max(0, (notch + corner) ** 2 - (edge + corner - badgeY) ** 2));
    const rightNotch = badgeY + Math.sqrt(Math.max(0, (notch + corner) ** 2 - (width - edge - corner - badgeX) ** 2));
    const notchTopPoint = {
      x: badgeX + (topNotch - badgeX) * notch / (notch + corner),
      y: badgeY + (edge + corner - badgeY) * notch / (notch + corner)
    };
    const notchRightPoint = {
      x: badgeX + (width - edge - corner - badgeX) * notch / (notch + corner),
      y: badgeY + (rightNotch - badgeY) * notch / (notch + corner)
    };
    const d = [
      'M',n(topJoin),edge,'H',n(topNotch),
      'A',corner,corner,0,0,1,n(notchTopPoint.x),n(notchTopPoint.y),
      'A',n(notch),n(notch),0,0,0,n(notchRightPoint.x),n(notchRightPoint.y),
      'A',corner,corner,0,0,1,n(width-edge),n(rightNotch),
      'V',n(height-corner-edge),'Q',n(width-edge),n(height-edge),n(width-corner-edge),n(height-edge),
      'H',corner+edge,'Q',edge,n(height-edge),edge,n(height-corner-edge),
      'V',n(leftJoin),'A',corner,corner,0,0,0,n(leftTangent.x),n(leftTangent.y),
      'A',n(radius),n(radius),0,1,1,n(topTangent.x),n(topTangent.y),
      'A',corner,corner,0,0,0,n(topJoin),edge,'Z'
    ].join(' ');
    outline.setAttribute('viewBox', `0 0 ${n(width)} ${n(height)}`);
    if (outline.firstElementChild.getAttribute('d') !== d) outline.firstElementChild.setAttribute('d', d);
    card.dataset.desktopOutline = 'photo-and-number';
    card.dataset.desktopPhotoClearance = '20';
    const title = panel.querySelector('.panel-visual-title');
    const triad = title?.querySelector('.panel-info-eyebrow');
    if (triad) {
      const text = document.createRange();
      text.selectNodeContents(triad);
      const triadBox = text.getBoundingClientRect(), titleBox = title.getBoundingClientRect();
      title.style.setProperty('--pilot-rule-left', n(triadBox.left - titleBox.left) + 'px');
      title.style.setProperty('--pilot-rule-width', n(triadBox.width) + 'px');
    }
    // Contact headings use their actual glyph top, rather than empty line-box air.
    const paragraph = panel.querySelector('.panel-description-copy p:not(:empty),.mobile-contacts-body');
    if (paragraph) {
      let anchorTop = paragraph.getBoundingClientRect().top;
      const heading = panel.dataset.contactPage === 'true' ? paragraph.querySelector('h3') : null;
      if (heading && contactInk) {
        const style = getComputedStyle(heading), size = parseFloat(style.fontSize) || 27;
        let text = heading.textContent.trim();
        if (style.textTransform === 'lowercase') text = text.toLocaleLowerCase('ru');
        else if (style.textTransform === 'uppercase') text = text.toLocaleUpperCase('ru');
        contactInk.font = [style.fontStyle, style.fontWeight, style.fontSize, style.fontFamily].join(' ');
        const metrics = contactInk.measureText(text);
        const ascent = metrics.fontBoundingBoxAscent || metrics.emHeightAscent || size * .8;
        const descent = metrics.fontBoundingBoxDescent || metrics.emHeightDescent || size * .2;
        const lineHeight = parseFloat(style.lineHeight) || size * 1.2;
        anchorTop = heading.getBoundingClientRect().top + (lineHeight - ascent - descent) / 2 + ascent - (metrics.actualBoundingBoxAscent || size * .72);
      }
      const offset = Math.max(0, anchorTop - grid.getBoundingClientRect().top);
      const value = n(offset) + 'px';
      if (grid.style.getPropertyValue('--pilot-nav-offset') !== value) grid.style.setProperty('--pilot-nav-offset', value);
    }
    if (observedCard !== card) {
      resize.disconnect();
      [card,photo,panel.querySelector('.panel-visual-title')].filter(Boolean).forEach(element => resize.observe(element));
      observedCard = card;
    }
  }
  const content = new MutationObserver(schedule);
  content.observe(panel, {childList: true, subtree: true});
  window.addEventListener('resize', schedule, {passive:true});
  window.addEventListener('hub:layout-change', schedule);
  window.addEventListener('hub:mobile-ui-updated', schedule);
  panel.addEventListener('load', schedule, true);
  document.fonts?.ready.then(schedule);
  schedule();
})();

/* Confirm the large circle in the compact word stripes before leaving the section. */
(() => {
  if (!window.GARDARI_HUB_LAYOUT || window.GARDARI_HUB_CONTENT?.features?.adaptiveLayout !== true) return;
  // The local editor injects this bridge. Follow its existing trusted mode protocol.
  const authoringFrame = window.parent !== window &&
    ['localhost', '127.0.0.1', '::1', '[::1]'].includes(location.hostname) &&
    Boolean(document.querySelector('script[src="/bridge.js"]'));
  let editing = authoringFrame;
  const dialog = document.createElement('dialog');
  dialog.className = 'hub-exit-dialog';
  dialog.setAttribute('aria-labelledby', 'hub-exit-question');
  dialog.setAttribute('aria-describedby', 'hub-exit-description');
  dialog.innerHTML = '<p class="hub-exit-question" id="hub-exit-question"><span id="hub-exit-prefix"></span><span id="hub-exit-name"></span></p>' +
    '<p class="hub-exit-description" id="hub-exit-description">Откроется в новой вкладке.</p>' +
    '<div class="hub-exit-actions"><button type="button" class="hub-exit-choice hub-exit-no">Нет</button>' +
    '<a class="hub-exit-choice hub-exit-yes" target="_blank" rel="noopener noreferrer">Да</a></div>';
  document.body.append(dialog);
  const no = dialog.querySelector('.hub-exit-no');
  const yes = dialog.querySelector('.hub-exit-yes');
  let trigger = null;
  let previousRootOverflow = '';
  let previousPanelOverflow = '';
  let lockedPanel = null;
  let confirmedContact = null;
  let confirmedBypass = null;
  function close() { if (dialog.open) dialog.close(); }
  function open(link) {
    if (dialog.open || editing || !window.GARDARI_HUB_LAYOUT.isCompact()) return;
    const panel = document.getElementById('direction-panel');
    const item = window.GARDARI_HUB_CONTENT.directions.find(item => item.number === panel.dataset.direction);
    if (!item || !/^https?:$/.test(new URL(link.href).protocol)) return;
    trigger = link;
    const internal = link.hasAttribute('data-phone-contacts');
    dialog.querySelector('#hub-exit-prefix').textContent = internal ? 'Перейти на раздел ' : 'Перейти на страницу ';
    dialog.querySelector('#hub-exit-name').textContent = internal ? 'контактов?' : '«' + item.title + '»?';
    dialog.querySelector('#hub-exit-description').hidden = internal;
    if (internal) dialog.removeAttribute('aria-describedby');
    else dialog.setAttribute('aria-describedby', 'hub-exit-description');
    yes.href = link.href;
    if (internal) { yes.removeAttribute('target'); yes.removeAttribute('rel'); }
    else { yes.target = '_blank'; yes.rel = 'noopener noreferrer'; }
    previousRootOverflow = document.documentElement.style.overflow;
    previousPanelOverflow = panel.style.overflow;
    lockedPanel = panel;
    document.documentElement.style.overflow = 'hidden';
    panel.style.overflow = 'hidden';
    dialog.showModal();
    no.focus({preventScroll: true});
  }
  dialog.addEventListener('close', () => {
    document.documentElement.style.overflow = previousRootOverflow;
    if (lockedPanel) lockedPanel.style.overflow = previousPanelOverflow;
    lockedPanel = null;
    const contact = confirmedContact;
    confirmedContact = null;
    if (contact?.isConnected) {
      confirmedBypass = contact;
      try { contact.click(); }
      finally { confirmedBypass = null; }
    } else if (trigger?.isConnected) trigger.focus({preventScroll: true});
  });
  no.addEventListener('click', close);
  yes.addEventListener('click', event => {
    if (trigger?.hasAttribute('data-phone-contacts')) {
      event.preventDefault();
      confirmedContact = trigger;
    }
    close();
  });
  let backdropStart = false;
  const outside = event => {
    const r = dialog.getBoundingClientRect();
    return event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom;
  };
  dialog.addEventListener('pointerdown', event => { backdropStart = event.target === dialog && outside(event); });
  dialog.addEventListener('click', event => {
    if (backdropStart && event.target === dialog && outside(event)) close();
    backdropStart = false;
  });
  document.addEventListener('click', event => {
    if (event.defaultPrevented || !(event.target instanceof Element) || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('#direction-panel .mobile-word-cta');
    if (!link || editing || !window.GARDARI_HUB_LAYOUT.isCompact()) return;
    if (link === confirmedBypass) { confirmedBypass = null; return; }
    event.preventDefault();
    open(link);
  }, true);
  window.addEventListener('message', event => {
    if (!authoringFrame || event.source !== window.parent || event.origin !== location.origin) return;
    const message = event.data;
    if (!message || typeof message !== 'object') return;
    if (message.type === 'vmg:init') editing = message.editing !== false;
    else if (message.type === 'vmg:mode') editing = !!message.editing;
    else return;
    if (editing) close();
  });
  window.addEventListener('hub:select', close);
  window.addEventListener('hub:layout-change', () => {
    if (!window.GARDARI_HUB_LAYOUT.isCompact()) close();
  });
})();

}else{
// Paper-fold kinetics and ink metrics from the accepted Hub 4.1.
(() => {
  'use strict';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const metricCanvas = document.createElement('canvas').getContext('2d');
  const baselineStyle = 'display:inline-block;width:0;height:0;padding:0;margin:0;border:0;vertical-align:baseline;line-height:0';
  const noteSources = new WeakMap();
  function copySlice(source, start, end) {
    const walker = document.createTreeWalker(source,NodeFilter.SHOW_TEXT), nodes=[];
    let node,position=0;
    while ((node=walker.nextNode())) {nodes.push({node,start:position});position+=node.length;}
    const point = offset => {
      const item = [...nodes].reverse().find(item=>item.start<=offset);
      return [item.node,Math.min(item.node.length,offset-item.start)];
    };
    const range=document.createRange();range.selectNodeContents(source);
    range.setStart(...point(start));range.setEnd(...point(end));
    return range.cloneContents();
  }
  function paragraphCopy(fragment) {
    const source=document.createElement('div'), result=document.createDocumentFragment();
    source.append(fragment);
    const copy=source.textContent, breaks=[...copy.matchAll(/\n+/g)];
    let start=0;
    for (const boundary of [...breaks,{index:copy.length,0:''}]) {
      let from=start,to=boundary.index;
      while(from<to && /\s/.test(copy[from]))from++;
      while(to>from && /\s/.test(copy[to-1]))to--;
      if(to>from){const p=document.createElement('p');p.append(copySlice(source,from,to));result.append(p);}
      start=boundary.index+boundary[0].length;
    }
    return result;
  }
  function balanceNotes(notes) {
    const blocks=[...notes.querySelectorAll('.section-note')];
    if(blocks.length!==2)return;
    const compact=matchMedia('(max-width:680px)').matches;
    const signature=notes.offsetWidth+'|'+getComputedStyle(blocks[0].querySelector('p')).fontSize+'|'+compact;
    if(notes.dataset.balanceSignature===signature)return;
    if(!noteSources.has(notes)){
      const source=document.createElement('div');
      const originalSplit=blocks[0].textContent.length;
      blocks.forEach((block,index)=>{
        if(index)source.append(document.createTextNode('\n\n'));
        [...block.querySelectorAll('p')].forEach((paragraph,pIndex)=>{
          if(pIndex)source.append(document.createTextNode('\n\n'));
          [...paragraph.childNodes].forEach(node=>source.append(node.cloneNode(true)));
        });
      });
      noteSources.set(notes,{source,originalSplit});
    }
    const {source,originalSplit}=noteSources.get(notes),copy=source.textContent;
    const render=split=>{
      let end=split,start=split;
      while(end && /\s/.test(copy[end-1]))end--;
      while(start<copy.length && /\s/.test(copy[start]))start++;
      blocks[0].replaceChildren(paragraphCopy(copySlice(source,0,end)));
      blocks[1].replaceChildren(paragraphCopy(copySlice(source,start,copy.length)));
      return Math.abs(blocks[0].offsetHeight-blocks[1].offsetHeight);
    };
    let best=originalSplit,difference=render(best);
    if(!compact){
      const boundaries=[...copy.matchAll(/[.!?](?:[»”"])?\s+|\n+/g)].map(match=>match.index+match[0].length).filter(index=>copy.slice(index).trim());
      for(const split of boundaries){const delta=render(split);if(delta<difference){difference=delta;best=split;}}
    }
    render(best);notes.dataset.balanceSignature=signature;notes.dataset.balanceDifference=String(difference);
  }
  function setPixels(element, name, value) {
    const next = value.toFixed(4) + 'px';
    if (element.style.getPropertyValue(name) !== next) element.style.setProperty(name, next);
  }
  // Range rows locate the baselines; Canvas supplies the painted letter bounds,
  // including both lower text columns.
  function textInk(element) {
    if (!element?.getClientRects().length) return null;
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const rows = new Map();
    const range = document.createRange();
    let node, lastRect;
    while ((node = walker.nextNode())) {
      for (let index = 0; index < node.length; index++) {
        if (/\s/.test(node.data[index])) continue;
        range.setStart(node,index); range.setEnd(node,index+1);
        const rect = range.getBoundingClientRect();
        if (!rect.height) continue;
        const key = rect.top.toFixed(2);
        const row = rows.get(key) || {top:rect.top, text:''};
        row.text += node.data[index]; rows.set(key,row); lastRect = rect;
      }
    }
    if (!lastRect) return null;
    const probe = document.createElement('span');
    probe.setAttribute('aria-hidden','true'); probe.style.cssText = baselineStyle;
    element.append(probe);
    const baselineOffset = probe.getBoundingClientRect().top - lastRect.top;
    probe.remove();
    const style = getComputedStyle(element);
    metricCanvas.font = [style.fontStyle,style.fontWeight,style.fontSize,style.fontFamily].join(' ');
    let top = Infinity, bottom = -Infinity;
    for (const row of rows.values()) {
      const ink = metricCanvas.measureText(row.text);
      top = Math.min(top,row.top+baselineOffset-ink.actualBoundingBoxAscent);
      bottom = Math.max(bottom,row.top+baselineOffset+ink.actualBoundingBoxDescent);
    }
    const box = element.getBoundingClientRect();
    element.dataset.inkTopInset = (top-box.top).toFixed(4);
    element.dataset.inkBottomInset = (box.bottom-bottom).toFixed(4);
    return {top,bottom};
  }
  function notesInk(notes) {
    const bounds = [...notes.querySelectorAll('p')].map(textInk).filter(Boolean);
    return {top:Math.min(...bounds.map(box=>box.top)),bottom:Math.max(...bounds.map(box=>box.bottom))};
  }
  function alignFooterGap(scope) {
    const notes = scope?.querySelector('.section-notes');
    const footer = scope?.querySelector('.panel-contact-row,.panel-route-row');
    if (!notes || !footer || !notes.offsetWidth) return;
    const bounds = notesInk(notes);
    const gap = parseFloat(getComputedStyle(scope).getPropertyValue('--section-block-gap')) || 25;
    const inset = notes.getBoundingClientRect().bottom - bounds.bottom;
    setPixels(footer,'margin-top',gap-inset);
    notes.dataset.inkInset = inset.toFixed(4);
    footer.dataset.textGap = String(gap);
  }
  function stripeBounds(list) {
    const rows = [...list.children];
    const stripe = row => {
      const fill = row.querySelector('.author-discipline-fill');
      const style = getComputedStyle(fill);
      const top = row.getBoundingClientRect().top + parseFloat(style.marginTop);
      return {top,bottom:top+parseFloat(style.height)};
    };
    return {top:stripe(rows[0]).top,bottom:stripe(rows.at(-1)).bottom};
  }
  function alignSectionLayout(scope) {
    if (!scope?.offsetWidth) return;
    const gap = parseFloat(getComputedStyle(scope).getPropertyValue('--section-block-gap')) || 25;
    const header = scope.querySelector('.description-heading');
    const heading = scope.querySelector('.section-heading > span:last-child');
    const synthesis = scope.querySelector('.author-synthesis');
    if (synthesis) {
      balanceNotes(scope.querySelector('.section-notes'));
      const list = synthesis.querySelector('.author-disciplines');
      const lead = synthesis.querySelector('.panel-description-lead');
      const video = synthesis.querySelector('.section-video-preview');
      const compact = matchMedia('(max-width:680px)').matches;
      let stripes = stripeBounds(list);
      const field=synthesis.querySelector('.author-word-field');
      const fillStyle=getComputedStyle(list.querySelector('.author-discipline-fill'));
      const stripeHeight=parseFloat(fillStyle.height);
      const halo=Math.max(0,parseFloat(getComputedStyle(list).lineHeight)-stripeHeight)*2/3;
      const span=stripes.bottom-stripes.top-stripeHeight;
      const diameter=span-2*halo;
      setPixels(scope,'--section-video-size',diameter);
      setPixels(scope,'--section-video-top',stripes.top+stripeHeight/2+halo-field.getBoundingClientRect().top);
      setPixels(scope,'--section-video-halo',halo);
      setPixels(scope,'--section-video-right',halo+stripeHeight);
      setPixels(lead,'margin-top',0);
      let phrase = textInk(lead);
      if (compact) {
        setPixels(lead,'margin-top',gap-(list.getBoundingClientRect().bottom-stripes.bottom)-(phrase.top-lead.getBoundingClientRect().top));
      } else {
        setPixels(lead,'margin-top',stripes.top-list.getBoundingClientRect().top-(phrase.top-lead.getBoundingClientRect().top));
      }
      const title = textInk(heading);
      const oldPadding = parseFloat(getComputedStyle(header).paddingBottom);
      setPixels(header,'padding-bottom',oldPadding+gap-(stripeBounds(list).top-title.bottom));
      stripes = stripeBounds(list); phrase = textInk(lead);
      const rowBottom = Math.max(stripes.bottom,phrase.bottom,video.getBoundingClientRect().bottom);
      const notes = scope.querySelector('.section-notes');
      const blocks=[...notes.querySelectorAll('.section-note')];
      blocks.forEach(block=>block.style.removeProperty('margin-top'));
      if(compact){
        const previous=notesInk(blocks[0]),next=notesInk(blocks[1]);
        setPixels(blocks[1],'margin-top',gap-(next.top-previous.bottom));
      }
      const text = notesInk(notes);
      const inset = text.top-notes.getBoundingClientRect().top;
      setPixels(notes,'margin-top',gap-(synthesis.getBoundingClientRect().bottom-rowBottom)-inset);
      scope.dataset.blockGap = String(gap);
      video.dataset.stripeDiameter = diameter.toFixed(4);
      alignFooterGap(scope);
    } else if (scope.id === 'contacts') {
      const groups = [...scope.querySelectorAll('.contact-group')];
      const groupInk = group => {
        const boxes = [...group.querySelectorAll('h3,.contact-label,.contact-value')].map(textInk).filter(Boolean);
        return {top:Math.min(...boxes.map(box=>box.top)),bottom:Math.max(...boxes.map(box=>box.bottom))};
      };
      groups.slice(1).forEach((group,index) => {
          setPixels(group,'margin-top',0);
          const previous = groups[index];
          setPixels(group,'margin-top',gap-(previous.getBoundingClientRect().bottom-groupInk(previous).bottom)-(groupInk(group).top-group.getBoundingClientRect().top));
      });
      const title = textInk(heading);
      const first = groupInk(groups[0]);
      setPixels(header,'padding-bottom',parseFloat(getComputedStyle(header).paddingBottom)+gap-(first.top-title.bottom));
    }
  }
  function alignAuthorComposition(scope) {
    const field=scope.querySelector('.author-word-field'),list=field?.querySelector('.author-disciplines');
    if(!list)return;
    const width=field.getBoundingClientRect().width;
    list.style.width='100%';scope.style.setProperty('--word-block-width',width.toFixed(4)+'px');
    list.style.setProperty('--author-axis-column',width+'px');list.style.removeProperty('font-size');
    const ink=document.createElement('canvas').getContext('2d');
    const words=[...document.querySelectorAll('.author-discipline-word')].map(word=>word.textContent);
    let style=getComputedStyle(list),size=parseFloat(style.fontSize);
    // Keep the circle clear of the longest word, including at the tablet boundary.
    for(let attempt=0;attempt<8;attempt++){
      style=getComputedStyle(list);size=parseFloat(style.fontSize);
      ink.font=[style.fontStyle,style.fontWeight,style.fontSize,style.fontFamily].join(' ');
      const tracking=parseFloat(style.letterSpacing)||0;
      const longest=Math.max(...words.map(word=>ink.measureText(word).width+tracking*word.length));
      const step=parseFloat(style.lineHeight),stroke=parseFloat(style.webkitTextStrokeWidth)||0;
      const bounds=ink.measureText('семиотика');
      const stripe=bounds.actualBoundingBoxAscent+bounds.actualBoundingBoxDescent+stroke;
      const halo=Math.max(0,step-stripe)*2/3;
      const diameter=(list.children.length-1)*step-2*halo;
      const required=longest+size*.36+diameter+2*halo+stripe+4;
      if(required<=width+.5)break;
      list.style.fontSize=(size*width/required).toFixed(4)+'px';
    }
    style=getComputedStyle(list);ink.font=[style.fontStyle,style.fontWeight,style.fontSize,style.fontFamily].join(' ');
    const stroke=parseFloat(style.webkitTextStrokeWidth)||0,reference=ink.measureText('семиотика');
    const ascent=reference.actualBoundingBoxAscent||parseFloat(style.fontSize)*.54;
    const height=ascent+(reference.actualBoundingBoxDescent||0)+stroke;
    list.querySelectorAll('.author-discipline-word').forEach(word=>{
      const marker=document.createElement('span');marker.setAttribute('aria-hidden','true');marker.style.cssText=baselineStyle;
      word.append(marker);const top=marker.getBoundingClientRect().top-word.getBoundingClientRect().top-ascent-stroke/2;marker.remove();
      word.parentElement.style.setProperty('--word-fill-height',height+'px');
      word.parentElement.style.setProperty('--word-fill-top',Math.max(0,top)+'px');
    });
  }
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
      alignSectionLayout(scope);
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

  window.HubSectionMotion = {attach: attachWordBlockMotion, alignFooter: alignFooterGap, alignLayout: alignSectionLayout};
})();

// Circular opening, playback controls and progress follow the Platform's comments player.
(() => {
  'use strict';
  const triggers = [...document.querySelectorAll('.section-video-preview')];
  const dialog = document.getElementById('section-video-player');
  const view = dialog.querySelector('.section-video-view');
  const video = dialog.querySelector('video');
  const poster = dialog.querySelector('.section-video-poster');
  const title = dialog.querySelector('.section-video-title');
  const status = dialog.querySelector('.section-video-status');
  const toggle = dialog.querySelector('.section-video-toggle');
  const ring = dialog.querySelector('.section-video-progress');
  const progress = dialog.querySelector('progress');
  let origin = null, animation = null, closing = false, generation = 0, frame = 0, closeTimer = 0;
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const resize = () => {
    const field = document.querySelector('.page-shell').getBoundingClientRect().width;
    const desired = matchMedia('(max-width:680px)').matches ? field : field * 2 / 3;
    dialog.style.setProperty('--section-player-size', Math.max(100,Math.min(desired,innerWidth-32,innerHeight-100))+'px');
  };
  const transform = () => {
    if (!origin?.isConnected) return null;
    const a = origin.getBoundingClientRect(), b = view.getBoundingClientRect();
    return `translate(${a.x+a.width/2-b.x-b.width/2}px,${a.y+a.height/2-b.y-b.height/2}px) scale(${a.width/b.width})`;
  };
  const draw = () => {
    const value = Number.isFinite(video.duration) && video.duration > 0 ? Math.min(1,video.currentTime/video.duration) : 0;
    ring.style.strokeDashoffset = String(307.876080052*(1-value));
    progress.value = value;
  };
  const update = () => {
    toggle.setAttribute('aria-label',video.paused?'Воспроизвести видео':'Пауза');
    view.classList.toggle('is-playing',!video.paused);
    draw();
  };
  const tick = () => {
    draw();
    if (!video.paused && !video.ended) frame = requestAnimationFrame(tick);
  };
  const resume = () => {
    if (dialog.dataset.ready !== 'true') return;
    const request = generation;
    status.textContent = '';
    if (video.error) video.load();
    video.play().catch(() => {
      if (request === generation && dialog.open) {
        status.textContent = 'Нажмите на видео, чтобы воспроизвести.';
        update();
      }
    });
  };
  const reset = () => {
    clearTimeout(closeTimer); closeTimer=0;
    generation++; animation?.cancel(); animation = null; closing = false;
    cancelAnimationFrame(frame); frame = 0;
    video.pause(); video.removeAttribute('src'); video.load();
    origin?.setAttribute('aria-expanded','false');
    if (origin?.isConnected) origin.focus({preventScroll:true});
    view.classList.remove('is-playing');
    status.textContent = ''; draw();
  };
  const close = () => {
    if (!dialog.open || closing) return;
    closing = true; video.pause(); animation?.cancel();
    const end = transform();
    if (reduced() || !end) {dialog.close();return;}
    animation = view.animate([{transform:'none'},{transform:end}],{duration:220,easing:'cubic-bezier(.3,0,.7,1)',fill:'forwards'});
    closeTimer = setTimeout(() => {if (closing && dialog.open) dialog.close();},300);
    animation.finished.then(() => dialog.close()).catch(() => {
      if (closing && dialog.open) dialog.close();
    });
  };
  triggers.forEach(button => {
    button.setAttribute('aria-label',(button.dataset.videoSrc.trim()?'Открыть видео: ':'Открыть фото: ')+button.dataset.videoTitle);
    button.addEventListener('click', () => {
    const src = button.dataset.videoSrc.trim();
    generation++; origin = button; closing = false;
    const image = button.querySelector('img');
    const ready = Boolean(src);
    dialog.dataset.ready = String(ready);
    resize(); title.textContent = button.dataset.videoTitle;
    poster.src = image.src; poster.alt = image.alt;
    poster.style.objectPosition = image.style.objectPosition;
    poster.hidden = ready; video.hidden = !ready; toggle.hidden = !ready;
    dialog.querySelector('.section-video-ring').hidden = !ready;
    progress.hidden = !ready;
    status.textContent = '';
    if (ready) {video.poster = image.src;video.src = src;video.setAttribute('aria-label',button.dataset.videoTitle);}
    draw(); button.setAttribute('aria-expanded','true');
    dialog.showModal();
    dialog.querySelector('.section-video-close').focus({preventScroll:true});
    const start = transform();
    if (!reduced() && start) animation = view.animate([{transform:start},{transform:'none'}],{duration:380,easing:'cubic-bezier(.2,.75,.15,1)'});
    if (ready) {resume();update();}
    });
  });
  toggle.addEventListener('click', () => video.paused?resume():video.pause());
  for (const event of ['loadedmetadata','timeupdate','pause','ended']) video.addEventListener(event, () => {
    if (video.paused || video.ended) {cancelAnimationFrame(frame);frame=0;}
    update();
  });
  video.addEventListener('playing', () => {status.textContent='';update();cancelAnimationFrame(frame);tick();});
  video.addEventListener('error', () => {
    if (dialog.open && dialog.dataset.ready==='true') {status.textContent='Видео не загрузилось. Нажмите, чтобы повторить.';update();}
  });
  dialog.querySelector('.section-video-close').addEventListener('click',close);
  dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
  dialog.addEventListener('close',reset);
  dialog.addEventListener('click',event=>{
    if (event.target===dialog) {
      const r=dialog.getBoundingClientRect();
      if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom) close();
    }
  });
  window.addEventListener('resize',()=>{
    if (!dialog.open) return;
    animation?.cancel(); animation=null;
    if (closing) dialog.close();
    else resize();
  });
})();

(() => {
  'use strict';
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const phone = matchMedia('(max-width: 680px)');
  const panels = [...document.querySelectorAll('.accordion-panel')];
  const links = panels.map(panel => panel.querySelector('.panel-activate'));
  const tabs = [...document.querySelectorAll('.section-tab')];
  const descriptions = [...document.querySelectorAll('.description')];
  const home = document.querySelector('#home');
  let open = 0;
  let selected = null;
  let entranceAnimations = [];
  let disposeSectionMotion = () => {};
  let activeHeading = null;
  const headingInk = document.createElement('canvas').getContext('2d');

  function alignContactMarks(section) {
    const title=section.querySelector('.section-heading > span:last-child');
    const titleStyle=getComputedStyle(title),text=title.firstChild;
    headingInk.font=[titleStyle.fontStyle,titleStyle.fontWeight,titleStyle.fontSize,titleStyle.fontFamily].join(' ');
    const range=document.createRange();range.setStart(text,0);range.setEnd(text,1);
    const left=range.getBoundingClientRect().left-headingInk.measureText(text.data[0]).actualBoundingBoxLeft;
    const last=text.length-1;range.setStart(text,last);range.setEnd(text,last+1);
    const glyph=headingInk.measureText(text.data[last]),lastBox=range.getBoundingClientRect();
    const right=lastBox.left+glyph.actualBoundingBoxRight;
    const origin=section.getBoundingClientRect().left;
    section.style.setProperty('--contacts-left',(left-origin).toFixed(4)+'px');
    section.style.setProperty('--contacts-width',Math.min(section.clientWidth-(left-origin),Math.max(240,right-left)).toFixed(4)+'px');
    section.dataset.contactAxisLeft=(left-origin).toFixed(4);
    section.dataset.contactAxisRight=(right-origin).toFixed(4);
    section.querySelectorAll('.contact-link').forEach(link => {
      const value = link.querySelector('.contact-value');
      const style = getComputedStyle(value);
      headingInk.font = [style.fontStyle,style.fontWeight,style.fontSize,style.fontFamily].join(' ');
      const bounds = headingInk.measureText('Н');
      const ascent = bounds.actualBoundingBoxAscent || parseFloat(style.fontSize) * .75;
      const size = ascent + (bounds.actualBoundingBoxDescent || 0);
      const probe = document.createElement('span');
      probe.setAttribute('aria-hidden','true');
      probe.style.cssText = 'display:inline-block;width:0;height:0;padding:0;margin:0;border:0;vertical-align:baseline;line-height:0';
      value.prepend(probe);
      const top = probe.getBoundingClientRect().top - link.getBoundingClientRect().top - ascent;
      probe.remove();
      link.style.setProperty('--contact-mark-size',size.toFixed(4)+'px');
      link.style.setProperty('--contact-mark-top',top.toFixed(4)+'px');
    });
  }

  function alignHeadingMark() {
    const heading = activeHeading;
    if (!heading || !heading.offsetWidth) return;
    const square = heading.querySelector('.section-heading-square');
    const copy = square?.nextElementSibling;
    if (!copy) return;
    const style = getComputedStyle(heading);
    headingInk.font = [style.fontStyle, style.fontWeight, style.fontSize, style.fontFamily].join(' ');
    // Use the common capital plane, independent of accents and descenders in a title.
    const bounds = headingInk.measureText('Н');
    const ascent = bounds.actualBoundingBoxAscent || parseFloat(style.fontSize) * .75;
    const descent = bounds.actualBoundingBoxDescent || 0;
    const size = ((ascent + descent) * 1.1).toFixed(4) + 'px';
    if (heading.style.getPropertyValue('--heading-square-size') !== size) {
      heading.style.setProperty('--heading-square-size', size);
    }
    const baseline = document.createElement('span');
    baseline.setAttribute('aria-hidden', 'true');
    baseline.style.cssText = 'display:inline-block;width:0;height:0;padding:0;margin:0;border:0;vertical-align:baseline;line-height:0';
    copy.prepend(baseline);
    const inkTop = baseline.getBoundingClientRect().top - heading.getBoundingClientRect().top - ascent;
    baseline.remove();
    const top = (inkTop - (ascent + descent) * .05).toFixed(4) + 'px';
    if (heading.style.getPropertyValue('--heading-square-top') !== top) {
      heading.style.setProperty('--heading-square-top', top);
    }
    heading.dataset.inkTop = inkTop.toFixed(4);
    heading.dataset.inkHeight = (ascent + descent).toFixed(4);
    const section = heading.closest('.description');
    if (section.id === 'contacts') alignContactMarks(section);
    window.HubSectionMotion.alignLayout(section);
  }

  const headingObserver = typeof ResizeObserver === 'function'
    ? new ResizeObserver(alignHeadingMark) : null;
  window.addEventListener('resize', alignHeadingMark, {passive: true});
  document.fonts.ready.then(alignHeadingMark);
  document.fonts.addEventListener('loadingdone', alignHeadingMark);

  function dockComposition() {
    if (!document.body.classList.contains('is-landing')) return;
    const shell = document.querySelector('.page-shell');
    const previousTop = shell.getBoundingClientRect().top;
    document.body.classList.remove('is-landing');
    window.scrollTo({top: 0, behavior: 'instant'});
    const offset = previousTop - shell.getBoundingClientRect().top;
    if (!reduced.matches && offset > 0) {
      const animation = shell.animate([
        {transform: `translateY(${offset}px)`},
        {transform: 'translateY(0)'}
      ], {duration: 620, easing: 'cubic-bezier(.2,.72,.13,1)'});
      reduced.addEventListener('change', () => animation.cancel(), {once: true});
    }
  }

  function expand(index) {
    open = index;
    panels.forEach((panel, i) => panel.classList.toggle('is-open', i === index));
  }
  function menu(page) {
    tabs.forEach(tab => tab.setAttribute('aria-pressed', String(tab.dataset.page === page)));
  }
  function hideDescriptions() {
    headingObserver?.disconnect();
    activeHeading = null;
    disposeSectionMotion();
    disposeSectionMotion = () => {};
    descriptions.forEach(section => { section.hidden = true; });
    links.forEach(link => link.setAttribute('aria-expanded', 'false'));
    selected = null;
  }
  function reveal(section, moveFocus = true) {
    section.hidden = false;
    activeHeading = section.querySelector('.section-heading');
    alignHeadingMark();
    if (activeHeading) headingObserver?.observe(activeHeading);
    if (!reduced.matches) section.animate([{opacity: 0, transform: 'translateY(12px)'}, {opacity: 1, transform: 'translateY(0)'}], {duration: 380, easing: 'cubic-bezier(.16,1,.3,1)'});
    if (moveFocus) section.focus({preventScroll: true});
    if (section.querySelector('.author-disciplines')) {
      disposeSectionMotion = window.HubSectionMotion.attach(section);
      window.HubSectionMotion.alignLayout(section);
    }
  }
  function showHome() {
    dockComposition();
    hideDescriptions();
    home.hidden = false;
    document.querySelectorAll('.utility-page').forEach(page => { page.hidden = true; });
    menu('home');
  }
  function showDirection(index) {
    showHome();
    expand(index);
    selected = index;
    if (phone.matches) {
      document.querySelector('.accordion-track').scrollTo({
        left: panels[index].offsetLeft - panels[0].offsetLeft,
        behavior: reduced.matches ? 'instant' : 'smooth'
      });
    }
    links[index].setAttribute('aria-expanded', 'true');
    const section = document.getElementById(links[index].getAttribute('aria-controls'));
    reveal(section);
  }
  function showUtility(page) {
    dockComposition();
    hideDescriptions();
    home.hidden = true;
    document.querySelectorAll('.utility-page').forEach(section => { section.hidden = section.id !== page; });
    menu(page);
    reveal(document.getElementById(page));
    window.scrollTo({top: 0, behavior: reduced.matches ? 'instant' : 'smooth'});
  }
  panels.forEach((panel, index) => {
    panel.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') expand(index); });
    links[index].addEventListener('focus', () => expand(index));
    links[index].addEventListener('click', event => {
      event.preventDefault();
      showDirection(index);
    });
    links[index].addEventListener('keydown', event => {
      let next = null;
      if (event.key === 'ArrowRight') next = (open + 1) % panels.length;
      if (event.key === 'ArrowLeft') next = (open - 1 + panels.length) % panels.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = panels.length - 1;
      if (event.key === ' ') { event.preventDefault(); showDirection(index); return; }
      if (next === null) return;
      event.preventDefault();
      expand(next);
      links[next].focus({preventScroll: true});
      if (phone.matches) panels[next].scrollIntoView({behavior: reduced.matches ? 'instant' : 'smooth', block: 'nearest', inline: 'start'});
    });
  });
  tabs.forEach(tab => tab.addEventListener('click', () => {
    if (tab.dataset.page === 'home') {
      showHome();
      window.scrollTo({top: 0, behavior: reduced.matches ? 'instant' : 'smooth'});
    } else showUtility(tab.dataset.page);
  }));
  document.querySelector('.brand-pill').addEventListener('click', event => {
    event.preventDefault(); showHome(); window.scrollTo({top: 0, behavior: reduced.matches ? 'instant' : 'smooth'});
  });
  document.querySelectorAll('[data-show-contacts]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault(); showUtility('contacts');
  }));
  document.querySelectorAll('.close-description').forEach(button => button.addEventListener('click', () => {
    const index = selected;
    hideDescriptions();
    if (index !== null) links[index].focus({preventScroll: true});
  }));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && selected !== null) {
      const index = selected; hideDescriptions(); links[index].focus({preventScroll: true});
    }
  });

  async function entrance() {
    const finish = () => {
      entranceAnimations.forEach(animation => animation.cancel());
      entranceAnimations = [];
      root.classList.remove('enter-pending');
      document.querySelector('.brand-pill').classList.remove('brand-entrance');
      document.querySelector('.brand-shell')?.remove();
    };
    reduced.addEventListener('change', event => { if (event.matches) finish(); });
    if (reduced.matches) { finish(); return; }
    try {
      await document.fonts.ready;
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      if (reduced.matches) { finish(); return; }
      const ease = 'cubic-bezier(.16,1,.3,1)';
      const animate = (el, frames, duration, delay = 0, easing = ease) => {
        const animation = el.animate(frames, {duration, delay, easing, fill: 'both'});
        entranceAnimations.push(animation);
      };
      const brand = document.querySelector('.brand-pill');
      const shell = document.createElement('span');
      shell.className = 'brand-shell'; shell.setAttribute('aria-hidden', 'true');
      brand.prepend(shell); brand.classList.add('brand-entrance');
      animate(document.querySelector('.brand-disc'), [
        {transform: 'scale(.015)', opacity: 1, offset: 0, easing: 'cubic-bezier(.3,0,.35,1)'},
        {transform: 'scale(1.3)', opacity: 1, offset: .65, easing: 'ease-in-out'},
        {transform: 'scale(1)', opacity: 1, offset: 1}
      ], 800, 0, 'ease-in-out');
      const height = brand.offsetHeight;
      animate(shell, [
        {width: `${height}px`, opacity: 0, offset: 0},
        {width: `${height + (brand.clientWidth - height) * .08}px`, opacity: 1, offset: .12},
        {width: `${brand.getBoundingClientRect().width}px`, opacity: 1, offset: 1}
      ], 440, 456);
      animate(document.querySelector('.brand-name'), [{opacity: 0}, {opacity: 1}], 160, 956);
      tabs.forEach((tab, i) => animate(tab, [{opacity: 0, transform: 'perspective(650px) rotateX(-86deg)'}, {opacity: 1, transform: 'perspective(650px) rotateX(0deg)'}], 420, i * 90));
      panels.forEach((panel, i) => animate(panel, [{opacity: 0, transform: 'perspective(650px) rotateX(-86deg)'}, {opacity: 1, transform: 'perspective(650px) rotateX(0deg)'}], 420, 380 + i * 90));
      root.classList.remove('enter-pending');
      await Promise.all(entranceAnimations.map(animation => animation.finished.catch(() => {})));
    } finally { finish(); }
  }

  function familyPage(){return selected!==null?panels[selected].querySelector('.panel-activate').getAttribute('aria-controls').replace('section-','0.').replace('0.0','0.'):!home.hidden?'home':document.querySelector('.utility-page:not([hidden])')?.id==='contacts'?'0.9':'quotes';}
  function familyOpen(value){if(!value)return;const page=value==='d09'||value==='0.9'?'contacts':value;if((page==='contacts'&&familyPage()==='0.9')||page===familyPage())return;if(page==='home')showHome();else if(page==='contacts'||page==='quotes')showUtility(page);else{const number=page.startsWith('d')?'0.'+Number(page.slice(1)):page;const index=links.findIndex(link=>document.getElementById(link.getAttribute('aria-controls')).dataset.direction===number);if(index>=0)showDirection(index);}dispatchEvent(new CustomEvent('hub-family:change'));}
  window.HubFamily={open:familyOpen,page:familyPage};
  function familyLayout(){const mode=innerWidth<=680?'phone':innerWidth<=1130?(innerWidth<=899?'tablet-portrait':'tablet-landscape'):'desktop';root.dataset.hubLayout=mode;dispatchEvent(new CustomEvent('hub:layout-change'));}
  window.GARDARI_HUB_LAYOUT={isCompact:()=>innerWidth<=1130,isSidebar:()=>false,setPreviewDevice:familyLayout};addEventListener('resize',familyLayout,{passive:true});familyLayout();

  entrance().catch(error => console.error('Hub experiment entrance:', error));
})();

}
})();
