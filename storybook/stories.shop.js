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
      badge: p.badge === 'code' ? { code: { discount: '−20%', text: 'z kodem JESIEN20' } } : p.badge === 'premium' ? { premium: 'Niższa cena z ALAB club' } : p.badge === 'basic' ? { basic: 'Niedostępne w wybranym Punkcie Pobrań' } : null,
      price: p.badge === 'basic' ? null : { current: '24,80 zł', old: p.old ? '31,00 zł' : null, club: p.club ? '23,56 zł ekstra −5% w klubie' : null, lowest: p.old ? 'Najniższa cena z 30 dni: 31,00 zł' : null, note: '+ opłata za pobranie' },
      cta: p.badge === 'basic' ? 'Zmień punkt' : 'Do koszyka', ctaVariant: p.badge === 'basic' ? 'secondary' : 'primary', footer: p.kind === 'package' ? { label: 'Zobacz składowe pakietu', count: 4 } : null }),
    matrix: () => `</div><div class="sb-matrix sb-matrix--col">` +
      cell('CellPackage · kod rabatowy', W(DS.ProductCard({ kind: 'package', meta: 'Liczba badań: 4', title: 'Pakiet tarczycowy podstawowy', badge: { code: { discount: '−20%', text: 'z kodem JESIEN20' } }, price: { current: '68,00 zł', old: '85,00 zł', club: '64,60 zł ekstra −5% w klubie', lowest: 'Najniższa cena z 30 dni: 85,00 zł', note: '+ opłata za pobranie' }, footer: { label: 'Zobacz składowe pakietu', count: 4 } }))) +
      cell('CellTest · ALAB club', W(DS.ProductCard({ meta: 'Materiał: Krew', title: 'Ferrytyna – ocena zapasów żelaza', badge: { premium: 'Niższa cena z ALAB club' }, price: { current: '49,00 zł', club: '29,40 zł taniej −40% w klubie', note: '+ opłata za pobranie' } }))) +
      cell('CellTest · niedostępne', W(DS.ProductCard({ meta: 'Materiał: Krew', title: 'Witamina D 25(OH) – metabolit', badge: { basic: 'Niedostępne w wybranym Punkcie Pobrań' }, cta: 'Zmień punkt', ctaVariant: 'secondary' }))),
    props: [['kind', "'test' | 'package'", 'pakiet ma stopkę'], ['meta, title', 'string', ''], ['badge', '{ code:{discount,text} } | { premium } | { basic }', ''], ['price', '{ current, old, club, lowest, note }', ''], ['cta, ctaVariant', 'string, primary|secondary', ''], ['footer', '{ label, count }', 'tylko pakiet']] };

  COMPONENTS.badges = { fn: 'BadgeCode', title: 'Badges (Code · Premium · Basic)', figma: 'BadgeCode 777:6359 · BadgePremium 777:6327 · BadgeBasic 1946:140938', desc: 'BadgePrice = zielony gradient z cieniem (GradientSuccess + elevation_CodeBadge). BadgeCode = pill surfaceSecondary z BadgePrice i tekstem 11 Bold. BadgePremium = gradient ALAB club z sygnetem. BadgeBasic = szary z ikoną.',
    controls: [text('discount', 'Discount', '−20%'), text('text', 'Text', 'z kodem JESIEN20')],
    render: p => DS.BadgeCode(p),
    matrix: () => cell('BadgePrice', DS.BadgePrice({})) + cell('BadgeCode', DS.BadgeCode({})) + cell('BadgePremium', DS.BadgePremium({})) + cell('BadgeBasic', DS.BadgeBasic({})),
    props: [['BadgePrice({ label })', '', ''], ['BadgeCode({ discount, text })', '', ''], ['BadgePremium({ text })', '', ''], ['BadgeBasic({ text, icon })', '', '']] };

  COMPONENTS.cells = { fn: 'Cell', title: 'Cell · SectionHeader · CellOrderTypeStatus', figma: 'Cell 25:1313 · Header 713:23564 · CellOrderTypeStatus 2483:45318', desc: 'Cell = wiersz listy (ikona 24, tytuł 14 Bold, podtytuł 12, chevron 16); w podpowiedziach wyszukiwarki podświetla dopasowaną frazę. SectionHeader = tytuł headline/large + link „Pokaż wszystkie”. CellOrderTypeStatus = wybrany Punkt Pobrań z godzinami.',
    controls: [text('title', 'Title', 'Morfologia krwi (pełna)'), text('subtitle', 'Subtitle', '141,55 zł'), sel('icon', 'Icon', ['file-note-search', 'file-check', 'test-tube', 'view-list'], 'test-tube')],
    phone: true,
    render: p => DS.Cell({ ...p, subtitle: p.subtitle || null }),
    matrix: () => `</div><div class="sb-matrix sb-matrix--col">` + cell('Cell · najczęściej szukane', W(DS.Cell({ title: 'Morfologia' }))) + cell('Cell · podpowiedź z frazą', W(DS.Cell({ titleHtml: '„<span class="match">Mor</span>fologia”', subtitle: '3 pakiety i 2 badania' }))) + cell('Cell · kategoria', W(DS.Cell({ icon: 'view-list', title: 'Morfologia krwi', subtitle: '3 badań' }))) + cell('SectionHeader', W(DS.SectionHeader({ title: 'Popularne pakiety', action: 'Pokaż wszystkie' }))) + cell('CellOrderTypeStatus', W(DS.CellOrderTypeStatus({}))) + cell('SearchEmpty', W(DS.SearchEmpty({ title: 'Brak wyników dla „MorfoDD3232r22”', hint: 'Sprawdź pisownię lub wyszukaj inną frazę' }))),
    props: [['Cell({ icon, title | titleHtml, subtitle, trailing })', '', ''], ['SectionHeader({ title, action, actionAttrs })', '', ''], ['CellOrderTypeStatus({ title, status })', '', ''], ['SearchEmpty({ title, hint })', '', '']] };

  COMPONENTS.priceblock = { fn: 'PriceBlock', title: 'PriceBlock · CodeBox · ClubPromo', figma: 'Produkt • Badanie 1183:19461', desc: 'Blok ceny z karty produktu: etykieta 12 secondary, cena 28 Bold w kolorze functional/success, przekreślona cena, cena klubowa (accent/loyalty), Omnibus i „+ opłata za pobranie” z ikoną info. Pod nim PromoStack: CodeBox (kod rabatowy + kopiuj) zespolony z ClubPromo (fiolet).',
    controls: [text('label', 'Label', 'Cena za badanie'), text('current', 'Cena', '96,00 zł'), text('old', 'Cena przekreślona', '120,00 zł'), text('club', 'Cena klubowa', '130,50 zł ekstra −5% w klubie'), text('lowest', 'Omnibus', 'Najniższa cena z 30 dni: 130,00 zł dla wybranego Punktu Pobrań'), text('note', 'Dopisek', '+ opłata za pobranie')],
    render: p => W(DS.PriceBlock(p)),
    matrix: () => cell('PriceBlock + PromoStack', W(DS.PriceBlock({ current: '96,00 zł', old: '120,00 zł', club: '130,50 zł ekstra −5% w klubie', lowest: 'Najniższa cena z 30 dni: 130,00 zł dla wybranego Punktu Pobrań', note: '+ opłata za pobranie' }) + `<div style="height:16px"></div><div class="ds-PromoStack">${DS.CodeBox({ discount: '−20%', code: 'B26SIER' })}${DS.ClubPromo()}</div>`)) +
      cell('bez promocji (tylko klub)', W(DS.PriceBlock({ label: 'Cena za pakiet', current: '199,00 zł', club: '189,05 zł ekstra −5% w klubie', note: '+ opłata za pobranie' }) + `<div style="height:16px"></div><div class="ds-PromoStack">${DS.ClubPromo()}</div>`)),
    props: [['label', 'string', '„Cena za badanie” / „Cena za pakiet”'], ['current · old · club · lowest · note', 'string', 'gotowe teksty z groszami (leksykon ALAB)']] };

  COMPONENTS.cellinfo = { fn: 'CellInfo', title: 'CellInfo · Surface', figma: 'Produkt • Badanie 1183:19461 (wiersze szczegółów)', desc: 'Wiersz informacyjny karty produktu: ikona 24 w kolorze accent, etykieta 12 secondary, wartość 14 Bold albo lista punktów (przygotowanie). Wiersze grupuje Surface (biała karta, border Outline/border, radius 24).',
    controls: [sel('icon', 'Icon', ['timer', 'lab-tube', 'pin', 'file-check-doc', 'file-doc', 'file-text', 'faq'], 'timer'), text('label', 'Label', 'Oczekiwanie na wynik'), text('value', 'Value', '1 dzień roboczy')],
    render: p => W(DS.Surface({ content: DS.CellInfo(p) })),
    matrix: () => cell('karta szczegółów', W(DS.Surface({ content: `<div class="ds-Surface__rows">${DS.CellInfo({ icon: 'timer', label: 'Oczekiwanie na wynik', value: '1 dzień roboczy' })}${DS.CellInfo({ icon: 'lab-tube', label: 'Pobierany materiał', value: 'Krew' })}${DS.CellInfo({ icon: 'pin', label: 'Gdzie można wykonać', value: 'Punkt Pobrań, ALAB w domu' })}</div>` }))) +
      cell('przygotowanie (lista)', W(DS.Surface({ content: DS.CellInfo({ icon: 'file-check-doc', label: 'Przygotowanie do badania', bullets: ['Na czczo 8-12 h', 'Rano, dobrze nawodniony'] }) }))) +
      cell('Surface z labelem i linkami', W(DS.Surface({ label: 'Szczegóły badania', content: DS.Divider() + `<div class="ds-Surface__list">${DS.Cell({ icon: 'file-text', title: 'Pełny opis badania' })}${DS.Cell({ icon: 'faq', title: 'Najczęstsze pytania (FAQ)' })}</div><p class="ds-Surface__meta">Symbol MORF • Kod ICD: C55</p>` }))),
    props: [['icon', 'nazwa ikony', 'timer · lab-tube · pin · file-check-doc'], ['label', 'string', ''], ['value', 'string', 'pomijana, gdy podano bullets'], ['bullets', 'string[]', 'lista punktów']] };

  COMPONENTS.clubbanner = { fn: 'ClubBannerLarge', title: 'ClubBannerLarge', figma: 'AlabBannerLarge (Produkt • Badanie 1183:19461)', desc: 'Duży baner ALAB club: zdjęcie z fioletowym gradientem, tytuł 24 Bold, logo klubu, trzy benefity z ikoną check i biały przycisk „Sprawdź”. Ukrywany, gdy użytkownik jest już w klubie.',
    render: () => W(DS.ClubBannerLarge()), matrix: () => '', props: [['—', '', 'bez parametrów; akcja data-action="club-promo"']] };

  COMPONENTS.chipdropdown = { fn: 'ChipDropdown', title: 'ChipDropdown · FilterChip z licznikiem · SectionHeader z licznikiem', figma: 'Listing • Kategoria 1183:26762', desc: 'Rząd filtrów listingu: chip rozwijany „Badania i pakiety ⌵” (otwiera arkusz wyboru), separator, chipy podkategorii z licznikiem „Tarczyca • 2”. Nagłówki sekcji listingu mają licznik „Pakiety badań • 2”.',
    controls: [text('label', 'Label', 'Badania i pakiety')],
    render: p => DS.ChipDropdown(p),
    matrix: () => cell('rząd filtrów', `<div class="ds-FilterRow" style="width:335px">${DS.ChipDropdown({ label: 'Badania i pakiety' })}<span class="ds-FilterRow__sep"></span>${DS.FilterChip({ label: 'Tarczyca', count: 2, selected: true })}${DS.FilterChip({ label: 'Hormony kobiece', count: 3 })}</div>`) +
      cell('SectionHeader z licznikiem', W(DS.SectionHeader({ title: 'Pakiety badań', count: 2 }))),
    props: [['label', 'string', ''], ['FilterChip.count', 'number', 'licznik po kropce'], ['SectionHeader.count', 'number', 'licznik po kropce']] };

  COMPONENTS.sheet = { fn: 'presentSheet', title: 'BottomSheet · presentSheet (gest iOS)', figma: 'BottomSheet 1416:56513 · Sklep • Wybór kategorii 1183:23540', desc: 'DS.presentSheet({ title, subtitle, content, height }) otwiera arkusz na scrimie i dodaje gest zamykania jak w iOS: ciągnięcie w dół przesuwa arkusz 1:1 za palcem i rozjaśnia scrim, puszczenie poniżej 30% wysokości (albo szybki ruch) zamyka, inaczej arkusz wraca. Z treści przewijalnej gest startuje tylko na jej górze.',
    render: () => DS.Button({ label: 'Otwórz arkusz', attrs: { onclick: "DS.presentSheet({ title: 'Kategorie', subtitle: 'Wybierz kategorię badań, która Cię interesuje', height: '70vh', content: '<div class=\\'ds-BottomSheet__scroll\\' style=\\'gap:8px\\'>' + ['Badania i pakiety ogólne', 'Hormony', 'Alergie i nietolerancje pokarmowe', 'Układ pokarmowy', 'Układ krążenia i Hematologia', 'Cukrzyca i Otyłość'].map(t => DS.Cell({ icon: 'test-tube', title: t, subtitle: '3 badania' })).join('') + '</div>' })" } }),
    matrix: () => '', props: [['title · subtitle', 'string', ''], ['content', 'html', 'zwykle .ds-BottomSheet__scroll z listą'], ['height', 'css', 'np. 750px'], ['onClose', 'fn', 'po zamknięciu'], ['→ { wrap, sheet, close }', '', 'close(animate=true)']] };

  window.SB.route();
})();
