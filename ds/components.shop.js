/* ============================================================
   ALAB • Design System — komponenty sklepu (Moduł 3)
   Źródło: „Sklep • Strona główna” 656:7311, „Wyszukiwarka • Start/Podpowiedzi/Brak wyników”
   (1177:15512-15514) w pliku Alab • Design. Wymaga ds/components.js.
   ============================================================ */
(function () {
  const DS = window.DS;
  const { esc, cls, attrs } = DS;

  // ---------- SearchField (Style: onColor | Solid; State: Default | Active) ----------
  // onColor = placeholder na granatowym hero (klik otwiera wyszukiwarkę); active = prawdziwe pole z caretem, Clear i „Anuluj”
  DS.SearchField = ({ style = 'oncolor', state = 'default', value = '', placeholder = 'Szukaj badania...', cancel = true, id = 'search-input', attrs: a, inputAttrs } = {}) => {
    if (state !== 'active') {
      return `<button type="button" class="${cls('ds', 'ds-SearchField', 'ds-SearchField--' + style)}" ${attrs(a)}>` +
        `<span class="ds-SearchField__field">${DS.icon('search-md', 24)}<span class="ds-SearchField__placeholder">${esc(placeholder)}</span></span></button>`;
    }
    return `<div class="${cls('ds', 'ds-SearchField', 'ds-SearchField--solid', 'is-active', value && 'has-value')}" ${attrs(a)}>` +
      `<label class="ds-SearchField__field" for="${esc(id)}">${DS.icon('search-md', 24)}` +
      `<input class="ds-SearchField__input" id="${esc(id)}" type="search" autocomplete="off" autocorrect="off" spellcheck="false" enterkeyhint="search" placeholder="${esc(placeholder)}" value="${esc(value)}" ${attrs(inputAttrs)}>` +
      `<button type="button" class="ds-SearchField__clear" aria-label="Wyczyść" data-ds="search-clear">${DS.icon('clear', 20)}</button></label>` +
      (cancel ? `<button type="button" class="ds-SearchField__cancel" data-action="search-cancel">Anuluj</button>` : '') + `</div>`;
  };

  // ---------- BottomTabBar ----------
  DS.BottomTabBar = ({ items = [], active = 'shop', attrs: a } = {}) =>
    `<nav class="ds ds-BottomTabBar" aria-label="Nawigacja dolna" ${attrs(a)}>${DS.Divider()}<div class="ds-BottomTabBar__items">` +
    items.map(it => `<button type="button" class="${cls('ds-BottomTabItem', it.id === active && 'is-active')}" data-tab="${esc(it.id)}" aria-current="${it.id === active ? 'page' : 'false'}">` +
      `<span class="ds-BottomTabItem__icon">${DS.icon(it.id === active && it.iconActive ? it.iconActive : it.icon, 24)}${it.badge ? `<span class="ds-BottomTabItem__badge">${DS.NumberIndicator({ value: it.badge })}</span>` : ''}</span>` +
      `<span class="ds-BottomTabItem__label">${esc(it.label)}</span></button>`).join('') +
    `</div>${DS.HomeIndicator({ attrs: { class: 'ds-BottomTabBar__home' } })}</nav>`;

  // ---------- CategoryTile (Variant: Default | All) ----------
  DS.CategoryTile = ({ icon = 'test-tube', label = 'Kategoria', all = false, attrs: a } = {}) =>
    `<button type="button" class="${cls('ds', 'ds-CategoryTile', all && 'ds-CategoryTile--all')}" ${attrs(a)}>${DS.icon(icon, 24)}<span class="ds-CategoryTile__label">${esc(label)}</span></button>`;

  // ---------- SectionHeader ----------
  DS.SectionHeader = ({ title = '', action, actionAttrs } = {}) =>
    `<div class="ds ds-SectionHeader"><p class="ds-SectionHeader__title">${esc(title)}</p>${action ? `<button type="button" class="ds-SectionHeader__action" ${attrs(actionAttrs)}>${esc(action)}</button>` : ''}</div>`;

  // ---------- CellOrderTypeStatus (lokalizacja punktu) ----------
  DS.CellOrderTypeStatus = ({ icon = 'location-check', title = 'Puławska 10, Warszawa', status = 'Dziś otwarte 7:00 - 11:00', attrs: a } = {}) =>
    `<button type="button" class="ds ds-CellOrderTypeStatus" ${attrs(a)}>${DS.icon(icon, 24)}<span class="ds-CellOrderTypeStatus__text"><span class="ds-CellOrderTypeStatus__title">${esc(title)}</span><span class="ds-CellOrderTypeStatus__status">${esc(status)}${DS.icon('chevron-right', 16)}</span></span></button>`;

  // ---------- Cell (wiersz listy: ikona 24 + tytuł + podtytuł + chevron) ----------
  // titleHtml pozwala podać gotowe HTML (np. podświetlenie frazy w podpowiedziach)
  DS.Cell = ({ icon = 'file-note-search', title = '', titleHtml, subtitle, trailing = 'chevron-right', attrs: a } = {}) =>
    `<button type="button" class="ds ds-Cell" ${attrs(a)}>${icon ? DS.icon(icon, 24) : ''}<span class="ds-Cell__content"><span class="ds-Cell__title">${titleHtml || esc(title)}</span>${subtitle ? `<span class="ds-Cell__subtitle">${esc(subtitle)}</span>` : ''}</span>${trailing ? DS.icon(trailing, 16, 'ds-Cell__trailing') : ''}</button>`;

  // ---------- Badges ----------
  DS.BadgePrice = ({ label = '-20%' } = {}) => `<span class="ds ds-BadgePrice">${esc(label)}</span>`;
  DS.BadgeCode = ({ discount = '-20%', text = 'z kodem JESIEN20' } = {}) => `<span class="ds ds-BadgeCode">${DS.BadgePrice({ label: discount })}<span>${esc(text)}</span></span>`;
  DS.BadgePremium = ({ text = 'Niższa cena z ALAB Club' } = {}) => `<span class="ds ds-BadgePremium">${DS.icon('alabek', 16)}<span>${esc(text)}</span></span>`;
  DS.BadgeBasic = ({ text = 'Niedostępne w wybranym punkcie', icon = 'unavailable' } = {}) => `<span class="ds ds-BadgeBasic">${DS.icon(icon, 16)}<span>${esc(text)}</span></span>`;

  // ---------- ProductCard (CellPackage / CellTest) ----------
  // badge: {code:{discount,text}} | {premium:text} | {basic:text}; price: {current, old, club, lowest, note}
  DS.ProductCard = ({ id, kind = 'test', meta = '', title = '', badge, price, cta = 'Do koszyka', ctaVariant = 'primary', footer, attrs: a } = {}) => {
    const badgeHtml = !badge ? '' : badge.code ? DS.BadgeCode(badge.code) : badge.premium ? DS.BadgePremium({ text: badge.premium }) : DS.BadgeBasic({ text: badge.basic });
    const priceHtml = !price ? '' : `<div class="ds-ProductCard__price">` +
      `<div class="ds-ProductCard__priceMain"><div class="ds-ProductCard__priceRow"><span class="ds-ProductCard__current">${esc(price.current)}</span>${price.old ? `<s class="ds-ProductCard__old">${esc(price.old)}</s>` : ''}</div>` +
      (price.club ? `<p class="ds-ProductCard__club">${esc(price.club)}</p>` : '') + `</div>` +
      `<div class="ds-ProductCard__notes">${price.lowest ? `<p>${esc(price.lowest)}</p>` : ''}${price.note ? `<p>${esc(price.note)}</p>` : ''}</div></div>`;
    return `<article class="${cls('ds', 'ds-ProductCard', 'ds-ProductCard--' + kind)}" ${attrs(a)} ${id ? `data-product="${esc(id)}"` : ''}>` +
      `<div class="ds-ProductCard__surface"><div class="ds-ProductCard__text">${badgeHtml}<div class="ds-ProductCard__heading"><p class="ds-ProductCard__meta">${esc(meta)}</p><p class="ds-ProductCard__title">${esc(title)}</p></div>${priceHtml}</div>` +
      `<button type="button" class="${cls('ds-ButtonTiny', 'ds-ButtonTiny--' + ctaVariant, 'ds-ProductCard__cta')}" data-action="${ctaVariant === 'primary' ? 'add-to-cart' : 'change-point'}" data-title="${esc(title)}"><span class="ds-ButtonTiny__label">${esc(cta)}</span></button></div>` +
      (footer ? `<button type="button" class="ds-ProductCard__footer" data-action="package-details"><span>${esc(footer.label)}</span><span class="ds-ProductCard__footerCount">&nbsp;• ${esc(footer.count)}</span>${DS.icon('chevron-right', 16)}</button>` : '') + `</article>`;
  };

  // ---------- EmptyState (wyszukiwarka: brak wyników) ----------
  DS.SearchEmpty = ({ icon = 'heart-rate', title = '', hint = '' } = {}) =>
    `<div class="ds ds-SearchEmpty">${DS.icon(icon, null, 'ds-SearchEmpty__icon')}<div class="ds-SearchEmpty__text"><p class="ds-SearchEmpty__title">${esc(title)}</p><p class="ds-SearchEmpty__hint">${esc(hint)}</p></div></div>`;

  // ---------- zachowania ----------
  const baseEnhance = DS.enhance;
  DS.enhance = (root = document) => {
    baseEnhance(root);
    root.querySelectorAll('.ds-SearchField.is-active').forEach(sf => {
      if (sf.dataset.enhanced) return; sf.dataset.enhanced = '1';
      const input = sf.querySelector('.ds-SearchField__input');
      const sync = () => sf.classList.toggle('has-value', input.value !== '');
      input.addEventListener('input', () => { sync(); sf.dispatchEvent(new CustomEvent('ds:search', { bubbles: true, detail: { value: input.value } })); });
      sf.querySelector('[data-ds="search-clear"]').addEventListener('click', () => { input.value = ''; sync(); input.focus(); sf.dispatchEvent(new CustomEvent('ds:search', { bubbles: true, detail: { value: '' } })); });
      sync();
    });
  };
})();
