/* ALAB Storybook — katalog fundamentów i komponentów DS (bez buildu, hash-router) */
(function () {
  DS.ASSETS = '../ds/assets/';
  const $ = (s, r = document) => r.querySelector(s);
  const esc = DS.esc;
  const FIGMA_DS = 'https://www.figma.com/design/xnsgOdaVVKCkzjyStSOdVv/Alab-%E2%80%A2-Design-system';

  // ---------------- FUNDAMENTY ----------------
  const COLORS = [
    ['Main', [['Main/primary', '--main-primary'], ['Main/accent', '--main-accent'], ['Main/accent-loyalty', '--main-accent-loyalty']]],
    ['Background', [['Background/surface', '--background-surface'], ['Background/surfaceSecondary', '--background-surface-secondary'], ['Background/surfaceTertiary', '--background-surface-tertiary'], ['Background/surfaceQuaternary', '--background-surface-quaternary'], ['Background/surfaceInverse', '--background-surface-inverse'], ['Background/surfaceAlphaLight', '--background-surface-alpha-light', true], ['Background/scrim', '--background-scrim', true]]],
    ['Content', [['Content/onSurface', '--content-on-surface'], ['Content/onSurfaceSecondary', '--content-on-surface-secondary'], ['Content/onSurfaceTertiary', '--content-on-surface-tertiary'], ['Content/onPrimary', '--content-on-primary', true], ['Content/onAccent', '--content-on-accent', true], ['Content/onScrim', '--content-on-scrim', true], ['Content/onScrimSecondary', '--content-on-scrim-secondary', true]]],
    ['Outline', [['Outline/border', '--outline-border'], ['Outline/borderSecondary', '--outline-border-secondary'], ['Outline/borderControls', '--outline-border-controls'], ['Outline/borderAlphaDark', '--outline-border-alpha-dark', true], ['Outline/borderAlphaLight', '--outline-border-alpha-light', true]]],
    ['Functional', [['Functional/success', '--functional-success'], ['Functional/error', '--functional-error']]],
  ];
  const TYPE = [
    ['display/large', 't-display-large', '36/36 · Bold · -2%'], ['display/medium', 't-display-medium', '30/40 · Bold · -2%'], ['display/small', 't-display-small', '24/32 · Bold · -2%'],
    ['headline/xlarge', 't-headline-xlarge', '20/24 · Bold · -1%'], ['headline/large', 't-headline-large', '16/24 · Bold · -1%'], ['headline/medium', 't-headline-medium', '14/20 · Bold · -1%'],
    ['body/large', 't-body-large', '16/24 · SemiBold'], ['body/medium', 't-body-medium', '14/20 · SemiBold'], ['body/small', 't-body-small', '13/20 · SemiBold'], ['body/xsmall', 't-body-xsmall', '12/18 · SemiBold'], ['body/xxsmall', 't-body-xxsmall', '11/16 · SemiBold'],
    ['label/xlarge-emphasized', 't-label-xlarge-em', '16/20 · Bold'], ['label/xlarge', 't-label-xlarge', '16/20 · SemiBold'], ['label/large-emphasized', 't-label-large-em', '14/16 · Bold'], ['label/large', 't-label-large', '14/16 · SemiBold'], ['label/medium-emphasized', 't-label-medium-em', '12/16 · Bold'], ['label/medium', 't-label-medium', '12/16 · SemiBold'], ['label/small-emphasized', 't-label-small-em', '11/12 · Bold'], ['label/xsmall', 't-label-xsmall', '9/10 · SemiBold'],
  ];
  const SPACE = [['space/xs', 2], ['space/sm', 4], ['space/md', 8], ['space/lg', 10], ['space/xl', 12], ['space/2xl', 16], ['space/4xl · globalMargin', 20], ['space/5xl · screen margin', 24], ['space/6xl', 32]];
  const RADII = [['radius/none', 0], ['radius/small · checkbox', 6], ['radius/medium · snackbar', 12], ['radius/large · TextField', 16], ['radius/xlarge', 24], ['radius/pill · Button', 999]];

  const swatch = (name, v, alpha) => {
    const val = getComputedStyle(document.documentElement).getPropertyValue(v).trim();
    return `<div class="sb-swatch"><div class="sb-swatch__chip ${alpha ? 'sb-swatch__chip--checker' : ''}" style="${alpha ? '' : 'background:' + val}">${alpha ? `<span style="background:${val}"></span>` : ''}</div><div class="sb-swatch__meta"><span class="sb-swatch__name">${esc(name)}</span><span class="sb-swatch__val">${esc(val)}</span><span class="sb-swatch__val">var(${v})</span></div></div>`;
  };

  const FOUNDATIONS = {
    colors: { title: 'Kolory', desc: 'Zmienne kolorów z kolekcji DS. Nazwa CSS = nazwa zmiennej Figmy w kebab-case (Content/onSurface → --content-on-surface).',
      render: () => COLORS.map(([g, items]) => `<section class="sb-section"><h2>${g}</h2><div class="sb-swatches">${items.map(i => swatch(...i)).join('')}</div></section>`).join('') },
    typography: { title: 'Typografia', desc: 'Manrope. Style tekstowe 1:1 z Figmą: display/headline = Bold z ujemnym trackingiem, body = SemiBold, label = SemiBold, a wersje „-emphasized” = Bold. Klasa CSS: .t-<styl> (np. .t-body-small).',
      render: () => `<section class="sb-section"><div class="sb-type">${TYPE.map(([n, c, s]) => `<div class="sb-type__row"><span class="sb-type__name">${n}<br>.${c}</span><span class="${c}">Zadbaj o zdrowie, wygodnie</span><span class="sb-type__spec">${s}</span></div>`).join('')}</div></section>` },
    spacing: { title: 'Odstępy i promienie', desc: 'Skala odstępów (space/*), globalMargin 20 (padding przycisków), margines ekranu 24 oraz promienie użyte w komponentach.',
      render: () => `<section class="sb-section"><h2>Odstępy</h2><div class="sb-matrix"><div class="sb-space">${SPACE.map(([n, v]) => `<div class="sb-space__item"><div class="sb-space__box" style="width:${v}px;height:${v}px"></div><span class="sb-space__lbl">${n}<br>${v}px</span></div>`).join('')}</div></div></section>` +
        `<section class="sb-section"><h2>Promienie</h2><div class="sb-matrix"><div class="sb-radii">${RADII.map(([n, v]) => `<div class="sb-space__item"><div class="sb-radii__box" style="border-radius:${v}px"></div><span class="sb-space__lbl">${n}<br>${v}px</span></div>`).join('')}</div></div></section>` +
        `<section class="sb-section"><h2>Efekty</h2><div class="sb-matrix"><div class="sb-cell"><div style="width:200px;height:60px;border:1px solid var(--main-accent);border-radius:16px;box-shadow:var(--inner-shadow-input-active)"></div><span class="sb-cell__label">InnerShadow_InputActive · inset 0 0 0 4 #096BCD 10%</span></div></div></section>` },
    icons: { title: 'Ikony i logotypy', desc: 'Ikony wyeksportowane z DS (ic_outline_*, ic_line_*) jako inline SVG z kolorem currentColor. Flagi jako pliki SVG w ds/assets/flags.',
      render: () => `<section class="sb-section"><h2>Ikony</h2><div class="sb-icons">${Object.keys(DS.ICONS).filter(k => !k.startsWith('logo') && k !== 'splash-loader' && k !== 'alabek').map(k => `<div class="sb-iconcard">${DS.icon(k)}<span>${k}</span></div>`).join('')}</div></section>` +
        `<section class="sb-section"><h2>Logotypy</h2><div class="sb-matrix sb-matrix--dark"><div class="sb-cell"><span style="display:inline-block;width:224px;height:36px;color:#fff">${DS.ICONS['logo-laboratoria']}</span><span class="sb-cell__label">il_logo/laboratoria/white</span></div><div class="sb-cell"><span style="display:inline-block;width:149px;height:32px;color:#fff">${DS.ICONS['logo-club']}</span><span class="sb-cell__label">il_logo/club/white</span></div><div class="sb-cell"><span style="display:inline-block;width:46px;height:42px;color:#fff">${DS.ICONS['alabek']}</span><span class="sb-cell__label">il_alabek</span></div></div></section>` +
        `<section class="sb-section"><h2>Flagi</h2><div class="sb-matrix">${['pl', 'at', 'be', 'fi', 'fr', 'es', 'nl', 'no', 'ch', 'se', 'it'].map(f => `<div class="sb-cell">${DS.Flag(f)}<span class="sb-cell__label">${f}</span></div>`).join('')}</div></section>` },
  };

  // ---------------- KOMPONENTY ----------------
  const sel = (name, label, options, def) => ({ name, label, type: 'select', options, default: def });
  const bool = (name, label, def = false) => ({ name, label, type: 'bool', default: def });
  const text = (name, label, def = '') => ({ name, label, type: 'text', default: def });
  const cell = (label, html, w) => `<div class="sb-cell ${w ? 'sb-cell--w' : ''}"><span class="sb-cell__label">${esc(label)}</span>${html}</div>`;

  const COMPONENTS = {
    button: { title: 'Button', figma: '25:687', desc: 'Główny przycisk akcji. Wysokość 60 (padding 20 + label 20), pełne zaokrąglenie, label/xlarge-emphasized. Type: Primary, Secondary, On color (na fotografii/kolorze), Ghost, Loyalty (ALAB club). State: Default, Disabled, Loading.',
      controls: [sel('type', 'Type', ['primary', 'secondary', 'oncolor', 'ghost', 'loyalty'], 'primary'), sel('state', 'State', ['default', 'disabled', 'loading'], 'default'), text('label', 'Label', 'Zarejestruj się'), bool('leadingIcon', 'Leading icon'), bool('trailingIcon', 'Trailing icon'), bool('block', 'Pełna szerokość', true)],
      dark: p => p.type === 'oncolor',
      render: p => DS.Button({ ...p, leadingIcon: p.leadingIcon ? 'scan' : null, trailingIcon: p.trailingIcon ? 'chevron-left' : null }),
      matrix: () => ['primary', 'secondary', 'ghost', 'loyalty'].map(t => ['default', 'disabled', 'loading'].map(s => cell(`${t} / ${s}`, DS.Button({ type: t, state: s, label: 'Button' }))).join('')).join('') +
        `</div><div class="sb-matrix sb-matrix--dark">` + ['default', 'disabled'].map(s => cell(`oncolor / ${s}`, DS.Button({ type: 'oncolor', state: s, label: 'Mam już konto' }))).join(''),
      props: [['label', 'string', 'Tekst przycisku'], ['type', "'primary' | 'secondary' | 'oncolor' | 'ghost' | 'loyalty'", 'Figma: Type'], ['state', "'default' | 'disabled' | 'loading'", 'Figma: State'], ['leadingIcon / trailingIcon', 'nazwa ikony', 'Ikona 20px'], ['block', 'boolean', 'Rozciągnij na szerokość rodzica']] },

    buttontiny: { title: 'ButtonTiny', figma: '135:72', desc: 'Mały przycisk (40px) do akcji drugoplanowych: „Pomiń”, „Wejdź jako gość”, linki. Variant: Primary, Secondary, Tertiary, Link.',
      controls: [sel('variant', 'Variant', ['primary', 'secondary', 'tertiary', 'link'], 'primary'), text('label', 'Label', 'Sprawdź'), bool('leadingIcon', 'Leading icon')],
      render: p => DS.ButtonTiny({ ...p, leadingIcon: p.leadingIcon ? 'scan' : null }),
      matrix: () => ['primary', 'secondary', 'tertiary', 'link'].map(v => cell(v, DS.ButtonTiny({ variant: v }))).join(''),
      props: [['label', 'string', ''], ['variant', "'primary' | 'secondary' | 'tertiary' | 'link'", 'Figma: Variant'], ['leadingIcon / trailingIcon', 'nazwa ikony', 'Ikona 16px']] },

    iconbutton: { fn: 'IconButton', title: 'IconButton + NumberIndicator', figma: '25:728 · 25:1050', desc: 'Przycisk ikonowy 56 / 48 / 40. Variant: Transparent (TopBar), On scrim (na zdjęciu), With background (arkusze). Badge = NumberIndicator (1–99 lub 99+).',
      controls: [sel('variant', 'Variant', ['transparent', 'withbg', 'onscrim'], 'transparent'), sel('size', 'Size', ['large', 'medium', 'small'], 'large'), sel('icon', 'Icon', Object.keys(DS.ICONS).filter(k => !k.startsWith('logo') && k !== 'splash-loader'), 'chevron-left'), bool('enabled', 'Enabled', true), bool('loading', 'Loading'), text('badge', 'Badge (puste = brak)', '')],
      dark: p => p.variant === 'onscrim',
      render: p => DS.IconButton({ ...p, badge: p.badge === '' ? null : p.badge }),
      matrix: () => ['transparent', 'withbg'].map(v => ['large', 'medium', 'small'].map(s => cell(`${v} / ${s}`, DS.IconButton({ variant: v, size: s, icon: 'x' }))).join('')).join('') +
        cell('disabled', DS.IconButton({ enabled: false, icon: 'x' })) + cell('loading', DS.IconButton({ loading: true })) + cell('badge 3', DS.IconButton({ icon: 'tag', badge: 3 })) + cell('badge 120', DS.IconButton({ icon: 'tag', badge: 120 })) +
        `</div><div class="sb-matrix sb-matrix--dark">` + ['large', 'medium', 'small'].map(s => cell(`onscrim / ${s}`, DS.IconButton({ variant: 'onscrim', size: s, icon: 'x-close' }))).join(''),
      props: [['icon', 'nazwa ikony', ''], ['variant', "'transparent' | 'onscrim' | 'withbg'", 'Figma: Variant'], ['size', "'large' | 'medium' | 'small'", '56 / 48 / 40'], ['enabled, loading', 'boolean', ''], ['badge', 'number', 'NumberIndicator w prawym górnym rogu']] },

    textfield: { title: 'TextField', figma: 'TextFieldForm (843:5108, 843:5136, 843:5152)', desc: 'Pole tekstowe 60px z etykietą pływającą: pusta = etykieta 16 Bold w polu; focus/wypełnione = etykieta 12 nad wartością 16 Bold. Focus: border accent + inner shadow 4px. Wiersz pomocniczy z ikoną info (12/18). Leading slot: ikona lub prefix kraju; trailing: ikona (np. podgląd hasła).',
      controls: [text('label', 'Label', 'Numer telefonu'), text('value', 'Value', ''), sel('state', 'State', ['default', 'focused', 'error', 'disabled'], 'default'), text('helper', 'Helper', 'Wyślemy SMS z kodem potwierdzającym'), text('error', 'Error (nadpisuje helper)', ''), sel('leading', 'Leading slot', ['none', 'prefix', 'icon'], 'prefix'), sel('trailing', 'Trailing icon', ['none', 'eye'], 'none')],
      phone: true,
      render: p => DS.TextField({ label: p.label, value: p.value, state: p.state, helper: p.helper || null, error: p.error || null,
        leading: p.leading === 'prefix' ? { prefix: { flag: 'pl', code: '+ 48' } } : p.leading === 'icon' ? { icon: 'search' } : null,
        trailing: p.trailing === 'eye' ? { icon: 'eye', action: true, label: 'Pokaż hasło', attrs: { 'data-ds': 'toggle-password' } } : null, type: p.trailing === 'eye' ? 'password' : 'text' }),
      matrix: () => `</div><div class="sb-matrix sb-matrix--col">` +
        cell('default (pusty) + helper', DS.TextField({ label: 'Numer telefonu', helper: 'Wyślemy SMS z kodem potwierdzającym', leading: { prefix: {} } }), true) +
        cell('focused (pusty)', DS.TextField({ label: 'Email', state: 'focused' }), true) +
        cell('filled', DS.TextField({ label: 'Email', value: 'anna.kowalska@example.com' }), true) +
        cell('password + eye', DS.TextField({ label: 'Hasło', value: 'Tajne1234', type: 'password', trailing: { icon: 'eye', action: true, attrs: { 'data-ds': 'toggle-password' } } }), true) +
        cell('error', DS.TextField({ label: 'PESEL', value: '1234', error: 'PESEL niepoprawny' }), true) +
        cell('disabled', DS.TextField({ label: 'Imię', value: 'Anna', state: 'disabled' }), true) +
        cell('leading icon (wyszukiwanie)', DS.TextField({ label: 'Wpisz kraj...', leading: { icon: 'search' } }), true),
      props: [['label', 'string', 'Etykieta pływająca'], ['value', 'string', ''], ['state', "'default' | 'focused' | 'error' | 'disabled'", ''], ['helper', 'string', 'Tekst pomocniczy z ikoną info'], ['error', 'string', 'Komunikat błędu (border + tekst w kolorze error) — założenie, brak mastera stanu Error w źródle'], ['leading', '{ icon } | { prefix: { flag, code } }', ''], ['trailing', '{ icon, action, attrs }', "data-ds='toggle-password' przełącza podgląd hasła"]] },

    inputcode: { title: 'InputCode', figma: '1761:81398', desc: 'Pole na 6-cyfrowy kod SMS: dwie grupy po 3 komórki (60px), zaokrąglone krańce grup, aktywna komórka z kursorem i inner shadow. Kliknięcie ustawia fokus na ukrytym polu numerycznym.',
      controls: [text('value', 'Value', '12'), bool('error', 'Error')],
      phone: true,
      render: p => DS.InputCode({ value: p.value, error: p.error }),
      matrix: () => `</div><div class="sb-matrix sb-matrix--col">` + cell('pusty', DS.InputCode({}), true) + cell('częściowo wpisany', DS.InputCode({ value: '123' }), true) + cell('pełny', DS.InputCode({ value: '123456' }), true) + cell('error', DS.InputCode({ value: '000000', error: true }), true),
      props: [['length', 'number', 'domyślnie 6'], ['value', 'string', 'cyfry'], ['error', 'boolean', 'Kod nieprawidłowy'], ['event ds:code', '{ value, complete }', 'emitowany na zmianę']] },

    selection: { fn: 'SelectableCell', title: 'Checkbox · RadioButton · SelectableCell', figma: 'Checkbox 1418:59734 · RadioButton 1418:59740 · SelectableCell 2483:45599', desc: 'Kontrolki 24px (border 2 borderControls). SelectableCell = kontrolka + treść: tytuł 14 Bold, podtytuł, „* Wymagane”, akcja „Więcej”, tekst rozwinięty.',
      controls: [sel('variant', 'Variant', ['checkbox', 'radio'], 'checkbox'), bool('checked', 'Checked'), text('title', 'Title', 'Akceptuje Regulamin i politykę prywatności'), text('subtitle', 'Subtitle', ''), bool('required', 'Required', true), bool('action', 'Action „Więcej”', true), text('expanded', 'Expanded text', ''), bool('error', 'Error')],
      phone: true,
      render: p => DS.SelectableCell({ ...p, subtitle: p.subtitle || null, action: p.action ? 'Więcej' : null, expanded: p.expanded || null }),
      matrix: () => cell('checkbox', DS.Checkbox()) + cell('checked', DS.Checkbox({ checked: true })) + cell('error', DS.Checkbox({ error: true })) + cell('disabled', DS.Checkbox({ disabled: true })) + cell('radio', DS.Radio()) + cell('radio checked', DS.Radio({ checked: true })) +
        `</div><div class="sb-matrix sb-matrix--col">` + cell('SelectableCell · pełny', DS.SelectableCell({ title: 'Title', subtitle: 'Subtitle', required: true, requiredText: '* Required', action: 'Read more', expanded: 'Expanded text container' }), true) +
        cell('SelectableCell · zgoda', DS.SelectableCell({ title: 'Akceptuje Regulamin i politykę prywatności', required: true, action: 'Więcej' }), true) +
        cell('SelectableCell · prosty', DS.SelectableCell({ title: 'Nie mam numeru PESEL', checked: true }), true) +
        cell('SelectableCell · radio', DS.SelectableCell({ variant: 'radio', title: 'Punkt Pobrań', subtitle: 'ul. Długa 12, Kraków', checked: true }), true),
      props: [['variant', "'checkbox' | 'radio'", ''], ['checked, error', 'boolean', ''], ['title, subtitle', 'string', ''], ['required', 'boolean', 'pokazuje requiredText („* Wymagane”)'], ['action', 'string', 'link akcji (np. „Więcej”)'], ['expanded', 'string', 'tekst rozwinięty pod akcją']] },

    filterchip: { title: 'FilterChip', figma: '567:6772', desc: 'Chip wyboru (np. płeć). Selected: tło Main/primary, tekst biały. Unselected: border 1.5 Outline/border.',
      controls: [text('label', 'Label', 'Kobieta'), bool('selected', 'Selected', true)],
      render: p => DS.FilterChip(p),
      matrix: () => cell('selected', DS.FilterChip({ label: 'Kobieta', selected: true })) + cell('unselected', DS.FilterChip({ label: 'Mężczyzna' })) + cell('para na szerokość', `<div style="display:flex;gap:5px;width:327px">${DS.FilterChip({ label: 'Kobieta', selected: true, fill: true })}${DS.FilterChip({ label: 'Mężczyzna', fill: true })}</div>`),
      props: [['label', 'string', ''], ['selected', 'boolean', ''], ['fill', 'boolean', 'flex: 1 w rzędzie']] },

    steps: { fn: 'StepsIndicator', title: 'StepsIndicator · LineIndicator', figma: 'StepsIndicator 741:2045 · LineIndicator 2874:2', desc: 'Pasek postępu kroków (4px, radius 12) z etykietami 12/18. OnScrim: białe paski na kolorze.',
      controls: [sel('steps', 'Steps', ['2', '3', '4', '5'], '3'), sel('current', 'Current', ['1', '2', '3', '4', '5'], '1'), text('label', 'Label', 'Twoje dane'), bool('text', 'Text', true), bool('onScrim', 'On scrim')],
      dark: p => p.onScrim, phone: true,
      render: p => DS.StepsIndicator({ ...p, steps: +p.steps, current: +p.current }),
      matrix: () => `</div><div class="sb-matrix sb-matrix--col">` + [1, 2, 3].map(i => cell(`krok ${i} z 3`, DS.StepsIndicator({ current: i, label: ['Twoje dane', 'Potwierdzenie', 'Twoje konto'][i - 1] }), true)).join('') + cell('bez tekstu (onboarding)', `<div style="width:87px">${DS.StepsIndicator({ current: 1, text: false })}</div>`) +
        `</div><div class="sb-matrix sb-matrix--dark">` + cell('onScrim', `<div style="width:327px">${DS.StepsIndicator({ current: 1, steps: 2, label: 'Informacje podstawowe', onScrim: true })}</div>`),
      props: [['steps, current', 'number', ''], ['label', 'string', 'etykieta z lewej'], ['text', 'boolean', 'pokaż etykiety'], ['onScrim', 'boolean', 'Figma: OnScrim']] },

    topbar: { fn: 'TopBar', title: 'TopBar · StatusBar · HomeIndicator', figma: 'TopBar 2483:41968', desc: 'Górny pasek: StatusBar iOS (62px) + wrapper 64px z IconButtonem 48 po lewej/prawej i tytułem (16/24) z podtytułem (12/18). HomeIndicator 34px na dole ekranu.',
      controls: [bool('leading', 'Leading (wstecz)', true), bool('trailing', 'Trailing', false), text('title', 'Title', 'Nagłówek'), text('subtitle', 'Subtitle', ''), bool('light', 'Light (na kolorze)')],
      dark: p => p.light, phone: true,
      render: p => DS.TopBar({ leading: p.leading ? 'chevron-left' : false, trailing: p.trailing ? { icon: 'x' } : false, title: p.title || null, subtitle: p.subtitle || null, light: p.light, transparent: p.light }) + (p.light ? DS.HomeIndicator({ light: true }) : DS.HomeIndicator()),
      matrix: () => `</div><div class="sb-matrix sb-matrix--col">` + cell('TopBar · tylko wstecz', `<div style="width:375px">${DS.TopBar({})}</div>`) + cell('TopBar · tytuł + podtytuł + trailing', `<div style="width:375px">${DS.TopBar({ title: 'Weryfikacja telefonu', subtitle: 'Krok 2 z 3', trailing: { icon: 'x' } })}</div>`) + cell('TopBar · zamknij (x_close)', `<div style="width:375px">${DS.TopBar({ leading: 'x-close' })}</div>`) + cell('HomeIndicator', `<div style="width:375px">${DS.HomeIndicator()}</div>`),
      props: [['leading', "nazwa ikony | false", 'IconButton medium, data-action=back'], ['trailing', '{ icon, attrs } | false', ''], ['title, subtitle', 'string', ''], ['statusBar', 'boolean', 'domyślnie true'], ['light / transparent', 'boolean', 'wersja na kolorze']] },

    bottombar: { title: 'BottomActionsBar', figma: '25:789', desc: 'Dolny pasek akcji przyklejony do krawędzi ekranu: gradient do białego + blur 22, przyciski (padding 24, gap 8) i HomeIndicator. Layout: Vertical (1–2 przyciski) lub Horizontal.',
      controls: [sel('layout', 'Layout', ['vertical', 'horizontal'], 'vertical'), sel('count', 'Liczba przycisków', ['1', '2'], '2')],
      phone: true,
      render: p => `<div style="height:80px;background:linear-gradient(#eaf0f9,#fff)"></div>` + DS.BottomActionsBar({ layout: p.layout, buttons: [DS.Button({ label: 'Dalej', block: true }), p.count === '2' ? DS.Button({ label: 'Mam już konto', type: 'secondary', block: true }) : ''] }),
      matrix: () => `</div><div class="sb-matrix sb-matrix--col">` + cell('vertical · 2 przyciski', `<div style="width:375px">${DS.BottomActionsBar({ buttons: [DS.Button({ label: 'Dołącz do ALAB club', block: true }), DS.Button({ label: 'Nie teraz', type: 'secondary', block: true })] })}</div>`) + cell('horizontal', `<div style="width:375px">${DS.BottomActionsBar({ layout: 'horizontal', buttons: [DS.Button({ label: 'Anuluj', type: 'secondary' }), DS.Button({ label: 'Zapisz' })] })}</div>`),
      props: [['buttons', 'string[] (HTML)', 'wyrenderowane DS.Button'], ['layout', "'vertical' | 'horizontal'", 'Figma: Layout'], ['homeIndicator', 'boolean', 'domyślnie true']] },

    snackbar: { title: 'Snackbar', figma: '746:9393', desc: 'Komunikat tymczasowy: radius 12, padding 16, ikona 20 + body/medium na kolorze onScrim. Success = Functional/success. Warianty error/info to rozszerzenie prototypu (założenie).',
      controls: [sel('type', 'Type', ['success', 'error', 'info'], 'success'), text('text', 'Text', 'Kod wysłany ponownie')],
      phone: true,
      render: p => `<div style="padding:20px">${DS.Snackbar(p)}</div>`,
      matrix: () => `</div><div class="sb-matrix sb-matrix--col">` + cell('success', DS.Snackbar({ text: 'Message text' }), true) + cell('error (założenie)', DS.Snackbar({ type: 'error', text: 'Nie udało się wysłać wiadomości' }), true) + cell('info (założenie)', DS.Snackbar({ type: 'info', text: 'Link działa 1 godzinę' }), true),
      props: [['text', 'string', ''], ['type', "'success' | 'error' | 'info'", 'tylko success ma mastera w Figmie'], ['icon', 'nazwa ikony', 'domyślnie check-circle / info-square']] },

    sheet: { fn: 'BottomSheet', title: 'BottomSheet · CellSelectCountry', figma: 'BottomSheet 25:1283 · CellSelectCountry 855:9584', desc: 'Arkusz dolny na scrimie (rgba 0,0,0,.4): uchwyt 40×5, nagłówek 20/24 + IconButton „With background” 40, slot treści. CellSelectCountry: radio + nazwa kraju | prefix + flaga.',
      controls: [text('title', 'Title', 'Wybierz kraj'), bool('search', 'Pole wyszukiwania', true)],
      phone: true, tall: true,
      render: p => `<div style="position:relative;height:640px;background:#fff">${DS.TopBar({})}<div class="ds-Scrim"></div>` + DS.BottomSheet({ title: p.title, content: (p.search ? DS.TextField({ label: 'Wpisz kraj...', leading: { icon: 'search' } }) : '') + `<div class="ds-BottomSheet__scroll">${[['Polska', '+ 48', 'pl', true], ['Austria', '+ 43', 'at'], ['Belgia', '+ 32', 'be'], ['Finlandia', '+ 358', 'fi'], ['Francja', '+ 33', 'fr']].map(([n, c, f, ch], i) => (i === 1 ? DS.Divider() : '') + DS.CellSelectCountry({ name: n, code: c, flag: f, checked: !!ch })).join('')}</div>` }) + `</div>`,
      matrix: () => `</div><div class="sb-matrix sb-matrix--col">` + cell('CellSelectCountry · wybrany', DS.CellSelectCountry({ checked: true }), true) + cell('CellSelectCountry', DS.CellSelectCountry({ name: 'Szwajcaria', code: '+ 41', flag: 'ch' }), true) + cell('Divider', DS.Divider(), true),
      props: [['title', 'string', ''], ['content', 'string (HTML)', 'slot'], ['closeAttrs', 'object', 'atrybuty przycisku zamknięcia (domyślnie data-action=sheet-close)']] },

    screenstate: { title: 'ScreenState', figma: '349:292', desc: 'Stan ekranu: ilustracja 132px, tytuł display/medium, treść body/medium na secondary, przyciski. Używany w „Sprawdź skrzynkę” i zachęcie do Face ID.',
      controls: [sel('asset', 'Ilustracja', ['il_phone_tick.png', 'il_mail_sent.png'], 'il_phone_tick.png'), text('title', 'Title', 'Loguj się szybciej'), text('body', 'Body', 'Wchodź do aplikacji odciskiem palca albo twarzą.')],
      phone: true,
      render: p => DS.ScreenState({ asset: DS.ASSETS + p.asset, title: p.title, body: p.body, buttons: [DS.Button({ label: 'Włącz Face ID', block: true }), DS.Button({ label: 'Nie teraz', type: 'secondary', block: true })] }),
      matrix: () => `</div><div class="sb-matrix sb-matrix--col">` + cell('Sprawdź skrzynkę', `<div style="width:375px">${DS.ScreenState({ asset: DS.ASSETS + 'il_mail_sent.png', title: 'Sprawdź skrzynkę', body: 'Jeśli ten email jest w naszej bazie, wysłaliśmy link do ustawienia nowego hasła.\n\nLink działa 1 godzinę. Sprawdź folder spam.', buttons: [DS.Button({ label: 'Wyślij ponownie za 0:29', type: 'secondary', state: 'disabled', block: true })] })}</div>`),
      props: [['asset', 'url', 'ilustracja'], ['title, body', 'string', 'body wspiera \\n'], ['buttons', 'string[] (HTML)', '']] },

    carousel: { fn: 'CarouselCell', title: 'CarouselCell (ALAB club)', figma: '1034:393', desc: 'Kafelek korzyści w bannerze ALAB club: 240×96, tło surfaceAlphaLight, ikona w ramce 48 z borderAlphaLight, tytuł 12 Bold + opis 11 onScrimSecondary. Kolory lojalnościowe: gradient #461BA6 → #7512C3.',
      controls: [sel('icon', 'Icon', ['tag', 'gift', 'voucher'], 'tag'), text('title', 'Title', '5% dodatkowej zniżki'), text('sub', 'Sub', 'na całą ofertę ALAB laboratoria')],
      dark: () => true,
      render: p => DS.CarouselCell(p),
      matrix: () => `</div><div class="sb-matrix" style="background:var(--gradient-brand)">` + cell('tag', DS.CarouselCell({ icon: 'tag', title: '5% dodatkowej zniżki', sub: 'na całą ofertę ALAB laboratoria' })) + cell('gift', DS.CarouselCell({ icon: 'gift', title: 'Oferta urodzinowa', sub: 'Specjalna niespodzianka w Twoim miesiącu' })) + cell('voucher', DS.CarouselCell({ icon: 'voucher', title: 'Voucher 20%', sub: 'Po wykonaniu badania na kolejne zakupy' })),
      props: [['icon', 'nazwa ikony', ''], ['title, sub', 'string', '']] },
  };

  // ---------------- RENDER ----------------
  const NAV = [['Fundamenty', Object.entries(FOUNDATIONS)], ['Komponenty', Object.entries(COMPONENTS)]];
  const state = {};

  function renderNav(current) {
    $('#sb-nav').innerHTML = NAV.map(([g, items]) => `<div class="sb-group">${g}</div>` + items.map(([id, s]) => `<a class="sb-link ${id === current ? 'active' : ''}" href="#/${id}">${esc(s.title)}</a>`).join('')).join('');
  }

  function code(name, props) {
    const body = Object.entries(props).filter(([, v]) => v !== '' && v != null).map(([k, v]) => `  <span class="k">${k}</span>: ${typeof v === 'string' ? `<span class="s">'${esc(v)}'</span>` : `<span class="n">${v}</span>`}`).join(',\n');
    return `<pre class="sb-code">DS.${name}({\n${body}\n})</pre>`;
  }

  function renderComponent(id) {
    const s = COMPONENTS[id];
    const props = state[id] || (state[id] = Object.fromEntries((s.controls || []).map(c => [c.name, c.default])));
    const dark = s.dark ? s.dark(props) : false;
    const controls = (s.controls || []).map(c => {
      if (c.type === 'select') return `<div class="sb-ctl"><label>${c.label}</label><select data-ctl="${c.name}">${c.options.map(o => `<option ${String(props[c.name]) === String(o) ? 'selected' : ''}>${o}</option>`).join('')}</select></div>`;
      if (c.type === 'bool') return `<div class="sb-ctl sb-ctl--bool"><input type="checkbox" id="c-${c.name}" data-ctl="${c.name}" ${props[c.name] ? 'checked' : ''}><label for="c-${c.name}">${c.label}</label></div>`;
      return `<div class="sb-ctl"><label>${c.label}</label><input type="text" data-ctl="${c.name}" value="${esc(props[c.name])}"></div>`;
    }).join('');
    const preview = s.render(props);
    $('#sb-main').innerHTML = `
      <div class="sb-head"><h1>${esc(s.title)}</h1><p>${esc(s.desc)}</p><a class="sb-figma" target="_blank" rel="noopener" href="${FIGMA_DS}">Figma: Alab • Design system · ${esc(s.figma || '')}</a></div>
      <section class="sb-section"><h2>Playground</h2>
        <div class="sb-play">
          <div>
            <div class="sb-stage ${dark ? 'sb-stage--dark' : ''} ${s.phone ? 'sb-stage--phone' : ''}" id="sb-stage">${s.phone ? `<div class="sb-device ds" style="${dark ? 'background:var(--main-primary)' : ''}${s.tall ? '' : ''}"><div style="padding:${s.tall ? '0' : '24px'}">${preview}</div></div>` : `<div class="ds" style="width:100%;display:flex;justify-content:center">${preview}</div>`}</div>
            ${code(s.fn || s.title.split(' ')[0], props)}
          </div>
          <aside class="sb-controls"><h4>Właściwości</h4>${controls}</aside>
        </div>
      </section>
      <section class="sb-section"><h2>Warianty</h2><div class="sb-matrix ds">${s.matrix ? s.matrix() : ''}</div></section>
      ${s.props ? `<section class="sb-section"><h2>Props (DS.${esc(s.fn || s.title.split(' ')[0])})</h2><table class="sb-table"><thead><tr><th>Prop</th><th>Typ</th><th>Opis</th></tr></thead><tbody>${s.props.map(([p, t, d]) => `<tr><td><code>${esc(p)}</code></td><td><code>${esc(t)}</code></td><td>${esc(d)}</td></tr>`).join('')}</tbody></table></section>` : ''}`;
    DS.enhance($('#sb-main'));
    $('#sb-main').querySelectorAll('[data-ctl]').forEach(el => {
      const ev = el.type === 'checkbox' ? 'change' : (el.tagName === 'SELECT' ? 'change' : 'input');
      el.addEventListener(ev, () => { props[el.dataset.ctl] = el.type === 'checkbox' ? el.checked : el.value; renderComponent(id); });
    });
    // demo interakcji w matrycy: checkbox/radio klikalne
    $('#sb-main').addEventListener('click', (e) => {
      const cb = e.target.closest('.ds-Checkbox'); if (cb) cb.classList.toggle('is-checked');
      const chip = e.target.closest('.ds-FilterChip'); if (chip) chip.classList.toggle('is-selected');
    });
  }

  function renderFoundation(id) {
    const f = FOUNDATIONS[id];
    $('#sb-main').innerHTML = `<div class="sb-head"><h1>${esc(f.title)}</h1><p>${esc(f.desc)}</p><a class="sb-figma" target="_blank" rel="noopener" href="${FIGMA_DS}">Figma: Alab • Design system</a></div>` + f.render();
  }

  function renderHome() {
    $('#sb-main').innerHTML = `<div class="sb-head"><h1>ALAB • Storybook</h1><p>Design system ALAB przeniesiony do kodu: tokeny, style tekstowe i komponenty odtworzone 1:1 z biblioteki Figma. Ten sam kod napędza <a href="../app/index.html" style="color:var(--sb-accent);font-weight:700">klikalny prototyp aplikacji</a>, więc każdy komponent tutaj = komponent na ekranach.</p></div>
      <section class="sb-section"><h2>Fundamenty</h2><div class="sb-home-grid">${Object.entries(FOUNDATIONS).map(([id, s]) => `<a class="sb-card" href="#/${id}"><b>${esc(s.title)}</b><span>${esc(s.desc).slice(0, 90)}…</span></a>`).join('')}</div></section>
      <section class="sb-section"><h2>Komponenty</h2><div class="sb-home-grid">${Object.entries(COMPONENTS).map(([id, s]) => `<a class="sb-card" href="#/${id}"><b>${esc(s.title)}</b><span>${esc(s.desc).slice(0, 90)}…</span></a>`).join('')}</div></section>
      <div class="sb-note">Źródło prawdy: plik Figma „Alab • Design system” (xnsgOda…). Wartości pobrane przez oficjalny Figma MCP (get_design_context / get_variable_defs) z masterów DS i ekranów logowania/rejestracji. Stany oznaczone jako „założenie” nie mają mastera w Figmie.</div>`;
  }

  function route() {
    const id = (location.hash.replace(/^#\/?/, '') || '');
    renderNav(id);
    if (COMPONENTS[id]) renderComponent(id); else if (FOUNDATIONS[id]) renderFoundation(id); else renderHome();
    window.scrollTo(0, 0);
  }
  $('#sb-logo').innerHTML = DS.ICONS['alabek'];
  window.addEventListener('hashchange', route);
  route();
})();
