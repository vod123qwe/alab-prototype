/* ALAB • Prototyp — wyniki badań i FAQ (SZABLONY z danymi przykładowymi, nie prawdziwe wyniki Pacjenta).
   Struktura 1:1 z sekcji „Wyniki badań” 2516:102053 w pliku Alab • Design. Trzy typy wiersza parametru
   (CellParameter 2483:100492): 'value' = liczba + norma, 'scale' = liczba + pozycja na tle normy, 'qual' = wynik jakościowy.
   Liczby w podsumowaniu („Aktualny wynik”) wyliczamy z listy parametrów, żeby prototyp był spójny —
   w Figmie karta pokazuje 52/56, choć na ekranie widać kilka wierszy.
   Liczby podajemy jako teksty z przecinkiem (tak je pokazujemy), a do matematyki parsujemy je w helperze.
   Daty piszemy z miesiącem z małej litery (leksykon ALAB); listing w Figmie ma „12 Marca 2026”. */
(function () {
  const n = (t) => parseFloat(String(t).replace(',', '.'));
  // p = wartość + norma, s = wartość + tor normy (RangeSlider), q = wynik jakościowy (ujemny / dodatni)
  const p = (name, val, min, max, unit = '') => {
    const v = n(val), lo = n(min), hi = n(max);
    return { type: 'value', name, value: val + (unit ? ' ' + unit : ''), num: v, min: lo, max: hi, norm: `Norma: ${min} - ${max}`, status: v > hi ? 'above' : v < lo ? 'below' : 'ok' };
  };
  const s = (name, val, min, max, unit = '') => ({ ...p(name, val, min, max, unit), type: 'scale' });
  const q = (name, positive = false, klasa = 3) => ({ type: 'qual', name, status: positive ? 'pos' : 'neg', statusLabel: positive ? `Dodatni • klasa ${klasa}` : 'Ujemny' });

  const MORFOLOGIA = [
    { id: 'g1', title: 'Parametry główne', params: [
      p('WBC (Leukocyty)', '11,2', '4,0', '10,0', '10^9/L'),
      p('RBC (Erytrocyty)', '4,8', '4,2', '5,4', '10^12/L'),
      p('HGB (Hemoglobina)', '13,9', '12,0', '16,0', 'g/dl'),
      p('HCT (Hematokryt)', '41,5', '37', '47', '%'),
      p('PLT (Płytki krwi)', '265', '150', '400', '10^9/L'),
    ] },
    { id: 'g2', title: 'Krwinki białe', params: [
      s('Neutrocyty (NEU)', '3,2', '1,90', '7,00', '10^9/L'),
      s('Limfocyty (LYMPH)', '3,0', '1,10', '4,50', '10^9/L'),
      s('Monocyty (MONO)', '0,9', '0,20', '0,80', '10^9/L'),
      s('Eozynofile (EOS)', '0,2', '0,02', '0,50', '10^9/L'),
    ] },
    { id: 'g3', title: 'Wskaźniki czerwonokrwinkowe', params: [
      p('MCV', '88', '80', '100', 'fl'),
      p('MCH', '29,5', '27,0', '33,0', 'pg'),
      p('MCHC', '33,5', '32,0', '36,0', 'g/dl'),
      p('RDW', '15,2', '11,5', '14,5', '%'),
      p('MPV', '10,2', '7,5', '11,5', 'fl'),
    ] },
  ];

  const ALERGIA = [
    { id: 'a1', title: 'Pokarmowe', params: [q('Mleko krowie (f2)'), q('Jajko białko (f1)', true, 3), q('Orzech laskowy (f17)'), q('Pszenica (f4)')] },
    { id: 'a2', title: 'Wziewne', params: [q('Roztocze kurzu domowego (d1)', true, 4), q('Brzoza (t3)', true, 2), q('Trawy — mieszanka (gx)'), q('Pleśń Alternaria (m6)')] },
    { id: 'a3', title: 'Zwierzęta i kontaktowe', params: [q('Kot — nabłonek (e1)', true, 2), q('Pies — nabłonek (e5)'), q('Lateks (k82)'), q('Nikiel')] },
  ];

  const META = {
    krew: { material: 'Krew żylna (EDTA)', method: 'Cytometria przepływowa', lab: 'ALAB Warszawa, ul. Zawodzie 22', collected: '12 marca 2026 • 08:40', ready: '12 marca 2026 • 15:10', note: 'Wartości referencyjne zależą od wieku, płci i metody oznaczenia' },
    surowica: { material: 'Krew żylna (surowica)', method: 'Chemiluminescencja (CLIA)', lab: 'ALAB Warszawa, ul. Zawodzie 22', collected: '12 marca 2026 • 08:40', ready: '13 marca 2026 • 11:20', note: 'Wartości referencyjne zależą od wieku, płci i metody oznaczenia' },
    panel: { material: 'Krew żylna (surowica)', method: 'Immunoblot (ALEX2)', lab: 'ALAB Warszawa, ul. Zawodzie 22', collected: '4 października 2025 • 07:50', ready: '11 października 2025 • 14:05', note: 'Klasa wyniku opisuje siłę reakcji, nie nasilenie objawów' },
  };

  const RESULTS = [
    { id: 'r1', title: 'Morfologia krwi obwodowej', person: 'Anna Kowalska', date: '12 marca 2026', year: '2026', isNew: true, meta: META.krew, groups: MORFOLOGIA },
    { id: 'r2', title: 'Witamina D (25-OH)', person: 'Anna Kowalska', date: '12 marca 2026', year: '2026', meta: META.surowica, groups: [
      { id: 'v1', title: 'Witaminy', params: [s('Witamina D 25(OH)', '18,4', '30,0', '50,0', 'ng/ml')] },
    ] },
    { id: 'r3', title: 'Lipidogram', person: 'Anna Kowalska', date: '2 lutego 2026', year: '2026', meta: META.surowica, groups: [
      { id: 'l1', title: 'Profil lipidowy', params: [
        p('Cholesterol całkowity', '182', '114', '190', 'mg/dl'),
        p('Cholesterol HDL', '62', '45', '80', 'mg/dl'),
        p('Cholesterol LDL', '104', '60', '115', 'mg/dl'),
        p('Trójglicerydy', '92', '40', '150', 'mg/dl'),
      ] },
    ] },
    { id: 'r4', title: 'Morfologia z oceną mikroskopową rozmazu', person: 'Anna Kowalska', date: '14 listopada 2025', year: '2025', meta: META.krew, groups: [
      { id: 'm1', title: 'Parametry główne', params: [
        p('WBC (Leukocyty)', '6,4', '4,0', '10,0', '10^9/L'),
        p('RBC (Erytrocyty)', '4,6', '4,2', '5,4', '10^12/L'),
        p('HGB (Hemoglobina)', '13,4', '12,0', '16,0', 'g/dl'),
        p('PLT (Płytki krwi)', '244', '150', '400', '10^9/L'),
      ] },
      { id: 'm2', title: 'Ocena mikroskopowa', params: [q('Nieprawidłowe formy komórek')] },
    ] },
    { id: 'r5', title: 'Panel alergiczny ALEX2', person: 'Anna Kowalska', date: '11 października 2025', year: '2025', meta: META.panel, groups: ALERGIA },
    { id: 'r6', title: 'TSH – tyreotropina III generacji', person: 'Anna Kowalska', date: '18 sierpnia 2025', year: '2025', meta: META.surowica, groups: [
      { id: 't1', title: 'Tarczyca', params: [s('TSH', '1,84', '0,27', '4,20', 'mIU/l')] },
    ] },
    { id: 'r7', title: 'Ferrytyna', person: 'Anna Kowalska', date: '18 sierpnia 2025', year: '2025', meta: META.surowica, groups: [
      { id: 'f1', title: 'Gospodarka żelazem', params: [s('Ferrytyna', '9,60', '13,0', '150,0', 'ng/ml'), p('Żelazo', '58', '37', '145', 'µg/dl')] },
    ] },
  ];

  // FAQ — pytania i pierwsza odpowiedź 1:1 z arkusza „FAQ” 2265:66487; pozostałe odpowiedzi to treść prototypowa
  const FAQ = [
    { id: 'q1', q: 'Jak przygotować się do badania morfologii krwi?', a: 'Do badania należy zgłosić się na czczo (8-12 godzin bez jedzenia), najlepiej w godzinach porannych. Dopuszczalne jest picie niewielkich ilości niegazowanej wody. Należy unikać intensywnego wysiłku fizycznego, alkoholu i palenia papierosów przed badaniem.' },
    { id: 'q2', q: 'Jak długo będę czekał na wyniki?', a: 'Morfologia krwi jest gotowa zwykle w ciągu jednego dnia roboczego od pobrania. Gdy wynik będzie dostępny, znajdziesz go w zakładce Wyniki, a my powiadomimy Cię o tym w aplikacji.' },
    { id: 'q3', q: 'Czy potrzebuję skierowania?', a: 'Nie, badania kupione w aplikacji wykonujesz bez skierowania. Skierowanie od lekarza jest potrzebne tylko wtedy, gdy badanie ma być rozliczone w ramach Narodowego Funduszu Zdrowia.' },
    { id: 'q4', q: 'Ile mam czasu na wykonanie badania?', a: 'Na wykonanie opłaconego badania masz 60 dni od zakupu. Termin znajdziesz w szczegółach zamówienia, a przed jego upływem przypomnimy Ci o wizycie w Punkcie Pobrań.' },
  ];

  // Ekrany otwierane jako webview (treść pobierana ze strony ALAB — w prototypie zaślepka).
  // `about` = co znajdzie się w tej przestrzeni w gotowej aplikacji; wchodzi do treści zaślepki,
  // żeby uczestnik badania wiedział, gdzie trafił, a nie widział samego słowa „placeholder”.
  const WEBVIEWS = {
    desc: { title: 'Opis badania', about: 'pełny opis badania: po co się je wykonuje, jak przygotować się do pobrania i jak czytać wynik' },
    faq: { title: 'Najczęstsze pytania', about: 'odpowiedzi na pytania, które Pacjenci zadają najczęściej: przygotowanie, czas oczekiwania i interpretacja wyniku' },
    club: { title: 'ALAB club', about: 'zasady ALAB club: 5% taniej, voucher po pierwszym badaniu, oferta urodzinowa i warunki uczestnictwa' },
    terms: { title: 'Regulamin', about: 'Regulamin aplikacji i Politykę prywatności w pełnej wersji' },
  };

  const isOk = (x) => x.status === 'ok' || x.status === 'neg';
  const allParams = (r) => r.groups.reduce((acc, g) => acc.concat(g.params), []);
  const summary = (r) => {
    const list = allParams(r), ok = list.filter(isOk).length, qual = list.some(x => x.type === 'qual');
    return { total: list.length, ok, abnormal: list.length - ok, qual };
  };

  window.RESULTS_DATA = { RESULTS, FAQ, WEBVIEWS, allParams, summary, isOk };
})();
