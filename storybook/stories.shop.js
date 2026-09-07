/* Storybook — komponenty sklepu (Moduł 3). Dopisuje się do SB.COMPONENTS z storybook.js. */
(function () {
  const { COMPONENTS, sel, bool, text, cell } = window.SB;
  const W = (html) => `<div style="width:335px">${html}</div>`;

  COMPONENTS.searchfield = { fn: 'SearchField', title: 'SearchField', figma: 'SearchField 656:7321 · 1875:77552', desc: 'Pole wyszukiwania 56px. Style onColor (na granatowym hero, klik otwiera wyszukiwarkę) i Solid Active (border 2 Outline/borderActive, caret, Clear, link „Anuluj”).',
    controls: [sel('state', 'State', ['default', 'active'], 'default'), text('value', 'Value', ''), bool('cancel', 'Anuluj', true)],
    dark: p => p.state !== 'active', phone: true,
    render: p => DS.SearchField({ style: p.state === 'active' ? 'solid' : 'oncolor', state: p.state, value: p.value, cancel: p.cancel }),
    matrix: () => `</div><div class="sb-matrix sb-matrix--dark">` + cell('onColor · default', W(DS.SearchField({}))) + `</div><div class="sb-matrix sb-matrix--col">` + cell('solid · active · pusty', W(DS.SearchField({ style: 'solid', state: 'active' }))) + cell('solid · active · z frazą', W(DS.SearchField({ style: 'solid', state: 'active', value: 'Mor' }))),
    props: [['style', "'oncolor' | 'solid'", 'Figma: Style'], ['state', "'default' | 'active'", 'default = przycisk-placeholder, active = input'], ['value, placeholder', 'string', ''], ['cancel', 'boolean', 'link „Anuluj” (data-action=search-cancel)'], ['event ds:search', '{ value }', 'na każdą zmianę']] };

  COMPONENTS.tabbar = { fn: 'BottomTabBar', title: 'BottomTabBar', figma: '656:7312', desc: 'Dolna nawigacja: Divider + 4 zakładki (ikona 24 + label 11/12 Bold, aktywna w Main/accent) + HomeIndicator 20px. Badge = NumberIndicator (np. liczba pozycji w koszyku).',
    controls: [sel('active', 'Active', ['start', 'shop', 'results', 'cart'], 'shop'), text('badge', 'Badge koszyka', '2')],
    phone: true, tall: true,
    render: p => `<div style="height:120px"></div>` + DS.BottomTabBar({ active: p.active, items: [{ id: 'start', label: 'Start', icon: 'home' }, { id: 'shop', label: 'Sklep', icon: 'search-active' }, { id: 'results', label: 'Wyniki', icon: 'folder' }, { id: 'cart', label: 'Koszyk', icon: 'cart', badge: p.badge || null }] }),
    matrix: () => `</div><div class="sb-matrix sb-matrix--col">` + cell('Sklep aktywny', `<div style="width:375px">${DS.BottomTabBar({ active: 'shop', items: [{ id: 'start', label: 'Start', icon: 'home' }, { id: 'shop', label: 'Sklep', icon: 'search-active' }, { id: 'results', label: 'Wyniki', icon: 'folder' }, { id: 'cart', label: 'Koszyk', icon: 'cart', badge: 3 }] })}</div>`),
    props: [['items', '[{ id, label, icon, badge }]', ''], ['active', 'id', 'aktywna zakładka'], ['data-tab', 'atrybut przycisku', 'obsługa kliknięcia po stronie aplikacji']] };

  COMPONENTS.categorytile = { fn: 'CategoryTile', title: 'CategoryTile', figma: '679:8111', desc: 'Kafel kategorii: tło surfaceQuaternary, radius 16, ikona 24 + label 12 Bold wyrównany do dołu (min 32px). Wariant „Wszystkie kategorie” = białe tło z borderem.',
    controls: [sel('icon', 'Icon', ['test-tube', 'medicine-bottle', 'fork-knife', 'bubbles', 'heart-rate', 'plus-square'], 'test-tube'), text('label', 'Label', 'Badania i pakiety ogólne'), bool('all', 'All (biały)')],
    render: p => `<div style="width:163px">${DS.CategoryTile(p)}</div>`,
    matrix: () => cell('siatka 2 kolumny', `<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;width:335px">${[['test-tube', 'Badania i pakiety ogólne'], ['medicine-bottle', 'Hormony'], ['fork-knife', 'Alergie i nietolerancje pokarmowe'], ['bubbles', 'Układ pokarmowy'], ['heart-rate', 'Układ krążenia i Hematologia']].map(([i, l]) => DS.CategoryTile({ icon: i, label: l })).join('')}${DS.CategoryTile({ icon: 'plus-square', label: 'Wszystkie kategorie', all: true })}</div>`),
    props: [['icon', 'nazwa ikony', 'ic_line_* z DS'], ['label', 'string', ''], ['all', 'boolean', 'wariant wejścia do arkusza kategorii']] };

  COMPONENTS.productcard = { fn: 'ProductCard', title: 'ProductCard (CellPackage · CellTest)', figma: 'CellPackage 1888:348 · CellTest 1888:407', desc: 'Karta produktu na SurfaceSlot (radius 28, border Outline/border): badge, meta 12 Bold secondary, tytuł 14 Bold, blok ceny (20 Bold + przekreślona + fiolet klubu + drobne 11), ButtonTiny na całą szerokość. Pakiet ma stopkę „Zobacz składowe pakietu • N”.',
    controls: [sel('kind', 'Kind', ['test', 'package'], 'test'), sel('badge', 'Badge', ['none', 'code', 'premium', 'basic'], 'code'), text('title', 'Title', 'Morfologia krwi obwodowej z rozmazem'), bool('old', 'Cena przekreślona', true), bool('club', 'Cena klubowa', true)],
    phone: true,
    render: p => DS.ProductCard({ kind: p.kind, meta: p.kind === 'package' ? 'Liczba badań: 4' : 'Materiał: Krew', title: p.title,
      badge: p.badge === 'code' ? { code: { discount: '-20%', text: 'z kodem JESIEN20' } } : p.badge === 'premium' ? { premium: 'Niższa cena z ALAB Club' } : p.badge === 'basic' ? { basic: 'Niedostępne w wybranym punkcie' } : null,
      price: p.badge === 'basic' ? null : { current: '24,80 zł', old: p.old ? '31 zł' : null, club: p.club ? '23,56 zł ekstra -5% w klubie' : null, lowest: p.old ? 'Najniższa cena z 30 dni: 31 zł' : null, note: '+ opłata za pobranie' },
      cta: p.badge === 'basic' ? 'Zmień punkt' : 'Do koszyka', ctaVariant: p.badge === 'basic' ? 'secondary' : 'primary', footer: p.kind === 'package' ? { label: 'Zobacz składowe pakietu', count: 4 } : null }),
    matrix: () => `</div><div class="sb-matrix sb-matrix--col">` +
      cell('CellPackage · kod rabatowy', W(DS.ProductCard({ kind: 'package', meta: 'Liczba badań: 4', title: 'Pakiet tarczycowy podstawowy', badge: { code: { discount: '-20%', text: 'z kodem JESIEN20' } }, price: { current: '68 zł', old: '85 zł', club: '64,60 zł ekstra -5% w klubie', lowest: 'Najniższa cena z 30 dni: 85 zł', note: '+ opłata za pobranie' }, footer: { label: 'Zobacz składowe pakietu', count: 4 } }))) +
      cell('CellTest · ALAB club', W(DS.ProductCard({ meta: 'Materiał: Krew', title: 'Ferrytyna – ocena zapasów żelaza', badge: { premium: 'Niższa cena z ALAB Club' }, price: { current: '49 zł', club: '29,40 zł zniżka -40% w klubie', note: '+ opłata za pobranie' } }))) +
      cell('CellTest · niedostępne', W(DS.ProductCard({ meta: 'Materiał: Krew', title: 'Witamina D 25(OH) – metabolit', badge: { basic: 'Niedostępne w wybranym punkcie' }, cta: 'Zmień punkt', ctaVariant: 'secondary' }))),
    props: [['kind', "'test' | 'package'", 'pakiet ma stopkę'], ['meta, title', 'string', ''], ['badge', '{ code:{discount,text} } | { premium } | { basic }', ''], ['price', '{ current, old, club, lowest, note }', ''], ['cta, ctaVariant', 'string, primary|secondary', ''], ['footer', '{ label, count }', 'tylko pakiet']] };

  COMPONENTS.badges = { fn: 'BadgeCode', title: 'Badges (Code · Premium · Basic)', figma: 'BadgeCode 777:6359 · BadgePremium 777:6327 · BadgeBasic 1946:140938', desc: 'BadgePrice = zielony gradient z cieniem (GradientSuccess + elevation_CodeBadge). BadgeCode = pill surfaceSecondary z BadgePrice i tekstem 11 Bold. BadgePremium = gradient ALAB club z sygnetem. BadgeBasic = szary z ikoną.',
    controls: [text('discount', 'Discount', '-20%'), text('text', 'Text', 'z kodem JESIEN20')],
    render: p => DS.BadgeCode(p),
    matrix: () => cell('BadgePrice', DS.BadgePrice({})) + cell('BadgeCode', DS.BadgeCode({})) + cell('BadgePremium', DS.BadgePremium({})) + cell('BadgeBasic', DS.BadgeBasic({})),
    props: [['BadgePrice({ label })', '', ''], ['BadgeCode({ discount, text })', '', ''], ['BadgePremium({ text })', '', ''], ['BadgeBasic({ text, icon })', '', '']] };

  COMPONENTS.cells = { fn: 'Cell', title: 'Cell · SectionHeader · CellOrderTypeStatus', figma: 'Cell 25:1313 · Header 713:23564 · CellOrderTypeStatus 2483:45318', desc: 'Cell = wiersz listy (ikona 24, tytuł 14 Bold, podtytuł 12, chevron 16); w podpowiedziach wyszukiwarki podświetla dopasowaną frazę. SectionHeader = tytuł headline/large + link „Pokaż wszystkie”. CellOrderTypeStatus = wybrany Punkt Pobrań z godzinami.',
    controls: [text('title', 'Title', 'Morfologia krwi (pełna)'), text('subtitle', 'Subtitle', '141,55 zł'), sel('icon', 'Icon', ['file-note-search', 'file-check', 'test-tube', 'view-list'], 'test-tube')],
    phone: true,
    render: p => DS.Cell({ ...p, subtitle: p.subtitle || null }),
    matrix: () => `</div><div class="sb-matrix sb-matrix--col">` + cell('Cell · najczęściej szukane', W(DS.Cell({ title: 'Morfologia' }))) + cell('Cell · podpowiedź z frazą', W(DS.Cell({ titleHtml: '„<span class="match">Mor</span>fologia”', subtitle: '3 pakiety i 2 badania' }))) + cell('Cell · kategoria', W(DS.Cell({ icon: 'view-list', title: 'Morfologia krwi', subtitle: '3 badań' }))) + cell('SectionHeader', W(DS.SectionHeader({ title: 'Popularne pakiety', action: 'Pokaż wszystkie' }))) + cell('CellOrderTypeStatus', W(DS.CellOrderTypeStatus({}))) + cell('SearchEmpty', W(DS.SearchEmpty({ title: 'Brak wyników dla „MorfoDD3232r22”', hint: 'Sprawdź pisownię lub wyszukaj inną frazę' }))),
    props: [['Cell({ icon, title | titleHtml, subtitle, trailing })', '', ''], ['SectionHeader({ title, action, actionAttrs })', '', ''], ['CellOrderTypeStatus({ title, status })', '', ''], ['SearchEmpty({ title, hint })', '', '']] };

  window.SB.route();
})();
