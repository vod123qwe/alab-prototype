# DS „❖ Cells" — lista zmian copy

**WDROŻONE W FIGMIE 2026-09-09.** Decyzje Jarka naniesione bezpośrednio na komponenty w pliku
`Alab • Design system`. Zrealizowane pozycje mają ✅, pominięte ⏭, nowe znaleziska są w sekcji na końcu.

Plik: `Alab • Design system` (`xnsgOdaVVKCkzjyStSOdVv`), strona **„  ├  ❖ Cells"** (`24:10`), odczyt 2026-09-09.
Weryfikacja wobec `ux-writing-lexicon`, ustaleń klienta i tego, co już jest w prototypie (wersja 2026.09.09-111).

Legenda kolumny **Status**:

- 🔴 **łamie zakaz klienta** — słowo, którego prawnicy ALAB nie chcą w interfejsie
- 🟠 **rozjazd z leksykonem** — reguła zapisana, komponent jej nie trzyma
- 🔵 **rozjazd DS ↔ mapa/prototyp** — dwa źródła mówią co innego, trzeba wybrać
- ⚪ **porządek** — nie treść, ale myli przy kolejnych rundach

Kolumna **W prototypie** mówi, czy my już to mamy poprawione.

---

## CellTestResult/CarouselALAB · `1034:414`

- ✅ 🔴 **„5% dodatkowej zniżki" → „5% taniej, zawsze"** — słowo „zniżka" jest zakazane (leksykon 321, prawnicy klienta). To najpilniejsza pozycja na tej stronie, bo siedzi w komponencie DS i rozejdzie się na każdy ekran, który go użyje. **W prototypie: poprawione.**
- ✅ 🟠 **„na całą ofertę ALAB laboratoria" → „Na całą ofertę, w każdym punkcie."** — brzmienie z mapy M3 3.4. **W prototypie: poprawione.**
- ✅ 🟠 **„Specjalna niespodzianka w Twoim miesiącu" → „Specjalna oferta w miesiącu urodzin."** — mapa M3 3.4 wybrała wersję konkretniejszą. **W prototypie: poprawione.**
- ⏭ 🟠 **„Voucher 20%" → „Voucher 20% po wykonaniu badań"** oraz **„Po wykonaniu badania na kolejne zakupy" → „Na kolejne zakupy, po pierwszym badaniu."** — mapa M3 3.4. **W prototypie: poprawione.**
- ✅ ⚪ **Spacja na końcu** stringa „5% dodatkowej zniżki ".

---

## PriceRow · `777:6266`

- ⏭ 🟠 **Znak minus zamiast dywizu w trzech z czterech stringów.** „taniej -40%", „ekstra -5%" mają dywiz; tylko „Aktywne −40% w klubie" ma prawdziwy minus (U+2212). Leksykon 109 wymaga znaku minus, tak jak w badge'u kodu „−20%". **W prototypie: U+2212 konsekwentnie we wszystkich czterech.**
- ✅ ⚪ **Kwoty bez groszy w danych przykładowych:** „952 zł", „1190 zł", „1369 zł", „120 zł". Klient wymaga groszy zawsze, także w danych (leksykon klienta, CIX). **W prototypie: wszystkie kwoty z groszami.**
- ✅ ⚪ **Wariant „No code, ALAB club member=Yes"** ma cenę główną 1369 zł i przekreśloną 120 zł — przekreślona jest niższa od głównej. Dane przykładowe, ale wariant czyta się wtedy odwrotnie.

---

## CellOrderTypeStatus · `783:7103`

