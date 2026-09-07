/* ALAB • Prototyp — Sklep (dashboard) z natywnym zachowaniem TopBar/TabBar + wyszukiwarka (3 stany).
   Ekrany 1:1 z „Sklep • Strona główna” 656:7311 i „Wyszukiwarka • Start/Podpowiedzi/Brak wyników” 1177:15512-15514.
   Zachowanie paska przy scrollu NIE jest opisane w Figmie — przyjęte wg iOS (UINavigationBar + UISearchController):
   pole szukania zostaje przypięte, rząd chipów zwija się przy scrollu, tab bar stoi zawsze na dole. */
(function () {
  const APP = window.APP; const { SCREENS, ACTIONS, FADE_ROUTES, go, back, snack, current } = APP;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = DS.esc;
  const S = () => APP.S;

  // ---------------- dane (treść 1:1 z masterów) ----------------
  // 12 kategorii ALAB (lista i ikony ustalone w POC, 2026-08-11). Dostępność per typ realizacji = ZAŁOŻENIE prototypu
  // (brak takiej tabeli w Figmie i inventory): Punkt Pobrań = wszystko, ALAB w domu = badania z krwi, Zestaw wysyłkowy = próbki do wysyłki.
  const CATEGORIES = [
    { id: 'ogolne', icon: 'test-tube', label: 'Badania i pakiety ogólne', count: 9, types: ['punkt', 'dom'] },
    { id: 'hormony', icon: 'medicine-bottle', label: 'Hormony', count: 2, types: ['punkt', 'dom'] },
    { id: 'alergie', icon: 'fork-knife', label: 'Alergie i nietolerancje pokarmowe', count: 1, types: ['punkt', 'dom', 'wysylka'] },
    { id: 'pokarmowy', icon: 'bubbles', label: 'Układ pokarmowy', count: 2, types: ['punkt', 'wysylka'] },
    { id: 'krazenie', icon: 'heart-rate', label: 'Układ krążenia i Hematologia', count: 4, types: ['punkt', 'dom'] },
    { id: 'cukrzyca', icon: 'syringe', label: 'Cukrzyca i Otyłość', count: 1, types: ['punkt', 'dom'] },
    { id: 'ciaza', icon: 'heart', label: 'Ciąża, Zdrowie intymne i Układ moczowy', count: 2, types: ['punkt', 'dom'] },
    { id: 'genetyka', icon: 'dna', label: 'Genetyka i Nowotwory', count: null, types: ['punkt', 'wysylka'] },
    { id: 'infekcje', icon: 'virus', label: 'Infekcje i choroby zakaźne', count: 3, types: ['punkt', 'dom', 'wysylka'] },
    { id: 'lifestyle', icon: 'mirror', label: 'Lifestylowe i Uroda', count: 2, types: ['punkt', 'wysylka'] },
    { id: 'psychika', icon: 'user', label: 'Zdrowie psychiczne', count: null, types: ['punkt', 'wysylka'] },
    { id: 'reuma', icon: 'tube', label: 'Reumatologia i Dermatologia', count: null, types: ['punkt', 'dom'] },
  ];
  const HOME_TILES = 6; // siatka na stronie głównej: > 6 kategorii → 5 + „Wszystkie kategorie”, ≤ 6 → wszystkie
  const catsFor = (type) => CATEGORIES.filter(c => c.types.includes(type));
  const tilesHtml = (type) => {
    const cats = catsFor(type);
    const shown = cats.length > HOME_TILES ? cats.slice(0, HOME_TILES - 1) : cats;
    return shown.map(c => DS.CategoryTile({ icon: c.icon, label: c.label, attrs: { 'data-action': 'open-category', 'data-title': c.label } })).join('') +
      (cats.length > HOME_TILES ? DS.CategoryTile({ icon: 'plus-square', label: 'Wszystkie kategorie', all: true, attrs: { 'data-action': 'all-categories' } }) : '');
  };
  const PACKAGES = [
    { id: 'p1', kind: 'package', meta: 'Liczba badań: 4', title: 'Pakiet tarczycowy podstawowy', badge: { code: { discount: '-20%', text: 'z kodem JESIEN20' } }, price: { current: '68 zł', old: '85 zł', club: '64,60 zł ekstra -5% w klubie', lowest: 'Najniższa cena z 30 dni: 85 zł', note: '+ opłata za pobranie' }, footer: { label: 'Zobacz składowe pakietu', count: 4 }, search: { sub: '4 badania • 68,00 zł' } },
    { id: 'p2', kind: 'package', meta: 'Liczba badań: 8', title: 'Pakiet Zdrowie podstawowy', price: { current: '199 zł', club: '189,05 zł ekstra -5% w klubie', note: '+ opłata za pobranie' }, footer: { label: 'Zobacz składowe pakietu', count: 8 }, search: { sub: '8 badań • 199,00 zł' } },
    { id: 'p3', kind: 'package', meta: 'Liczba badań: 4', title: 'Pakiet Sport', price: { current: '280,50 zł', club: '266,48 zł ekstra -5% w klubie', note: '+ opłata za pobranie' }, footer: { label: 'Zobacz składowe pakietu', count: 4 }, search: { sub: '4 badania • 280,50 zł' }, hidden: true },
    { id: 'p4', kind: 'package', meta: 'Liczba badań: 8', title: 'Pakiet dla kobiet', price: { current: '540,90 zł', club: '513,86 zł ekstra -5% w klubie', note: '+ opłata za pobranie' }, footer: { label: 'Zobacz składowe pakietu', count: 8 }, search: { sub: '8 badań • 540,90 zł' }, hidden: true },
  ];
  const TESTS = [
    { id: 't1', kind: 'test', meta: 'Materiał: Krew', title: 'Morfologia krwi obwodowej z rozmazem', badge: { code: { discount: '-20%', text: 'z kodem JESIEN20' } }, price: { current: '24,80 zł', old: '31 zł', club: '23,56 zł ekstra -5% w klubie', lowest: 'Najniższa cena z 30 dni: 31 zł', note: '+ opłata za pobranie' }, search: { sub: '24,80 zł' } },
    { id: 't2', kind: 'test', meta: 'Materiał: Krew', title: 'TSH – hormon tyreotropowy', price: { current: '39 zł', club: '37,05 zł ekstra -5% w klubie', note: '+ opłata za pobranie' }, search: { sub: '39,00 zł' } },
    { id: 't3', kind: 'test', meta: 'Materiał: Krew', title: 'Ferrytyna – ocena zapasów żelaza', badge: { premium: 'Niższa cena z ALAB Club' }, price: { current: '49 zł', club: '29,40 zł zniżka -40% w klubie', note: '+ opłata za pobranie' }, search: { sub: '49,00 zł' } },
    { id: 't4', kind: 'test', meta: 'Materiał: Krew', title: 'Glukoza na czczo w surowicy', price: { current: '15 zł', club: '14,25 zł ekstra -5% w klubie', note: '+ opłata za pobranie' }, search: { sub: '15,00 zł' } },
    { id: 't5', kind: 'test', meta: 'Materiał: Krew', title: 'Witamina D 25(OH) – metabolit', badge: { basic: 'Niedostępne w wybranym punkcie' }, cta: 'Zmień punkt', ctaVariant: 'secondary', search: { sub: '89,00 zł' } },
    { id: 't6', kind: 'test', meta: 'Materiał: Krew', title: 'Morfologia krwi (pełna)', price: { current: '141,55 zł', note: '+ opłata za pobranie' }, search: { sub: '141,55 zł' }, hidden: true },
    { id: 't7', kind: 'test', meta: 'Materiał: Krew', title: 'CRP – białko C-reaktywne', price: { current: '29,00 zł', note: '+ opłata za pobranie' }, search: { sub: '29,00 zł' }, hidden: true },
  ];
  const MOST_SEARCHED = ['Morfologia', 'CRP', 'Witamina D', 'TSH', 'Ferrytyna'];
  const TABS = [
    { id: 'start', label: 'Start', icon: 'home', route: 'tab/start' },
    { id: 'shop', label: 'Sklep', icon: 'search-active', route: 'dashboard' },
    { id: 'results', label: 'Wyniki', icon: 'folder', route: 'tab/results' },
    { id: 'cart', label: 'Koszyk', icon: 'cart', route: 'tab/cart' },
  ];
  const TAB_ROUTES = new Set(TABS.map(t => t.route));
  TAB_ROUTES.forEach(r => FADE_ROUTES.add(r)); FADE_ROUTES.add('search');

  const st = () => { const s = S(); if (!s.shop) s.shop = { delivery: 'punkt', cart: 0, added: {}, scroll: {}, query: '' }; return s.shop; };
  const tabBar = (active) => DS.BottomTabBar({ active, items: TABS.map(t => ({ ...t, badge: t.id === 'cart' && st().cart ? st().cart : null })), attrs: { class: 'shop__tabbar' } });
  const chips = (style) => {
    const sel = st().delivery;
    return [['punkt', 'Punkt Pobrań'], ['dom', 'ALAB w domu'], ['wysylka', 'Zestaw wysyłkowy']].map(([id, label]) =>
      DS.FilterChip({ label, selected: sel === id, style, attrs: { 'data-delivery': id } })).join('');
  };

  // ---------------- Sklep • Strona główna ----------------
  SCREENS.dashboard = () => {
    const A = DS.ASSETS;
    const card = (p) => DS.ProductCard({ ...p, attrs: { class: st().added[p.id] ? 'is-added' : '' }, cta: st().added[p.id] ? 'Dodano' : (p.cta || 'Do koszyka') });
    return `<div class="screen shop" data-tab="shop">
      <header class="shop__head" id="shop-head">
        <div class="shop__fill"><div class="shop__bg"><img src="${A}img_shop_bg.png" alt=""><div class="shop__bgOverlay"></div></div></div>
        <div class="shop__nav">${DS.StatusBar({ light: true })}</div>
        <div class="shop__searchWrap">
          ${DS.SearchField({ style: 'oncolor', attrs: { 'data-action': 'open-search', 'aria-label': 'Szukaj badania' } })}
          <div class="shop__chipsWrap" id="shop-chips"><div class="shop__chips">${chips('oncolor')}</div></div>
        </div>
        <div class="shop__corner"></div>
      </header>
      <div class="screen__body shop__scroll" id="shop-scroll">
        <div class="shop__spacer" id="shop-spacer"></div>
        <div class="shop__content">
          <section class="shop__section shop__section--loc">
            ${DS.CellOrderTypeStatus({ attrs: { 'data-action': 'change-point' } })}
            <div class="shop__tiles" id="shop-tiles">${tilesHtml(st().delivery)}</div>
          </section>
          <section class="shop__section">
            ${DS.SectionHeader({ title: 'Popularne pakiety', action: 'Pokaż wszystkie', actionAttrs: { 'data-action': 'show-all', 'data-title': 'Pakiety' } })}
            <div class="shop__cards">${PACKAGES.filter(p => !p.hidden).map(card).join('')}</div>
            ${DS.Button({ label: 'Pokaż wszystkie pakiety', type: 'secondary', block: true, attrs: { 'data-action': 'show-all', 'data-title': 'Pakiety' } })}
          </section>
          <section class="shop__section">
            ${DS.SectionHeader({ title: 'Popularne badania', action: 'Pokaż wszystkie', actionAttrs: { 'data-action': 'show-all', 'data-title': 'Badania' } })}
            <div class="shop__cards">${TESTS.filter(t => !t.hidden).map(card).join('')}</div>
            ${DS.Button({ label: 'Pokaż wszystkie badania', type: 'secondary', block: true, attrs: { 'data-action': 'show-all', 'data-title': 'Badania' } })}
          </section>
        </div>
      </div>
      ${tabBar('shop')}
    </div>`;
  };

  // Zakładki bez własnych ekranów w Figmie → lekkie placeholdery na tym samym tab barze
  const tabPlaceholder = (id, title, body, asset) => `<div class="screen shop" data-tab="${id}">
      <div class="screen__top">${DS.TopBar({ leading: false, title })}</div>
      <div class="screen__body shop__scroll" style="padding-bottom:120px">${DS.ScreenState({ asset: DS.ASSETS + asset, title, body })}</div>${tabBar(id)}</div>`;
  SCREENS['tab/start'] = () => tabPlaceholder('start', 'Dzień dobry', 'Ekran Start (dashboard) powstanie na bazie Modułu 2. W prototypie pokazujemy tu ścieżkę zakupową w zakładce Sklep.', 'il_phone_tick.png');
  SCREENS['tab/results'] = () => tabPlaceholder('results', 'Wyniki', 'Tutaj znajdą się wyniki badań (Moduł 7). W prototypie zakładka jest zaślepką.', 'il_mail_sent.png');
  SCREENS['tab/cart'] = () => `<div class="screen shop" data-tab="cart">
      <div class="screen__top">${DS.TopBar({ leading: false, title: 'Koszyk', subtitle: st().cart ? `${st().cart} ${st().cart === 1 ? 'pozycja' : (st().cart < 5 ? 'pozycje' : 'pozycji')}` : null })}</div>
      <div class="screen__body shop__scroll" style="padding-bottom:120px">${st().cart
        ? `<div class="stack-12">${Object.keys(st().added).map(id => { const p = [...PACKAGES, ...TESTS].find(x => x.id === id); return DS.Cell({ icon: p.kind === 'package' ? 'file-check' : 'test-tube', title: p.title, subtitle: p.price ? p.price.current : '', trailing: null }); }).join('')}</div>`
        : DS.ScreenState({ asset: DS.ASSETS + 'il_mail_sent.png', title: 'Koszyk jest pusty', body: 'Dodaj badania lub pakiety w zakładce Sklep.', buttons: [DS.Button({ label: 'Przejdź do sklepu', block: true, attrs: { 'data-tab': 'shop' } })] })}</div>${tabBar('cart')}</div>`;

  // ---------------- Wyszukiwarka (Start / Podpowiedzi / Brak wyników) ----------------
  const plural = (n, one, few, many) => `${n} ${n === 1 ? one : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? few : many)}`;
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ł/g, 'l');
  const highlight = (title, q) => { const i = norm(title).indexOf(norm(q)); if (i < 0) return esc(title); return esc(title.slice(0, i)) + `<span class="match">${esc(title.slice(i, i + q.length))}</span>` + esc(title.slice(i + q.length)); };
  const mostSearched = () => `<div class="search__group"><p class="search__label">Najczęściej szukane</p><div class="search__list search__list--tight">${MOST_SEARCHED.map(t => DS.Cell({ icon: 'file-note-search', title: t, attrs: { 'data-action': 'search-pick', 'data-q': t } })).join('')}</div></div>`;
  function searchResults(q) {
    if (q.trim().length < 3) return mostSearched();
    const nq = norm(q.trim());
    const pk = PACKAGES.filter(p => norm(p.title).includes(nq)), ts = TESTS.filter(t => norm(t.title).includes(nq)), cats = CATEGORIES.filter(c => norm(c.label).includes(nq));
    const total = pk.length + ts.length + cats.length;
    if (!total) return DS.SearchEmpty({ title: `Brak wyników dla „${q.trim()}”`, hint: 'Sprawdź pisownię lub wyszukaj inną frazę' }) + DS.Divider() + mostSearched();
    const first = ts[0] || pk[0];
    const phrase = first ? DS.Cell({ icon: 'file-note-search', titleHtml: '„' + `<span class="match">${esc(q.trim())}</span>` + esc(first.title.slice(first.title.toLowerCase().indexOf(nq) + nq.length).split(' ')[0]) + '”', subtitle: `${plural(pk.length, 'pakiet', 'pakiety', 'pakietów')} i ${plural(ts.length, 'badanie', 'badania', 'badań')}`, attrs: { 'data-action': 'search-go', 'data-q': q.trim() } }) : '';
    const sec = (label, items, icon, mapSub) => items.length ? `<div class="search__group"><p class="search__label">${label}</p><div class="search__list">${items.map(it => DS.Cell({ icon, titleHtml: highlight(it.title || it.label, q.trim()), subtitle: mapSub(it), attrs: { 'data-action': 'search-go', 'data-q': it.title || it.label } })).join('')}</div></div>` : '';
    return `<p class="search__count">${total + (first ? 1 : 0)} podpowiedzi</p>${phrase}` +
      [sec('Pakiety badań', pk, 'file-check', p => p.search.sub), sec('Badania', ts, 'test-tube', t => t.search.sub), sec('Kategorie', cats, 'view-list', c => plural(c.count, 'badanie', 'badania', 'badań'))].filter(Boolean).map(h => DS.Divider() + h).join('');
  }
  SCREENS.search = () => `<div class="screen search">
      <div class="screen__top search__top">${DS.StatusBar()}<div class="search__fieldWrap">${DS.SearchField({ style: 'solid', state: 'active', value: st().query, id: 'search-input' })}<div class="shop__chips">${chips('solid')}</div></div></div>
      <div class="screen__body search__body" id="search-results">${searchResults(st().query)}</div></div>`;

  // ---------------- zachowanie paska przy scrollu (iOS-like collapse) ----------------
  function setupShopScroll(root) {
    const head = $('#shop-head', root), scroll = $('#shop-scroll', root), spacer = $('#shop-spacer', root), chipsWrap = $('#shop-chips', root);
    if (!head || !scroll) return;
    const bg = head.querySelector('.shop__bg img'), wrap = head.querySelector('.shop__searchWrap'), corner = head.querySelector('.shop__corner');
    const measure = () => { head.classList.remove('is-collapsed'); chipsWrap.style.height = ''; wrap.style.paddingBottom = ''; wrap.style.gap = ''; spacer.style.height = head.offsetHeight + 'px'; head.dataset.full = head.offsetHeight; head.dataset.chips = chipsWrap.offsetHeight; };
    measure();
    const COLLAPSE = 72; // px scrolla, po których chipy są schowane
    let raf = 0;
    const onScroll = () => {
      if (raf) return; raf = requestAnimationFrame(() => {
        raf = 0; const y = scroll.scrollTop; const p = Math.max(0, Math.min(1, y / COLLAPSE));
        const ch = +head.dataset.chips; chipsWrap.style.height = (ch * (1 - p)) + 'px'; chipsWrap.style.opacity = String(1 - p); chipsWrap.style.transform = `translateY(${-10 * p}px)`;
        // po zwinięciu: 28 px od pola do dolnej krawędzi granatu; boczne zaokrąglenia zostają, treść prześwituje między nimi
        wrap.style.paddingBottom = (24 + 4 * p) + 'px'; wrap.style.gap = (16 * (1 - p)) + 'px';
        head.classList.toggle('is-collapsed', p >= 1); head.classList.toggle('is-scrolled', y > 4);
        st().scroll.shop = y;
      });
    };
    scroll.addEventListener('scroll', onScroll, { passive: true });
    const y0 = st().scroll.shop || 0; if (y0) { scroll.scrollTop = y0; onScroll(); }
  }
  APP.afterRender.push((route, root) => {
    if (route === 'dashboard') setupShopScroll(root);
    if (route === 'search') { const i = $('#search-input', root); setTimeout(() => i?.focus({ preventScroll: true }), 60); }
    if (route === 'tab/results' || route === 'tab/start' || route === 'tab/cart') { const sc = $('.shop__scroll', root); if (sc) sc.scrollTop = st().scroll[route] || 0; }
  });

  function categorySheet() {
    const ov = $('#overlay');
    const cats = catsFor(st().delivery);
    const wrap = document.createElement('div'); wrap.className = 'ds'; wrap.style.cssText = 'position:absolute;inset:0';
    wrap.innerHTML = `<div class="ds-Scrim" data-action="sheet-close"></div>` + DS.BottomSheet({ title: 'Kategorie', subtitle: 'Wybierz kategorię badań, która Cię interesuje', attrs: { style: 'height:750px;max-height:92%' },
      content: `<div class="ds-BottomSheet__scroll" style="gap:8px">${cats.map(c => DS.Cell({ icon: c.icon, title: c.label, subtitle: c.count ? plural(c.count, 'podkategoria', 'podkategorie', 'podkategorii') : null, attrs: { 'data-action': 'open-category', 'data-title': c.label } })).join('')}</div>` });
    ov.appendChild(wrap); DS.enhance(wrap);
    wrap.addEventListener('click', (e) => { if (e.target.closest('[data-action="sheet-close"], [data-action="open-category"]')) setTimeout(() => wrap.remove(), e.target.closest('[data-action="open-category"]') ? 150 : 0); });
  }

  // ---------------- akcje ----------------
  const info = (t) => snack(t, 'info', 110);
  Object.assign(ACTIONS, {
    'open-search': () => { st().query = ''; go('search'); },
    'search-cancel': () => back(),
    'search-pick': (el) => { st().query = el.dataset.q; const i = $('#search-input'); if (i) { i.value = el.dataset.q; i.closest('.ds-SearchField').classList.add('has-value'); } $('#search-results').innerHTML = searchResults(el.dataset.q); i?.focus({ preventScroll: true }); },
    'search-go': (el) => info(`Wyniki dla „${el.dataset.q}” — ekran listy w kolejnym etapie`),
    'add-to-cart': (el) => {
      const card = el.closest('.ds-ProductCard'); const id = card?.dataset.product; if (!id || st().added[id]) return info('To badanie jest już w koszyku');
      st().added[id] = true; st().cart++; card.classList.add('is-added'); el.querySelector('.ds-ButtonTiny__label').textContent = 'Dodano';
      const tab = $('[data-tab="cart"] .ds-BottomTabItem__icon'); if (tab) { let b = tab.querySelector('.ds-BottomTabItem__badge'); if (!b) { b = document.createElement('span'); b.className = 'ds-BottomTabItem__badge'; tab.appendChild(b); } b.innerHTML = DS.NumberIndicator({ value: st().cart }); }
      snack(`Dodano do koszyka: ${el.dataset.title}`, 'success', 110);
    },
    'change-point': () => info('Wybór Punktu Pobrań — Moduł 4, poza zakresem tego prototypu'),
    'open-category': (el) => info(`Kategoria „${el.dataset.title}” — lista w kolejnym etapie`),
    'all-categories': () => categorySheet(),
    'show-all': (el) => info(`${el.dataset.title}: pełna lista w kolejnym etapie`),
    'package-details': () => info('Składowe pakietu — w kolejnym etapie'),
  });
  document.addEventListener('click', (e) => {
    const tab = e.target.closest('[data-tab]'); if (tab && !tab.classList.contains('screen')) { const t = TABS.find(x => x.id === tab.dataset.tab); if (t) { const sc = $('#screen .shop__scroll'); if (sc) st().scroll[current()] = sc.scrollTop; if (current() !== t.route) go(t.route); } return; }
    const chip = e.target.closest('[data-delivery]'); if (chip) { st().delivery = chip.dataset.delivery; $$('[data-delivery]').forEach(c => { const on = c.dataset.delivery === st().delivery; c.classList.toggle('is-selected', on); c.setAttribute('aria-pressed', on); });
      const tiles = $('#shop-tiles'); if (tiles) { tiles.classList.add('is-swapping'); setTimeout(() => { tiles.innerHTML = tilesHtml(st().delivery); tiles.classList.remove('is-swapping'); }, 120); } }
  });
  document.addEventListener('ds:search', (e) => { st().query = e.detail.value; const r = $('#search-results'); if (r) r.innerHTML = searchResults(e.detail.value); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.id === 'search-input') { e.target.blur(); const q = e.target.value.trim(); if (q) info(`Wyniki dla „${q}” — ekran listy w kolejnym etapie`); } });

  // panel deweloperski: dopisz trasy sklepu
  APP.ROUTES.splice(APP.ROUTES.findIndex(r => r[1] === 'dashboard'), 1, ['Sklep · Strona główna', 'dashboard'], ['Sklep · Wyszukiwarka', 'search'], ['Zakładka Start', 'tab/start'], ['Zakładka Wyniki', 'tab/results'], ['Zakładka Koszyk', 'tab/cart']);
  APP.renderNav();
})();
