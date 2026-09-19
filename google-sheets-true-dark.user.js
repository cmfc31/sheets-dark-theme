// ==UserScript==
// @name         Google Sheets True Dark
// @namespace    sheets-dark-theme
// @version      1.6.6
// @description  Dark theme for Google Sheets that keeps photos from turning into negatives.
// @author       cmfc31
// @license      MIT
// @match        https://docs.google.com/spreadsheets/*
// @match        https://docs.google.com/drivesharing/*
// @match        https://ogs.google.com/*
// @run-at       document-start
// @inject-into  content
// @grant        GM_addStyle
// ==/UserScript==

/*
  Violentmonkey: replace the old script with this whole file, Save, then hard-refresh the sheet (Ctrl+Shift+R).
  Allow access to ogs.google.com and docs.google.com/drivesharing if Violentmonkey asks.
*/

(() => {
  "use strict";

  const FILTER = "invert(1) hue-rotate(180deg)";
  const ROOT_CLASS = "gs-true-dark";
  const ACCOUNT_CLASS = "gs-true-dark-account";
  const STYLE_ID = "gs-true-dark-style";
  const LOG = "[Sheets True Dark]"; 
  const isAccountWidget = location.hostname === "ogs.google.com";
  const isShareFrame = location.pathname.startsWith("/drivesharing/");
  const SHARE_CLASS = "gs-true-dark-share";

  const sheetsCss = `
    html.${ROOT_CLASS} {
      --chrome: #e4e3e1;
      --formula: #dad9d7;
      --tabs: #e6e5e3;
      --tab: #d8d7d5;
      --tab-on: #c6c5c3;
      --menu: #d3d2d0;
      --hover: #c7c6c4;
      --line: #b6b5b3;
      --input: #cfcecc;
      --scrim: rgb(250 250 250 / 78%);
      --popup-box: 0 8px 24px rgb(198 200 202 / 40%);
      --popup-shadow: none;
      background: #ecebe9 !important;
      filter: ${FILTER} !important;
    }

    html.${ROOT_CLASS} img,
    html.${ROOT_CLASS} picture,
    html.${ROOT_CLASS} video,
    html.${ROOT_CLASS} image,
    html.${ROOT_CLASS} .waffle-borderless-embedded-object-container > [style*="background-image"],
    html.${ROOT_CLASS} .waffle-embedded-object-container img,
    html.${ROOT_CLASS} .waffle-embedded-object-overlay img {
      filter: ${FILTER} !important;
    }

    html.${ROOT_CLASS} #docs-chrome,
    html.${ROOT_CLASS} #docs-header,
    html.${ROOT_CLASS} .docs-titlebar-container,
    html.${ROOT_CLASS} .docs-titlebar {
      background: var(--chrome) !important;
      overflow: visible !important;
    }

    html.${ROOT_CLASS} #docs-branding-container,
    html.${ROOT_CLASS} .docs-branding-icon {
      overflow: hidden !important;
      z-index: 0 !important;
    }

    html.${ROOT_CLASS} #docs-bars,
    html.${ROOT_CLASS} .docs-bars,
    html.${ROOT_CLASS} #docs-menubar,
    html.${ROOT_CLASS} .docs-menubar {
      background: transparent !important;
      overflow: visible !important;
      position: relative !important;
      z-index: 2 !important;
    }

    html.${ROOT_CLASS} #docs-menubar .goog-control,
    html.${ROOT_CLASS} .docs-menubar .goog-control {
      overflow: visible !important;
    }

    html.${ROOT_CLASS} .docs-menubar .goog-control-hover,
    html.${ROOT_CLASS} .docs-menubar .goog-control-open {
      background: var(--hover) !important;
      border-radius: 4px !important;
    }

    html.${ROOT_CLASS} .docs-titlebar-buttons,
    html.${ROOT_CLASS} .docs-titlebar-buttons-container,
    html.${ROOT_CLASS} .docs-presence-plus-widget-container,
    html.${ROOT_CLASS} #docs-titlebar-share-client-button,
    html.${ROOT_CLASS} #gb,
    html.${ROOT_CLASS} #gb > div,
    html.${ROOT_CLASS} .oneGoogleBar,
    html.${ROOT_CLASS} .oneGoogleWrapper {
      background: var(--chrome) !important;
      background-image: none !important;
      box-shadow: none !important;
    }

    html.${ROOT_CLASS} #formula-bar,
    html.${ROOT_CLASS} .formula-bar,
    html.${ROOT_CLASS} #docs-formula-bar {
      background: var(--formula) !important;
    }

    html.${ROOT_CLASS} .grid-bottom-bar,
    html.${ROOT_CLASS} #docs-sheets-bar,
    html.${ROOT_CLASS} .docs-sheets-bar {
      background: var(--tabs) !important;
    }

    html.${ROOT_CLASS} .docs-sheet-tab {
      background: var(--tab) !important;
    }

    html.${ROOT_CLASS} .docs-sheet-active-tab,
    html.${ROOT_CLASS} .docs-gm .docs-sheet-active-tab {
      background: var(--tab-on) !important;
    }

    html.${ROOT_CLASS} .goog-menu,
    html.${ROOT_CLASS} .goog-menu-vertical,
    html.${ROOT_CLASS} .docs-menu,
    html.${ROOT_CLASS} .modal-dialog,
    html.${ROOT_CLASS} .ac-renderer,
    html.${ROOT_CLASS} .docs-findbar-container {
      background: var(--menu) !important;
      background-image: none !important;
      border-color: var(--line) !important;
    }

    html.${ROOT_CLASS} .goog-menuitem-highlight,
    html.${ROOT_CLASS} .goog-menuitem:hover,
    html.${ROOT_CLASS} .goog-menuitem-hover {
      background: var(--hover) !important;
    }

    html.${ROOT_CLASS} .companion-app-switcher-container,
    html.${ROOT_CLASS} #docs-side-companion {
      background: var(--chrome) !important;
    }

    html.${ROOT_CLASS} #gb iframe,
    html.${ROOT_CLASS} .oneGoogleBar iframe,
    html.${ROOT_CLASS} .docs-titlebar-buttons iframe,
    html.${ROOT_CLASS} iframe[src*="ogs.google.com"],
    html.${ROOT_CLASS} iframe[src*="accounts.google.com"],
    html.${ROOT_CLASS} #gb *:has(> iframe),
    html.${ROOT_CLASS} .oneGoogleBar *:has(> iframe) {
      box-shadow: none !important;
    }

    html.${ROOT_CLASS} .modal-dialog-bg,
    html.${ROOT_CLASS} .goog-modalpopup-bg,
    html.${ROOT_CLASS} .docs-dialog-bg,
    html.${ROOT_CLASS} .modal-dialog-bg-movable,
    html.${ROOT_CLASS} [class*="modalpopup-bg"],
    html.${ROOT_CLASS} [class*="dialog-bg"] {
      background: var(--scrim) !important;
      background-color: var(--scrim) !important;
      opacity: 1 !important;
    }

    html.${ROOT_CLASS} .modal-dialog,
    html.${ROOT_CLASS} .docs-dialog,
    html.${ROOT_CLASS} .waffle-dialog,
    html.${ROOT_CLASS} .goog-modalpopup {
      background: var(--menu) !important;
      background-image: none !important;
      border: 1px solid var(--line) !important;
      color: #202124 !important;
    }

    html.${ROOT_CLASS} .modal-dialog-title,
    html.${ROOT_CLASS} .modal-dialog-content,
    html.${ROOT_CLASS} .modal-dialog-buttons,
    html.${ROOT_CLASS} .docs-dialog-title,
    html.${ROOT_CLASS} .docs-dialog-body {
      background: transparent !important;
      border-color: var(--line) !important;
      color: inherit !important;
    }

    html.${ROOT_CLASS} .modal-dialog input,
    html.${ROOT_CLASS} .modal-dialog textarea,
    html.${ROOT_CLASS} .modal-dialog .jfk-textinput,
    html.${ROOT_CLASS} .docs-dialog input,
    html.${ROOT_CLASS} .docs-dialog textarea {
      background: var(--input) !important;
      background-image: none !important;
      border: 1px solid var(--line) !important;
      color: #202124 !important;
      box-shadow: none !important;
    }

    html.${ROOT_CLASS} .modal-dialog .jfk-button,
    html.${ROOT_CLASS} .modal-dialog .goog-flat-button,
    html.${ROOT_CLASS} .docs-dialog .jfk-button {
      background-image: none !important;
      border-color: var(--line) !important;
    }

    html.${ROOT_CLASS} .modal-dialog .jfk-button-standard,
    html.${ROOT_CLASS} .modal-dialog .jfk-button-default,
    html.${ROOT_CLASS} .docs-dialog .jfk-button-standard {
      background: var(--hover) !important;
    }

    html.${ROOT_CLASS} .modal-dialog .jfk-button-action,
    html.${ROOT_CLASS} .docs-dialog .jfk-button-action {
      background: #1a73e8 !important;
      border-color: #1a73e8 !important;
      color: #fff !important;
    }

    html.${ROOT_CLASS} .modal-dialog .goog-radiobutton,
    html.${ROOT_CLASS} .modal-dialog .docs-material-radiobutton {
      accent-color: #1a73e8;
    }

    html.${ROOT_CLASS} .docs-bubble,
    html.${ROOT_CLASS} .link-bubble,
    html.${ROOT_CLASS} .waffle-hyperlink-tooltip,
    html.${ROOT_CLASS} .jfk-tooltip,
    html.${ROOT_CLASS} .docs-popup,
    html.${ROOT_CLASS} [class*="link-bubble"],
    html.${ROOT_CLASS} [class*="LinkBubble"],
    html.${ROOT_CLASS} [class*="linkbubble" i],
    html.${ROOT_CLASS} [id*="linkbubble" i],
    html.${ROOT_CLASS} [class*="hyperlink-tooltip"],
    html.${ROOT_CLASS} [class*="hyperlink-chip"],
    html.${ROOT_CLASS} .docs-link-insertlinkbubble,
    html.${ROOT_CLASS} .gs-true-dark-popup,
    html.${ROOT_CLASS} .gs-true-dark-popup-host,
    html.${ROOT_CLASS} .gs-true-dark-popup *,
    html.${ROOT_CLASS} .gs-true-dark-popup-host * {
      box-shadow: none !important;
    }

    html.${ROOT_CLASS} .gs-true-dark-popup,
    html.${ROOT_CLASS} .gs-true-dark-popup-host,
    html.${ROOT_CLASS} .waffle-hyperlink-tooltip,
    html.${ROOT_CLASS} .docs-bubble,
    html.${ROOT_CLASS} .jfk-tooltip,
    html.${ROOT_CLASS} .docs-popup {
      filter: none !important;
    }

    html.${ROOT_CLASS} .gs-true-dark-popup::before,
    html.${ROOT_CLASS} .gs-true-dark-popup::after,
    html.${ROOT_CLASS} .gs-true-dark-popup-host::before,
    html.${ROOT_CLASS} .gs-true-dark-popup-host::after,
    html.${ROOT_CLASS} .waffle-hyperlink-tooltip::before,
    html.${ROOT_CLASS} .waffle-hyperlink-tooltip::after,
    html.${ROOT_CLASS} .docs-bubble::before,
    html.${ROOT_CLASS} .docs-bubble::after,
    html.${ROOT_CLASS} .jfk-tooltip::before,
    html.${ROOT_CLASS} .jfk-tooltip::after,
    html.${ROOT_CLASS} .docs-popup::before,
    html.${ROOT_CLASS} .docs-popup::after {
      box-shadow: none !important;
      filter: none !important;
    }

    html.${ROOT_CLASS} .share-client-dialog,
    html.${ROOT_CLASS} .share-client-dialog.modal-dialog,
    html.${ROOT_CLASS} .full-screen-share-client-dialog,
    html.${ROOT_CLASS} .team-drive-share-client-dialog,
    html.${ROOT_CLASS} .share-client-dialog .contentEl,
    html.${ROOT_CLASS} .share-client-content-iframe {
      background: transparent !important;
      background-color: transparent !important;
      background-image: none !important;
      border: none !important;
      box-shadow: none !important;
    }
  `;

  const POPUP_CLASS = "gs-true-dark-popup";
  const POPUP_HOST_CLASS = "gs-true-dark-popup-host";
  const CARD_CLASS = "gs-true-dark-card";
  const POPUP_FILTER =
    "drop-shadow(0 1px 2px rgb(186 188 190 / 50%)) drop-shadow(0 6px 12px rgb(198 200 202 / 32%))";

  /* Parent invert already darkens this iframe. Invert photos here so they
     come out original after the parent invert. Do not invert the widget UI.
     Shadow lives on the rounded card, not the padded iframe/body box. */
  const accountCss = `
    html.${ACCOUNT_CLASS},
    html.${ACCOUNT_CLASS} body {
      background: transparent !important;
      box-shadow: none !important;
    }

    html.${ACCOUNT_CLASS} * {
      box-shadow: none !important;
    }

    html.${ACCOUNT_CLASS} *:not(img):not(picture):not(video):not(image):not(.${CARD_CLASS}) {
      filter: none !important;
    }

    html.${ACCOUNT_CLASS} .${CARD_CLASS} {
      filter: ${POPUP_FILTER} !important;
    }

    html.${ACCOUNT_CLASS} img,
    html.${ACCOUNT_CLASS} picture,
    html.${ACCOUNT_CLASS} video,
    html.${ACCOUNT_CLASS} image {
      filter: ${FILTER} !important;
    }
  `;

  /* Parent invert already darkens this iframe. Keep plates behind the
     share card transparent so the sheet shows through. */
  const shareCss = `
    html.${SHARE_CLASS},
    html.${SHARE_CLASS} body {
      background: transparent !important;
      background-color: transparent !important;
      background-image: none !important;
      filter: none !important;
      color-scheme: light;
    }

    html.${SHARE_CLASS} .modal-dialog-bg,
    html.${SHARE_CLASS} .goog-modalpopup-bg,
    html.${SHARE_CLASS} .docs-dialog-bg,
    html.${SHARE_CLASS} .mdc-dialog__scrim,
    html.${SHARE_CLASS} [class*="scrim" i],
    html.${SHARE_CLASS} [class*="backdrop" i],
    html.${SHARE_CLASS} [class*="veil" i],
    html.${SHARE_CLASS} [class*="curtain" i],
    html.${SHARE_CLASS} ::backdrop {
      background: transparent !important;
      background-color: transparent !important;
      background-image: none !important;
      box-shadow: none !important;
    }
  `;

  const css = isAccountWidget ? accountCss : isShareFrame ? shareCss : sheetsCss;

  try {
    GM_addStyle(css);
  } catch (error) {
    console.warn(LOG, "GM_addStyle failed", error);
  }

  function ensureStyle() {
    const root = document.documentElement;
    if (!root) return;
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      (document.head || root).appendChild(style);
    }
    if (style.textContent !== css) style.textContent = css;
  }

  const LINK_SEL = [
    ".waffle-hyperlink-tooltip",
    ".docs-bubble",
    ".link-bubble",
    "[class*='link-bubble']",
    "[class*='LinkBubble']",
    "[class*='linkbubble']",
    "[id*='linkbubble']",
    "[id*='LinkBubble']",
    "[class*='hyperlink-tooltip']",
    "a.waffle-hyperlink-tooltip-link",
    "a#docs-linkbubble-link-text",
  ].join(",");

  function isChipShape(el) {
    if (!(el instanceof HTMLElement)) return false;
    const style = getComputedStyle(el);
    const radius = parseFloat(style.borderTopLeftRadius) || 0;
    if (radius < 10) return false;
    const rect = el.getBoundingClientRect();
    return rect.width >= 120 && rect.width <= 720 && rect.height >= 28 && rect.height <= 92;
  }

  function closestChip(el) {
    let node = el;
    let found = null;
    for (let i = 0; i < 12 && node && node !== document.body; i += 1) {
      if (isChipShape(node)) found = node;
      node = node.parentElement;
    }
    return found || (el instanceof HTMLElement ? el : null);
  }

  function stripShadow(el) {
    if (!(el instanceof HTMLElement)) return;
    el.style.setProperty("box-shadow", "none", "important");
    const filter = getComputedStyle(el).filter || "";
    if (/drop-shadow/i.test(filter)) el.style.setProperty("filter", "none", "important");
  }

  function neutralizePlates(card) {
    const parent = card && card.parentElement;
    if (!parent) return;
    [...parent.children].forEach((el) => {
      if (el === card) return;
      stripShadow(el);
      const nested = el.querySelectorAll("*");
      const limit = Math.min(nested.length, 24);
      for (let i = 0; i < limit; i += 1) stripShadow(nested[i]);
    });
  }

  function punchTransparent(el) {
    if (!(el instanceof HTMLElement) && !(el instanceof SVGElement)) return;
    el.style.setProperty("background", "transparent", "important");
    el.style.setProperty("background-color", "transparent", "important");
    el.style.setProperty("background-image", "none", "important");
    el.style.setProperty("box-shadow", "none", "important");
  }

  function clearShareFramePlates(doc) {
    if (!doc || !doc.documentElement) return;
    doc.documentElement.classList.add(SHARE_CLASS);
    punchTransparent(doc.documentElement);
    if (doc.body) punchTransparent(doc.body);
    let style = doc.getElementById(STYLE_ID);
    if (!style) {
      style = doc.createElement("style");
      style.id = STYLE_ID;
      (doc.head || doc.documentElement).appendChild(style);
    }
    if (style.textContent !== shareCss) style.textContent = shareCss;
    const win = doc.defaultView;
    if (!win || !doc.body) return;
    const vw = win.innerWidth;
    const vh = win.innerHeight;
    doc.body.querySelectorAll("*").forEach((el) => {
      if (!(el instanceof HTMLElement)) return;
      const rect = el.getBoundingClientRect();
      const fills = rect.width >= vw - 8 && rect.height >= vh - 8 && rect.left <= 8 && rect.top <= 8;
      if (!fills) return;
      const radius = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
      if (radius >= 8 && rect.width < vw - 24 && rect.height < vh - 24) return;
      punchTransparent(el);
    });
  }

  function paintShareIframe() {
    if (isAccountWidget || !document.body) return;
    document
      .querySelectorAll("iframe.share-client-content-iframe, iframe[src*='drivesharing'], iframe[src*='driveshare']")
      .forEach((frame) => {
        frame.style.setProperty("background", "transparent", "important");
        frame.style.setProperty("background-color", "transparent", "important");
        frame.setAttribute("allowtransparency", "true");
        try {
          const doc = frame.contentDocument;
          if (!doc || !doc.documentElement) return;
          clearShareFramePlates(doc);
        } catch (error) {
          /* cross-origin iframe */
        }
      });
  }

  function paintPopup(el) {
    if (!(el instanceof HTMLElement)) return;
    el.classList.add(POPUP_CLASS);
    stripShadow(el);
    neutralizePlates(el);
    const kids = el.querySelectorAll("*");
    const limit = Math.min(kids.length, 48);
    for (let i = 0; i < limit; i += 1) stripShadow(kids[i]);
    let node = el.parentElement;
    for (let i = 0; i < 12 && node && node !== document.body && node !== document.documentElement; i += 1) {
      const rect = node.getBoundingClientRect();
      const huge = rect.width > window.innerWidth - 24 && rect.height > window.innerHeight - 24;
      if (!huge) {
        node.classList.add(POPUP_HOST_CLASS);
        stripShadow(node);
        neutralizePlates(node);
      }
      node = node.parentElement;
    }
  }

  function tagLinkPopups() {
    if (isAccountWidget || !document.body) return;
    document.querySelectorAll(LINK_SEL).forEach((el) => {
      paintPopup(el.tagName === "A" ? closestChip(el) : el);
    });
    document
      .querySelectorAll(
        '[aria-label*="Copy" i], [aria-label*="Copiar" i], [data-tooltip*="Copy" i], [data-tooltip*="Copiar" i]'
      )
      .forEach((btn) => {
        const chip = closestChip(btn);
        if (chip && isChipShape(chip)) paintPopup(chip);
      });
    const overlay = document.querySelector('[id$="static-overlay-container"]');
    const roots = overlay ? [overlay, document.body] : [document.body];
    roots.forEach((root) => {
      const scope = root === document.body ? ":scope > div" : "div";
      root.querySelectorAll(scope).forEach((el) => {
        if (!isChipShape(el)) return;
        const pos = getComputedStyle(el).position;
        if (pos !== "absolute" && pos !== "fixed") return;
        if (!/https?:\/\//i.test((el.innerText || "").trim())) return;
        paintPopup(el);
      });
    });
  }

  function findAccountCloseButton() {
    const labeled = document.querySelector(
      'button[aria-label*="Close" i], button[aria-label*="Cerrar" i], [role="button"][aria-label*="Close" i], [role="button"][aria-label*="Cerrar" i], [aria-label*="Close" i], [aria-label*="Cerrar" i]'
    );
    if (labeled) return labeled;
    const vw = window.innerWidth;
    const candidates = document.querySelectorAll("button, [role='button']");
    for (let i = 0; i < candidates.length; i += 1) {
      const el = candidates[i];
      const rect = el.getBoundingClientRect();
      if (rect.width > 44 || rect.height > 44 || rect.width < 12) continue;
      if (rect.top > 72 || rect.right < vw - 72) continue;
      if (el.querySelector("svg, img, [class*='close']")) return el;
    }
    return null;
  }

  function tagAccountCard() {
    if (!isAccountWidget || !document.body) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const close = findAccountCloseButton();
    let best = null;
    let bestScore = Infinity;
    let node = close && close.parentElement;
    while (node && node !== document.documentElement) {
      if (node instanceof HTMLElement) {
        const style = getComputedStyle(node);
        const radius = parseFloat(style.borderTopLeftRadius) || 0;
        const rect = node.getBoundingClientRect();
        if (
          radius >= 12 &&
          rect.width >= 260 &&
          rect.height >= 240 &&
          rect.width < vw - 4 &&
          rect.height < vh - 4
        ) {
          const score = rect.width * rect.height;
          if (score < bestScore) {
            best = node;
            bestScore = score;
          }
        }
      }
      node = node.parentElement;
    }
    if (!best) {
      document.querySelectorAll('[role="dialog"], [aria-modal="true"]').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.width < 260 || rect.height < 240) return;
        if (rect.width >= vw - 4 && rect.height >= vh - 4) return;
        const score = rect.width * rect.height;
        if (score < bestScore) {
          best = el;
          bestScore = score;
        }
      });
    }
    document.querySelectorAll("." + CARD_CLASS).forEach((el) => {
      if (el !== best) el.classList.remove(CARD_CLASS);
    });
    if (best) {
      best.classList.add(CARD_CLASS);
      neutralizePlates(best);
    }
  }

  function applyTheme() {
    const root = document.documentElement;
    if (!root) return;
    ensureStyle();
    const leftover = document.getElementById("gs-true-dark-toggle");
    if (leftover) leftover.remove();
    if (isAccountWidget) {
      root.classList.add(ACCOUNT_CLASS);
      tagAccountCard();
      return;
    }
    if (isShareFrame) {
      root.classList.add(SHARE_CLASS);
      clearShareFramePlates(document);
      return;
    }
    root.classList.add(ROOT_CLASS);
    tagLinkPopups();
    paintShareIframe();
  }

  function bootUi() {
    applyTheme();
  }

  applyTheme();
  console.info(LOG, "loaded", {
    widget: isAccountWidget,
    injectInto: typeof GM_info !== "undefined" ? GM_info.injectInto : "unknown",
  });


  let raf = 0;
  const observer = new MutationObserver(() => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      bootUi();
    });
  });
  if (document.documentElement) {
    observer.observe(document.documentElement, {
      childList: true,
      subtree: isAccountWidget || isShareFrame,
      attributes: true,
      attributeFilter: ["class"],
    });
  }
  document.addEventListener("DOMContentLoaded", bootUi, { once: true });
  window.addEventListener("load", bootUi, { once: true });
  setInterval(bootUi, 2000);

  if (!isAccountWidget && !isShareFrame) {
    let popupRaf = 0;
    let popupLater = 0;
    const scheduleLinkTag = () => {
      if (!popupRaf) {
        popupRaf = requestAnimationFrame(() => {
          popupRaf = 0;
          tagLinkPopups();
          paintShareIframe();
        });
      }
      clearTimeout(popupLater);
      popupLater = setTimeout(() => {
        tagLinkPopups();
        paintShareIframe();
      }, 80);
    };
    document.addEventListener("pointerover", scheduleLinkTag, true);
    document.addEventListener("pointerdown", scheduleLinkTag, true);
    const overlayWatch = new MutationObserver(scheduleLinkTag);
    const watchOverlay = () => {
      const overlay = document.querySelector('[id$="static-overlay-container"]') || document.body;
      if (!overlay || overlay.dataset.gsTrueDarkWatch === "1") return;
      overlay.dataset.gsTrueDarkWatch = "1";
      overlayWatch.observe(overlay, { childList: true, subtree: true });
    };
    watchOverlay();
    document.addEventListener("DOMContentLoaded", watchOverlay, { once: true });
  }

  if (!isAccountWidget && !isShareFrame) injectCanvasHook();

  function injectCanvasHook() {
    const source = `(() => {
      if (window.__GS_TRUE_DARK_HOOK__) return;
      window.__GS_TRUE_DARK_HOOK__ = true;
      const FILTER = ${JSON.stringify(FILTER)};
      const ROOT_CLASS = ${JSON.stringify(ROOT_CLASS)};
      const natives = new WeakMap();
      let bypass = 0;

      function enabled() {
        return document.documentElement.classList.contains(ROOT_CLASS);
      }

      function isCanvas(src) {
        return src instanceof HTMLCanvasElement || (window.OffscreenCanvas && src instanceof OffscreenCanvas);
      }

      function isDomImage(src) {
        return src instanceof HTMLImageElement || src instanceof HTMLVideoElement ||
          (window.SVGImageElement && src instanceof SVGImageElement);
      }

      function area(src) {
        const w = Number(src.naturalWidth || src.videoWidth || src.width) || 0;
        const h = Number(src.naturalHeight || src.videoHeight || src.height) || 0;
        return w * h;
      }

      function keepOriginal(src) {
        if (!src || typeof src !== "object" || isCanvas(src)) return false;
        if (src.__gsTrueDarkPreserve) return true;
        if (!isDomImage(src) && !(window.VideoFrame && src instanceof VideoFrame)) return false;
        const url = String(src.currentSrc || src.src || "");
        if (/googleusercontent|ggpht|lh[3-6]\\.google|googleapis\\.com|drive\\.google/i.test(url)) return true;
        return area(src) >= 32 * 32;
      }

      function hook(proto) {
        if (!proto || natives.has(proto) || typeof proto.drawImage !== "function") return;
        const original = proto.drawImage;
        natives.set(proto, original);
        proto.drawImage = function () {
          const image = arguments[0];
          if (bypass || !enabled() || !keepOriginal(image)) {
            return original.apply(this, arguments);
          }
          const prev = this.filter;
          this.filter = !prev || prev === "none" ? FILTER : (String(prev).includes("invert(") ? prev : prev + " " + FILTER);
          bypass += 1;
          try {
            return original.apply(this, arguments);
          } finally {
            bypass -= 1;
            this.filter = prev;
          }
        };
      }

      hook(window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype);
      hook(window.OffscreenCanvasRenderingContext2D && OffscreenCanvasRenderingContext2D.prototype);

      if (window.createImageBitmap) {
        const orig = createImageBitmap.bind(window);
        window.createImageBitmap = function (src) {
          const preserve = keepOriginal(src);
          return orig.apply(this, arguments).then((bitmap) => {
            if (preserve) bitmap.__gsTrueDarkPreserve = true;
            return bitmap;
          });
        };
      }
    })();`;

    const tryInject = () => {
      if (document.documentElement && document.documentElement.dataset.gsTrueDarkHook === "1") return true;
      try {
        const script = document.createElement("script");
        const nonceNode = document.querySelector("script[nonce]");
        const nonce = nonceNode && (nonceNode.nonce || nonceNode.getAttribute("nonce"));
        if (nonce) script.nonce = nonce;
        script.textContent = source;
        (document.documentElement || document.head).appendChild(script);
        script.remove();
        if (document.documentElement) document.documentElement.dataset.gsTrueDarkHook = "1";
        console.info(LOG, "canvas hook injected");
        return true;
      } catch (error) {
        console.warn(LOG, "canvas hook inject failed", error);
        return false;
      }
    };

    tryInject();
    document.addEventListener("DOMContentLoaded", tryInject, { once: true });
  }
})();
