/* ALAB • Prototyp — zaślepki zakładek na potrzeby testu niemoderowanego (Start, Wyniki, Koszyk).
   Wzór 1:1 z „Rejestracja - krok 8” 3136:31878 w pliku Alab • Design: pod spodem szkielet układu ekranu,
   nad nim wyśrodkowana karta z rozmyciem (radius 44, cień 0 4 60 rgba(0,0,0,.06)) z pigułką „Niedostępne w badaniu”,
   tytułem (display/medium) i dwiema linijkami opisu (body/xsmall).
   Pełny moduł Wyników nie jest usunięty — siedzi pod trasą `results-full` (poza ścieżką badania). */
(function () {
  const APP = window.APP; const { SCREENS } = APP;
  const esc = DS.esc;

  // pojedynczy klocek szkieletu; r = promień (domyślnie pigułka)
  const sk = (w, h, r = 999) => `<span class="stub__skel" style="width:${w};height:${h}px;border-radius:${r}px"></span>`;
  const row = (content, gap = 12) => `<div class="stub__row" style="gap:${gap}px">${content}</div>`;
  // karta szkieletu: biały kontener z obwódką (jak CellTestResult / SurfaceSlot) i klockami w środku
  const skCard = (inner, r = 28) => `<div class="stub__cardSkel" style="border-radius:${r}px">${inner}</div>`;

  const notice = (title) => `<div class="stub__notice"><div class="stub__card">` +
    DS.ButtonTiny({ label: 'Niedostępne w badaniu', variant: 'primary', attrs: { tabindex: '-1', 'aria-hidden': 'true' } }) +
    `<div class="stub__text"><p class="stub__title">${esc(title)}</p>` +
    `<p class="stub__desc"><span>Ta część aplikacji jest w przygotowaniu.</span><span class="stub__descStrong">Przejdź do innej zakładki.</span></p>` +
    `</div></div></div>`;

  const stub = (tab, title, skeleton) => `<div class="screen shop stub" data-tab="${tab}">
      <div class="screen__top">${DS.StatusBar()}</div>
      <div class="screen__body stub__body">${skeleton}</div>
      ${notice(title)}
    </div>`;

  // Start — szkielet 1:1 z wzoru: awatar + dwie linijki, dwa kafle, niżej sekcja z blokiem
  const startSkeleton = `${row(sk('62px', 62, 16) + `<div class="stub__col">${sk('62px', 21)}${sk('222px', 21)}</div>`, 25)}
      ${row(sk('154px', 59, 16) + sk('154px', 59, 16), 19)}
      <div class="stub__gap"></div>
      <div class="stub__col" style="gap:12px">${sk('62px', 21)}${sk('222px', 21)}${sk('100%', 64, 16)}</div>`;

  // Wyniki — szkielet listy: tytuł, nagłówek roku i trzy karty wyniku z zawartością (tytuł, osoba, data, pill statusu)
  const resultCardSkel = () => skCard(`<div class="stub__col" style="gap:12px">${sk('70%', 20)}${sk('45%', 16)}</div>` +
    `<div class="stub__col" style="gap:16px">${sk('30%', 12)}${sk('148px', 32)}</div>`);
  const resultsSkeleton = `${sk('200px', 40, 16)}
      <div class="stub__gap stub__gap--sm"></div>
      ${sk('44px', 20)}
      <div class="stub__col" style="gap:12px">${resultCardSkel()}${resultCardSkel()}${resultCardSkel()}</div>`;

  // Koszyk — szkielet: tytuł, trzy pozycje i blok podsumowania
  const cartSkeleton = `${sk('140px', 40, 16)}
      <div class="stub__gap stub__gap--sm"></div>
      <div class="stub__col" style="gap:12px">${sk('100%', 72, 16)}${sk('100%', 72, 16)}${sk('100%', 72, 16)}</div>
      <div class="stub__gap"></div>
      ${sk('100%', 120, 28)}`;

  // Pełne Wyniki zostają w prototypie, ale poza ścieżką badania (podgląd z panelu)
  const fullResults = SCREENS['tab/results'];
  if (fullResults) SCREENS['results-full'] = fullResults;

  APP.resultsStub = true;   // zakładka Wyniki jest zaślepką → bez licznika nowych wyników w dolnej nawigacji

  SCREENS['tab/start'] = () => stub('start', 'Ekran startowy', startSkeleton);
  SCREENS['tab/results'] = () => stub('results', 'Wyniki badań', resultsSkeleton);
  SCREENS['tab/cart'] = () => stub('cart', 'Koszyk', cartSkeleton);

  const i = APP.ROUTES.findIndex(r => r[1] === 'tab/results');
  if (i >= 0) APP.ROUTES.splice(i + 1, 0, ['Wyniki · pełne (poza badaniem)', 'results-full']);
  APP.renderNav();
})();
