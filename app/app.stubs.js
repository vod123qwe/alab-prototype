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
  // karta szkieletu: biały kontener z obwódką (jak CellTestResult / SurfaceSlot) i klockami w środku
  const skCard = (inner) => `<div class="stub__cardSkel">${inner}</div>`;

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

  // Wyniki — szkielet listy: tytuł, nagłówek roku i trzy karty wyniku z zawartością (tytuł, osoba, data, pill statusu)
  const resultCardSkel = () => skCard(`<div class="stub__col" style="gap:12px">${sk('70%', 20)}${sk('45%', 16)}</div>` +
    `<div class="stub__col" style="gap:16px">${sk('30%', 12)}${sk('148px', 32)}</div>`);
  const resultsSkeleton = `${sk('200px', 40)}
      <div class="stub__gap stub__gap--sm"></div>
      ${sk('44px', 20)}
      <div class="stub__col" style="gap:12px">${resultCardSkel()}${resultCardSkel()}${resultCardSkel()}</div>`;

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

  // ---------------- wybór zadań (ekran startowy badania) ----------------
  // Każde zadanie ma własny adres i startuje od zera: pusty koszyk, brak klubu, sposób realizacji = Punkt Pobrań.
  const TASKS = [['1', 'Zadanie 1'], ['2', 'Zadanie 2'], ['3', 'Zadanie 3']];
  SCREENS['zadania'] = () => `<div class="screen tasks">
      <div class="screen__top">${DS.StatusBar()}</div>
      <div class="screen__body tasks__body">
        <h1 class="tasks__title">Wybierz zadanie</h1>
        <p class="tasks__lead">Każde zadanie zaczyna się od nowa, z pustym koszykiem.</p>
        <div class="tasks__list">${TASKS.map(([n, label]) => DS.Cell({ icon: 'file-note-search', title: label, attrs: { 'data-action': 'start-task', 'data-task': n } })).join('')}</div>
      </div>
      ${DS.HomeIndicator()}
    </div>`;

  // Start zadania renderujemy POD adresem zadania (`#/zadanie/1`), żeby narzędzie badawcze widziało wejście.
  const resetForTask = () => { const s = APP.S; delete s.shop; delete s.res; s.clubJoined = false; s.welcomed = true; };
  SCREENS['zadanie/:id'] = () => { resetForTask(); return SCREENS['tab/start'](); };

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
  APP.renderNav();
})();
