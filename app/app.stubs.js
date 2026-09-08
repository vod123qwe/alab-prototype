/* ALAB • Prototyp — zaślepki zakładek na potrzeby testu niemoderowanego (Start, Wyniki, Koszyk).
   Wzór 1:1 z „Rejestracja - krok 8” 3136:31878 w pliku Alab • Design: pod spodem szkielet układu ekranu,
   nad nim wyśrodkowana karta z rozmyciem (radius 44, cień 0 4 60 rgba(0,0,0,.06)) z pigułką „Niedostępne w badaniu”,
   tytułem (display/medium) i dwiema linijkami opisu (body/xsmall).
   Pełny moduł Wyników nie jest usunięty — siedzi pod trasą `results-full` (poza ścieżką badania). */
(function () {
  const APP = window.APP; const { SCREENS } = APP;
  const esc = DS.esc;

  // pojedynczy klocek szkieletu; r = promień (domyślnie pigułka)
  // wszystkie klocki mają promień 12 z CSS — wzór nie różnicuje go per element
  const sk = (w, h) => `<span class="stub__skel" style="width:${w};height:${h}px"></span>`;
  const row = (content, gap = 12) => `<div class="stub__row" style="gap:${gap}px">${content}</div>`;

  const notice = (title, second = 'Przejdź do innej zakładki.', action = '') => `<div class="stub__notice"><div class="stub__card">` +
    `<div class="stub__group">` +
    DS.ButtonTiny({ label: 'Niedostępne w badaniu', variant: 'primary', attrs: { tabindex: '-1', 'aria-hidden': 'true' } }) +
    `<div class="stub__text"><p class="stub__title">${esc(title)}</p>` +
    `<p class="stub__desc"><span>Ta część aplikacji jest w przygotowaniu.</span><span class="stub__descStrong">${esc(second)}</span></p>` +
    `</div></div>` + (action ? `<div class="stub__action">${action}</div>` : '') + `</div></div>`;

  const stub = (tab, title, skeleton, second, action) => `<div class="screen shop stub" data-tab="${tab}">
      <div class="screen__top">${DS.StatusBar()}</div>
      <div class="screen__body stub__body">${skeleton}</div>
      ${notice(title, second, action)}
    </div>`;

  // Start — szkielet 1:1 z wzoru: awatar + dwie linijki, dwa kafle, niżej sekcja z blokiem
  const startSkeleton = `${row(sk('62px', 62) + `<div class="stub__col">${sk('62px', 21)}${sk('222px', 21)}</div>`, 25)}
      ${row(sk('154px', 59) + sk('154px', 59), 19)}
      <div class="stub__gap"></div>
      <div class="stub__col" style="gap:12px">${sk('62px', 21)}${sk('222px', 21)}${sk('100%', 64)}</div>`;

  // Wyniki — szkielet listy BEZ ramek: tytuł, nagłówek roku i trzy grupy klocków (tytuł, podtytuł, pill statusu).
  // Wcześniej klocki siedziały w białych kartach z obwódką i cała lista zlewała się w jedną plamę — teraz
  // grupy rozdziela duży odstęp, więc od razu widać, że to trzy pozycje listy.
  const resultRowSkel = () => `<div class="stub__col" style="gap:14px">${sk('70%', 20)}${sk('45%', 16)}${sk('148px', 32)}</div>`;
  const resultsSkeleton = `${sk('200px', 40)}
      <div class="stub__gap stub__gap--sm"></div>
      ${sk('44px', 20)}
      <div class="stub__gap stub__gap--sm"></div>
      <div class="stub__col" style="gap:44px">${resultRowSkel()}${resultRowSkel()}${resultRowSkel()}</div>`;

  // Koszyk — szkielet: tytuł, trzy pozycje i blok podsumowania
  const cartSkeleton = `${sk('140px', 40)}
      <div class="stub__gap stub__gap--sm"></div>
      <div class="stub__col" style="gap:12px">${sk('100%', 72)}${sk('100%', 72)}${sk('100%', 72)}</div>
      <div class="stub__gap"></div>
      ${sk('100%', 120)}`;

  // Pełne Wyniki zostają w prototypie, ale poza ścieżką badania (podgląd z panelu)
  const fullResults = SCREENS['tab/results'];
  if (fullResults) SCREENS['results-full'] = fullResults;

  APP.resultsStub = true;   // zakładka Wyniki jest zaślepką → bez licznika nowych wyników w dolnej nawigacji

  SCREENS['tab/start'] = () => stub('start', 'Ekran startowy', startSkeleton);
  SCREENS['tab/results'] = () => stub('results', 'Wyniki badań', resultsSkeleton);
  SCREENS['tab/cart'] = () => stub('cart', 'Koszyk', cartSkeleton, 'Jeśli zadanie jest skończone, kliknij poniżej.',
    DS.Button({ label: 'Zakończ zadanie', type: 'secondary', block: true, attrs: { 'data-action': 'end-task' } }));

  // ---------------- ekran startowy badania (wybór zadania) ----------------
  // 1:1 z „Start screen” 3153:32180 w pliku Alab • Design: granat, blob z tego samego assetu co splash,
  // logo ALAB laboratoria, nadtytuł „Prototyp do badań ALAB”, display/large i lista trzech zadań.
  // Każde zadanie ma własny adres i startuje od zera: pusty koszyk, brak klubu, realizacja = Punkt Pobrań.
  const TASKS = [
    ['1', 'Zadanie 1', 'Zamów badania moczu'],
    ['2', 'Zadanie 2', 'Zamów Pakiet Sport'],
    ['3', 'Zadanie 3', 'Zamów badanie krwi do domu'],
  ];
  SCREENS['zadania'] = () => `<div class="screen tasks">
      <div class="tasks__bg" aria-hidden="true">
        <div class="tasks__blob"><img src="${DS.ASSETS}img_splash_shape.png" alt=""></div>
        <div class="tasks__veil"></div>
        <div class="tasks__glow"></div>
      </div>
      <div class="tasks__top">${DS.StatusBar({ light: true })}</div>
      <div class="tasks__content">
        <span class="tasks__logo">${DS.ICONS['logo-laboratoria']}</span>
        <div class="tasks__text">
          <div class="tasks__heading">
            <p class="tasks__eyebrow">Prototyp do badań ALAB</p>
            <h1 class="tasks__title">Wybierz zadanie</h1>
          </div>
          <p class="tasks__lead">Każde zadanie zaczyna się od nowa,<br>z pustym koszykiem.</p>
        </div>
        <div class="tasks__list">${TASKS.map(([n, title, sub]) => DS.Cell({ icon: null, title, subtitle: sub, trailing: 'chevron-right-20', attrs: { 'data-action': 'start-task', 'data-task': n } })).join('')}</div>
      </div>
      ${DS.HomeIndicator({ light: true })}
    </div>`;
  APP.FADE_ROUTES.add('zadania');      // ekran korzeniowy — wchodzi i wychodzi przejściem fade
  APP.DARK_ROUTES.add('zadania');      // granatowy: tło dokumentu i theme-color jak na splashu

  // Start zadania renderujemy POD adresem zadania (`/app/zadanie/1`), żeby narzędzie badawcze widziało wejście.
  // Uczestnik wchodzi jako zalogowany Pacjent — rejestracji i logowania w zadaniach nie ma.
  // Członkostwo w ALAB club PRZECHODZI między zadaniami: kto dołączył w zadaniu 1, widzi zadania 2 i 3 już
  // jako członek klubu (ustalenie z Maćkiem). Trzyma się na sesji przeglądarki, więc przetrwa też wejście
  // w kolejne zadanie z linku. Reszta stanu (koszyk, sposób realizacji, filtry, wyniki) startuje od zera.
  const resetForTask = () => { const s = APP.S; delete s.shop; delete s.res; delete s.clubFrom;
    s.clubJoined = APP.recallClub(); if (!s.clubJoined) s.club = { terms: false, rodo: false };
    s.welcomed = true; s.loggedIn = true; };

  // Wejście w zadanie wygląda jak uruchomienie aplikacji: najpierw krótki ekran ładowania (ten sam splash,
  // co przy starcie apki), potem przejście na Start. Adres przez cały czas został `/app/zadanie/N`, więc
  // narzędzie badawcze widzi wejście w zadanie, a uczestnik nie widzi, że stan jest czyszczony.
  const BOOT_MS = 1200;
  let booting = null;
  const bootScreen = () => `<div class="screen splash"><div class="splash__bg"><img src="${DS.ASSETS}img_splash_shape.png" alt=""></div>
      <div class="splash__top">${DS.StatusBar({ light: true })}</div>
      <div class="splash__logo">${DS.ICONS['logo-laboratoria']}</div>
      <div class="splash__bottom"><div class="stack-16" style="align-items:center;gap:20px"><span class="splash__loader">${DS.ICONS['splash-loader']}</span><p class="splash__tag">Zadbaj o zdrowie, wygodnie</p></div>${DS.HomeIndicator({ light: true })}</div>
    </div>`;
  SCREENS['zadanie/:id'] = (id) => {
    if (booting === id) { booting = null; APP.hideTabBar = false; return SCREENS['tab/start'](); }
    resetForTask(); booting = id; APP.hideTabBar = true; return bootScreen();
  };
  TASKS.forEach(([n]) => APP.FADE_ROUTES.add('zadanie/' + n));   // wejście w zadanie i wyjście z ładowania = przejście fade
  APP.afterRender.push((route) => {
    if (!booting || route !== 'zadanie/' + booting) return;
    // ekran ładowania jest granatowy, a updateChrome ustawił już kolor dla trasy zadania (białej) — poprawiamy przed pierwszym paintem
    requestAnimationFrame(() => {
      APP.setThemeColor('#04387c');
      if (matchMedia('(max-width: 900px)').matches) document.documentElement.style.backgroundColor = '#04387c';
    });
    const id = booting;
    setTimeout(() => { if (booting === id && APP.current() === 'zadanie/' + id) APP.rerender('fade'); }, BOOT_MS);
  });

  Object.assign(APP.ACTIONS, {
    'end-task': () => APP.go('zadania'),
    'start-task': (el) => APP.go('zadanie/' + el.dataset.task),
  });

  // Punkt Pobrań — wchodzimy z komórki adresu w sklepie i z CTA „Zmień punkt” na karcie produktu
  const pointSkeleton = `${sk('100%', 56)}
      <div class="stub__gap stub__gap--sm"></div>
      ${sk('100%', 180)}
      <div class="stub__gap stub__gap--sm"></div>
      <div class="stub__col" style="gap:12px">${sk('100%', 72)}${sk('100%', 72)}${sk('100%', 72)}</div>`;
  SCREENS['punkt-pobran'] = () => `<div class="screen stub">
      <div class="screen__top">${DS.TopBar({ leading: 'x-close', title: 'Punkt Pobrań' })}</div>
      <div class="screen__body stub__body">${pointSkeleton}</div>
      ${notice('Punkt Pobrań', 'Wróć do poprzedniego ekranu.')}
      ${DS.HomeIndicator()}
    </div>`;

  const i = APP.ROUTES.findIndex(r => r[1] === 'tab/results');
  if (i >= 0) APP.ROUTES.splice(i + 1, 0, ['Wyniki · pełne (poza badaniem)', 'results-full'], ['Punkt Pobrań · zaślepka', 'punkt-pobran']);
  APP.ROUTES.push(['— Badanie'], ['Wybór zadań', 'zadania'],
    ['Zadanie 1 · mocz', 'zadanie/1'], ['Zadanie 2 · Pakiet Sport', 'zadanie/2'], ['Zadanie 3 · morfologia w domu', 'zadanie/3']);

  // Prototyp badawczy zaczyna się od wyboru zadania. Rejestracja, logowanie i onboarding są POZA zakresem
  // tego testu, więc chowamy je z wejścia i z panelu — ekrany zostają w kodzie i wrócą, gdy będą potrzebne
  // (np. ekran zgód ALAB club, który ma się otwierać z karty produktu).
  APP.setHome('zadania');
  const HIDDEN = new Set(['splash', 'onboarding/1', 'onboarding/2', 'onboarding/3', 'start',
    'register/1', 'register/2', 'register/3', 'login', 'faceid', 'reset', 'reset/sent']);   // 'club' zostaje: to podstrona sklepu
  for (let i = APP.ROUTES.length - 1; i >= 0; i--) {
    const r = APP.ROUTES[i];
    if (r[1] ? HIDDEN.has(r[1]) : /Rejestracja|Logowanie/.test(r[0])) APP.ROUTES.splice(i, 1);
  }
  APP.renderNav();
})();
