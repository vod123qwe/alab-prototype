/* ============================================================
   ALAB • Design System — komponenty (JS, bez buildu)
   Każda funkcja zwraca string HTML. Nazwy i właściwości odpowiadają
   masterom w Figmie (Button: Type/State, IconButton: Variant/Size…).
   Wymaga: ds/icons.js (DS.ICONS), ds/tokens.css, ds/components.css
   ============================================================ */
(function () {
  const DS = window.DS = window.DS || {};

  // ---------- helpers ----------
  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const cls = (...xs) => xs.filter(Boolean).join(' ');
  const attrs = (o) => Object.entries(o || {})
    .filter(([, v]) => v !== false && v != null)
    .map(([k, v]) => v === true ? k : `${k}="${esc(v)}"`).join(' ');
  DS.esc = esc; DS.cls = cls; DS.attrs = attrs;

  DS.ASSETS = DS.ASSETS || 'ds/assets/'; // nadpisz przed użyciem, gdy strona leży w podfolderze

  // ---------- Icon ----------
  DS.icon = (name, size, extra) => {
    const svg = DS.ICONS[name];
    if (!svg) return `<span class="ds-icon ${size ? 'ds-icon--' + size : ''}" data-missing-icon="${esc(name)}"></span>`;
    return `<span class="${cls('ds-icon', size && 'ds-icon--' + size, extra)}" aria-hidden="true">${svg}</span>`;
  };
  // Znacznik ptaszka w checkboxie (nie ma go w assetach DS → prosty path)
  const CHECK = '<svg viewBox="0 0 16 16" fill="none"><path d="M3.5 8.5l3 3 6-7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  // ---------- Button ----------
  // type: primary | secondary | oncolor | ghost | loyalty ; state: default | disabled | loading
  DS.Button = ({ label = 'Button', type = 'primary', state = 'default', leadingIcon, trailingIcon, block, tag = 'button', attrs: a } = {}) => {
    const c = cls('ds', 'ds-Button', 'ds-Button--' + type, block && 'ds-Button--block',
      state === 'disabled' && 'is-disabled', state === 'loading' && 'is-loading');
    const dis = state !== 'default' ? 'disabled aria-disabled="true"' : '';
    return `<${tag} class="${c}" ${tag === 'button' ? 'type="button"' : ''} ${dis} ${attrs(a)}>` +
      (state === 'loading' ? DS.icon('loading', 20, 'ds-icon--spin') : '') +
      (leadingIcon ? `<span class="ds-Button__icon">${DS.icon(leadingIcon, 20)}</span>` : '') +
      `<span class="ds-Button__label">${esc(label)}</span>` +
      (trailingIcon ? `<span class="ds-Button__icon">${DS.icon(trailingIcon, 20)}</span>` : '') +
      `</${tag}>`;
  };

  // ---------- ButtonTiny ----------
  // variant: primary | secondary | tertiary | link
  DS.ButtonTiny = ({ label = 'Sprawdź', variant = 'primary', leadingIcon, trailingIcon, attrs: a } = {}) =>
    `<button type="button" class="${cls('ds', 'ds-ButtonTiny', 'ds-ButtonTiny--' + variant)}" ${attrs(a)}>` +
    (leadingIcon ? DS.icon(leadingIcon, 16) : '') +
    `<span class="ds-ButtonTiny__label">${esc(label)}</span>` +
    (trailingIcon ? DS.icon(trailingIcon, 16) : '') + `</button>`;

  // ---------- NumberIndicator ----------
  DS.NumberIndicator = ({ value = 1 } = {}) => {
    const n = Number(value);
    return `<span class="ds ds-NumberIndicator">${n > 99 ? '99+' : esc(value)}</span>`;
  };

  // ---------- IconButton ----------
  // variant: transparent | onscrim | withbg ; size: large | medium | small
  DS.IconButton = ({ icon = 'chevron-left', variant = 'transparent', size = 'large', enabled = true, loading = false, badge, label, attrs: a } = {}) => {
    const c = cls('ds', 'ds-IconButton', 'ds-IconButton--' + variant, 'ds-IconButton--' + size,
      !enabled && 'is-disabled', loading && 'is-loading');
    return `<button type="button" class="${c}" ${label ? `aria-label="${esc(label)}"` : ''} ${!enabled ? 'disabled' : ''} ${attrs(a)}>` +
      (loading ? DS.icon('loading', null, 'ds-icon--spin') : DS.icon(icon)) +
      (badge != null && badge !== false ? `<span class="ds-IconButton__badge">${DS.NumberIndicator({ value: badge })}</span>` : '') +
      `</button>`;
  };

  // ---------- Flag / Prefix ----------
  DS.Flag = (code = 'pl') => `<span class="ds-Flag"><img src="${DS.ASSETS}flags/${esc(code)}.svg" alt=""></span>`;
  DS.Prefix = ({ flag = 'pl', code = '+ 48', attrs: a } = {}) =>
    `<button type="button" class="ds-Prefix" ${attrs(a)}>${DS.Flag(flag)}<span class="ds-Prefix__code">${esc(code)}</span>` +
    `<span class="ds-icon ds-icon--16" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span></button>`;

  // ---------- TextField ----------
  // state: default | focused | error | disabled ; leading: { icon } | { prefix: {flag, code} } ; trailing: { icon, action }
  DS.TextField = ({ id, name, label = 'Label', value = '', type = 'text', state = 'default', helper, helperIcon = 'info-square',
    error, leading, trailing, inputAttrs, attrs: a } = {}) => {
    const hasValue = value !== '' && value != null;
    const isErr = state === 'error' || !!error;
    const c = cls('ds', 'ds-TextField', (hasValue || state === 'focused') && 'is-active', state === 'focused' && 'is-focused',
      isErr && 'is-error', state === 'disabled' && 'is-disabled');
    const inputId = id || ('tf-' + Math.random().toString(36).slice(2, 8));
    const lead = leading ? `<span class="ds-TextField__leading">${leading.prefix ? DS.Prefix(leading.prefix) : DS.icon(leading.icon, 20)}</span>` : '';
    const trail = trailing ? `<span class="ds-TextField__trailing">${trailing.action
      ? `<button type="button" aria-label="${esc(trailing.label || '')}" ${attrs(trailing.attrs)}>${DS.icon(trailing.icon, 20)}</button>`
      : DS.icon(trailing.icon, 20)}</span>` : '';
    const helpText = error || helper;
    const help = helpText ? `<div class="ds-TextField__helper">${DS.icon(helperIcon, 16)}<p>${esc(helpText)}</p></div>` : '';
    return `<div class="${c}" ${attrs(a)}>` +
      `<label class="ds-TextField__box" for="${inputId}">${lead}` +
      `<span class="ds-TextField__content"><span class="ds-TextField__label">${esc(label)}</span>` +
      `<input class="ds-TextField__input" id="${inputId}" ${name ? `name="${esc(name)}"` : ''} type="${esc(type)}" value="${esc(value)}" ` +
      `${state === 'disabled' ? 'disabled' : ''} placeholder="${esc(label)}" ${attrs(inputAttrs)}></span>${trail}</label>${help}</div>`;
  };

  // ---------- InputCode ----------
  DS.InputCode = ({ length = 6, value = '', active = null, error = false, attrs: a } = {}) => {
    const digits = String(value).split('');
    const act = active == null ? Math.min(digits.length, length - 1) : active;
    const cell = (i) => {
      const pos = i % 3 === 0 ? 'left' : (i % 3 === 2 ? 'right' : 'middle');
      const isActive = i === act;
      const d = digits[i];
      return `<div class="${cls('ds-CodeCell', 'ds-CodeCell--' + pos, isActive && 'is-active')}" data-index="${i}">` +
        (d != null ? `<span class="ds-CodeCell__digit">${esc(d)}</span>` : (isActive ? '<span class="ds-CodeCell__cursor"></span>' : '<span class="ds-CodeCell__dot"></span>')) + `</div>`;
    };
    const groups = [];
    for (let g = 0; g < length; g += 3) groups.push(`<div class="ds-InputCode__group">${[0, 1, 2].map(i => g + i < length ? cell(g + i) : '').join('')}</div>`);
    return `<div class="${cls('ds', 'ds-InputCode', error && 'is-error')}" data-length="${length}" ${attrs(a)}>` + groups.join('') +
      `<input class="ds-InputCode__hidden" inputmode="numeric" autocomplete="one-time-code" maxlength="${length}" value="${esc(value)}" aria-label="Kod SMS"></div>`;
  };

  // ---------- Checkbox / Radio ----------
  DS.Checkbox = ({ checked = false, error = false, disabled = false, attrs: a } = {}) =>
    `<span class="${cls('ds', 'ds-Checkbox', checked && 'is-checked', error && 'is-error', disabled && 'is-disabled')}" role="checkbox" aria-checked="${checked}" tabindex="0" ${attrs(a)}>${CHECK}</span>`;
  DS.Radio = ({ checked = false, disabled = false, attrs: a } = {}) =>
    `<span class="${cls('ds', 'ds-Radio', checked && 'is-checked', disabled && 'is-disabled')}" role="radio" aria-checked="${checked}" tabindex="0" ${attrs(a)}></span>`;

  // ---------- SelectableCell ----------
  DS.SelectableCell = ({ variant = 'checkbox', checked = false, title = 'Title', subtitle, required = false, requiredText = '* Wymagane',
    action, actionAttrs, expanded, error = false, attrs: a } = {}) =>
    `<div class="${cls('ds', 'ds-SelectableCell', error && 'is-error')}" ${attrs(a)}>` +
    (variant === 'radio' ? DS.Radio({ checked }) : DS.Checkbox({ checked, error })) +
    `<div class="ds-SelectableCell__content">` +
    `<div><p class="ds-SelectableCell__title">${esc(title)}</p>` +
    (subtitle ? `<p class="ds-SelectableCell__subtitle">${esc(subtitle)}</p>` : '') + `</div>` +
    (required ? `<p class="ds-SelectableCell__required">${esc(requiredText)}</p>` : '') +
    (action ? `<button type="button" class="ds-SelectableCell__action" ${attrs(actionAttrs)}>${esc(action)}</button>` : '') +
    (expanded ? `<p class="ds-SelectableCell__expanded">${esc(expanded)}</p>` : '') +
    `</div></div>`;

  // ---------- FilterChip ----------
  DS.FilterChip = ({ label = 'Chip', selected = false, fill = false, style, count, attrs: a } = {}) => {
    const { class: extra, ...rest } = a || {};
    return `<button type="button" class="${cls('ds', 'ds-FilterChip', style === 'oncolor' && 'ds-FilterChip--oncolor', selected && 'is-selected', fill && 'ds-FilterChip--fill', extra)}" aria-pressed="${selected}" ${attrs(rest)}>${esc(label)}${count != null ? `<span class="ds-FilterChip__count">• ${count}</span>` : ''}</button>`;
  };

  // ---------- StepsIndicator ----------
  DS.StepsIndicator = ({ steps = 3, current = 1, label = '', text = true, onScrim = false, stepLabel } = {}) => {
    const bars = Array.from({ length: steps }, (_, i) => `<span class="${cls('ds-LineIndicator', i < current && 'is-active')}"></span>`).join('');
    const right = stepLabel ? stepLabel(current, steps) : `Krok ${current} z ${steps}`;
    return `<div class="${cls('ds', 'ds-StepsIndicator', onScrim && 'ds-StepsIndicator--onscrim')}">` +
      `<div class="ds-StepsIndicator__bars">${bars}</div>` +
      (text ? `<div class="ds-StepsIndicator__labels"><span>${esc(label)}</span><span>${esc(right)}</span></div>` : '') + `</div>`;
  };

  // ---------- StatusBar / HomeIndicator / TopBar ----------
  const LEVELS = '<svg viewBox="0 0 86 13" fill="none"><rect x="0" y="9" width="3" height="4" rx="1" fill="currentColor"/><rect x="5" y="7" width="3" height="6" rx="1" fill="currentColor"/><rect x="10" y="4" width="3" height="9" rx="1" fill="currentColor"/><rect x="15" y="1" width="3" height="12" rx="1" fill="currentColor"/><path d="M31.5 3.2a9 9 0 0 1 11 0l-1.3 1.6a7 7 0 0 0-8.4 0L31.5 3.2Zm2.3 2.9a5.8 5.8 0 0 1 6.4 0l-1.3 1.6a3.7 3.7 0 0 0-3.8 0l-1.3-1.6Zm2.3 2.9a2.5 2.5 0 0 1 1.9 0L37 11l-.9-2Z" fill="currentColor"/><rect x="58" y="0.5" width="24" height="12" rx="3.5" stroke="currentColor" stroke-opacity=".35"/><rect x="60" y="2.5" width="20" height="8" rx="2" fill="currentColor"/><path d="M83.5 4.5v4a2 2 0 0 0 0-4Z" fill="currentColor" fill-opacity=".4"/></svg>';
  DS.StatusBar = ({ light = false, time = '9:41' } = {}) =>
    `<div class="${cls('ds', 'ds-StatusBar', light && 'ds-StatusBar--light')}"><div class="ds-StatusBar__time">${esc(time)}</div><div class="ds-StatusBar__island"></div><div class="ds-StatusBar__levels">${LEVELS}</div></div>`;
  DS.HomeIndicator = ({ light = false } = {}) =>
    `<div class="${cls('ds', 'ds-HomeIndicator', light && 'ds-HomeIndicator--light')}"><span class="ds-HomeIndicator__bar"></span></div>`;

  // leading: icon name | false ; trailing: {icon, attrs} | false
  DS.TopBar = ({ leading = 'chevron-left', leadingAttrs, trailing = false, title, subtitle, statusBar = true, transparent = false, light = false } = {}) =>
    `<div class="${cls('ds', 'ds-TopBar', transparent && 'ds-TopBar--transparent')}">` +
    (statusBar ? DS.StatusBar({ light }) : '') +
    `<div class="ds-TopBar__wrapper">` +
    (leading ? `<div class="ds-TopBar__leading">${DS.IconButton({ icon: leading, size: 'medium', variant: light ? 'onscrim' : 'transparent', label: 'Wstecz', attrs: leadingAttrs || { 'data-action': 'back' } })}</div>` : '') +
    `<div class="ds-TopBar__title">${title ? `<p class="ds-TopBar__header">${esc(title)}</p>` : ''}${subtitle ? `<p class="ds-TopBar__subtitle">${esc(subtitle)}</p>` : ''}</div>` +
    (trailing ? `<div class="ds-TopBar__trailing">${DS.IconButton({ icon: trailing.icon, size: 'medium', variant: light ? 'onscrim' : 'transparent', label: trailing.label, attrs: trailing.attrs })}</div>` : '') +
    `</div></div>`;

  // ---------- BottomActionsBar ----------
  DS.BottomActionsBar = ({ buttons = [], layout = 'vertical', homeIndicator = true, attrs: a } = {}) =>
    `<div class="${cls('ds', 'ds-BottomActionsBar', layout === 'horizontal' && 'ds-BottomActionsBar--horizontal')}" ${attrs(a)}>` +
    `<div class="ds-BottomActionsBar__buttons">${buttons.join('')}</div>` + (homeIndicator ? DS.HomeIndicator() : '') + `</div>`;

  // ---------- presentSheet: arkusz w #overlay z gestem zamykania jak w iOS (UISheetPresentationController) ----------
  // Ciągnięcie w dół przesuwa arkusz 1:1 za palcem i rozjaśnia scrim, odsłaniając ekran pod spodem. Puszczenie poniżej progu
  // (30% wysokości albo szybki ruch) zamyka arkusz, inaczej wraca sprężyście. Z treści przewijalnej gest startuje tylko na jej górze.
  DS.presentSheet = ({ title, subtitle, content = '', closeAttrs, height, onClose, className } = {}) => {
    const host = document.getElementById('overlay') || document.body;
    const wrap = document.createElement('div'); wrap.className = cls('ds', 'ds-SheetLayer', className); wrap.style.cssText = (host === document.body ? 'position:fixed;' : 'position:absolute;') + 'inset:0;z-index:20';
    const closeSel = Object.entries(closeAttrs || { 'data-action': 'sheet-close' }).map(([k, v]) => `[${k}="${v}"]`).join('');
    wrap.innerHTML = `<div class="ds-Scrim" data-sheet="scrim"></div>` + DS.BottomSheet({ title, subtitle, content, closeAttrs: closeAttrs || { 'data-action': 'sheet-close' }, attrs: { style: height ? `height:${height}` : '' } });
    const sheet = wrap.querySelector('.ds-BottomSheet'), scrim = wrap.querySelector('.ds-Scrim');
    let closed = false, swallow = false;
    const close = (animate = true) => {
      if (closed) return; closed = true;
      if (!animate) { wrap.remove(); onClose && onClose(); return; }
      sheet.style.animation = 'none'; scrim.style.animation = 'none'; void sheet.offsetWidth;
      sheet.classList.add('is-closing'); sheet.style.transform = 'translateY(105%)'; scrim.style.opacity = '0';
      setTimeout(() => { wrap.remove(); onClose && onClose(); }, 320);
    };
    wrap.addEventListener('click', (e) => { if (swallow) { swallow = false; e.stopPropagation(); e.preventDefault(); return; } if (e.target === scrim || e.target.closest(closeSel)) close(); }, true);
    let drag = null;
    const start = (y, target) => { const sc = sheet.querySelector('.ds-BottomSheet__scroll'); drag = { y0: y, y, t0: performance.now(), h: sheet.offsetHeight, sc: sc && sc.contains(target) ? sc : null, active: false, ignore: false }; };
    const move = (y, ev) => {
      if (!drag || drag.ignore) return;
      const dy = y - drag.y0; drag.y = y;
      if (!drag.active) {
        if (Math.abs(dy) < 4) return;
        if (dy < 0 || (drag.sc && drag.sc.scrollTop > 0)) { drag.ignore = true; return; }
        drag.active = true; sheet.style.animation = 'none'; scrim.style.animation = 'none'; sheet.classList.add('is-dragging'); scrim.classList.add('is-dragging');
      }
      if (ev && ev.cancelable) ev.preventDefault();
      const off = Math.max(0, dy); sheet.style.transform = `translateY(${off}px)`; scrim.style.opacity = String(Math.max(0, 1 - off / drag.h));
    };
    const end = () => {
      if (!drag) return; const d = drag; drag = null; if (!d.active) return;
      swallow = true; setTimeout(() => { swallow = false; }, 50);
      const off = Math.max(0, d.y - d.y0), v = off / Math.max(1, performance.now() - d.t0);
      sheet.classList.remove('is-dragging'); scrim.classList.remove('is-dragging');
      if (off > d.h * 0.3 || v > 0.6) return close();
      sheet.classList.add('is-closing'); sheet.style.transform = ''; scrim.style.opacity = '';
      setTimeout(() => sheet.classList.remove('is-closing'), 320);
    };
    sheet.addEventListener('touchstart', (e) => start(e.touches[0].clientY, e.target), { passive: true });
    sheet.addEventListener('touchmove', (e) => move(e.touches[0].clientY, e), { passive: false });
    sheet.addEventListener('touchend', end); sheet.addEventListener('touchcancel', end);
    sheet.addEventListener('mousedown', (e) => { if (e.button !== 0 || e.target.closest('input, textarea')) return; start(e.clientY, e.target); const mv = (ev) => move(ev.clientY, ev), up = () => { end(); window.removeEventListener('mousemove', mv); window.removeEventListener('mouseup', up); }; window.addEventListener('mousemove', mv); window.addEventListener('mouseup', up); });
    host.appendChild(wrap); DS.enhance(wrap);
    return { wrap, sheet, close };
  };

  // ---------- haptic: lekka wibracja potwierdzenia ----------
  // Android/Chrome: navigator.vibrate. iOS Safari nie ma Vibration API — od iOS 18 haptyk systemowy wyzwala przełącznik
  // <input type="checkbox" switch> klikany przez label (workaround, do zweryfikowania na telefonie).
  DS.haptic = (kind = 'light') => {
    const ms = kind === 'medium' ? 20 : kind === 'success' ? [10, 40, 10] : 10;
    if (navigator.vibrate) { try { navigator.vibrate(ms); return; } catch (_) { /* brak wsparcia */ } }
    let l = document.getElementById('ds-haptic');
    if (!l) { l = document.createElement('label'); l.id = 'ds-haptic'; l.setAttribute('aria-hidden', 'true'); l.style.cssText = 'position:fixed;left:-9999px;top:0;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none'; l.innerHTML = '<input type="checkbox" switch tabindex="-1">'; document.body.appendChild(l); }
    try { l.click(); } catch (_) { /* ignoruj */ }
  };

  // ---------- Snackbar ----------
  DS.Snackbar = ({ text = 'Message text', type = 'success', icon, attrs: a } = {}) =>
    `<div class="${cls('ds', 'ds-Snackbar', 'ds-Snackbar--' + type)}" role="status" ${attrs(a)}>${DS.icon(icon || (type === 'success' ? 'check-circle' : 'info-square'), 20)}<p>${esc(text)}</p></div>`;

  DS.Divider = () => `<div class="ds ds-Divider" role="separator"></div>`;

  // ---------- BottomSheet ----------
  DS.BottomSheet = ({ title = '', subtitle, content = '', closeAttrs, attrs: a } = {}) =>
    `<div class="ds ds-BottomSheet" role="dialog" aria-modal="true" ${attrs(a)}><span class="ds-BottomSheet__handle"></span>` +
    `<div class="ds-BottomSheet__slot"><div class="ds-BottomSheet__head"><div class="ds-BottomSheet__header"><p class="ds-BottomSheet__title">${esc(title)}</p>` +
    DS.IconButton({ icon: 'x', variant: 'withbg', size: 'small', label: 'Zamknij', attrs: closeAttrs || { 'data-action': 'sheet-close' } }) +
    `</div>${subtitle ? `<p class="ds-BottomSheet__subtitle">${esc(subtitle)}</p>` : ''}</div>${content}</div>${DS.HomeIndicator()}</div>`;

  // ---------- CellSelectCountry ----------
  DS.CellSelectCountry = ({ name = 'Polska', code = '+ 48', flag = 'pl', checked = false, attrs: a } = {}) =>
    `<div class="ds ds-CellSelectCountry" ${attrs(a)}>${DS.Radio({ checked })}<div class="ds-CellSelectCountry__row">` +
    `<span class="ds-CellSelectCountry__name">${esc(name)}</span><span class="ds-CellSelectCountry__sep"></span>` +
    `<span class="ds-CellSelectCountry__code">${esc(code)}</span></div>${DS.Flag(flag)}</div>`;

  // ---------- ScreenState ----------
  DS.ScreenState = ({ asset, title = '', body = '', buttons = [] } = {}) =>
    `<div class="ds ds-ScreenState"><div class="ds-ScreenState__content">` +
    (asset ? `<div class="ds-ScreenState__asset"><img src="${esc(asset)}" alt=""></div>` : '') +
    `<div class="ds-ScreenState__text"><p class="ds-ScreenState__title">${esc(title)}</p><p class="ds-ScreenState__body">${esc(body)}</p></div></div>` +
    buttons.join('') + `</div>`;

  // ---------- CarouselCell (ALAB club) ----------
  DS.CarouselCell = ({ icon = 'tag', title = '', sub = '' } = {}) =>
    `<div class="ds ds-CarouselCell"><span class="ds-CarouselCell__icon">${DS.icon(icon, 20)}</span><div class="ds-CarouselCell__text"><p class="ds-CarouselCell__title">${esc(title)}</p><p class="ds-CarouselCell__sub">${esc(sub)}</p></div></div>`;

  // ============================================================
  // Zachowania (progressive enhancement po wyrenderowaniu HTML)
  // ============================================================
  DS.enhance = (root = document) => {
    // TextField: klasy stanu na focus/blur/input, podgląd hasła
    root.querySelectorAll('.ds-TextField').forEach(tf => {
      if (tf.dataset.enhanced) return; tf.dataset.enhanced = '1';
      const input = tf.querySelector('.ds-TextField__input');
      if (!input) return;
      const sync = () => { tf.classList.toggle('is-active', document.activeElement === input || input.value !== ''); };
      input.addEventListener('focus', () => { tf.classList.add('is-focused'); sync(); });
      input.addEventListener('blur', () => { tf.classList.remove('is-focused'); sync(); });
      input.addEventListener('input', () => { tf.classList.remove('is-error'); sync(); tf.dispatchEvent(new CustomEvent('ds:input', { bubbles: true, detail: { value: input.value } })); });
      const eye = tf.querySelector('[data-ds="toggle-password"]');
      if (eye) eye.addEventListener('click', (e) => { e.preventDefault(); input.type = input.type === 'password' ? 'text' : 'password'; input.focus(); });
      sync();
    });
    // InputCode: ukryty input zbiera cyfry, komórki odzwierciedlają stan
    root.querySelectorAll('.ds-InputCode').forEach(ic => {
      if (ic.dataset.enhanced) return; ic.dataset.enhanced = '1';
      const hidden = ic.querySelector('.ds-InputCode__hidden');
      const len = Number(ic.dataset.length) || 6;
      const paint = () => {
        const v = hidden.value.replace(/\D/g, '').slice(0, len); hidden.value = v;
        const act = Math.min(v.length, len - 1);
        ic.querySelectorAll('.ds-CodeCell').forEach((c, i) => {
          c.classList.toggle('is-active', i === act && document.activeElement === hidden);
          c.innerHTML = v[i] != null ? `<span class="ds-CodeCell__digit">${esc(v[i])}</span>` : (i === act && document.activeElement === hidden ? '<span class="ds-CodeCell__cursor"></span>' : '<span class="ds-CodeCell__dot"></span>');
        });
        ic.dispatchEvent(new CustomEvent('ds:code', { bubbles: true, detail: { value: v, complete: v.length === len } }));
      };
      hidden.addEventListener('input', () => { ic.classList.remove('is-error'); paint(); });
      hidden.addEventListener('focus', paint); hidden.addEventListener('blur', paint);
      ic.addEventListener('click', () => hidden.focus());
    });
  };

  // Ustawienie błędu na TextField po fakcie (walidacja)
  DS.setFieldError = (tf, message) => {
    if (!tf) return;
    let help = tf.querySelector('.ds-TextField__helper');
    if (message) {
      tf.classList.add('is-error');
      if (!help) { help = document.createElement('div'); help.className = 'ds-TextField__helper'; tf.appendChild(help); }
      help.innerHTML = DS.icon('info-square', 16) + `<p>${esc(message)}</p>`;
      help.dataset.error = '1';
    } else {
      tf.classList.remove('is-error');
      if (help && help.dataset.error) { const orig = tf.dataset.helper; if (orig) { help.innerHTML = DS.icon('info-square', 16) + `<p>${esc(orig)}</p>`; delete help.dataset.error; } else help.remove(); }
    }
  };
})();
