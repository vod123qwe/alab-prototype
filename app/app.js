/* ALAB • Prototyp — klikalna ścieżka: onboarding → rejestracja → ALAB club → Face ID → dashboard
   + logowanie i reset hasła. Ekrany 1:1 z pliku „Alab • Design” (strona „Logowanie i rejestracja”),
   komponenty wyłącznie z ds/components.js. Bez buildu. */
(function () {
  DS.ASSETS = '../ds/assets/';
  const A = DS.ASSETS;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = DS.esc;

  // ---------------- stan ----------------
  const initial = () => ({
    prefix: { name: 'Polska', code: '+ 48', flag: 'pl' }, phone: '', pesel: '', noPesel: false, birth: '', sex: null,
    consents: { terms: false, marketing: false }, expanded: {}, code: '', name: '', surname: '', email: '', password: '',
    club: { terms: false, rodo: false }, clubJoined: null, faceId: null, loggedIn: false, guest: false,
    loginEmail: '', loginPassword: '', resetEmail: '',
  });
  let S = initial();
  const COUNTRIES = [['Polska', '+ 48', 'pl'], ['Austria', '+ 43', 'at'], ['Belgia', '+ 32', 'be'], ['Finlandia', '+ 358', 'fi'], ['Francja', '+ 33', 'fr'], ['Hiszpania', '+ 34', 'es'], ['Holandia', '+ 31', 'nl'], ['Norwegia', '+ 47', 'no'], ['Szwajcaria', '+ 41', 'ch'], ['Szwecja', '+ 46', 'se'], ['Włochy', '+ 39', 'it']];

  // ---------------- pomocnicze ----------------
  const go = (route) => { location.hash = '#/' + route; };
  let lastRoute = '';
  let history = [];
  const back = () => { history.pop(); const prev = history.pop(); go(prev || 'start'); };
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
  const peselValid = (p) => {
    if (!/^\d{11}$/.test(p)) return false;
    const w = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
    const sum = w.reduce((a, x, i) => a + x * +p[i], 0);
    return (10 - (sum % 10)) % 10 === +p[10];
  };
  const pwdRules = (p) => ({ len: p.length >= 8, case: /[a-z]/.test(p) && /[A-Z]/.test(p), digit: /\d/.test(p) });
  const pwdStrong = (p) => Object.values(pwdRules(p)).every(Boolean);

  const layout = ({ top = '', body = '', bottom = '', bodyClass = '', cls = '', overlay = '' }) =>
    `<div class="screen ${cls}">${top ? `<div class="screen__top">${top}</div>` : ''}<div class="screen__body ${bodyClass}">${body}</div>${bottom ? `<div class="screen__bottom">${bottom}</div>` : ''}${overlay}</div>`;

  let snackTimer;
  function snack(text, type = 'success', bottom = 138) {
    const ov = $('#overlay');
    ov.querySelectorAll('.snack-slot').forEach(n => n.remove());
    const el = document.createElement('div'); el.className = 'snack-slot'; el.style.bottom = bottom + 'px';
    el.innerHTML = DS.Snackbar({ text, type }); ov.appendChild(el);
    clearTimeout(snackTimer); snackTimer = setTimeout(() => { el.classList.add('hide'); setTimeout(() => el.remove(), 250); }, 2800);
  }
  function faceIdOverlay(then) {
    const ov = $('#overlay');
    const el = document.createElement('div'); el.className = 'faceid';
    el.innerHTML = `<div class="faceid__alert"><svg class="faceid__icon" viewBox="0 0 64 64" fill="none" stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M8 22V14a6 6 0 0 1 6-6h8M42 8h8a6 6 0 0 1 6 6v8M56 42v8a6 6 0 0 1-6 6h-8M22 56h-8a6 6 0 0 1-6-6v-8"/><path d="M22 26v4M42 26v4M32 26v10h-3"/><path d="M24 42c4 4 12 4 16 0"/></svg><span>Face ID</span></div>`;
    ov.appendChild(el);
    setTimeout(() => { el.remove(); then(); }, 1300);
  }
  const fieldError = (input, msg) => { DS.setFieldError(input.closest('.ds-TextField'), msg); };

  // ---------------- ekrany ----------------
  const SCREENS = {};

  SCREENS.splash = () => {
    setTimeout(() => { if (current() === 'splash') go('onboarding/1'); }, 1800);
    return `<div class="screen splash"><div class="splash__bg"><img src="${A}img_splash_shape.png" alt=""></div>
      <div class="splash__top">${DS.StatusBar({ light: true })}</div>
      <div class="splash__logo">${DS.ICONS['logo-laboratoria']}</div>
      <div class="splash__bottom"><div class="stack-16" style="align-items:center;gap:20px"><span class="splash__loader">${DS.ICONS['splash-loader']}</span><p class="splash__tag">Zadbaj o zdrowie, wygodnie</p></div>${DS.HomeIndicator({ light: true })}</div></div>`;
  };

  const ONB = [
    ['Badania zamówisz w 3 krokach', 'Wybierz badanie, kup w aplikacji i wykonaj w punkcie pobran w ciągu 60 dni.'],
    ['Wyniki badań masz zawsze przy sobie', 'Powiadomimy Cię, gdy będą gotowe. Sprawdzisz je w aplikacji i udostępnisz lekarzowi.'],
    ['W ALAB club zapłacisz mniej', 'Dołączysz do programu bezpłatnie i od razu skorzystasz ze zniżek na badania.'],
  ];
  // Onboarding = jeden ekran z przesuwaną taśmą 3 slajdów (swipe / drag / przyciski). Kropki, „Pomiń” i pasek akcji są stałe.
  const onbIndex = (r) => { const m = String(r || '').match(/^onboarding\/(\d)$/); return m ? Math.min(Math.max(+m[1], 1), 3) : null; };
  SCREENS['onboarding/:n'] = (n) => {
    const i = Math.min(Math.max(+n || 1, 1), 3);
    const slide = ([title, body]) => `<div class="onb__slide"><div class="onb__hero"></div><div class="onb__text"><p class="onb__title">${esc(title)}</p><p class="onb__body">${esc(body)}</p></div></div>`;
    return `<div class="screen onb" data-step="${i}">
      <div class="onb__track" id="onb-track" style="transform:translateX(${-(i - 1) * (100 / 3)}%)">${ONB.map(slide).join('')}</div>
      <div class="onb__status">${DS.StatusBar()}</div>
      <div class="onb__skip">${DS.ButtonTiny({ label: 'Pomiń', variant: 'tertiary', attrs: { 'data-go': 'start' } })}</div>
      <div class="onb__dots" id="onb-dots">${DS.StepsIndicator({ steps: 3, current: i, text: false })}</div>
      <div class="screen__bottom">${DS.BottomActionsBar({ buttons: [DS.Button({ label: 'Dalej', block: true, attrs: { 'data-action': 'onb-next' } }), DS.Button({ label: 'Mam już konto', type: 'secondary', block: true, attrs: { 'data-go': 'login' } })] })}</div></div>`;
  };
  // Synchronizacja taśmy z hashem bez przerysowania ekranu
  function onbSync() {
    const i = onbIndex(current()) || 1;
    const track = $('#onb-track'); if (!track) return;
    track.classList.remove('is-dragging'); track.style.transform = `translateX(${-(i - 1) * (100 / 3)}%)`;
    const dots = $('#onb-dots'); if (dots && +dots.dataset.step !== i) { dots.dataset.step = i; dots.innerHTML = DS.StepsIndicator({ steps: 3, current: i, text: false }); }
    $('#screen .onb')?.setAttribute('data-step', i);
    $$$('#dev-nav a').forEach(a => a.classList.toggle('active', a.dataset.route === current()));
  }
  const onbGoto = (i) => { if (i < 1) i = 1; if (i > 3) return go('start'); location.replace('#/onboarding/' + i); };

  SCREENS.start = () => `<div class="screen start">
    <div class="start__bg"><img src="${A}img_start_login.png" alt=""></div>
    <div class="splash__top">${DS.StatusBar({ light: true })}</div>
    <div class="start__header"><span class="start__mark">${DS.ICONS['alabek']}</span>${DS.ButtonTiny({ label: 'Wejdź jako gość', variant: 'tertiary', attrs: { 'data-action': 'guest' } })}</div>
    <div class="start__content">
      <div class="start__heading"><p class="start__title">Załóż konto<br>lub zaloguj się</p><p class="start__lead">Twoje dane sa bezpieczne. Konto pozwala kupować badania i odbierać wyniki.</p></div>
      <div class="start__actions">${DS.Button({ label: 'Zarejestruj się', block: true, attrs: { 'data-go': 'register/1' } })}${DS.Button({ label: 'Mam już konto', type: 'oncolor', block: true, attrs: { 'data-go': 'login' } })}</div>
      <p class="start__legal">Zakładając konto akceptujesz <span class="ds-TextLink">Regulamin</span> i <span class="ds-TextLink">Politykę prywatności</span></p>
    </div>
    <div class="screen__bottom">${DS.HomeIndicator({ light: true })}</div></div>`;

  // ---- Rejestracja krok 1 ----
  SCREENS['register/1'] = () => {
    const ex = S.expanded;
    const consent = (key, title, required, text) => DS.SelectableCell({
      checked: S.consents[key], title, required, action: 'Więcej', actionAttrs: { 'data-expand': key },
      expanded: ex[key] ? text : null, attrs: { 'data-consent': key, id: 'consent-' + key },
    });
    const body = `<div class="stack-32">
      ${DS.StepsIndicator({ steps: 3, current: 1, label: 'Twoje dane' })}
      <p class="screen__title">Zarejestruj się do konta pacjenta</p></div>
      <div class="fields">
        ${DS.TextField({ id: 'f-phone', label: 'Numer telefonu', value: S.phone, type: 'tel', helper: 'Wyślemy SMS z kodem potwierdzającym', leading: { prefix: { flag: S.prefix.flag, code: S.prefix.code, attrs: { 'data-action': 'open-country' } } }, inputAttrs: { inputmode: 'numeric', autocomplete: 'tel-national' }, attrs: { 'data-helper': 'Wyślemy SMS z kodem potwierdzającym' } })}
        ${S.noPesel ? `<div class="fields">
            ${DS.TextField({ id: 'f-birth', label: 'Data urodzenia', value: S.birth, helper: 'Wpisz w formacie DD/MM/RRRR', inputAttrs: { inputmode: 'numeric' }, attrs: { 'data-helper': 'Wpisz w formacie DD/MM/RRRR' } })}
            <div class="stack-12"><div class="stack-12"><p class="field-label">Wybierz płeć</p><div class="row-5">${DS.FilterChip({ label: 'Kobieta', selected: S.sex === 'k', fill: true, attrs: { 'data-sex': 'k' } })}${DS.FilterChip({ label: 'Mężczyzna', selected: S.sex === 'm', fill: true, attrs: { 'data-sex': 'm' } })}</div></div>
            ${DS.SelectableCell({ title: 'Nie mam numeru PESEL', checked: true, attrs: { 'data-action': 'toggle-pesel' } })}</div></div>`
        : `<div class="stack-0">${DS.TextField({ id: 'f-pesel', label: 'PESEL', value: S.pesel, inputAttrs: { inputmode: 'numeric', maxlength: 11 } })}
            ${DS.SelectableCell({ title: 'Nie mam numeru PESEL', checked: false, attrs: { 'data-action': 'toggle-pesel' } })}</div>`}
      </div>
      ${DS.Divider()}
      <div class="stack-0">
        ${consent('terms', 'Akceptuje Regulamin i politykę prywatności', true, 'Regulamin określa zasady korzystania z aplikacji ALAB laboratoria i Konta Pacjenta. Polityka prywatności opisuje, jak przetwarzamy Twoje dane osobowe.')}
        ${consent('marketing', 'Chcę informację o promocjach i nowościach', false, 'Zgoda na otrzymywanie informacji handlowych drogą elektroniczną. Możesz ją wycofać w każdej chwili w ustawieniach konta.')}
      </div>`;
    return layout({ top: DS.TopBar({}), body, bodyClass: 'screen__body--pb', bottom: DS.BottomActionsBar({ buttons: [DS.Button({ label: 'Dalej', block: true, attrs: { 'data-action': 'register-1-next' } })] }) });
  };

  function countrySheet() {
    const list = (q = '') => { const l = COUNTRIES.filter(([n]) => n.toLowerCase().includes(q.toLowerCase())); return l.length
      ? l.map(([n, c, f], i) => (i === 1 ? DS.Divider() : '') + DS.CellSelectCountry({ name: n, code: c, flag: f, checked: S.prefix.code === c, attrs: { 'data-country': c } })).join('')
      : `<div class="ds-ScreenState" style="padding-top:48px"><div class="ds-ScreenState__text"><p class="ds-ScreenState__title" style="font-size:20px;line-height:24px">Brak wyników</p><p class="ds-ScreenState__body">Spróbuj wpisać nazwę kraju inaczej.</p></div></div>`; };
    const sheet = DS.presentSheet({ title: 'Wybierz kraj', height: '750px', content: DS.TextField({ id: 'f-country', label: 'Wpisz kraj...', leading: { icon: 'search' } }) + `<div class="ds-BottomSheet__scroll">${list()}</div>` });
    sheet.wrap.addEventListener('click', (e) => {
      const c = e.target.closest('[data-country]');
      if (c) { const found = COUNTRIES.find(x => x[1] === c.dataset.country); S.prefix = { name: found[0], code: found[1], flag: found[2] }; sheet.close(false); render_(); }
    });
    sheet.wrap.addEventListener('ds:input', (e) => { sheet.wrap.querySelector('.ds-BottomSheet__scroll').innerHTML = list(e.detail.value); });
    setTimeout(() => sheet.wrap.querySelector('#f-country')?.focus(), 50);
  }

  // ---- Rejestracja krok 2 (SMS) ----
  let otpTimer, otpLeft = 29;
  SCREENS['register/2'] = () => {
    clearInterval(otpTimer); otpLeft = 29;
    otpTimer = setInterval(() => { otpLeft--; const el = $('#otp-timer'); if (!el) return clearInterval(otpTimer); if (otpLeft <= 0) { clearInterval(otpTimer); el.outerHTML = `<button type="button" class="center-13 ds-TextLink" id="otp-resend" data-action="otp-resend" style="width:100%">Wyślij kod ponownie</button>`; } else el.textContent = '0:' + String(otpLeft).padStart(2, '0'); }, 1000);
    const body = `<div class="stack-32">${DS.StepsIndicator({ steps: 3, current: 2, label: 'Potwierdzenie' })}
        <div class="stack-16"><p class="screen__title">Weryfikacja telefonu</p><p class="screen__lead">Wysłaliśmy 6-cyfrowy kod na numer<br><b>${esc(S.prefix.code.replace(' ', ''))} ${esc(S.phone.replace(/(\d{3})(?=\d)/g, '$1 '))}</b></p></div></div>
      <div class="stack-16" style="gap:16px">${DS.InputCode({ value: S.code, attrs: { id: 'otp' } })}<p class="center-13 muted-3" id="otp-row">Wyślij ponownie za <b id="otp-timer" style="color:var(--content-on-surface)">0:29</b></p></div>
      ${DS.Button({ label: 'Potwierdź', block: true, attrs: { 'data-action': 'register-2-next', id: 'otp-btn' } })}`;
    return layout({ top: DS.TopBar({}), body, bodyClass: 'screen__body--gap24' });
  };

  // ---- Rejestracja krok 3 ----
  SCREENS['register/3'] = () => {
    const r = pwdRules(S.password);
    const body = `<div class="stack-32">${DS.StepsIndicator({ steps: 3, current: 3, label: 'Twoje konto' })}<p class="screen__title">Dane podstawowe</p></div>
      <div class="fields">
        ${DS.TextField({ id: 'f-name', label: 'Imię', value: S.name, inputAttrs: { autocomplete: 'given-name' } })}
        ${DS.TextField({ id: 'f-surname', label: 'Nazwisko', value: S.surname, inputAttrs: { autocomplete: 'family-name' } })}
        ${DS.TextField({ id: 'f-email', label: 'Email', value: S.email, type: 'email', inputAttrs: { autocomplete: 'email' } })}
        <div class="stack-16">${DS.TextField({ id: 'f-password', label: 'Hasło', value: S.password, type: 'password', trailing: { icon: 'eye', action: true, label: 'Pokaż hasło', attrs: { 'data-ds': 'toggle-password' } }, inputAttrs: { autocomplete: 'new-password' } })}
          <div class="rules" id="pwd-rules"><b>Hasło powinno zawierać:</b><ul><li class="${r.len ? 'ok' : ''}" data-rule="len">minimum 8 znaków</li><li class="${r.case ? 'ok' : ''}" data-rule="case">mała i wielka litera</li><li class="${r.digit ? 'ok' : ''}" data-rule="digit">cyfra</li></ul></div></div>
      </div>`;
    return layout({ top: DS.TopBar({}), body, bodyClass: 'screen__body--pb', bottom: DS.BottomActionsBar({ buttons: [DS.Button({ label: 'Załóż konto', block: true, attrs: { 'data-action': 'register-3-next' } })] }) });
  };

  // ---- Zgody ALAB club ----
  SCREENS.club = () => {
    const ex = S.expanded;
    const body = `<div class="club__banner">
        <div class="club__photo"><img src="${A}img_club_consent.png" alt=""></div>
        <div style="position:relative;width:100%">${DS.StatusBar({ light: true })}</div>
        <div class="club__intro"><span class="club__logo">${DS.ICONS['logo-club']}</span><div><p class="club__title">Bezpłatny program<br>dla pacjentów</p><p class="club__lead">Trzy korzyści, jedna decyzja.</p></div></div>
        <div class="club__carouselwrap"><div class="club__carousel" id="club-carousel">${DS.CarouselCell({ icon: 'tag', title: '5% dodatkowej zniżki', sub: 'na całą ofertę ALAB laboratoria' })}${DS.CarouselCell({ icon: 'gift', title: 'Oferta urodzinowa', sub: 'Specjalna niespodzianka w Twoim miesiącu' })}${DS.CarouselCell({ icon: 'voucher', title: 'Voucher 20%', sub: 'Po wykonaniu badania na kolejne zakupy' })}</div>
          <div class="club__dots" id="club-dots">${DS.StepsIndicator({ steps: 3, current: 1, text: false, onScrim: true })}</div>
          <div class="club__corner"></div></div>
      </div>
      <div class="stack-32" style="padding:0 20px 140px">
        <div class="stack-0">
          ${DS.SelectableCell({ checked: S.club.terms, title: 'Zapoznałem/-am się z Regulaminem Programu “ALAB club” i akceptuje jego postanowienia', required: true, action: 'Więcej', actionAttrs: { 'data-expand': 'clubTerms' }, expanded: ex.clubTerms ? 'Regulamin Programu ALAB club określa zasady przyznawania i wykorzystania korzyści dla uczestników programu.' : null, attrs: { 'data-club': 'terms', id: 'club-terms' } })}
          ${DS.SelectableCell({ checked: S.club.rodo, title: 'Wyrażam zgodę na przetwarzanie moich danych osobowych przez ALAB laboratoria Sp. z.', required: true, action: 'Więcej', actionAttrs: { 'data-expand': 'clubRodo' }, expanded: ex.clubRodo ? 'Zgoda obejmuje przetwarzanie danych w celu realizacji Programu ALAB club, w tym naliczania zniżek i komunikacji o korzyściach.' : null, attrs: { 'data-club': 'rodo', id: 'club-rodo' } })}
        </div>
        ${DS.Divider()}
        <div class="club__text"><p class="clamp ${ex.t1 ? 'open' : ''}"><b>Dane osobowe będą przetwarzane:</b><br>w celu realizacji Programu „ALAB club” – na podstawie art. 6 ust. 1 lit. b RODO (wykonanie umowy), w celach marketingowych – na podstawie zgody (art. 6 ust. 1 lit. a RODO), w celu ustalenia i dochodzenia roszczeń – na podstawie uzasadnionego interesu administratora.</p><button type="button" data-expand="t1">${ex.t1 ? 'Mniej' : 'Więcej'}</button></div>
        <div class="club__text"><p class="clamp ${ex.t2 ? 'open' : ''}"><b>Podanie danych jest dobrowolne, ale niezbędne do udziału w programie.</b> Dane mogą być przekazywane podmiotom wspierającym administratora (np. dostawcom IT).<br>Dane będą przechowywane przez okres uczestnictwa w programie oraz do czasu przedawnienia roszczeń lub do momentu cofnięcia zgody (w przypadku marketingu).<br><br>Przysługuje Państwu prawo do: dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia oraz wniesienia sprzeciwu i skargi do Prezesa UODO.</p><button type="button" data-expand="t2">${ex.t2 ? 'Mniej' : 'Więcej'}</button></div>
      </div>`;
    return `<div class="screen"><div class="screen__body" style="padding:0;gap:11px">${body}</div><div class="screen__bottom">${DS.BottomActionsBar({ buttons: [DS.Button({ label: 'Dołącz do ALAB club', block: true, attrs: { 'data-action': 'club-join' } }), DS.Button({ label: 'Nie teraz', type: 'secondary', block: true, attrs: { 'data-action': 'club-skip' } })] })}</div></div>`;
  };

  // ---- Face ID (K4 zachęta) ----
  SCREENS.faceid = () => `<div class="screen"><div class="screen__top">${DS.TopBar({})}</div>
    <div style="position:absolute;left:0;right:0;top:50%;transform:translateY(-50%)">${DS.ScreenState({ asset: A + 'il_phone_tick.png', title: 'Loguj się szybciej', body: 'Wchodź do aplikacji odciskiem palca albo twarzą.\n\nHasło zostaje w zapasie, na wypadek gdyby biometria nie zadziałała.', buttons: [DS.Button({ label: 'Włącz Face ID', block: true, attrs: { 'data-action': 'faceid-on' } }), DS.Button({ label: 'Nie teraz', type: 'secondary', block: true, attrs: { 'data-action': 'faceid-skip' } })] })}</div>
    <div class="screen__bottom">${DS.HomeIndicator()}</div></div>`;

  // ---- Logowanie ----
  SCREENS.login = () => {
    const body = `<div class="screen__heading"><p class="screen__title">Zaloguj się</p><p class="screen__lead">Wpisz dane, których używasz w aplikacji ALAB</p></div>
      <div class="fields fields--12">${DS.TextField({ id: 'l-email', label: 'Email', value: S.loginEmail, type: 'email', inputAttrs: { autocomplete: 'email' } })}
        ${DS.TextField({ id: 'l-password', label: 'Hasło', value: S.loginPassword, type: 'password', trailing: { icon: 'eye', action: true, label: 'Pokaż hasło', attrs: { 'data-ds': 'toggle-password' } }, inputAttrs: { autocomplete: 'current-password' } })}</div>
      <button type="button" class="center-13 ds-TextLink" data-go="reset" style="width:100%">Nie pamiętam hasła</button>
      <div class="stack-12">${DS.Button({ label: 'Zaloguj się', block: true, attrs: { 'data-action': 'login', id: 'login-btn' } })}${DS.Button({ label: 'Zaloguj się z Face ID', type: 'secondary', leadingIcon: 'scan', block: true, attrs: { 'data-action': 'login-faceid' } })}</div>`;
    const bottom = `<div class="stack-0" style="gap:24px;align-items:center"><p class="center-13 muted" style="padding:0 24px">Nie masz jeszcze konta? <button type="button" class="ds-TextLink" data-go="register/1" style="color:var(--content-on-surface);font:inherit;text-decoration-thickness:12%">Załóż konto</button></p>${DS.HomeIndicator()}</div>`;
    return layout({ top: DS.TopBar({}), body, bodyClass: 'screen__body--gap24', bottom });
  };

  // ---- Reset hasła ----
  SCREENS.reset = () => layout({ top: DS.TopBar({ leading: 'x-close', leadingAttrs: { 'data-go': 'login' } }), bodyClass: 'screen__body--gap24',
    body: `<div class="screen__heading"><p class="screen__title">Reset hasła</p><p class="screen__lead">Wpisz email użyty przy rejestracji, Jeśli istnieje konto, wyślemy link do ustawienia nowego hasla.</p></div>
      ${DS.TextField({ id: 'r-email', label: 'Email', value: S.resetEmail, type: 'email', state: S.resetEmail ? 'default' : 'focused', inputAttrs: { autocomplete: 'email', autofocus: true } })}
      ${DS.Button({ label: 'Wyślij link', block: true, attrs: { 'data-action': 'reset-send', id: 'reset-btn' } })}` });

  let resendTimer, resendLeft = 29;
  SCREENS['reset/sent'] = () => {
    clearInterval(resendTimer); resendLeft = 29;
    resendTimer = setInterval(() => { resendLeft--; const b = $('#resend-btn'); if (!b) return clearInterval(resendTimer);
      if (resendLeft <= 0) { clearInterval(resendTimer); b.outerHTML = DS.Button({ label: 'Wyślij ponownie', type: 'secondary', block: true, attrs: { id: 'resend-btn', 'data-action': 'reset-resend' } }); }
      else b.querySelector('.ds-Button__label').textContent = 'Wyślij ponownie za 0:' + String(resendLeft).padStart(2, '0'); }, 1000);
    return `<div class="screen"><div class="screen__top">${DS.TopBar({})}</div>
      <div style="position:absolute;left:0;right:0;top:174px">${DS.ScreenState({ asset: A + 'il_mail_sent.png', title: 'Sprawdź skrzynkę', body: 'Jeśli ten email jest w naszej bazie, wysłaliśmy link do ustawienia nowego hasła.\n\nLink działa 1 godzinę. Sprawdź folder spam.', buttons: [DS.Button({ label: 'Wyślij ponownie za 0:29', type: 'secondary', state: 'disabled', block: true, attrs: { id: 'resend-btn' } })] })}</div>
      <div class="screen__bottom">${DS.HomeIndicator()}</div></div>`;
  };

  // ---- Dashboard (istniejący prototyp sklepu w ramie telefonu) ----
  SCREENS.dashboard = () => `<div class="screen dash"><iframe src="../index.html" title="Sklep • Strona główna"></iframe></div>`; // nadpisywane w app.shop.js
  // powitanie po rejestracji/logowaniu (raz)
  window.addEventListener('hashchange', () => { if (current() === 'dashboard' && S.loggedIn && !S.welcomed) { S.welcomed = true; setTimeout(() => snack(S.clubJoined ? 'Konto gotowe. Witaj w ALAB club!' : 'Konto gotowe. Możesz kupować badania i odbierać wyniki.', 'success', 110), 500); } });

  // Kolor tła dokumentu i theme-color = kolor dolnej krawędzi ekranu (pas poza oknem PWA na iOS maluje html)
  // Dwa niezależne kolory: tło dokumentu (iOS maluje nim pas pod oknem PWA na dole) i theme-color (od niego zależy kolor
  // tekstu systemowego status bara przy black-translucent: granat → biały tekst, biel → czarny).
  const DARK_ROUTES = new Set(['splash', 'start']);
  const NAVY_TOP = (r) => DARK_ROUTES.has(r) || r === 'dashboard' || r === 'results' || /^(category|list|product)\//.test(r);
  const setThemeColor = (color) => { let m = document.querySelector('meta[name="theme-color"]'); if (!m) { m = document.createElement('meta'); m.name = 'theme-color'; document.head.appendChild(m); } if (m.content !== color) m.content = color; };
  function updateChrome(route) {
    if (matchMedia('(max-width: 900px)').matches) document.documentElement.style.backgroundColor = DARK_ROUTES.has(route) ? '#04387c' : '#ffffff';
    setThemeColor(NAVY_TOP(route) ? '#04387c' : '#ffffff');
  }

  // ---------------- router ----------------
  const ROUTES = [
    ['Splash', 'splash'], ['Onboarding 1/3', 'onboarding/1'], ['Onboarding 2/3', 'onboarding/2'], ['Onboarding 3/3', 'onboarding/3'], ['Start', 'start'],
    ['— Rejestracja'], ['Krok 1 · Dane logowania', 'register/1'], ['Krok 2 · Kod SMS', 'register/2'], ['Krok 3 · Dane podstawowe', 'register/3'], ['Zgody ALAB club', 'club'], ['Zachęta Face ID', 'faceid'],
    ['— Logowanie'], ['Zaloguj się', 'login'], ['Reset hasła', 'reset'], ['Sprawdź skrzynkę', 'reset/sent'],
    ['— Aplikacja'], ['Dashboard (sklep)', 'dashboard'],
  ];
  const current = () => location.hash.replace(/^#\/?/, '') || 'splash';
  function resolve(route) {
    if (SCREENS[route]) return SCREENS[route]();
    const i = route.indexOf('/'); if (i > 0 && SCREENS[route.slice(0, i) + '/:id']) return SCREENS[route.slice(0, i) + '/:id'](decodeURIComponent(route.slice(i + 1)));
    const m = route.match(/^onboarding\/(\d)$/); if (m) return SCREENS['onboarding/:n'](m[1]);
    return SCREENS.start();
  }
  // Przejścia jak w iOS: push (nowy wjeżdża z prawej, stary odjeżdża w lewo i ciemnieje),
  // pop (odwrotnie), fade (splash → onboarding, → dashboard). Bez dir = przerysowanie w miejscu.
  const FADE_ROUTES = new Set(['splash', 'dashboard', 'start', 'results-empty']);
  const T_MS = 380;
  function stagger(root) {
    const items = $$('.screen__body > *, .start__content > *, .ds-ScreenState__content > *, .ds-ScreenState > .ds-Button, .onb__slide .onb__text > *', root);
    items.forEach((el, i) => { el.classList.add('anim-in'); el.style.animationDelay = Math.min(i, 8) * 45 + 'ms'; });
  }
  function render_(dir) {
    const route = current();
    const scr = $('#screen');
    const old = scr.lastElementChild;
    const tmp = document.createElement('div'); tmp.innerHTML = resolve(route);
    const next = tmp.firstElementChild;
    $('#overlay').innerHTML = '';
    if (!old || !dir) {
      scr.innerHTML = ''; scr.appendChild(next);
    } else {
      $$('.screen', scr).forEach(s => { if (s !== old) s.remove(); });
      const mode = dir === 'back' ? 'back' : (dir === 'fade' ? 'fade' : 'fwd');
      next.classList.add('screen--enter-' + mode);
      scr.appendChild(next);
      old.style.pointerEvents = 'none';
      void next.offsetWidth; // reflow, żeby stan startowy się zapisał
      next.classList.add('screen--t', 'screen--go');
      old.classList.add('screen--t', 'screen--leave-' + mode);
      setTimeout(() => { old.remove(); next.classList.remove('screen--t', 'screen--go', 'screen--enter-' + mode); }, T_MS + 40);
      stagger(next);
    }
    DS.enhance(next);
    (window.APP?.afterRender || []).forEach(f => { try { f(route, next); } catch (err) { console.error(err); } });
    updateChrome(route);
    $$('#dev-nav a').forEach(a => a.classList.toggle('active', a.dataset.route === route));
    if (route === 'register/2') setTimeout(() => $('#otp .ds-InputCode__hidden')?.focus(), T_MS);
    if (route === 'reset') setTimeout(() => $('#r-email')?.focus(), T_MS);
  }
  function route() {
    const r = current();
    // krok onboardingu → tylko przesuń taśmę
    if (onbIndex(r) && onbIndex(lastRoute) && $('#onb-track')) { history[history.length - 1] = r; lastRoute = r; onbSync(); return; }
    const isBack = history.length >= 2 && history[history.length - 2] === r;
    if (isBack) history.pop(); else history.push(r);
    // fade: do tras „korzeniowych” (splash, start, dashboard, zakładki, wyszukiwarka) oraz ze splasha/onboardingu; z korzenia w głąb = push jak w iOS
    const dir = isBack ? 'back' : ((FADE_ROUTES.has(r) || lastRoute === 'splash' || onbIndex(lastRoute) || !lastRoute) ? 'fade' : 'fwd');
    lastRoute = r; render_(dir);
  }

  // ---------------- gesty: swipe onboardingu + cofanie od lewej krawędzi ----------------
  const EASE = 'cubic-bezier(.32,.72,0,1)';
  let drag = null;
  const phoneEl = $('#phone');
  phoneEl.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    const track = e.target.closest('#onb-track');
    const rect = phoneEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (track) { drag = { kind: 'onb', x0: e.clientX, y0: e.clientY, t0: performance.now(), w: rect.width, i: onbIndex(current()) || 1, el: track, moved: false }; track.classList.add('is-dragging'); }
    else if (x < 28 && history.length >= 2 && !FADE_ROUTES.has(current()) && !onbIndex(current()) && !$('#overlay').firstElementChild) {
      const scr = $('#screen').lastElementChild; if (!scr) return;
      const dim = document.createElement('div'); dim.className = 'swipe-dim'; $('#screen').insertBefore(dim, scr);
      drag = { kind: 'back', x0: e.clientX, y0: e.clientY, t0: performance.now(), w: rect.width, el: scr, dim, moved: false };
      scr.classList.add('is-dragging');
    } else return;
    try { phoneEl.setPointerCapture(e.pointerId); } catch (_) { /* zdarzenia syntetyczne / brak wskaźnika */ }
  });
  phoneEl.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x0, dy = e.clientY - drag.y0;
    if (!drag.moved && Math.abs(dx) < 6) return;
    if (!drag.moved && Math.abs(dy) > Math.abs(dx) * 1.2 && drag.kind === 'onb') { endDrag(false); return; }
    drag.moved = true; drag.dx = dx;
    if (drag.kind === 'onb') {
      let off = -(drag.i - 1) * drag.w + dx;
      if (off > 0) off = off * 0.35; if (off < -2 * drag.w) off = -2 * drag.w + (off + 2 * drag.w) * 0.35;
      drag.el.style.transform = `translateX(${off}px)`;
    } else {
      const x = Math.max(0, dx); drag.el.style.transform = `translateX(${x}px)`; drag.dim.style.opacity = String(0.14 * (1 - x / drag.w));
    }
  });
  const endDrag = (commit) => {
    if (!drag) return; const d = drag; drag = null;
    if (d.kind === 'onb') {
      d.el.classList.remove('is-dragging');
      const dt = Math.max(1, performance.now() - d.t0); const v = (d.dx || 0) / dt; // px/ms
      let target = d.i;
      if (commit && d.moved) { if (d.dx < -d.w * 0.25 || v < -0.45) target = d.i + 1; else if (d.dx > d.w * 0.25 || v > 0.45) target = d.i - 1; }
      if (target > 3) { onbSync(); return go('start'); }
      if (target === d.i) onbSync(); else onbGoto(target);
    } else {
      d.el.classList.remove('is-dragging');
      const dt = Math.max(1, performance.now() - d.t0); const v = (d.dx || 0) / dt;
      if (commit && d.moved && ((d.dx || 0) > d.w * 0.3 || v > 0.5)) {
        d.el.style.transition = `transform ${T_MS}ms ${EASE}`; d.el.style.transform = `translateX(${d.w}px)`; d.dim.style.transition = `opacity ${T_MS}ms ${EASE}`; d.dim.style.opacity = '0';
        setTimeout(() => { d.dim.remove(); back(); }, T_MS * 0.55);
      } else {
        d.el.style.transition = `transform ${T_MS}ms ${EASE}`; d.el.style.transform = ''; d.dim.style.transition = `opacity ${T_MS}ms ${EASE}`; d.dim.style.opacity = '0';
        setTimeout(() => { d.el.style.transition = ''; d.dim.remove(); }, T_MS);
      }
    }
  };
  phoneEl.addEventListener('pointerup', () => endDrag(true));
  phoneEl.addEventListener('pointercancel', () => endDrag(false));
  phoneEl.addEventListener('click', (e) => { if (e.target.closest('#onb-track') && drag === null && e.detail && Math.abs((e.clientX || 0)) >= 0) {} }, true);

  // ---------------- zdarzenia ----------------
  document.addEventListener('click', (e) => {
    const t = e.target;
    const goEl = t.closest('[data-go]'); if (goEl) { go(goEl.dataset.go); return; }
    const ex = t.closest('[data-expand]'); if (ex) { const k = ex.dataset.expand; S.expanded[k] = !S.expanded[k]; render_(); return; }
    // przełączanie w miejscu (bez przerysowania), żeby mikroanimacje kontrolek były widoczne
    const sexEl = t.closest('[data-sex]'); if (sexEl) { S.sex = sexEl.dataset.sex; syncInputs(); $$('[data-sex]').forEach(c => { const on = c.dataset.sex === S.sex; c.classList.toggle('is-selected', on); c.setAttribute('aria-pressed', on); }); return; }
    const toggleCell = (cell, on) => { cell.classList.remove('is-error'); const cb = cell.querySelector('.ds-Checkbox'); cb.classList.remove('is-error'); cb.classList.toggle('is-checked', on); cb.setAttribute('aria-checked', on); };
    const consent = t.closest('[data-consent]'); if (consent && !t.closest('.ds-SelectableCell__action')) { const k = consent.dataset.consent; S.consents[k] = !S.consents[k]; syncInputs(); toggleCell(consent, S.consents[k]); return; }
    const club = t.closest('[data-club]'); if (club && !t.closest('.ds-SelectableCell__action')) { const k = club.dataset.club; S.club[k] = !S.club[k]; toggleCell(club, S.club[k]); return; }
    const act = t.closest('[data-action]'); if (act) ACTIONS[act.dataset.action]?.(act, e);
  });
  document.addEventListener('input', (e) => { if (e.target.matches('.ds-TextField__input, .ds-InputCode__hidden')) syncInputs(); if (e.target.id === 'f-password') { const r = pwdRules(e.target.value); $$('#pwd-rules li').forEach(li => li.classList.toggle('ok', r[li.dataset.rule])); } });
  document.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.matches('.ds-TextField__input')) { const btn = $('#screen .screen__bottom .ds-Button, #screen .ds-Button--primary'); btn?.click(); } });
  document.addEventListener('ds:code', (e) => { S.code = e.detail.value; if (e.detail.complete) setTimeout(() => ACTIONS['register-2-next']($('#otp-btn')), 150); });
  $('#club-carousel');
  document.addEventListener('scroll', (e) => { const c = e.target; if (c && c.id === 'club-carousel') { const i = Math.round(c.scrollLeft / 248) + 1; $('#club-dots').innerHTML = DS.StepsIndicator({ steps: 3, current: Math.min(i, 3), text: false, onScrim: true }); } }, true);

  function syncInputs() {
    const v = (id) => $('#' + id)?.value;
    if (v('f-phone') != null) S.phone = v('f-phone').replace(/\D/g, '');
    if (v('f-pesel') != null) S.pesel = v('f-pesel');
    if (v('f-birth') != null) S.birth = v('f-birth');
    if (v('f-name') != null) S.name = v('f-name'); if (v('f-surname') != null) S.surname = v('f-surname');
    if (v('f-email') != null) S.email = v('f-email'); if (v('f-password') != null) S.password = v('f-password');
    if (v('l-email') != null) S.loginEmail = v('l-email'); if (v('l-password') != null) S.loginPassword = v('l-password');
    if (v('r-email') != null) S.resetEmail = v('r-email');
  }

  const ACTIONS = {
    back, 'sheet-close': () => { }, 'open-country': (el, e) => { e.preventDefault(); countrySheet(); },
    guest: () => { S.guest = true; go('dashboard'); },
    'toggle-pesel': () => { syncInputs(); S.noPesel = !S.noPesel; render_(); },
    'register-1-next': () => {
      syncInputs(); let ok = true;
      const phone = $('#f-phone');
      if (!/^\d{9}$/.test(S.phone)) { fieldError(phone, 'Numer telefonu nieprawidłowy'); ok = false; }
      else if (S.phone === '600000000') { fieldError(phone, 'Numer już zarejestrowany. Zaloguj się lub zresetuj hasło.'); ok = false; }
      if (!S.noPesel) { if (!peselValid(S.pesel)) { fieldError($('#f-pesel'), 'PESEL niepoprawny'); ok = false; } }
      else { if (!/^\d{2}\/\d{2}\/\d{4}$/.test(S.birth)) { fieldError($('#f-birth'), 'Wpisz datę w formacie DD/MM/RRRR'); ok = false; } if (!S.sex) { ok = false; snack('Wybierz płeć', 'error'); } }
      if (!S.consents.terms) { $('#consent-terms')?.classList.add('is-error'); $('#consent-terms .ds-Checkbox')?.classList.add('is-error'); if (ok) snack('Brak zgody wymaganej', 'error'); ok = false; }
      if (!ok) { $('#screen .is-error')?.scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
      S.code = ''; go('register/2');
    },
    'otp-resend': () => { otpLeft = 29; $('#otp-resend').outerHTML = `<p class="center-13 muted-3" id="otp-row">Wyślij ponownie za <b id="otp-timer" style="color:var(--content-on-surface)">0:29</b></p>`; SCREENS['register/2'].timerRestart?.(); snack('Kod wysłany ponownie', 'success', 313);
      clearInterval(otpTimer); otpTimer = setInterval(() => { otpLeft--; const el = $('#otp-timer'); if (!el) return clearInterval(otpTimer); if (otpLeft <= 0) { clearInterval(otpTimer); el.parentElement.outerHTML = `<button type="button" class="center-13 ds-TextLink" id="otp-resend" data-action="otp-resend" style="width:100%">Wyślij kod ponownie</button>`; } else el.textContent = '0:' + String(otpLeft).padStart(2, '0'); }, 1000); },
    'register-2-next': () => {
      const ic = $('#otp'); const v = ic.querySelector('.ds-InputCode__hidden').value;
      if (v.length < 6) { ic.classList.add('is-error'); snack('Wpisz 6-cyfrowy kod z SMS', 'error', 200); return; }
      if (v === '000000') { ic.classList.add('is-error'); snack('Kod nieprawidłowy. Sprawdź SMS i spróbuj ponownie.', 'error', 200); return; }
      ic.classList.add('is-success'); ic.querySelector('.ds-InputCode__hidden').blur();
      setTimeout(() => go('register/3'), 420);
    },
    'onb-next': () => { const i = onbIndex(current()) || 1; if (i >= 3) go('start'); else onbGoto(i + 1); },
    'register-3-next': () => {
      syncInputs(); let ok = true;
      if (!S.name.trim()) { fieldError($('#f-name'), 'Imię jest wymagane'); ok = false; }
      if (!S.surname.trim()) { fieldError($('#f-surname'), 'Nazwisko jest wymagane'); ok = false; }
      if (!S.email.trim()) { fieldError($('#f-email'), 'E-mail jest wymagany'); ok = false; }
      else if (!isEmail(S.email)) { fieldError($('#f-email'), 'Adres e-mail jest niepoprawny'); ok = false; }
      else if (S.email.trim().toLowerCase() === 'zajety@alab.pl') { fieldError($('#f-email'), 'E-mail już wykorzystany'); ok = false; }
      if (!S.password) { fieldError($('#f-password'), 'Hasło jest wymagane'); ok = false; }
      else if (!pwdStrong(S.password)) { fieldError($('#f-password'), 'Hasło za słabe'); ok = false; }
      if (!ok) { $('#screen .is-error')?.scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
      const btn = $('#screen .screen__bottom .ds-Button'); btn.outerHTML = DS.Button({ label: 'Załóż konto', state: 'loading', block: true });
      setTimeout(() => { S.loggedIn = true; go('club'); }, 900);
    },
    'club-join': () => {
      let ok = true;
      ['terms', 'rodo'].forEach(k => { if (!S.club[k]) { $('#club-' + k)?.classList.add('is-error'); $('#club-' + k + ' .ds-Checkbox')?.classList.add('is-error'); ok = false; } });
      if (!ok) { snack('Zaznacz wymagane zgody, żeby dołączyć do ALAB club', 'error', 190); $('#club-terms')?.scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
      S.clubJoined = true; go('faceid');
    },
    'club-skip': () => { S.clubJoined = false; go('faceid'); },
    'faceid-on': () => faceIdOverlay(() => { S.faceId = true; go('dashboard'); }),
    'faceid-skip': () => { S.faceId = false; go('dashboard'); },
    login: () => {
      syncInputs(); let ok = true;
      if (!S.loginEmail.trim()) { fieldError($('#l-email'), 'E-mail jest wymagany'); ok = false; }
      else if (!isEmail(S.loginEmail)) { fieldError($('#l-email'), 'Adres e-mail jest niepoprawny'); ok = false; }
      if (!S.loginPassword) { fieldError($('#l-password'), 'Hasło jest wymagane'); ok = false; }
      if (!ok) return;
      const btn = $('#login-btn'); btn.outerHTML = DS.Button({ label: 'Zaloguj się', state: 'loading', block: true, attrs: { id: 'login-btn' } });
      setTimeout(() => {
        if (S.loginPassword === 'blokada') { render_(); snack('Konto zostało zablokowane. Skontaktuj się z infolinią ALAB.', 'error', 120); return; }
        if (S.loginPassword === 'zle12345') { render_(); fieldError($('#l-password'), 'Dane uwierzytelniające są nieprawidłowe'); return; }
        S.loggedIn = true; go(S.faceId == null ? 'faceid' : 'dashboard');
      }, 900);
    },
    'login-faceid': () => faceIdOverlay(() => { S.loggedIn = true; S.faceId = true; go('dashboard'); }),
    'reset-send': () => {
      syncInputs();
      if (!S.resetEmail.trim()) return fieldError($('#r-email'), 'E-mail jest wymagany');
      if (!isEmail(S.resetEmail)) return fieldError($('#r-email'), 'Adres e-mail jest niepoprawny');
      const btn = $('#reset-btn'); btn.outerHTML = DS.Button({ label: 'Wyślij link', state: 'loading', block: true, attrs: { id: 'reset-btn' } });
      setTimeout(() => { if (S.resetEmail.trim().toLowerCase() === 'fail@alab.pl') { render_(); snack('Nie udało się wysłać wiadomości. Spróbuj ponownie.', 'error', 120); } else go('reset/sent'); }, 900);
    },
    'reset-resend': () => { snack('Wysłaliśmy link ponownie', 'success', 120); render_(); },
  };

  // ---------------- API dla modułów (app.shop.js) ----------------
  // Pasek akcji chowa się przy przewijaniu w dół i wraca po lekkim ruchu w górę (wzorzec z aplikacji natywnych,
  // Material 3 „scroll-away” / iOS toolbar). Przy samym dole i na górze ekranu pasek jest zawsze widoczny.
  function hideOnScrollDown(scroll, bar, { min = 24, step = 4 } = {}) {
    if (!scroll || !bar) return;
    let last = scroll.scrollTop, raf = 0;
    scroll.addEventListener('scroll', () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = scroll.scrollTop, d = y - last;
        const atBottom = y + scroll.clientHeight >= scroll.scrollHeight - 8;
        if (atBottom || y < min) bar.classList.remove('is-hidden');
        else if (d > step) bar.classList.add('is-hidden');
        else if (d < -step) bar.classList.remove('is-hidden');
        last = y;
      });
    }, { passive: true });
  }

  window.APP = { setThemeColor, hideOnScrollDown, SCREENS, ACTIONS, FADE_ROUTES, ROUTES, go, back, snack, current, layout, afterRender: [], get S() { return S; }, renderNav };

  // ---------------- panel deweloperski ----------------
  function renderNav() { $('#dev-nav').innerHTML = ROUTES.map(([label, r]) => r ? `<a href="#/${r}" data-route="${r}">${esc(label)}</a>` : `<div class="sep">${esc(label.replace('— ', ''))}</div>`).join(''); $$('#dev-nav a').forEach(a => a.classList.toggle('active', a.dataset.route === current())); }
  $('#dev-logo').innerHTML = DS.ICONS['alabek'];
  renderNav();
  const resetAll = () => { S = initial(); history = []; lastRoute = ''; if (current() === 'splash') render_('fade'); else go('splash'); };
  window.APP.reset = resetAll;
  $('#dev-reset').addEventListener('click', resetAll);
  if (matchMedia('(max-width: 900px)').matches) document.body.classList.add('is-mobile');

  window.addEventListener('hashchange', route);
  document.addEventListener('DOMContentLoaded', () => { if (!location.hash) location.hash = '#/splash'; else route(); });
})();
