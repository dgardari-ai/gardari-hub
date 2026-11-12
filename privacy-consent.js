/* Privacy-choice preview.
 * No statistics are sent from this fork: data-metrica-id is empty.
 * When a counter is deliberately configured, it loads only after opt-in.
 */
(() => {
  'use strict';
  const VERSION = 2;
  const STORAGE_KEY = 'gardari-privacy-choice:v2';
  const SHARED_COOKIE = 'gardari_privacy_choice_v2';
  const LIFETIME = 180 * 24 * 60 * 60;
  const scriptElement = document.currentScript;
  const counterId = Number(scriptElement?.getAttribute('data-metrica-id') || 0);
  const panel = document.getElementById('gardari-consent-panel');
  const manageControls = [...document.querySelectorAll('[data-gardari-cookie-settings]')];
  const necessaryButton = document.getElementById('gardari-consent-necessary');
  const allowButton = document.getElementById('gardari-consent-allow');
  if (!panel || !manageControls.length || !necessaryButton || !allowButton) return;

  const host = location.hostname;
  const sharedDomain = host === 'gardari.art' || host.endsWith('.gardari.art');
  let choice = null;
  let analyticsStarted = false;
  let trigger = null;

  function readSharedCookie() {
    if (!sharedDomain) return null;
    const pair = document.cookie.split('; ').find(item => item.startsWith(SHARED_COOKIE + '='));
    if (!pair) return null;
    const value = pair.slice(SHARED_COOKIE.length + 1);
    if (value === 'yes') return true;
    if (value === 'no') return false;
    return null;
  }
  function readChoice() {
    const cookieChoice = readSharedCookie();
    if (cookieChoice !== null) return { analytics: cookieChoice };
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (parsed && parsed.version === VERSION && typeof parsed.analytics === 'boolean') {
        return { analytics: parsed.analytics };
      }
    } catch (_) {}
    return null;
  }
  function saveChoice(allow) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        version: VERSION,
        analytics: allow,
        updatedAt: new Date().toISOString()
      }));
    } catch (_) {}
    if (sharedDomain) {
      try {
        document.cookie = SHARED_COOKIE + '=' + (allow ? 'yes' : 'no') +
          '; Domain=.gardari.art; Path=/; Max-Age=' + LIFETIME + '; Secure; SameSite=Lax';
      } catch (_) {}
    }
  }
  function enableConfiguredMetrika() {
    if (analyticsStarted || !Number.isSafeInteger(counterId) || counterId <= 0) return;
    analyticsStarted = true;
    window.ym = window.ym || function () {
      (window.ym.a = window.ym.a || []).push(arguments);
    };
    window.ym.l = window.ym.l || Date.now();
    window.ym(counterId, 'init', {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: false
    });
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://mc.yandex.ru/metrika/tag.js';
    tag.setAttribute('data-gardari-analytics', 'consent-gated');
    document.head.append(tag);
  }
  function showPanel(focus) {
    panel.hidden = false;
    manageControls.forEach(control => { control.hidden = true; });
    if (focus) necessaryButton.focus();
  }
  function hidePanel() {
    panel.hidden = true;
    manageControls.forEach(control => { control.hidden = false; });
    if (trigger?.isConnected) trigger.focus();
    trigger = null;
  }
  function setChoice(analytics) {
    const wasRunning = analyticsStarted;
    choice = { analytics };
    saveChoice(analytics);
    hidePanel();
    dispatchEvent(new CustomEvent('gardari:privacy-choice', { detail: { analytics } }));
    if (analytics) enableConfiguredMetrika();
    else if (wasRunning) {
      // A previously loaded analytics library cannot be unloaded in place.
      // Reload before further page interactions; the counter is not loaded again.
      location.reload();
    }
  }
  manageControls.forEach(control => control.addEventListener('click', () => {
    trigger = control;
    showPanel(true);
  }));
  necessaryButton.addEventListener('click', () => setChoice(false));
  allowButton.addEventListener('click', () => setChoice(true));
  panel.addEventListener('keydown', event => {
    if (event.key === 'Escape' && choice) {
      event.preventDefault();
      hidePanel();
    }
  });
  window.GardariPrivacyChoice = Object.freeze({
    analyticsAllowed: () => choice?.analytics === true,
    openSettings: () => showPanel(true)
  });
  choice = readChoice();
  const previewRequested = new URLSearchParams(location.search).get('cookie-settings') === 'open';
  if (!choice) showPanel(false);
  else {
    hidePanel();
    if (choice.analytics) enableConfiguredMetrika();
    if (previewRequested) showPanel(false);
  }
})();