/* ============================================================
   ALAB • Design System — komponenty Wyników badań (Moduł 7) i FAQ
   Źródło: sekcja „Wyniki badań” 2516:102053 w pliku Alab • Design
   (Listing 2516:102054, Empty state 2516:102079, Szczegóły badania 2516:102083,
   Dodatkowe informacje 2516:102151) oraz „Podstrony” 2265:66486 (FAQ + Webview).
   Wymaga ds/components.js.
   ============================================================ */
(function () {
  const DS = window.DS;
  const { esc, cls, attrs } = DS;

  // ---------- BadgeStatus (pill: ikona + etykieta) ----------
  // status: ok | warn | neutral; style: default (na białym) | oncolor (na granacie, półprzezroczysty)
  DS.BadgeStatus = ({ label = '', status = 'ok', style = 'default', value, icon, attrs: a } = {}) => {
    const ic = icon !== undefined ? icon : (status === 'ok' ? 'check-circle-fill' : status === 'warn' ? 'badge-warning' : null);
    return `<span class="${cls('ds', 'ds-BadgeStatus', 'ds-BadgeStatus--' + status, style === 'oncolor' && 'ds-BadgeStatus--oncolor')}" ${attrs(a)}>` +
      (ic ? DS.icon(ic, 16) : '') + `<span class="ds-BadgeStatus__label">${esc(label)}</span>` +
      (value != null ? `<span class="ds-BadgeStatus__sep">•</span><span class="ds-BadgeStatus__value">${esc(value)}</span>` : '') + `</span>`;
  };

  // ---------- CellTestResult (karta wyniku na liście) ----------
  // isNew = wariant „New”: 2 px obwódki Outline/borderActive, cień i delikatna aureola
  DS.CellTestResult = ({ id, title = '', person = '', date = '', badge, isNew = false, attrs: a } = {}) => {
    const { class: extra, ...rest } = a || {};
    return `<button type="button" class="${cls('ds', 'ds-CellTestResult', isNew && 'is-new', extra)}" ${attrs(rest)} ${id ? `data-result="${esc(id)}"` : ''}>` +
      `<span class="ds-CellTestResult__row"><span class="ds-CellTestResult__main">` +
      `<span class="ds-CellTestResult__head"><span class="ds-CellTestResult__title">${esc(title)}</span>` +
      `<span class="ds-CellTestResult__person">${DS.icon('user-01', 16)}<span>${esc(person)}</span></span></span>` +
      `<span class="ds-CellTestResult__date">${esc(date)}</span></span>` +
      DS.icon('chevron-right-20', 20, 'ds-CellTestResult__chevron') + `</span>` +
      (badge ? DS.BadgeStatus(badge) : '') + `</button>`;
  };

  // ---------- YearRule (nagłówek grupy: rok + linia) ----------
  DS.YearRule = ({ label = '' } = {}) =>
    `<div class="ds ds-YearRule"><span class="ds-YearRule__label">${esc(label)}</span><span class="ds-YearRule__line"></span></div>`;

  // ---------- ResultSummary („Aktualny wynik” — granatowa karta z pierścieniem) ----------
  DS.ResultSummary = ({ label = 'Aktualny wynik', ok = 0, total = 0, note = '', chips = [] } = {}) => {
    const p = total ? Math.round((ok / total) * 100) : 0;
    return `<section class="ds ds-ResultSummary">` +
      `<img class="ds-ResultSummary__art" src="${DS.ASSETS}il_alabek_hero.svg" alt="">` +
      `<p class="ds-ResultSummary__label">${esc(label)}</p>` +
      `<div class="ds-ResultSummary__value"><span class="ds-ResultSummary__ring" style="--p:${p}%"></span>` +
      `<span class="ds-ResultSummary__num">${esc(String(ok))}</span><span class="ds-ResultSummary__total">/ ${esc(String(total))}</span></div>` +
      `<p class="ds-ResultSummary__note">${esc(note)}</p>` +
      (chips.length ? `<div class="ds-ResultSummary__chips">${chips.map(c => DS.BadgeStatus({ label: c.label, value: c.value, icon: null, status: 'neutral', style: 'oncolor' })).join('')}</div>` : '') +
      `</section>`;
  };

  // ---------- SwitchableTabRow (segmenty: Wszystkie / Poza normą) ----------
  DS.SwitchableTabRow = ({ items = [], active, attrs: a } = {}) =>
    `<div class="ds ds-SwitchableTabRow" role="tablist" ${attrs(a)}>${items.map(it =>
      `<button type="button" role="tab" class="${cls('ds-SwitchableTabButton', it.id === active && 'is-active')}" aria-selected="${it.id === active}" data-tab-pick="${esc(it.id)}">${esc(it.label)}</button>`).join('')}</div>`;

  // ---------- AccordionGroup (grupa parametrów wyniku) ----------
  DS.AccordionGroup = ({ id, title = '', count, open = false, content = '', attrs: a } = {}) =>
    `<section class="${cls('ds', 'ds-AccordionGroup', open && 'is-open')}" ${attrs(a)} ${id ? `data-accordion="${esc(id)}"` : ''}>` +
    `<button type="button" class="ds-AccordionGroup__header" aria-expanded="${open}" data-accordion-toggle>` +
    `<span class="ds-AccordionGroup__title">${esc(title)}${count != null ? `<span class="ds-AccordionGroup__count"> • ${esc(String(count))}</span>` : ''}</span>` +
    `<span class="ds-AccordionGroup__icon">${DS.icon('chevron-down', 20)}</span></button>` +
    `<div class="ds-AccordionGroup__content" ${open ? '' : 'hidden'}>${content}</div></section>`;

  // ---------- AccordionCell (wiersz FAQ: ikona pytania + pytanie + odpowiedź) ----------
  DS.AccordionCell = ({ id, question = '', answer = '', open = false, attrs: a } = {}) =>
    `<section class="${cls('ds', 'ds-AccordionCell', open && 'is-open')}" ${attrs(a)} ${id ? `data-faq="${esc(id)}"` : ''}>` +
    `<button type="button" class="ds-AccordionCell__header" aria-expanded="${open}" data-faq-toggle>` +
    DS.icon('question-square', 20, 'ds-AccordionCell__mark') +
    `<span class="ds-AccordionCell__question">${esc(question)}</span>` +
    `<span class="ds-AccordionCell__icon">${DS.icon('chevron-down', 20)}</span></button>` +
    `<p class="ds-AccordionCell__answer" ${open ? '' : 'hidden'}>${esc(answer)}</p></section>`;

  // ---------- StatusLabel (status parametru: ikona + etykieta, bez tła) ----------
  // ok / negative → check; above / below → chevron; positive → trójkąt ostrzegawczy (konwencja z DS: StatusLabel 2483:41802)
  const STATUS_ICON = { ok: 'check-fill', neg: 'check-fill', above: 'chevron-up-single', below: 'chevron-up-single', pos: 'warning-fill' };
  DS.StatusLabel = ({ label = '', status = 'ok' } = {}) =>
    `<span class="${cls('ds', 'ds-StatusLabel', 'ds-StatusLabel--' + status)}">${DS.icon(STATUS_ICON[status] || 'check-fill', 16)}<span>${esc(label)}</span></span>`;

  // ---------- RangeSlider (pozycja wyniku na tle normy) ----------
  // Zielona strefa = zakres referencyjny (środkowe 50% toru), kropka = wynik pacjenta.
  // Wynik poza normą przyklejamy do krawędzi z marginesem 5% (konwencja z opisu komponentu w DS: 2483:41824).
  DS.RangeSlider = ({ min = 0, max = 1, value = 0, status = 'ok' } = {}) => {
    const span = (max - min) || 1;
    const t = (value - min) / span;                       // 0..1 w obrębie normy
    const pos = Math.max(5, Math.min(95, 25 + t * 50));   // norma zajmuje 25%..75% toru
    return `<div class="${cls('ds', 'ds-RangeSlider', 'ds-RangeSlider--' + status)}" role="img" aria-label="Wynik ${esc(String(value))}, norma od ${esc(String(min))} do ${esc(String(max))}">` +
      `<span class="ds-RangeSlider__track"></span><span class="ds-RangeSlider__zone"></span>` +
      `<span class="ds-RangeSlider__dot" style="left:${pos}%"></span></div>`;
  };

  // ---------- ParamRow (CellParameter: Qualitative | Value | Scale) ----------
  DS.ParamRow = ({ type = 'value', name = '', value = '', status = 'ok', statusLabel, norm, min, max, num } = {}) => {
    const label = statusLabel || (status === 'ok' ? 'W normie' : status === 'above' ? 'Powyżej normy' : status === 'below' ? 'Poniżej normy' : status === 'neg' ? 'Ujemny' : 'Dodatni');
    if (type === 'qual') {
      return `<div class="ds ds-ParamRow ds-ParamRow--qual"><span class="ds-ParamRow__name">${esc(name)}</span>${DS.StatusLabel({ label, status })}</div>`;
    }
    return `<div class="ds ds-ParamRow ds-ParamRow--stack">` +
      `<div class="ds-ParamRow__titleRow"><span class="ds-ParamRow__name">${esc(name)}</span><span class="ds-ParamRow__value">${esc(value)}</span></div>` +
      (type === 'scale' ? DS.RangeSlider({ min, max, value: num, status }) : '') +
      `<div class="ds-ParamRow__statusRow">${DS.StatusLabel({ label, status })}${norm ? `<span class="ds-ParamRow__norm">${esc(norm)}</span>` : ''}</div></div>`;
  };

  // ---------- ToastMessage (stała informacja w treści, wariant Info) ----------
  DS.ToastMessage = ({ title = '', body = '', action, actionAttrs, attrs: a } = {}) =>
    `<div class="ds ds-ToastMessage" role="note" ${attrs(a)}>${DS.icon('info-circle-fill', 20)}` +
    `<div class="ds-ToastMessage__text"><div class="ds-ToastMessage__head"><p class="ds-ToastMessage__title">${esc(title)}</p>` +
    (action ? `<button type="button" class="ds-ToastMessage__action" ${attrs(actionAttrs)}>${esc(action)}</button>` : '') + `</div>` +
    (body ? `<p class="ds-ToastMessage__body">${esc(body)}</p>` : '') + `</div></div>`;

  // ---------- CellContent (wiersz „etykieta + wartość” z ikoną — Dodatkowe informacje) ----------
  DS.CellContent = ({ icon = 'info-circle', label = '', value = '', attrs: a } = {}) =>
    `<div class="ds ds-CellContent" ${attrs(a)}>${DS.icon(icon, 24)}<div class="ds-CellContent__text">` +
    `<p class="ds-CellContent__label">${esc(label)}</p><p class="ds-CellContent__value">${esc(value)}</p></div></div>`;
})();
