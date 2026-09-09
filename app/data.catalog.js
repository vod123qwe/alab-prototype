/* ALAB • Prototyp — katalog badań i pakietów (DANE PRZYKŁADOWE do klikania, nie cennik ALAB).
   Nazwy i część cen pochodzą z masterów Figmy („Listing • Kategoria”, „Produkt • Badanie/Pakiet”, „Sklep • Strona główna”),
   reszta to placeholdery o realistycznym brzmieniu. Opisy skrócone; szczegóły uzupełnimy danymi z API (GET /api/services).
   Konwencje: ceny jako liczby (PLN), formatowanie zawsze z groszami (leksykon ALAB), `types` = sposoby realizacji:
   punkt = Punkt Pobrań, dom = ALAB w domu (pobranie krwi przez pielęgniarkę), wysylka = zestaw wysyłkowy (samodzielne pobranie próbki). */
(function () {
  const zl = (n) => n.toFixed(2).replace('.', ',') + ' zł';

  // 12 kategorii i 62 podkategorie z drzewka klienta („Nowe drzewko kategorii final 1.pdf”, 2026-07-29),
  // przepisane 1:1 z najnowszego POC (js/data.js → CATEGORY_TREE). Ikony ustalone w POC 2026-08-11.
  // `subs` to pełna lista podkategorii kategorii; w filtrach pokazujemy te, które mają produkty.
  const CATEGORIES = [
    { id: 'ogolne', icon: 'test-tube', label: 'Badania i pakiety ogólne', subs: ['Profilaktyka podstawowa', 'Profilaktyka rozszerzona', 'Pakiety wiekowe (20+, 30+, itd.)', 'Pakiety dla kobiet', 'Pakiety dla mężczyzn', 'Zdrowie dziecka', 'Badania z moczu', 'Badania z kału', 'Pakiety prezentowe'] },
    { id: 'hormony', icon: 'medicine-bottle', label: 'Hormony', subs: ['Tarczyca', 'Hormony kobiece', 'Hormony męskie', 'Diagnostyka płodności'] },
    { id: 'alergie', icon: 'fork-knife', label: 'Alergie i nietolerancje pokarmowe', subs: ['Alergie wziewne', 'Alergie kontaktowe, jad owadów', 'Panele alergiczne', 'Alergie pokarmowe', 'Nietolerancje pokarmowe'] },
    { id: 'pokarmowy', icon: 'bubbles', label: 'Układ pokarmowy', subs: ['Jelita (m.in. mikrobiota, stany zapalne)', 'Wątroba', 'Trzustka', 'Celiakia i gluten', 'Bóle brzucha / trawienie'] },
    { id: 'krazenie', icon: 'heart-rate', label: 'Układ krążenia i Hematologia', subs: ['Nadciśnienie tętnicze', 'Cholesterol i lipidy', 'Ryzyko sercowo-naczyniowe', 'Zaburzenia krzepnięcia krwi', 'Anemia / niedokrwistość'] },
    { id: 'cukrzyca', icon: 'syringe', label: 'Cukrzyca i Otyłość', subs: ['Diagnostyka cukrzycy i insulinooporności', 'Otyłość i apetyt'] },
    { id: 'ciaza', icon: 'heart', label: 'Ciąża, Zdrowie intymne i Układ moczowy', subs: ['Choroby przenoszone drogą płciową', 'Profilaktyka ginekologiczna (HPV, cytologia)', 'Diagnostyka HPV', 'Ciąża i planowanie ciąży', 'Diagnostyka prenatalna', 'Zaburzenia erekcji', 'Układ moczowy i nerki'] },
    { id: 'genetyka', icon: 'dna', label: 'Genetyka i Nowotwory', subs: ['Testy pokrewieństwa', 'Choroby genetyczne', 'Badania nowotworu pomagające dobrać leczenie', 'Ryzyko zachorowania na nowotwór', 'Predyspozycje genetyczne', 'Problemy z płodnością', 'Badania prekoncepcyjne', 'Markery nowotworowe'] },
    { id: 'infekcje', icon: 'virus', label: 'Infekcje i choroby zakaźne', subs: ['Infekcje bakteryjne', 'Infekcje wirusowe', 'Odporność i testy combo', 'Po infekcji', 'Borelioza', 'Choroby tropikalne', 'Pasożyty'] },
    { id: 'lifestyle', icon: 'mirror', label: 'Lifestylowe i Uroda', subs: ['Witaminy i minerały', 'Skóra, włosy i paznokcie', 'Ekspozycja środowiskowa (metale ciężkie, środowisko pracy)', 'Długowieczność'] },
    { id: 'psychika', icon: 'user', label: 'Zdrowie psychiczne', subs: ['Stres i zaburzenia psychiczne', 'Zaburzenia snu', 'Przewlekłe zmęczenie'] },
    { id: 'reuma', icon: 'tube', label: 'Reumatologia i Dermatologia', subs: ['Problemy skórne', 'Reumatologia', 'Osteoporoza'] },
  ];

  const PREP = {
    Krew: ['Na czczo 8-12 h', 'Rano, dobrze nawodniony'],
    Mocz: ['Pierwsza poranna próbka moczu', 'Pojemnik jednorazowy z apteki lub Punktu Pobrań'],
    Kał: ['Próbka z jednego wypróżnienia, wielkości orzecha', 'Dostarcz do laboratorium w ciągu 24 h'],
    Wymaz: ['Nie myj zębów i nie jedz 2 h przed pobraniem', 'Pobranie zgodnie z instrukcją w zestawie'],
    Ślina: ['Próbki o wskazanych godzinach dnia', 'Nie jedz i nie pij 30 min przed pobraniem'],
  };
  const CODE = { discount: '-20%', code: 'JESIEN20' };
  const BLOOD = ['punkt', 'dom'];
  const KIT = ['punkt', 'wysylka'];

  // t(id, title, cat, sub, price, opcje) — badanie; opcje: old, code, premium, unavailableAt, material, types, tat, symbol, icd, desc, prep, popular, keywords
  // keywords = dodatkowe frazy, po których badanie ma się znaleźć w wyszukiwarce (potoczne nazwy, skróty, materiał)
  const t = (id, title, cat, sub, price, o = {}) => ({
    id, kind: 'test', title, cat, sub, price, material: 'Krew', types: BLOOD, tat: '1 dzień roboczy', symbol: id.replace('t-', '').toUpperCase(),
    desc: `${title} to badanie laboratoryjne wykonywane z materiału: ${(o.material || 'krew').toLowerCase()}. Wynik pomaga ocenić stan zdrowia i wspiera diagnostykę zgodnie z zaleceniem lekarza.`,
    ...o, prep: o.prep || PREP[o.material || 'Krew'],
  });
  // p(id, title, cat, sub, price, components, opcje) — pakiet
  const p = (id, title, cat, sub, price, components, o = {}) => ({
    id, kind: 'package', title, cat, sub, price, components, types: BLOOD, tat: '2 dni robocze', symbol: id.replace('p-', 'PK').toUpperCase(),
    desc: `${title} łączy badania, które lekarze najczęściej zlecają razem. Kupując w pakiecie, płacisz mniej niż za każde badanie osobno.`,
    ...o, prep: o.prep || PREP.Krew,
  });

  const PRODUCTS = [
    // ---- Badania i pakiety ogólne ----
    t('t-ob', 'Odczyn Biernackiego (OB)', 'ogolne', 'Profilaktyka podstawowa', 14.00, { icd: 'C59' }),
    t('t-crp', 'CRP – białko C-reaktywne', 'infekcje', 'Infekcje bakteryjne', 28.00, { also: [['ogolne', 'Profilaktyka podstawowa']], popular: true, icd: 'I81', keywords: ['crp', 'stan zapalny', 'zapalenie', 'badanie krwi', 'krew'], desc: 'CRP to białko ostrej fazy, którego stężenie rośnie w stanach zapalnych i infekcjach. Badanie pomaga ocenić nasilenie zapalenia i skuteczność leczenia.' }),
    t('t-glu', 'Glukoza na czczo w surowicy', 'cukrzyca', 'Diagnostyka cukrzycy i insulinooporności', 15.00, { also: [['ogolne', 'Profilaktyka podstawowa']], popular: true, icd: 'L43', keywords: ['glukoza', 'cukier', 'cukrzyca', 'badanie krwi', 'krew'], desc: 'Podstawowe badanie w kierunku cukrzycy i zaburzeń gospodarki węglowodanowej. Wykonuj rano, na czczo, po 8-12 godzinach od ostatniego posiłku.' }),
    // morfologia świadomie NIE na początku listy — zadaniem uczestnika jest ją znaleźć (plan badania, zadanie 3)
    t('t-morf', 'Morfologia krwi', 'krazenie', 'Anemia / niedokrwistość', 21.70, { also: [['ogolne', 'Profilaktyka podstawowa']], symbol: 'MORF', icd: 'C55',
      keywords: ['morfologia', 'morfo', 'badanie krwi', 'krew', 'krwi', 'cbc', 'hematologia', 'mrf'],
      desc: 'Morfologia krwi obwodowej to fundamentalne i najczęściej wykonywane badanie laboratoryjne. Daje pełną ocenę krwinek czerwonych, białych i płytek krwi.' }),
    t('t-krea', 'Kreatynina', 'ciaza', 'Układ moczowy i nerki', 18.00, { icd: 'M37' }),
    t('t-alt', 'ALT – aminotransferaza alaninowa', 'ogolne', 'Profilaktyka rozszerzona', 16.00, { icd: 'I17' }),
    t('t-mocz', 'Badanie ogólne moczu', 'ciaza', 'Układ moczowy i nerki', 15.00, { also: [['ogolne', 'Badania z moczu']], material: 'Mocz', types: ['punkt'], icd: 'A01' }),
    t('t-witd', 'Witamina D 25(OH) – metabolit', 'lifestyle', 'Witaminy i minerały', 89.00, { unavailableAt: 'punkt', popular: true, tat: '2 dni robocze', icd: 'O91',
      desc: 'Oznaczenie 25(OH)D pokazuje zaopatrzenie organizmu w witaminę D. Niedobór jest częsty w Polsce, zwłaszcza od października do kwietnia.' }),
    t('t-b12', 'Witamina B12', 'lifestyle', 'Witaminy i minerały', 39.00, { icd: 'O83' }),
    p('p-tarcz', 'Pakiet tarczycowy podstawowy', 'hormony', 'Tarczyca', 68.00, ['t-tsh', 't-ft4', 't-ft3', 't-atpo'], { old: 85.00, code: CODE, popular: true, symbol: 'PKTARPO',
      desc: 'Tarczyca jest niewielkim gruczołem produkującym hormony mające istotny wpływ na przemianę materii i regulację pracy wielu narządów. Pakiet ocenia jej funkcję w podstawowym zakresie.',
      prep: ['Na czczo, rano - TSH wykazuje rytm dobowy. Leki na tarczycę przyjmij po pobraniu.'] }),
    // BEZ morfologii (pakiet jest na ekranie głównym — patrz README „Pod badania z użytkownikami”); suma składowych 178,08 zł
    p('p-zdrowie', 'Pakiet Zdrowie podstawowy', 'ogolne', 'Profilaktyka podstawowa', 149.00, ['t-fe', 't-ob', 't-crp', 't-glu', 't-krea', 't-alt', 't-lip', 't-tsh'], { popular: true }),
    p('p-pods', 'Pakiet badań podstawowych', 'ogolne', 'Profilaktyka podstawowa', 129.00, ['t-morf', 't-ob', 't-crp', 't-glu', 't-lip', 't-krea', 't-alt', 't-tsh', 't-mocz'], { types: ['punkt'] }),
    // Pakiet Sport: 6 składowych i BEZ morfologii — plan badania niemoderowanego (zadanie 2 pyta o liczbę badań,
    // a morfologia w pakiecie dawałaby obejście zadania „znajdź morfologię”). Suma składowych 245,40 zł → pakiet 199,00 zł.
    p('p-sport', 'Pakiet Sport', 'ogolne', 'Profilaktyka rozszerzona', 199.00, ['t-crp', 't-ferr', 't-fe', 't-witd', 't-b12', 't-krea']),
    p('p-kobiet', 'Pakiet dla kobiet', 'ogolne', 'Pakiety dla kobiet', 279.00, ['t-morf', 't-tsh', 't-ferr', 't-witd', 't-prl', 't-e2', 't-glu', 't-lip']),

    // ---- Hormony ----
    t('t-tsh', 'TSH – tyreotropina III generacji', 'hormony', 'Tarczyca', 29.68, { old: 37.10, code: CODE, popular: true, symbol: 'TSH', icd: 'L69', keywords: ['tsh', 'tarczyca', 'tyreotropina', 'hormony', 'badanie krwi', 'krew'],
      desc: 'TSH to hormon przysadki sterujący pracą tarczycy. Jest badaniem pierwszego wyboru przy podejrzeniu niedoczynności lub nadczynności tarczycy.', prep: ['Na czczo, rano - TSH wykazuje rytm dobowy', 'Leki na tarczycę przyjmij po pobraniu'] }),
    t('t-ft4', 'FT4 – wolna tyroksyna', 'hormony', 'Tarczyca', 39.20, { icd: 'O69' }),
    t('t-ft3', 'FT3 – wolna trijodotyronina', 'hormony', 'Tarczyca', 39.20, { icd: 'O55' }),
    t('t-atpo', 'Anty-TPO – przeciwciała przeciw peroksydazie tarczycowej', 'hormony', 'Tarczyca', 55.30, { premium: true, icd: 'O09' }),
    t('t-prl', 'Prolaktyna (PRL)', 'hormony', 'Hormony kobiece', 46.20, { icd: 'N59' }),
    t('t-e2', 'Estradiol (E2)', 'hormony', 'Hormony kobiece', 36.96, { old: 46.20, code: CODE, icd: 'K99' }),
    t('t-amh', 'AMH – hormon antymüllerowski', 'hormony', 'Diagnostyka płodności', 149.00, { unavailableAt: 'punkt', tat: '5 dni roboczych', icd: 'I43' }),
    t('t-testo', 'Testosteron całkowity', 'hormony', 'Hormony męskie', 35.70, { icd: 'M67', desc: 'Testosteron całkowity to podstawowe badanie hormonalne u mężczyzn. Pomaga ocenić libido, samopoczucie, masę mięśniową i płodność.' }),
    p('p-tarcz-roz', 'Pakiet tarczycowy rozszerzony', 'hormony', 'Tarczyca', 127.20, ['t-tsh', 't-ft4', 't-ft3', 't-atpo', 't-morf'], { old: 159.00, code: CODE }),
    p('p-meno', 'Pakiet hormony kobiece – menopauza', 'hormony', 'Hormony kobiece', 111.30, ['t-prl', 't-e2', 't-tsh', 't-amh'], { premium: true }),

    // ---- Alergie i nietolerancje ----
    t('t-ige', 'IgE całkowite', 'alergie', 'Panele alergiczne', 35.00, { icd: 'L89' }),
    t('t-alex', 'Panel alergiczny ALEX2 – 295 alergenów', 'alergie', 'Panele alergiczne', 899.00, { tat: '7 dni roboczych', icd: 'L91',
      desc: 'Molekularny panel alergologiczny oceniający uczulenie na niemal 300 alergenów wziewnych, pokarmowych i kontaktowych w jednym pobraniu krwi.' }),
    t('t-igg', 'Panel nietolerancji pokarmowych IgG – 44 składniki', 'alergie', 'Nietolerancje pokarmowe', 349.00, { types: ['punkt', 'dom', 'wysylka'], popular: true, tat: '10 dni roboczych',
      desc: 'Ocena swoistych przeciwciał IgG wobec 44 produktów spożywczych. W zestawie wysyłkowym próbkę suchej kropli krwi pobierasz samodzielnie.' }),
    p('p-alergia', 'Pakiet alergiczny wziewny', 'alergie', 'Alergie wziewne', 72.00, ['t-ige', 't-morf', 't-crp']),

    // ---- Układ pokarmowy ----
    t('t-kalpro', 'Kalprotektyna w kale', 'pokarmowy', 'Jelita (m.in. mikrobiota, stany zapalne)', 89.00, { material: 'Kał', types: KIT, popular: true, tat: '3 dni robocze', icd: 'I55' }),
    t('t-krewut', 'Krew utajona w kale', 'pokarmowy', 'Jelita (m.in. mikrobiota, stany zapalne)', 25.00, { material: 'Kał', types: KIT, icd: 'A17' }),
    t('t-hpyl', 'Helicobacter pylori – antygen w kale', 'pokarmowy', 'Jelita (m.in. mikrobiota, stany zapalne)', 45.00, { material: 'Kał', types: KIT, icd: 'U15' }),
    t('t-celiakia', 'Celiakia – przeciwciała anty-tTG IgA', 'pokarmowy', 'Celiakia i gluten', 69.00, { tat: '3 dni robocze', icd: 'N87' }),
    p('p-jelita', 'Pakiet zdrowe jelita', 'pokarmowy', 'Jelita (m.in. mikrobiota, stany zapalne)', 129.00, ['t-kalpro', 't-krewut', 't-hpyl'], { types: KIT, popular: true, prep: PREP.Kał }),

    // ---- Układ krążenia i Hematologia ----
    t('t-lip', 'Lipidogram', 'krazenie', 'Cholesterol i lipidy', 35.00, { also: [['ogolne', 'Profilaktyka podstawowa']], popular: false, icd: 'I99', desc: 'Lipidogram ocenia cholesterol całkowity, frakcje HDL i LDL oraz trójglicerydy. To podstawa oceny ryzyka chorób sercowo-naczyniowych.' }),
    t('t-chol', 'Cholesterol całkowity', 'krazenie', 'Cholesterol i lipidy', 21.60, { old: 27.00, code: CODE, icd: 'I99' }),
    t('t-hcy', 'Homocysteina', 'krazenie', 'Ryzyko sercowo-naczyniowe', 59.00, { icd: 'K99' }),
    t('t-ferr', 'Ferrytyna – ocena zapasów żelaza', 'krazenie', 'Anemia / niedokrwistość', 49.00, { premium: true, popular: true, symbol: 'FERR', icd: 'L05', keywords: ['ferrytyna', 'zelazo', 'anemia', 'niedokrwistosc', 'badanie krwi', 'krew'],
      desc: 'Ferrytyna odzwierciedla zapasy żelaza w organizmie. Niski poziom wyprzedza niedokrwistość, wysoki może wskazywać na stan zapalny.' }),
    t('t-fe', 'Żelazo w surowicy', 'krazenie', 'Anemia / niedokrwistość', 22.40, { icd: 'O95' }),
    t('t-ret', 'Oznaczanie odsetka retikulocytów', 'krazenie', 'Anemia / niedokrwistość', 21.00, { premium: true, icd: 'C69' }),
    p('p-serce', 'Pakiet serce i naczynia', 'krazenie', 'Ryzyko sercowo-naczyniowe', 99.00, ['t-lip', 't-hcy', 't-crp', 't-glu']),

    // ---- Cukrzyca i Otyłość ----
    t('t-hba1c', 'HbA1c – hemoglobina glikowana', 'cukrzyca', 'Diagnostyka cukrzycy i insulinooporności', 39.00, { icd: 'L55', desc: 'HbA1c pokazuje średnie stężenie glukozy z ostatnich 2-3 miesięcy. Służy do rozpoznania cukrzycy i kontroli jej leczenia.', prep: ['Nie musisz być na czczo'] }),
    t('t-ins', 'Insulina', 'cukrzyca', 'Diagnostyka cukrzycy i insulinooporności', 39.00, { icd: 'L97' }),
    t('t-leptyna', 'Leptyna – hormon sytości', 'cukrzyca', 'Otyłość i apetyt', 89.00, { tat: '5 dni roboczych', icd: 'L99', desc: 'Leptyna reguluje uczucie sytości. Badanie pomaga zrozumieć zaburzenia apetytu i trudności z redukcją masy ciała.' }),
    p('p-cukrz', 'Pakiet cukrzycowy', 'cukrzyca', 'Diagnostyka cukrzycy i insulinooporności', 79.00, ['t-glu', 't-hba1c', 't-ins']),

    // ---- Ciąża, Zdrowie intymne i Układ moczowy ----
    t('t-bhcg', 'Beta-HCG – gonadotropina kosmówkowa', 'ciaza', 'Ciąża i planowanie ciąży', 39.00, { icd: 'L46' }),
    t('t-prog', 'Progesteron', 'ciaza', 'Ciąża i planowanie ciąży', 39.00, { icd: 'N55' }),
    t('t-toxo', 'Toksoplazmoza IgG', 'ciaza', 'Diagnostyka prenatalna', 45.00, { icd: 'X41' }),
    p('p-ciaza', 'Pakiet dla kobiet w ciąży', 'ciaza', 'Ciąża i planowanie ciąży', 159.00, ['t-morf', 't-glu', 't-tsh', 't-toxo', 't-mocz', 't-ferr'], { types: ['punkt'] }),

    // ---- Genetyka i Nowotwory ----
    t('t-brca', 'Badanie genetyczne BRCA1 / BRCA2', 'genetyka', 'Ryzyko zachorowania na nowotwór', 599.00, { material: 'Wymaz', types: KIT, tat: '14 dni roboczych',
      desc: 'Analiza najczęstszych mutacji w genach BRCA1 i BRCA2 związanych z dziedzicznym ryzykiem raka piersi i jajnika. Materiał: wymaz z policzka.' }),
    t('t-mthfr', 'MTHFR – mutacje C677T i A1298C', 'genetyka', 'Predyspozycje genetyczne', 199.00, { material: 'Wymaz', types: KIT, tat: '10 dni roboczych' }),
    t('t-psa', 'PSA całkowity', 'genetyka', 'Markery nowotworowe', 39.00, { icd: 'I61' }),
    t('t-ca125', 'CA 125', 'genetyka', 'Markery nowotworowe', 55.00, { icd: 'I45' }),

    // ---- Infekcje i choroby zakaźne ----
    t('t-hiv', 'HIV Ag/Ab – test IV generacji', 'infekcje', 'Infekcje wirusowe', 45.00, { also: [['ciaza', 'Choroby przenoszone drogą płciową']], icd: 'F91' }),
    t('t-bor', 'Borelioza IgM / IgG', 'infekcje', 'Borelioza', 79.00, { tat: '3 dni robocze', icd: 'S21' }),
    t('t-hpv', 'HPV – genotypowanie 14 typów wysokiego ryzyka', 'ciaza', 'Diagnostyka HPV', 249.00, { also: [['infekcje', 'Infekcje wirusowe']], material: 'Wymaz', types: KIT, popular: true, tat: '7 dni roboczych' }),
    t('t-chl', 'Chlamydia trachomatis – PCR', 'infekcje', 'Infekcje bakteryjne', 129.00, { also: [['ciaza', 'Choroby przenoszone drogą płciową']], material: 'Wymaz', types: KIT, tat: '5 dni roboczych' }),
    p('p-std', 'Pakiet chorób przenoszonych drogą płciową', 'ciaza', 'Choroby przenoszone drogą płciową', 299.00, ['t-hiv', 't-chl', 't-hpv'], { also: [['infekcje', 'Infekcje wirusowe']], types: ['punkt'], tat: '7 dni roboczych' }),

    // ---- Lifestylowe i Uroda ----
    t('t-mikro', 'Mikrobiom jelitowy – analiza NGS', 'pokarmowy', 'Jelita (m.in. mikrobiota, stany zapalne)', 499.00, { material: 'Kał', types: KIT, popular: true, tat: '21 dni roboczych' }),
    t('t-kort-slina', 'Kortyzol – profil dzienny ze śliny', 'lifestyle', 'Długowieczność', 149.00, { material: 'Ślina', types: KIT, tat: '5 dni roboczych' }),
    t('t-biotyna', 'Biotyna (witamina B7)', 'lifestyle', 'Skóra, włosy i paznokcie', 119.00, { tat: '7 dni roboczych' }),
    p('p-uroda', 'Pakiet Uroda – skóra, włosy, paznokcie', 'lifestyle', 'Skóra, włosy i paznokcie', 189.00, ['t-ferr', 't-witd', 't-b12', 't-tsh', 't-biotyna']),

    // ---- Zdrowie psychiczne ----
    t('t-kort', 'Kortyzol', 'psychika', 'Stres i zaburzenia psychiczne', 35.00, { icd: 'M31', prep: ['Rano, między 7:00 a 9:00', 'Unikaj wysiłku i stresu przed pobraniem'] }),
    t('t-neuro', 'Profil neuroprzekaźników w moczu', 'psychika', 'Stres i zaburzenia psychiczne', 349.00, { material: 'Mocz', types: KIT, tat: '14 dni roboczych' }),
    p('p-stres', 'Pakiet Stres i zmęczenie', 'psychika', 'Przewlekłe zmęczenie', 149.00, ['t-kort', 't-tsh', 't-morf', 't-ferr', 't-b12']),

    // ---- Reumatologia i Dermatologia ----
    t('t-rf', 'Czynnik reumatoidalny (RF)', 'reuma', 'Reumatologia', 29.00, { icd: 'K21' }),
    t('t-ccp', 'Anty-CCP – przeciwciała przeciw cyklicznemu cytrulinowanemu peptydowi', 'reuma', 'Reumatologia', 89.00, { tat: '3 dni robocze', icd: 'N63' }),
    t('t-ana', 'ANA – przeciwciała przeciwjądrowe', 'reuma', 'Reumatologia', 79.00, { tat: '5 dni roboczych', icd: 'N81' }),
    t('t-hla', 'HLA-B27', 'reuma', 'Reumatologia', 199.00, { tat: '10 dni roboczych', icd: 'O33' }),
    t('t-wapn', 'Wapń całkowity', 'reuma', 'Osteoporoza', 12.60, { icd: 'M13', desc: 'Wapń całkowity to podstawowy parametr w diagnostyce osteoporozy i zaburzeń gospodarki mineralnej kości.' }),
    p('p-reuma', 'Pakiet reumatologiczny', 'reuma', 'Reumatologia', 169.00, ['t-rf', 't-ccp', 't-ana', 't-ob', 't-crp']),
  ];

  const byId = (id) => PRODUCTS.find(x => x.id === id);
  // sanity: składowe pakietów muszą istnieć
  PRODUCTS.filter(x => x.kind === 'package').forEach(x => x.components.forEach(c => { if (!byId(c)) console.warn('CATALOG: brak składowej', c, 'w', x.id); }));

  window.CATALOG = { CATEGORIES, PRODUCTS, byId, zl };
})();