- ⏭ 🟠 **„Dziś otwarte 7:00 - 11:00" → „Dziś otwarte 07:00 - 11:00"** — godziny dwucyfrowe (leksykon 3). **W prototypie: poprawione.**
- ⏭ 🟠 **„Kraków 109 zł" → „Kraków 109,00 zł"** — kwoty zawsze z groszami. **W prototypie: poprawione (u nas Warszawa, bo tam mieszka Pacjent w scenariuszu badania).**
- ✅ 🔵 **„Kraków" jako miasto domyślne.** W prototypie mamy Warszawę, żeby zgadzało się z Punktem Pobrań na Puławskiej. Do ustalenia, co jest danymi przykładowymi DS, a co scenariuszem.
- ⚪ **Nazwa wariantu „Type=Punkt pobrań"** z małą literą w „pobrań". Nazwa własna to „Punkt Pobrań" dwiema wielkimi (CXV.B). Nazwa wariantu nie jest treścią, ale wchodzi do kodu jako wartość property.

---

## CellTest · `777:6323` i CellPackage · `777:6353`

- ✅ 🔵 **„Niedostępne w wybranym punkcie" vs „Niedostępne w wybranym Punkcie Pobrań".** Mapa M3 3.1 ma wersję z małej, ale reguła nr 1 tej samej mapy mówi „Punkt Pobrań dwiema wielkimi we wszystkich formach". **W prototypie: wersja z wielkimi**, bo trzyma regułę. Do rozstrzygnięcia raz dla wszystkich miejsc.
- ⏭ 🔵 **„Materiał: Krew" → „Badanie · krew"** (i dla pakietu **„Liczba badań: 4" → „Pakiet · 4 badania"**) — kanon z leksykonu 136 i mapy M3 3.1. **W prototypie: poprawione.**
- ✅ **ButtonTiny „Zmień punkt"** w wariancie niedostępnym zgadza się z prototypem, bez ikony.
- ✅ **ButtonTiny „Dodaj" z ikoną plus** w wariancie dostępnym — odwzorowane 1:1 w prototypie.

---

## CategoryTile · `229:5187`

- ⏭ 🔵 **Wariant „More": „Pokaż wszystkie" vs „Wszystkie kategorie".** DS mówi „Pokaż wszystkie", a mapa M3 P01 i prototyp „Wszystkie kategorie". **Rekomendacja: zostawić „Wszystkie kategorie"** i poprawić DS — „Pokaż wszystkie" na kaflu nie mówi, wszystkie CO, a kafel stoi w siatce kategorii bez nagłówka nad nią.

---

## CellTestResult · `967:48`

- ✅ 🟠 **„12 Marca 2026" → „12 marca 2026"** — miesiąc z małej litery. Reguła jest w projektowym leksykonie wprost: wielka litera tylko na początku zdania lub etykiety. **W prototypie: mamy z małej**, z komentarzem w kodzie, że Figma ma inaczej.
- ✅ **BadgeStatus „Wszystko w normie"** zgadza się z prototypem.
- ⚪ **„Anna Kowalska", „Morfologia krwi obwodowej"** — dane przykładowe, bez uwag.

---

## StatusLabel · `980:93`

- ✅ Tekst idzie z property `Label` (placeholder „Status"), więc komponent nie narzuca copy. Nasze etykiety („W normie", „Powyżej normy", „Poniżej normy", „Ujemny", „Dodatni") są **nasze** i nie mają odpowiednika w DS.
- ⏭ 🔵 **Do decyzji: czy wpisać nasze etykiety do dokumentacji komponentu**, żeby nie rozjechały się między ekranami. Dziś każdy ekran może je nazwać po swojemu.

---

## Pozostałe komponenty — analiza (odczyt 2026-09-09)

Siedem komponentów, których wcześniej nie sprawdziłem. Większość trzyma tylko placeholdery slotów,
ale trzy dały realne znaleziska — w tym **dwa dowody na obronę wyjątku A2**.

### Cell · `25:1313`  · CellContent · `25:1344`  · AccordionCell · `801:6793`

- ✅ Bez uwag. Same placeholdery słotów po angielsku: „Title", „Subtitle", „Details", „Label", „Header",
  „Body text", „Top end". To nazwy pól, nie treść produktu, więc leksykon ich nie dotyczy.

### CellSelectCountry · `855:9583`

