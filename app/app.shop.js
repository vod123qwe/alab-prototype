/* ALAB • Prototyp — Sklep: strona główna, wyszukiwarka (3 stany), listing kategorii / wyników, karta produktu.
   Ekrany 1:1 z masterów w „Alab • Design” (strona ↳ 11.08.26): „Sklep • Strona główna” 1183:23539, „Sklep • Wybór kategorii” 1183:23540,
   „Wyszukiwarka • Start/Podpowiedzi/Brak wyników” 1177:15512-15514, „Listing • Kategoria” 1183:26762, „Listing • Wyniki wyszukiwania” 1183:26765,
   „Typy • ALAB w domu / Wysyłkowe” 1183:26770-26771, „Produkt • Badanie • Morfologia krwi” 1183:19461, „Produkt • Pakiet • Tarczyca” 1183:19462.
   Zachowanie paska przy scrollu NIE jest opisane w Figmie — przyjęte wg iOS (UINavigationBar + UISearchController):
   pole szukania zostaje przypięte, rząd chipów zwija się przy scrollu, tab bar stoi zawsze na dole. Dane: app/data.catalog.js (przykładowe). */
(function () {
  const APP = window.APP; const { SCREENS, ACTIONS, FADE_ROUTES, go, back, snack, current } = APP;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = DS.esc;
  const S = () => APP.S;
  const C = window.CATALOG; const { CATEGORIES, PRODUCTS, byId, zl } = C;
  const A = DS.ASSETS;

  // ---------------- sposoby realizacji ----------------
  // Komórka pod paskiem zmienia się razem z chipem (1:1 z masterami „Sklep • Strona główna”, „Typy • ALAB w domu”, „Typy • Wysyłkowe”)
  const DELIVERY = {
    punkt: { label: 'Punkt Pobrań', loc: 'w Punkcie Pobrań', cell: { icon: 'location-check', title: 'Puławska 10, Warszawa', status: 'Dziś otwarte 7:00 - 11:00', action: 'change-point' } },
    // Miasto ZMIENIONE względem mastera 1183:26770 („Kraków”) — plan badania stawia Pacjenta w Warszawie,
    // a Punkt Pobrań w prototypie jest na Puławskiej; dwa różne miasta na jednym ekranie myliłyby uczestnika.
    dom: { label: 'ALAB w domu', loc: 'w ALAB w domu', cell: { icon: 'location-check', title: 'Usługa pobrania krwi w domu', status: 'Warszawa 109,00 zł', action: 'change-point' } },
    wysylka: { label: 'Zestaw wysyłkowy', loc: 'w zestawie wysyłkowym', cell: { icon: 'home-pin', title: 'Samodzielne pobranie próbki', status: null } },
  };
  const TYPES = Object.keys(DELIVERY);

  const st = () => { const s = S(); if (!s.shop) s.shop = { delivery: 'punkt', cart: 0, added: {}, scroll: {}, query: '', kind: 'all', sub: {} }; if (!s.shop.sub) s.shop.sub = {}; if (!s.shop.kind) s.shop.kind = 'all'; return s.shop; };
  const type = () => st().delivery;

  // ---------------- katalog: pomocniki ----------------
  const avail = (p, t = type()) => p.types.includes(t);
  const forType = (t = type()) => PRODUCTS.filter(p => avail(p, t));
  const catsFor = (t = type()) => CATEGORIES.filter(c => forType(t).some(p => p.cat === c.id));
  const catCount = (c, t = type()) => forType(t).filter(p => p.cat === c.id).length;
  const subsFor = (catId, t = type()) => { const m = new Map(); forType(t).filter(p => p.cat === catId && p.sub).forEach(p => m.set(p.sub, (m.get(p.sub) || 0) + 1)); return [...m]; };
  const plural = (n, one, few, many) => `${n} ${n === 1 ? one : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? few : many)}`;
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ł/g, 'l');

  // ---------------- ceny: użytkownik podstawowy vs członek ALAB club ----------------
  // Warianty 1:1 z „Warianty • Banner PDP hero" 2726:16353 oraz kart badania 2726:16368 i pakietu 2726:16383:
  //  • bez klubu — cena podstawowa jako główna, a pod nią fioletowa ZACHĘTA „X zł ekstra -5% w klubie",
  //  • w klubie — cena klubowa staje się główną, podstawowa idzie w przekreślenie, a fioletowa linijka
  //    zmienia się w POTWIERDZENIE „Aktywna zniżka klubowa ekstra -5%" (na karcie produktu dodatkowo odznaka).
  // ZAŁOŻENIE (do potwierdzenia): kod rabatowy i zniżka klubowa NIE łączą się — produkt z kodem zostaje na
  // cenie z kodem, zmienia się tylko komunikat. Tak pokazują to warianty w Figmie (952 zł w obu rzędach).
  const inClub = () => !!S().clubJoined;
  const clubPrice = (p) => p.premium ? p.price * 0.6 : p.price * 0.95;
  const clubOffer = (p) => p.premium ? `${zl(clubPrice(p))} zniżka -40% w klubie` : `${zl(clubPrice(p))} ekstra -5% w klubie`;
  const clubActive = (p) => p.premium ? 'Aktywna zniżka klubowa -40%' : 'Aktywna zniżka klubowa ekstra -5%';
  // hero = karta produktu na PDP: tam komunikat o zniżce klubowej niesie ODZNAKA nad tytułem, więc fioletowa
  // linijka pod ceną znika (2726:16358); na kartach listingu odznaki nie ma, więc linijka zostaje (2726:16368).
  const priceVM = (p, t = type(), hero = false) => {
    if (p.unavailableAt === t) return null;
    const club = inClub(), coded = !!p.code, clubMain = club && !coded;
    return {
      current: zl(clubMain ? clubPrice(p) : p.price),
      old: clubMain ? zl(p.price) : (p.old ? zl(p.old) : null),
      club: club ? (hero ? null : clubActive(p)) : clubOffer(p),
      promo: coded,   // zielona cena tylko przy promocji z kodem
      lowest: p.old ? `Najniższa cena z 30 dni: ${zl(p.lowest || p.old)}` : null,
      note: t === 'wysylka' ? null : '+ opłata za pobranie', // wysyłka: cena stała, bez opłaty za pobranie (inventory P04d)
    };
  };
  const badgeVM = (p, t = type()) => p.unavailableAt === t ? { basic: 'Niedostępne w wybranym Punkcie Pobrań' } : p.code ? { code: { discount: p.code.discount, text: `z kodem ${p.code.code}` } } : p.premium ? { premium: 'Niższa cena z ALAB club' } : null;
  // Odznaka nad tytułem na karcie produktu: dla członka klubu potwierdzenie zniżki, dla pozostałych
  // zachęta przy produktach z niższą ceną klubową, a przy niedostępnym — informacja o punkcie.
  const heroBadge = (p, un) => un ? DS.BadgeBasic({ text: 'Niedostępne w wybranym Punkcie Pobrań' })
    : inClub() ? DS.BadgePremium({ text: clubActive(p), tone: 'soft' })
      : p.premium ? DS.BadgePremium({ text: 'Niższa cena z ALAB club' }) : '';
  const card = (p) => {
    const un = p.unavailableAt === type();
    return DS.ProductCard({ id: p.id, kind: p.kind, meta: p.kind === 'package' ? `Liczba badań: ${p.components.length}` : `Materiał: ${p.material}`, title: p.title,
      badge: badgeVM(p), price: priceVM(p), cta: un ? 'Zmień punkt' : 'Do koszyka', ctaVariant: un ? 'secondary' : 'primary',
      footer: p.kind === 'package' ? { label: 'Zobacz składowe pakietu', count: p.components.length } : null,
      attrs: { 'data-open': p.id } });
  };

  // ---------------- wspólne kawałki UI ----------------
  // ikony dolnej nawigacji parami: outline gdy nieaktywna, wypełniona i niebieska gdy aktywna (BottomTabBar 156:1388)
  const TABS = [
    { id: 'start', label: 'Start', icon: 'home', iconActive: 'home-active', route: 'tab/start' },
    { id: 'shop', label: 'Sklep', icon: 'search-lg', iconActive: 'search-active', route: 'dashboard' },
    { id: 'results', label: 'Wyniki', icon: 'folder', iconActive: 'folder-active', route: 'tab/results' },
    { id: 'cart', label: 'Koszyk', icon: 'cart', iconActive: 'cart-active', route: 'tab/cart' },
  ];
  TABS.forEach(t => FADE_ROUTES.add(t.route)); FADE_ROUTES.add('search');
  // badge: Koszyk = liczba pozycji, Wyniki = liczba nowych wyników (app.results.js)
  const tabBar = (active) => DS.BottomTabBar({ active, items: TABS.map(t => ({ ...t, badge: t.id === 'cart' ? (st().cart || null) : (t.id === 'results' && !APP.resultsStub ? ((APP.results && APP.results.newCount()) || null) : null) })), });
  const chips = (style) => TYPES.map(id => DS.FilterChip({ label: DELIVERY[id].label, selected: type() === id, style, attrs: { 'data-delivery': id } })).join('');
  const locCell = () => { const c = DELIVERY[type()].cell; return DS.CellOrderTypeStatus({ icon: c.icon, title: c.title, status: c.status, attrs: c.action ? { 'data-action': c.action } : { tabindex: '-1' } }); };
  const HOME_TILES = 6; // siatka: > 6 kategorii → 5 + „Wszystkie kategorie”, ≤ 6 → wszystkie
  const tilesHtml = () => {
    const cats = catsFor(); const shown = cats.length > HOME_TILES ? cats.slice(0, HOME_TILES - 1) : cats;
    return shown.map(c => DS.CategoryTile({ icon: c.icon, label: c.label, attrs: { 'data-action': 'open-category', 'data-cat': c.id } })).join('') +
      (cats.length > HOME_TILES ? DS.CategoryTile({ icon: 'plus-square', label: 'Wszystkie kategorie', all: true, attrs: { 'data-action': 'all-categories' } }) : '');
  };
  // granatowy nagłówek z hero, polem szukania i chipami (wspólny dla strony głównej i listingów)
  const shopHead = ({ title, bar = false, query } = {}) => `<header class="shop__head" id="shop-head">
        <div class="shop__fill"><div class="shop__bg"><img src="${A}img_shop_bg.png" alt=""><div class="shop__bgOverlay"></div></div></div>
        <div class="${bar ? 'shop__nav shop__nav--bar' : 'shop__nav'}">${bar ? DS.TopBar({ transparent: true, light: true, title }) : DS.StatusBar({ light: true })}</div>
        <div class="shop__searchWrap">
          <div class="shop__searchRow">${DS.SearchField({ style: 'oncolor', placeholder: query || 'Szukaj badania...', attrs: { 'data-action': 'open-search', 'aria-label': 'Szukaj badania', class: query ? 'has-query' : '' } })}${bar ? DS.IconButton({ icon: 'settings', variant: 'onscrim', size: 'medium', label: 'Filtry', attrs: { 'data-action': 'filters' } }) : ''}</div>
          <div class="shop__chipsWrap" id="shop-chips"><div class="shop__chips">${chips('oncolor')}</div></div>
        </div>
        <div class="shop__corner"></div>
      </header>`;

  // ---------------- Sklep • Strona główna ----------------
  const popular = (kind) => forType().filter(p => p.kind === kind && p.popular);
  const popularSections = () => [['package', 'Popularne pakiety', 'packages', 'Pokaż wszystkie pakiety'], ['test', 'Popularne badania', 'tests', 'Pokaż wszystkie badania']].map(([kind, title, k, btn]) => { const items = popular(kind); return items.length ? `<section class="shop__section">
            ${DS.SectionHeader({ title, action: 'Pokaż wszystkie', actionAttrs: { 'data-action': 'show-all', 'data-kind': k } })}
            <div class="shop__cards">${items.map(card).join('')}</div>
            ${DS.Button({ label: btn, type: 'secondary', block: true, attrs: { 'data-action': 'show-all', 'data-kind': k } })}
          </section>` : ''; }).join('');
  SCREENS.dashboard = () => `<div class="screen shop" data-tab="shop">
      ${shopHead()}
      <div class="screen__body shop__scroll" id="shop-scroll">
        <div class="shop__spacer" id="shop-spacer"></div>
        <div class="shop__content">
          <section class="shop__section shop__section--loc">
            <div id="shop-loc" class="shop__swap">${locCell()}</div>
            <div class="shop__tiles shop__swap" id="shop-tiles">${tilesHtml()}</div>
          </section>
          <div id="shop-popular" class="shop__swap shop__popular">${popularSections()}</div>
        </div>
      </div>
    </div>`;

  // Zakładki Start, Wyniki i Koszyk to zaślepki testu niemoderowanego — definiuje je app/app.stubs.js

  // ---------------- Wyszukiwarka (Start / Podpowiedzi / Brak wyników) ----------------
  const highlight = (title, q) => { const i = norm(title).indexOf(norm(q)); if (i < 0) return esc(title); return esc(title.slice(0, i)) + `<span class="match">${esc(title.slice(i, i + q.length))}</span>` + esc(title.slice(i + q.length)); };
  // UWAGA (badania z użytkownikami): „Morfologia” świadomie NIE jest podpowiedzią — zadaniem jest ją znaleźć,
  // a gotowa podpowiedź w jednym tapnięciu zaburzyłaby wynik.
  const MOST_SEARCHED = ['CRP', 'Witamina D', 'TSH', 'Ferrytyna', 'Lipidogram'];
  const mostSearched = () => `<div class="search__group"><p class="search__label">Najczęściej szukane</p><div class="search__list search__list--tight">${MOST_SEARCHED.map(t => DS.Cell({ icon: 'file-note-search', title: t, attrs: { 'data-action': 'search-pick', 'data-q': t } })).join('')}</div></div>`;
  // Pole wyszukiwania produktu: nazwa + podkategoria + materiał + potoczne frazy (keywords) + symbol.
  const haystack = (p) => norm([p.title, p.sub, p.material, p.symbol, ...(p.keywords || [])].filter(Boolean).join(' '));
  // Dopasowanie po SŁOWACH, nie po całej frazie — „badania krwi morfologii” trafia w „Morfologia krwi…”.
  // Lekki „stemming”: ucinamy końcówkę fleksyjną, żeby „morfologii”, „badania”, „krwi” trafiały w te same wpisy.
  const stem = (w) => w.length >= 7 ? w.slice(0, -2) : w.length >= 5 ? w.slice(0, -1) : w;
  const hits = (text, q) => norm(q).split(/\s+/).filter(w => w.length > 1).every(w => text.includes(w) || text.includes(stem(w)));
  const matches = (q, t = type()) => { const items = forType(t); return {
    pk: items.filter(p => p.kind === 'package' && hits(haystack(p), q)),
    ts: items.filter(p => p.kind === 'test' && hits(haystack(p), q)),
    cats: catsFor(t).filter(c => hits(norm(c.label), q)) }; };
  function searchResults(q) {
    if (q.trim().length < 3) return mostSearched();
    const { pk, ts, cats } = matches(q); const nq = norm(q.trim());
    const total = pk.length + ts.length + cats.length;
    if (!total) {
      // fraza może istnieć w innym sposobie realizacji — wtedy zamiast „najczęściej szukanych" dajemy przejście tam
      const alts = altList(t => { const m = matches(q, t); return { pk: m.pk.length, ts: m.ts.length }; });
      const title = `Brak wyników dla „${q.trim()}” ${DELIVERY[type()].loc}`;
      return alts.length ? emptyWithAlts(title, 'Sprawdź pisownię lub wyszukaj inną frazę', alts)
        : DS.SearchEmpty({ icon: 'file-note-search', title, hint: 'Sprawdź pisownię lub wyszukaj inną frazę' }) + DS.Divider() + mostSearched();
    }
    const first = ts[0] || pk[0];
    // dopowiedzenie reszty słowa tylko wtedy, gdy fraza faktycznie występuje w nazwie (przy trafieniu po synonimie pokazujemy samą frazę)
    const at = first ? norm(first.title).indexOf(nq) : -1;
    const tail = at >= 0 ? first.title.slice(at + nq.length).split(/[\s–,]/)[0] : '';
    const phrase = first ? DS.Cell({ icon: 'file-note-search', titleHtml: '„' + `<span class="match">${esc(q.trim())}</span>` + esc(tail) + '”', subtitle: countLabel({ pk: pk.length, ts: ts.length }), attrs: { 'data-action': 'search-submit', 'data-q': q.trim() } }) : '';
    const sec = (label, items, icon, mapSub, action, key) => items.length ? `<div class="search__group"><p class="search__label">${label}</p><div class="search__list">${items.map(it => DS.Cell({ icon, titleHtml: highlight(it.title || it.label, q.trim()), subtitle: mapSub(it), attrs: { 'data-action': action, [key]: it.id } })).join('')}</div></div>` : '';
    return `<p class="search__count">${total + (first ? 1 : 0)} podpowiedzi</p>${phrase}` +
      [sec('Pakiety badań', pk, 'file-check', p => `${plural(p.components.length, 'badanie', 'badania', 'badań')} • ${zl(p.price)}`, 'open-product', 'data-open'),
       sec('Badania', ts, 'test-tube', t => zl(t.price), 'open-product', 'data-open'),
       sec('Kategorie', cats, 'view-list', c => plural(catCount(c), 'badanie', 'badania', 'badań'), 'open-category', 'data-cat')].filter(Boolean).map(h => DS.Divider() + h).join('');
  }
  SCREENS.search = () => `<div class="screen search">
      <div class="screen__top search__top">${DS.StatusBar()}<div class="search__fieldWrap">${DS.SearchField({ style: 'solid', state: 'active', value: st().query, id: 'search-input' })}<div class="shop__chips">${chips('solid')}</div></div></div>
      <div class="screen__body search__body" id="search-results">${searchResults(st().query)}</div></div>`;

  // ---------------- Listing (kategoria / wyniki / wszystkie pakiety lub badania) ----------------
  const KINDS = [['all', 'Badania i pakiety'], ['tests', 'Badania'], ['packages', 'Pakiety badań']];
  function listingItems(ctx, t = type()) {
    let items = forType(t);
    if (ctx.cat) items = items.filter(p => p.cat === ctx.cat.id);
    if (ctx.query) items = items.filter(p => hits(haystack(p), ctx.query));
    if (ctx.cat && st().sub[ctx.cat.id]) items = items.filter(p => p.sub === st().sub[ctx.cat.id]);
    return items;
  }
  const kindOf = (ctx) => ctx.fixedKind || st().kind;
  // ---------------- brak wyników w wybranym sposobie realizacji ----------------
  // Wzór 2546:109588 (wyszukiwarka) i 2265:66501 (listing): zamiast ślepego zaułka mówimy, że w TYM sposobie
  // realizacji nic nie ma, i dajemy wyjście — ile jest w pozostałych i przejście jednym tapnięciem.
  const countLabel = ({ pk, ts }) => [pk && plural(pk, 'pakiet', 'pakiety', 'pakietów'), ts && plural(ts, 'badanie', 'badania', 'badań')].filter(Boolean).join(' i ');
  const altList = (counts) => TYPES.filter(t => t !== type()).map(t => ({ t, n: counts(t) })).filter(x => x.n.pk + x.n.ts > 0);
  const altRows = (alts) => !alts.length ? '' :
    `<div class="shop__or"><span>Lub</span></div><div class="shop__alts">` +
    alts.map(({ t, n }) => DS.Cell({ icon: 'file-note-search', title: `Szukaj ${DELIVERY[t].loc}`, subtitle: countLabel(n), attrs: { 'data-delivery': t } })).join('') + `</div>`;
  // owijka, żeby stan pusty NIE centrował się w całej wysokości (wtedy wiersze wyjścia lądowały pod ekranem)
  const emptyWithAlts = (title, hint, alts) => `<div class="shop__emptyAlts">` + DS.SearchEmpty({ icon: 'file-note-search', title, hint }) + altRows(alts) + `</div>`;
  function listingBody(ctx) {
    const items = listingItems(ctx), kind = kindOf(ctx);
    const pk = items.filter(p => p.kind === 'package'), ts = items.filter(p => p.kind === 'test');
    const sec = (title, arr) => arr.length ? `<section class="shop__section">${DS.SectionHeader({ title, count: arr.length })}<div class="shop__cards">${arr.map(card).join('')}</div></section>` : '';
    const html = (kind !== 'tests' ? sec('Pakiety badań', pk) : '') + (kind !== 'packages' ? sec('Badania', ts) : '');
    if (html) return html;
    // Brak wyników: jeśli w innym sposobie realizacji te badania są, prowadzimy tam (2265:66501);
    // jeśli nigdzie ich nie ma, zostaje komunikat o filtrach (1183:26768 — copy przyjęte).
    const alts = altList(t => { const items = listingItems(ctx, t), k = kindOf(ctx);
      return { pk: k !== 'tests' ? items.filter(p => p.kind === 'package').length : 0, ts: k !== 'packages' ? items.filter(p => p.kind === 'test').length : 0 }; });
    const what = ctx.query ? `Brak wyników dla „${ctx.query}”` : ctx.fixedKind === 'packages' ? 'Brak pakietów' : 'Brak badań w tej kategorii';
    return alts.length ? emptyWithAlts(`${what} ${DELIVERY[type()].loc}`, 'Zmień sposób realizacji, żeby je zobaczyć.', alts)
      : DS.SearchEmpty({ icon: 'file-note-search', title: 'Brak badań dla wybranych filtrów', hint: 'Zmień sposób realizacji, kategorię lub rodzaj produktu' });
  }
  const filtersRow = (ctx) => {
    if (ctx.fixedKind) return '';
    const subs = ctx.cat ? subsFor(ctx.cat.id) : [];
    return `<div class="shop__filters ds-FilterRow ds-FilterRow">${DS.ChipDropdown({ label: KINDS.find(k => k[0] === st().kind)[1], attrs: { 'data-action': 'kind-menu' } })}` +
      (subs.length ? `<span class="ds-FilterRow__sep"></span>${subs.map(([name, n]) => DS.FilterChip({ label: name, count: n, selected: st().sub[ctx.cat.id] === name, attrs: { 'data-sub': name, 'data-cat': ctx.cat.id } })).join('')}` : '') + `</div>`;
  };
  const listingScreen = (ctx) => `<div class="screen shop shop--listing" data-tab="shop">
      ${shopHead({ title: ctx.title, bar: true, query: ctx.query })}
      <div class="screen__body shop__scroll" id="shop-scroll">
        <div class="shop__spacer" id="shop-spacer"></div>
        <div class="shop__content shop__content--listing">
          <section class="shop__section shop__section--filters">
            <div id="shop-loc" class="shop__swap">${locCell()}</div>
            <div id="shop-filters">${filtersRow(ctx)}</div>
          </section>
          <div id="listing-body" class="shop__listing shop__swap">${listingBody(ctx)}</div>
        </div>
      </div>
    </div>`;
  const listingCtx = (route) => {
    const [kind, id] = route.split('/');
    if (kind === 'category') { const cat = CATEGORIES.find(c => c.id === id); return cat ? { title: cat.label, cat } : null; }
    if (kind === 'results') return { title: 'Wyniki wyszukiwania', query: st().query };
    if (kind === 'list') return id === 'packages' ? { title: 'Pakiety badań', fixedKind: 'packages' } : { title: 'Badania', fixedKind: 'tests' };
    return null;
  };
  SCREENS['category/:id'] = (id) => { const ctx = listingCtx('category/' + id); return ctx ? listingScreen(ctx) : SCREENS.dashboard(); };
  SCREENS['list/:id'] = (id) => listingScreen(listingCtx('list/' + id));
  SCREENS.results = () => listingScreen(listingCtx('results'));
  const isListing = (r) => /^(category|list)\//.test(r) || r === 'results';

  // ---------------- Karta produktu (badanie / pakiet) ----------------
  SCREENS['product/:id'] = (id) => {
    const p = byId(id); if (!p) return SCREENS.dashboard();
    const isPkg = p.kind === 'package', un = p.unavailableAt === type(), club = !!S().clubJoined;
    const price = priceVM(p, type(), true);
    const where = TYPES.filter(t => p.types.includes(t)).map(t => DELIVERY[t].label).join(', ');
    const comps = isPkg ? p.components.map(byId).filter(Boolean) : [];
    // „Kupując w pakiecie, oszczędzasz”: pakiety zawierające to badanie, a gdy brak — pakiety z tej samej kategorii
    const pkgs = forType().filter(x => x.kind === 'package'); const inPkgs = isPkg ? [] : (pkgs.filter(x => x.components.includes(p.id)).length ? pkgs.filter(x => x.components.includes(p.id)) : pkgs.filter(x => x.cat === p.cat)).slice(0, 3);
    const related = forType().filter(x => x.id !== p.id && x.kind === p.kind && x.cat === p.cat).slice(0, 3);
    const buyLabel = isPkg ? 'Kup pakiet' : 'Kup badanie';
    const buyAttrs = un ? { 'data-action': 'change-point' } : { 'data-action': 'add-to-cart', 'data-product': p.id, 'data-title': p.title };
    return `<div class="screen shop product" data-tab="shop">
      <header class="product__head" id="prod-head">${DS.TopBar({ transparent: true, light: true, title: isPkg ? 'Szczegóły pakietu' : 'Szczegóły badania' })}</header>
      <div class="product__bg" id="prod-bg"><img src="${A}img_product_bg.png" alt=""></div>
      <div class="screen__body shop__scroll product__scroll" id="prod-scroll">
        <div class="product__heroSpacer"></div>
        <div class="product__content">
          <div class="ds ds-Surface product__main">
            ${(() => { const b = heroBadge(p, un); return b ? `<div class="product__badge">${b}</div>` : ''; })()}
            <h1 class="product__title">${esc(p.title)}</h1>
            ${price ? DS.PriceBlock({ label: isPkg ? 'Cena za pakiet' : 'Cena za badanie', ...price, lowest: price.lowest && type() !== 'wysylka' ? price.lowest + ' dla wybranego Punktu Pobrań' : price.lowest })
              : `<p class="product__unavailableHint">Cenę zobaczysz po wybraniu punktu, w którym wykonujemy to badanie.</p>`}
            <!-- Gdy produktu nie da się kupić w wybranym kontekście, nie zachęcamy do ALAB club: zniżka dotyczyłaby
                 czegoś, czego nie można dodać do koszyka, a jedyne sensowne działanie to zmiana Punktu Pobrań
                 lub sposobu realizacji. Duży banner klubu niżej w treści zostaje. -->
            ${(p.code || (!club && !un)) ? `<div class="ds-PromoStack">${p.code ? DS.CodeBox({ discount: p.code.discount, code: p.code.code }) : ''}${(!club && !un) ? DS.ClubPromo() : ''}</div>` : ''}
            ${DS.Button({ label: un ? 'Zmień punkt' : buyLabel, type: un ? 'secondary' : 'primary', block: true, attrs: { id: 'prod-buy', ...buyAttrs } })}
          </div>
          ${DS.Surface({ label: isPkg ? 'Opis pakietu' : 'Opis badania', content: DS.Cell({ icon: 'file-doc', title: p.desc, attrs: { 'data-action': 'full-desc', class: 'ds-Cell--clamp' } }) })}
          ${isPkg ? DS.SectionHeader({ title: 'Składowe pakietu' }) + DS.Surface({ label: 'Składowe pakietu', content: `<div class="ds-Surface__list">${comps.map(c => DS.Cell({ icon: null, title: c.title, attrs: { 'data-open': c.id } })).join('')}</div>` }) : ''}
          ${DS.Surface({ content: `<div class="ds-Surface__rows">${DS.CellInfo({ icon: 'timer', label: 'Oczekiwanie na wynik', value: p.tat })}${isPkg ? '' : DS.CellInfo({ icon: 'lab-tube', label: 'Pobierany materiał', value: p.material })}${DS.CellInfo({ icon: 'pin', label: 'Gdzie można wykonać', value: where })}</div>` })}
          ${DS.Surface({ content: DS.CellInfo({ icon: 'file-check-doc', label: 'Przygotowanie do badania', bullets: p.prep }) })}
          ${inPkgs.length ? DS.SectionHeader({ title: 'Kupując w pakiecie, oszczędzasz' }) + `<div class="ds-Carousel">${inPkgs.map(card).join('')}</div>` : ''}
          ${DS.Surface({ label: isPkg ? 'Szczegóły pakietu' : 'Szczegóły badania', content: DS.Divider() + `<div class="ds-Surface__list">${DS.Cell({ icon: 'file-text', title: isPkg ? 'Pełny opis pakietu' : 'Pełny opis badania', attrs: { 'data-action': 'full-desc' } })}${DS.Cell({ icon: 'faq', title: 'Najczęstsze pytania (FAQ)', attrs: { 'data-action': 'faq' } })}</div><p class="ds-Surface__meta">Symbol ${esc(p.symbol)}${p.icd ? ` • Kod ICD: ${esc(p.icd)}` : ''}</p>` })}
          ${club ? '' : DS.ClubBannerLarge()}
          ${related.length ? `<section class="shop__section">${DS.SectionHeader({ title: isPkg ? 'Pakiety powiązane' : 'Badania powiązane' })}<div class="shop__cards">${related.map(card).join('')}</div></section>` : ''}
        </div>
      </div>
      ${price && !un ? `<div class="product__cta" id="prod-cta">${DS.Button({ label: `${buyLabel} • ${price.current}`, block: true, attrs: buyAttrs })}</div>` : ''}
    </div>`;
  };

  // ---------------- zachowanie paska przy scrollu (iOS-like collapse) ----------------
  // Nagłówek sklepu przy przewijaniu (wzorzec iOS: UINavigationBar + UISearchController, Material 3 „scroll-away”):
  //  • strona główna: pole szukania zostaje przypięte, a rząd chipów zwija się proporcjonalnie do ruchu palca,
  //  • listing kategorii / wyników: w dół cały blok pod paskiem (wyszukiwarka z filtrami + chipy) schodzi JEDNYM ruchem,
  //    lekki ruch w górę przywraca wyszukiwarkę z filtrami, a chipy wracają dopiero na samej górze.
  function setupShopScroll(root, route) {
    const head = $('#shop-head', root), scroll = $('#shop-scroll', root), spacer = $('#shop-spacer', root), chipsWrap = $('#shop-chips', root);
    if (!head || !scroll) return;
    const wrap = head.querySelector('.shop__searchWrap'), row = head.querySelector('.shop__searchRow');
    const listing = !!head.querySelector('.shop__nav--bar');   // listing ma pasek z tytułem, strona główna nie
    const measure = () => {
      head.classList.remove('is-collapsed', 'is-searchhidden');
      chipsWrap.style.cssText = ''; wrap.style.paddingBottom = ''; wrap.style.gap = '';
      if (row) row.style.height = '';
      spacer.style.height = head.offsetHeight + 'px';
      head.dataset.chips = chipsWrap.offsetHeight; head.dataset.row = row ? row.offsetHeight : 0;
      if (listing) { chipsWrap.style.setProperty('--chips-h', head.dataset.chips + 'px'); if (row) row.style.setProperty('--row-h', head.dataset.row + 'px'); }
    };
    measure();
    const COLLAPSE = 72;   // strona główna: px scrolla, po których chipy są schowane
    const TRIGGER = 24;    // listing: po tylu px w dół chowamy blok pod paskiem
    let raf = 0, last = scroll.scrollTop;
    const onScroll = () => {
      if (raf) return; raf = requestAnimationFrame(() => {
        raf = 0; const y = scroll.scrollTop, d = y - last;
        head.classList.toggle('is-scrolled', y > 4);
        if (listing) {
          // jeden stan = jeden ruch; klasy przełączamy skokowo, animację robi CSS na obu elementach naraz
          if (y < 8) head.classList.remove('is-collapsed', 'is-searchhidden');
          else if (d > 4 && y > TRIGGER) head.classList.add('is-collapsed', 'is-searchhidden');
          else if (d < -4) head.classList.remove('is-searchhidden');
        } else {
          const p = Math.max(0, Math.min(1, y / COLLAPSE));
          const ch = +head.dataset.chips;
          // chipy gasną szybciej niż zwija się ich pas, więc nie widać obcięcia i nie wchodzą pod wyszukiwarkę
          chipsWrap.style.height = (ch * (1 - p)) + 'px'; chipsWrap.style.opacity = String(Math.max(0, 1 - p * 1.8));
          // po zwinięciu: 28 px od pola do dolnej krawędzi granatu; boczne zaokrąglenia zostają, treść prześwituje między nimi
          wrap.style.paddingBottom = (24 + 4 * p) + 'px'; wrap.style.gap = (16 * (1 - p)) + 'px';
          head.classList.toggle('is-collapsed', p >= 1);
        }
        last = y; st().scroll[route] = y;
      });
    };
    scroll.addEventListener('scroll', onScroll, { passive: true });
    const y0 = st().scroll[route] || 0; if (y0) { scroll.scrollTop = y0; onScroll(); }
  }

  // karta produktu: pasek nawigacji wypełnia się granatem po zjechaniu z hero; przyklejone CTA pojawia się, gdy główny przycisk znika z ekranu
  function setupProductScroll(root, route) {
    const head = $('#prod-head', root), scroll = $('#prod-scroll', root), cta = $('#prod-cta', root), buy = $('#prod-buy', root), bar = $('#tabbar'), bg = $('#prod-bg', root);
    if (!head || !scroll) return;
    // przyklejone CTA siedzi dokładnie na tab barze (jego wysokość zależy od safe-area telefonu)
    const placeCta = () => { if (cta && bar) cta.style.bottom = bar.offsetHeight + 'px'; };
    placeCta(); window.addEventListener('resize', placeCta, { passive: true });
    // grafika hero jedzie w górę razem z treścią, ale przy ciągnięciu w dół (rubber band, scrollTop < 0) stoi w miejscu
    const onScroll = () => { const y = scroll.scrollTop, sc = y > 8; head.classList.toggle('is-scrolled', sc); APP.setThemeColor(sc ? '#ffffff' : '#04387c'); if (bg) bg.style.transform = `translateY(${-Math.max(0, Math.min(y, 468))}px)`; st().scroll[route] = y; };
    onScroll();
    scroll.addEventListener('scroll', onScroll, { passive: true });
    APP.hideOnScrollDown(scroll, cta);
    if (cta && buy && 'IntersectionObserver' in window) { new IntersectionObserver(([e]) => cta.classList.toggle('is-visible', !e.isIntersecting && e.boundingClientRect.top < 0), { root: scroll, threshold: 0 }).observe(buy); }
    // karta produktu otwiera się zawsze od góry (jak nowy ekran w iOS) — pozycji nie przywracamy
  }
  APP.afterRender.push((route, root) => {
    syncTabBar(route);
    if (route === 'dashboard' || isListing(route)) setupShopScroll(root, route);
    if (route.startsWith('product/')) setupProductScroll(root, route);
    if (route === 'search') { const i = $('#search-input', root); setTimeout(() => i?.focus({ preventScroll: true }), 60); }
    if (route === 'tab/results' || route === 'tab/start' || route === 'tab/cart') { const sc = $('.shop__scroll', root); if (sc) sc.scrollTop = st().scroll[route] || 0; }
  });

  // ---------------- arkusze (iOS-owy gest zamykania w DS.presentSheet) ----------------
  function categorySheet() {
    const cats = catsFor();
    const sheet = DS.presentSheet({ title: 'Kategorie', subtitle: 'Wybierz kategorię badań, która Cię interesuje', height: '750px',
      content: `<div class="ds-BottomSheet__scroll" style="gap:8px">${cats.map(c => DS.Cell({ icon: c.icon, title: c.label, subtitle: plural(catCount(c), 'badanie', 'badania', 'badań'), attrs: { 'data-action': 'open-category', 'data-cat': c.id } })).join('')}</div>` });
    sheet.wrap.addEventListener('click', (e) => { if (e.target.closest('[data-action="open-category"]')) setTimeout(() => sheet.close(false), 120); });
  }
  function kindSheet(ctx) {
    const sheet = DS.presentSheet({ title: 'Pokaż', content: `<div class="ds-BottomSheet__scroll" style="gap:4px">${KINDS.map(([id, label]) => DS.Cell({ icon: id === 'all' ? 'view-list' : id === 'tests' ? 'test-tube' : 'file-check', title: label, trailing: st().kind === id ? 'check-circle' : null, attrs: { 'data-kind-pick': id, class: st().kind === id ? 'is-selected' : '' } })).join('')}</div>` });
    sheet.wrap.addEventListener('click', (e) => { const k = e.target.closest('[data-kind-pick]'); if (!k) return; st().kind = k.dataset.kindPick; sheet.close(); refreshListing(); });
  }

  // ---------------- odświeżanie w miejscu (zmiana sposobu realizacji / filtrów) ----------------
  const swap = (el, html) => { if (!el) return; el.classList.add('is-swapping'); setTimeout(() => { el.innerHTML = html; el.classList.remove('is-swapping'); DS.enhance(el); }, 120); };
  function refreshListing() {
    const ctx = listingCtx(current()); if (!ctx) return;
    swap($('#listing-body'), listingBody(ctx)); const f = $('#shop-filters'); if (f) f.innerHTML = filtersRow(ctx);
  }
  function refreshDelivery() {
    const r = current();
    $$('.ds-FilterChip[data-delivery]').forEach(c => { const on = c.dataset.delivery === type(); c.classList.toggle('is-selected', on); c.setAttribute('aria-pressed', on); });
    swap($('#shop-loc'), locCell());
    if (r === 'dashboard') { swap($('#shop-tiles'), tilesHtml()); swap($('#shop-popular'), popularSections()); }
    else if (isListing(r)) { st().sub = {}; refreshListing(); }
    else if (r === 'search') { const res = $('#search-results'); if (res) res.innerHTML = searchResults(st().query); }
  }
  const refreshCartBadge = () => syncTabBar(current());

  // ---------------- trwała dolna nawigacja ----------------
  // Pasek żyje poza przewijanymi ekranami (#tabbar w ramce telefonu), więc nie jedzie razem z przejściem ekranu —
  // tak jak UITabBar w iOS i NavigationBar w Androidzie. Przerysowujemy go tylko wtedy, gdy zmienia się aktywna
  // zakładka albo licznik, a na ekranach pełnoekranowych (wyszukiwarka, webview, dodatkowe informacje) zjeżdża w dół.
  const BAR_ROUTES = (r) => r === 'dashboard' || r === 'results' || r === 'results-empty' || r.startsWith('tab/') || /^(category|list|product|result|zadanie)\//.test(r);
  const activeTabFor = (r) => (r === 'tab/start' || r.startsWith('zadanie/')) ? 'start' : r === 'tab/cart' ? 'cart'
    : (r === 'tab/results' || r === 'results-empty' || /^(result|rinfo)\//.test(r)) ? 'results' : 'shop';
  function syncTabBar(route) {
    const host = $('#tabbar'); if (!host) return;
    const show = BAR_ROUTES(route) && !APP.hideTabBar;   // ekran ładowania zadania chowa pasek
    host.classList.toggle('is-off', !show);
    if (!show) return;
    const active = activeTabFor(route);
    const key = [active, st().cart, (APP.results && APP.results.newCount()) || 0].join('|');
    if (host.dataset.key === key) return;
    host.dataset.key = key; host.innerHTML = tabBar(active); DS.enhance(host);
  }
  APP.syncTabBar = syncTabBar;

  // ---------------- akcje ----------------
  const info = (t) => snack(t, 'info', 110);
  const openProduct = (id) => { const p = byId(id); if (p) go('product/' + id); };
  Object.assign(ACTIONS, {
    'open-search': () => { st().query = ''; go('search'); },
    'search-cancel': () => back(),
    'search-pick': (el) => { st().query = el.dataset.q; const i = $('#search-input'); if (i) { i.value = el.dataset.q; i.closest('.ds-SearchField').classList.add('has-value'); } $('#search-results').innerHTML = searchResults(el.dataset.q); i?.focus({ preventScroll: true }); },
    'search-submit': (el) => { st().query = (el && el.dataset.q) || st().query; if (st().query.trim()) go('results'); },
    'open-product': (el) => openProduct(el.dataset.open),
    'add-to-cart': (el) => {
      const id = el.dataset.product || el.closest('.ds-ProductCard')?.dataset.product; const p = byId(id); if (!p) return;
      // można dodać kolejną sztukę — przycisk nie zmienia stanu; potwierdzeniem jest snackbar, haptyka i licznik na zakładce Koszyk
      st().added[id] = (+st().added[id] || 0) + 1; st().cart++;
      refreshCartBadge(); DS.haptic('light'); snack(`Dodano do koszyka: ${p.title}`, 'success', 110);
    },
    'change-point': () => go('punkt-pobran'),
    'open-category': (el) => go('category/' + el.dataset.cat),
    'all-categories': () => categorySheet(),
    'show-all': (el) => go('list/' + el.dataset.kind),
    'package-details': (el) => { const id = el.closest('.ds-ProductCard')?.dataset.product; if (id) openProduct(id); },
    'kind-menu': () => kindSheet(),
    'filters': () => info('Filtry (P02) — w kolejnym etapie'),
    'full-desc': () => info('Pełny opis — treść z API w kolejnym etapie'),
    'faq': () => info('FAQ badania — w kolejnym etapie'),
    'copy-code': (el) => { const code = el.dataset.code; (navigator.clipboard?.writeText(code) || Promise.resolve()).then(() => snack(`Skopiowano kod ${code}`, 'success', 110), () => info(`Kod: ${code}`)); },
    // Zachęta do klubu (mały banner pod ceną i duży banner w treści) otwiera ekran zgód ALAB club.
    // Zapamiętujemy, z którego ekranu wchodzimy, żeby po decyzji wrócić dokładnie tam — z nowymi cenami.
    'club-promo': () => { S().clubFrom = current(); go('club'); },
  });
  document.addEventListener('click', (e) => {
    const tab = e.target.closest('[data-tab]'); if (tab && !tab.classList.contains('screen')) { const t = TABS.find(x => x.id === tab.dataset.tab); if (t) { const sc = $('#screen .shop__scroll'); if (sc) st().scroll[current()] = sc.scrollTop; if (current() !== t.route) go(t.route); } return; }
    const chip = e.target.closest('[data-delivery]'); if (chip) { if (st().delivery !== chip.dataset.delivery) { st().delivery = chip.dataset.delivery; APP.syncUrl({ push: true }); refreshDelivery(); } return; }
    const sub = e.target.closest('[data-sub]'); if (sub) { const cat = sub.dataset.cat; st().sub[cat] = st().sub[cat] === sub.dataset.sub ? null : sub.dataset.sub; refreshListing(); return; }
    // karta / wiersz z data-open otwiera produkt (kliknięcia w przyciski wewnątrz karty mają własne akcje)
    const open = e.target.closest('[data-open]'); if (open && !e.target.closest('button:not([data-open]), [data-action]')) openProduct(open.dataset.open);
  });
  document.addEventListener('ds:search', (e) => { st().query = e.detail.value; const r = $('#search-results'); if (r) r.innerHTML = searchResults(e.detail.value); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.id === 'search-input') { e.target.blur(); const q = e.target.value.trim(); if (q) { st().query = q; go('results'); } } });

  // Sposób realizacji jest SEGMENTEM ścieżki (`/app/sklep/w-domu`), a nie parametrem `?dostawa=dom`:
  // narzędzia badawcze i analityczne potrafią traktować dwa adresy różniące się tylko query jako ten sam ekran,
  // a to jest pomiar, na którym zależy nam najbardziej (ile osób realnie zmieniło kontekst na dostawę do domu).
  // Segment dopisujemy tylko tam, gdzie widać chipy sposobu realizacji — karta produktu zostaje jednym adresem.
  const DELIVERY_SLUG = { punkt: 'punkt-pobran', dom: 'w-domu', wysylka: 'zestaw-wysylkowy' };
  const DELIVERY_OF_SLUG = { 'punkt-pobran': 'punkt', 'w-domu': 'dom', 'zestaw-wysylkowy': 'wysylka' };
  const hasDelivery = (r) => r === 'dashboard' || r === 'search' || r === 'results' || /^(category|list)\//.test(r);
  // Tryb ALAB club też siedzi w adresie — bez tego nie da się policzyć, ile osób kupiło z klubem, a ile bez
  // (uwaga Maćka z tablicy). Dokładamy go tam, gdzie zmienia to, co widać: ekrany sklepu z cenami, karta
  // produktu i koszyk (tam kończy się zadanie). Ekran wyboru zadań i ekran zgód zostają bez wariantu.
  const CLUB_SLUG = { yes: 'w-klubie', no: 'bez-klubu' };
  const hasClub = (r) => hasDelivery(r) || /^product\//.test(r) || r === 'tab/cart';
  APP.routeVariant({
    get: (r) => [hasDelivery(r) ? DELIVERY_SLUG[type()] : null, hasClub(r) ? (inClub() ? CLUB_SLUG.yes : CLUB_SLUG.no) : null].filter(Boolean).join('/') || null,
    match: (seg) => !!DELIVERY_OF_SLUG[seg] || seg === CLUB_SLUG.yes || seg === CLUB_SLUG.no,
    set: (seg) => {
      const d = DELIVERY_OF_SLUG[seg];
      if (d) st().delivery = d;
      else if (seg === CLUB_SLUG.yes || seg === CLUB_SLUG.no) { const on = seg === CLUB_SLUG.yes; S().clubJoined = on; APP.rememberClub(on); }
    },
  });
  if (APP.recallClub()) S().clubJoined = true;   // wejście w kolejne zadanie z linku: klub pamiętamy na sesję

  // Czytelne adresy: produkt i kategoria dostają slug z nazwy (adres w raporcie z badania mówi, co to za ekran).
  const slugify = (s) => s.toLowerCase().replace(/ł/g, 'l').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 52).replace(/-+$/, '');
  const uniq = (items, key) => { const used = new Set(), map = {}; items.forEach(x => { let s = slugify(key(x)) || x.id; if (used.has(s)) s += '-' + x.id.replace(/^[tp]-/, ''); used.add(s); map[x.id] = s; }); return map; };
  APP.slugs('product', uniq(PRODUCTS, x => x.title));
  APP.slugs('category', uniq(CATEGORIES, x => x.label));

  // panel deweloperski: dopisz trasy sklepu
  APP.ROUTES.splice(APP.ROUTES.findIndex(r => r[1] === 'dashboard'), 1, ['Sklep · Strona główna', 'dashboard'], ['Sklep · Wyszukiwarka', 'search'], ['Listing · Hormony', 'category/hormony'], ['Listing · Wszystkie pakiety', 'list/packages'], ['Produkt · Badanie', 'product/t-morf-roz'], ['Produkt · Pakiet', 'product/p-tarcz'], ['Zakładka Start', 'tab/start'], ['Zakładka Wyniki', 'tab/results'], ['Zakładka Koszyk', 'tab/cart']);
  APP.renderNav();
  APP.shop = { st, card, forType, catsFor, DELIVERY, tabBar, TABS };
})();