- 🟠 **„+ 48" → „+48"** — prefiks telefoniczny ze spacją po plusie. Notacja międzynarodowa (E.123) nie ma tam
  spacji, a pole telefonu w rejestracji składa z tego jeden numer. **W prototypie mamy ten sam błąd**
  (`app/app.js`, `COUNTRIES` — wszystkie jedenaście krajów). Do poprawy po obu stronach.
- ⚪ **Nazwa warstwy „ic_flag_ poland"** ma spację w środku identyfikatora.

### AccordionGroup · `974:888`

- ✅ **„Pokarmowe • 4"** — nazwa grupy parametrów z licznikiem po **dużej kropce**.
  **To pierwszy dowód, że duża kropka przy liczniku jest już konwencją DS**, a nie naszym wymysłem
  (wyjątek A2 w rejestrze odstępstw). Nikt tego komponentu nie kwestionował.

### CellParameter · `955:4401`

- ✅ **Etykiety statusów zgadzają się z prototypem 1:1:** „W normie", „Powyżej normy", „Ujemny".
  Czyli nasze nazwy nie są wymyślone — tylko StatusLabel ich nie dokumentuje, bo trzyma je w property.
- ✅ **„Dodatni • klasa 3"** — **drugi dowód na dużą kropkę** jako separator w linii w tym pliku.
- 🟠 **„Norma: 1,10 - 4,50"** — zakres z **dywizem**. Ten sam problem co „07:00 - 11:00": zakres to typowo
  półpauza. **W prototypie mamy identycznie** (`norm: \`Norma: ${min} - ${max}\``), więc do decyzji łącznie
  z godzinami — albo obie formy z dywizem, albo obie z półpauzą.
- ⚪ **„3,2 10^9/L"** — wykładnik zapisany jako `10^9` zamiast `10⁹`. **W prototypie tak samo.** Dane przyjdą
  z API, więc to raczej pytanie do devów, jak przyślą jednostki, niż decyzja copy.

### BadgeStatus · `974:948`

- ✅ **„Wszystko w normie"** zgadza się z prototypem. Bez uwag.

---

## Nowe znaleziska do decyzji (z tej rundy)

| # | Gdzie | Co | Dotyczy też prototypu |
| --- | --- | --- | --- |
| N1 | CellSelectCountry | „+ 48" → „+48" (spacja po plusie) | **tak**, wszystkie 11 krajów |
| N2 | CellParameter | „Norma: 1,10 - 4,50" — dywiz w zakresie, jak w godzinach | **tak** |
| N3 | CellParameter | „10^9/L" — notacja wykładnika | **tak**, pytanie do devów |
| N4 | PriceRow, wariant „Special + klubowicz" | cena główna 1369,00 zł i przekreślona 1190,00 zł — klubowicz powinien widzieć jako główną cenę klubową (821,40 zł), a przekreśloną regularną. **Nie ruszyłem**, bo nie było na liście — ale to ta sama usterka, którą naprawiliśmy w wariancie „No code" | nie |

---

## Podsumowanie liczbowe

| Status | Ile | Gdzie |
| --- | --- | --- |
| 🔴 łamie zakaz klienta | **1** | CarouselALAB („5% dodatkowej zniżki") |
| 🟠 rozjazd z leksykonem | **7** | CarouselALAB ×3, PriceRow ×1, CellOrderTypeStatus ×2, CellTestResult ×1 |
| 🔵 rozjazd DS ↔ mapa/prototyp | **5** | CellTest/CellPackage ×2, CategoryTile, CellOrderTypeStatus, StatusLabel |
| ⚪ porządek | **4** | PriceRow ×2, CellOrderTypeStatus, CarouselALAB |

**Dobra wiadomość:** wszystkie pozycje 🔴 i 🟠 są **już poprawione w prototypie**. Czyli prototyp jest dziś
bliżej leksykonu niż design system, i to on może służyć jako referencja przy podmianie w DS.
