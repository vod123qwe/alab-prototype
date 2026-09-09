# Weryfikacja: czy zmiany zeszły do pliku Design

> **AKTUALIZACJA 2026-09-09, po naniesieniu poprawek.** Sekcja „Co z tego wynika" na końcu zawiera
> **korektę pierwotnego wniosku o propagacji** oraz raport z wykonanych zmian.

Plik `Alab • Design` (`Qsc72CoT02rxWM4jF7aIxw`), odczyt 2026-09-09 po podmianach w DS.
Sprawdzone najpierw **mastery** (strony `🎨 Master files`), potem **flowy i warianty** (sekcje Approved
na stronach statusowych).

Metoda: sonda po konkretnych frazach — dla każdej pary „stare copy / nowe copy" skrypt sprawdza, która
wersja stoi w tekstach danego mastera albo sekcji. `NOWE` = zaktualizowane, `STARE` = nietknięte,
`OBA` = część instancji zaktualizowana, część nie.

---

## Mechanika, którą to ujawniło: override blokuje propagację

Komponenty na ekranach **są zdalne** (`remote: true`, biblioteka „Alab • Design system"), więc podmiany
w DS mają drogę do ekranów. Ale nie wszystkie doszły, i widać dokładnie dlaczego. W jednej instancji
PriceRow na masterze `Produkt • Badanie`:

| Węzeł | Treść po podmianie | Dlaczego |
| --- | --- | --- |
| `…;777:6288` | **„Najniższa cena z 30 dni: 1190,00 zł"** | brak override'u → przyjęło zmianę z DS |
| `…;777:6285` | „1190 zł" (stare) | **override na instancji** → zmiana z DS nie ma jak wejść |

Wniosek praktyczny: **każdy tekst wpisany ręcznie na ekranie zostaje stary.** Kwoty w hi-fi są
override'ami, więc „grosze wszędzie" trzeba nanieść na ekranach, nie w komponencie.

---

## Sklep

### Mastery (`🎨 Master files` → `├ Sklep`), 15 sprawdzonych

| Pozycja | Stan | Gdzie |
| --- | --- | --- |
| „Niedostępne w wybranym **Punkcie Pobrań**" | ✅ NOWE | Sklep • Strona główna, Wybór kategorii, Listing • Kategoria, Filtry • Listing kategorii |
| „**Warszawa** 109 zł" | ✅ NOWE | Typy • ALAB w domu |
| CTA kafelka „Dodaj" | ✅ NOWE | wszystkie mastery z kartami |
| „5% dodatkowej **zniżki**" (AlabBannerLarge) | 🔴 STARE | Produkt • Badanie, Produkt • Pakiet |
| „zyskaj dodatkowe **zniżki**" (mały baner klubu) | 🔴 STARE | Produkt • Badanie |
| kwoty bez groszy | ⚠️ | 9 masterów: „68 zł", „85 zł", „199 zł", „129 zł", „96 zł", „120 zł", „1190 zł" |

### Flowy i warianty (`├ 🟢 Sklep` → `🟢 Approved`, 10 ekranów)

| Pozycja | Stan |
| --- | --- |
| „Niedostępne w wybranym Punkcie Pobrań" | ✅ NOWE |
| „Warszawa 109 zł" | ✅ NOWE |
| „Najniższa cena z 30 dni: 1190,00 zł" | ✅ NOWE |
| baner klubu duży i mały | 🔴 STARE (oba ze słowem „zniżki") |
| „Aktywna zniżka klubowa" vs „Aktywne…" | ⚠️ OBA — część instancji ma jeszcze stare brzmienie jako override |
| kwoty bez groszy | ⚠️ 19 różnych |
| „ekstra -5% w klubie" z dywizem | ⚪ STARE — **zgodnie z Twoją decyzją**, znak minus był pominięty |

Sekcja `🟠 Review` (10 ekranów) nie ma żadnej z sond — czyli te ekrany nie zawierają badanych fraz.

---

## Logowanie i rejestracja

### Mastery (`🎨 Master files` → `├ Logowanie i rejestracja`), 16 sprawdzonych

**Wszystko STARE poza jedną pozycją.** To jest oczekiwane: **rozstrzygnięcia z mapy M1 nigdy nie zostały
wprowadzone w Figmie** — wdrożyliśmy je tylko w prototypie. Mapa M1 jest zleceniem na hi-fi, którego
nie wykonywaliśmy.

| Pozycja | Stan |
| --- | --- |
| „Email" → „E-mail" | STARE (Zaloguj się, Weryfikacja telefonu, Reset hasła) |
| „Nie mam numeru PESEL" → „Brak numeru PESEL" | STARE |
| „Wybierz płeć" → „Płeć" | STARE |
| „Więcej" → „rozwiń" | STARE (krok 1, Zgody • ALAB club, Wybór prefix) |
| „Dane podstawowe" → „Wpisz swoje dane, aby założyć Konto Pacjenta" | STARE |
| „konta pacjenta" → „Konta Pacjenta" | STARE |
| „Mam już konto" → „Masz już konto? Zaloguj się" | STARE (5 masterów) |
| „Nie pamiętam hasła" → „Nie pamiętasz hasła?" | STARE |
| „akceptuje" → „akceptuję" | STARE |
| „Sp. z." → „Sp. z o.o." | STARE |
| „dla pacjentów" → „dla Pacjentów" | STARE |
| „DD/MM/RRRR" → „DD.MM.RRRR" | STARE |
| korzyść klubu (CarouselALAB) | ✅ **NOWE** — jedyna pozycja, która zeszła z DS |

### Flowy i warianty (`├ 🟠 Logowanie i rejestracja`)

- `🟢 Approved`, **20 ekranów**: identycznie — wszystkie 14 sond STARE, tylko korzyść klubu NOWE.
- `🔴 Blocked`, 4 ekrany: też stare („Mam już konto", „w punkcie pobran").

**Dwie literówki nadal w hi-fi**, obie z mapy M1 jako „podmień":

- „Twoje dane **sa** bezpieczne" (hub) — brak ogonka
- „wykonaj w **punkcie pobran**" (slajd intro) — brak ogonków i nazwa własna z małej

---

## Korekta: propagacja z biblioteki DZIAŁA

Pierwotnie napisałem, że nie da się rozstrzygnąć, czy nowe teksty na ekranach to skutek moich podmian.
Rozstrzygnięte: **działa**. Dowód — zapytanie z pliku Design o tekst w **zdalnym mainie** CellTest
(`3257:16874`, `remote: true`) zwraca **„952,00 zł"**, czyli moją podmianę z DS. Klucze komponentów też się
zgadzają (`822da88d63`, `82d2751425`), więc `3257:…` to identyfikatory opublikowanej biblioteki, a `777:…`
to te same komponenty widziane z wnętrza DS.

**Co naprawdę blokowało resztę: override'y — w tym override'y wewnątrz masterów DS.** Master `CellTest`
w design systemie sam nadpisuje przekreśloną cenę na „1190 zł", więc poprawka w `PriceRow` nie ma jak
dojść do kart. To ważniejsze niż override'y na ekranach: **komponent nadpisujący inny komponent łamie
cały łańcuch propagacji w dół.**

---

## Wykonane poprawki (2026-09-09)

### 1. Banery klubu w DS — strona `❖ Cards`

| Komponent | Było | Jest |
| --- | --- | --- |
| AlabBannerLarge (`137:226`) | „5% dodatkowej **zniżki**" | „5% taniej, zawsze" |
| mały baner klubu (`794:36`, `797:157`) | „zyskaj dodatkowe **zniżki**" | „5% taniej + voucher 20% po pierwszym badaniu" |
| baner ceny klubowej (`798:293`) | „130,50 zł **zniżka** -40% w klubie" | „130,50 zł taniej −40% w klubie" |

Kontrola: na stronie `❖ Cards` **zero wystąpień słowa „zniżk"**.

### 2. Override'y na ekranach — plik Design

| Strona | „zniżka" poprawione | kwoty poprawione | zostało |
| --- | --- | --- | --- |
| `├ 🟢 Sklep` (Approved + Review, 20 ekranów) | **27** | **62** | 0 / 0 |
| `├ Sklep` (Master files, 15 masterów) | **23 + 1** | **54** | 0 / 0 |
| `├ 🟠 Logowanie i rejestracja` | 0 | 0 | — nic do poprawy |
| `├ Logowanie i rejestracja` (Master files) | 0 | 0 | — nic do poprawy |

Razem **171 węzłów tekstowych**: 4 w DS i 167 w pliku Design.

Jeden przypadek wymagał osobnego brzmienia: master hero produktu miał „+5% dodatkowej zniżki na wszystkie
badania" → **„5% taniej na wszystkie badania"**.

### 3. Kwoty — logika podmiany

Reguła: kwota **całkowita** („85 zł") dostaje „,00"; kwota, która już ma grosze („141,55 zł"), zostaje
nietknięta. Wzorzec pomija cyfry poprzedzone przecinkiem, więc „29,40 zł" nie zmieniło się w „29,40,00 zł".
Sprawdzone po podmianie: **zero kwot bez groszy** na obu stronach Sklepu.

**Autentykacja nie miała żadnej kwoty ani „zniżki"** — ani na masterach, ani w Approved. Czyli problem
z pkt 3 tam nie występuje.

### Nowe znalezisko przy okazji

W mainie `CellTest` w DS badge typu brzmi **„Niższa cena z ALAB Club"** — **„Club" z wielkiej litery**,
wbrew regule CIX („klub z małej"). Nie ruszyłem, bo to nie było na liście. Do poprawy razem z kolejną rundą.

---

## Runda po publikacji biblioteki (2026-09-09)

Jarek opublikował bibliotekę DS. Kontrola po publikacji — i domknięcie reguły **„ALAB club" zawsze
z małą literą w „club"** (CIX).

| Miejsce | Co poprawione | Ile |
| --- | --- | --- |
| `├ 🟢 Sklep` | „Niższa cena z ALAB **Club**" → „ALAB club" | **19** |
| `├ Sklep` (Master files) | to samo | **11** |
| `├ Sklep` (Master files) | opis korzyści klubu: „**Promocje**, oferta urodzinowa…" → „Oferta urodzinowa…" | **3** |
| `├ Logowanie i rejestracja` (Master files) | zgoda marketingowa „Chcę informację o **promocjach** i nowościach" → „Chcę informacje o ofertach i nowościach" | **2** |
| Prototyp, `storybook/stories.shop.js` | „ALAB Club", „zniżka -40%", „w wybranym punkcie", dywiz w badge'u kodu, „49 zł" | **5** |

Zgoda marketingowa dostała brzmienie z kanonu mapy M1 — przy okazji naprawia też liczbę
(„informację" → „informacje").

**Stan końcowy na czterech stronach pliku Design:** zero „ALAB Club", zero „zniżka/rabat", zero kwot
bez groszy.

### Zostawione świadomie: trzy etykiety na tablicy wariantów

Na stronie `├ 🟢 Sklep` nad kolumnami wariantów stoją podpisy **„Promocja z kodem"**,
**„Promocja specjalna ALAB"**, **„Promocja standardowa"**. To **adnotacje tablicy**, nie copy produktu —
dokładnie tak jak „promocja klubowa" żyje w naszym leksykonie jako nazwa typu. Nie ruszyłem, bo
przemianowanie podpisów to decyzja Jarka. Jeśli klient oglada ten plik, warto je przemianować na
„Oferta z kodem", „Oferta specjalna ALAB", „Oferta standardowa".

---

## Co z tego wynika

1. **Ścieżka DS → ekrany działa.** Trzy pozycje zeszły same na 10 ekranów Approved w Sklepie.
2. **Override wygrywa z biblioteką.** Kwoty i część linijek klubowych trzeba poprawić na ekranach.
3. **Zostały dwa komponenty ze słowem „zniżka":** `AlabBannerLarge` i mały baner klubu
   (`AlabClubBannerSmall` / `ClubPromo`). Nie ruszałem ich, bo nie leżą na stronie „❖ Cells" —
   są poza zakresem listy, którą przechodziliśmy. **To jedyne pozostałe naruszenie zakazu klienta w DS.**
4. **Hi-fi autentykacji jest niezaktualizowane w 13 pozycjach**, w tym dwie literówki. Prototyp ma
   je wszystkie poprawione, więc może służyć jako referencja.

---

## Runda 3: „przełączam wariant, a tekst się nie zmienia" (2026-09-09)

Jarek zgłosił to na `CellPackage` (`1897:54981`): po przełączeniu **`ALAB club member` na Yes**
fioletowa linijka ceny klubowej zostaje w brzmieniu dla **nie-klubowicza**. Potwierdzone i naprawione
— a przy okazji wyszedł drugi, powiązany błąd.

### Jak działa `PriceRow` (źródło prawdy)

| Discount | ALAB club member | cena główna | przekreślona | fioletowa linijka |
| --- | --- | --- | --- | --- |
| Special | No | 1369,00 zł | — | „821,40 zł taniej -40% w klubie" (**oferta**) |
| Special | Yes | 1369,00 zł | 1190,00 zł | „Aktywne −40% w klubie" (**stan**) |
| Code | No | 952,00 zł | 1190,00 zł | „904,40 zł ekstra -5% w klubie" |
| Code | Yes | 952,00 zł | 1190,00 zł | „Aktywne ekstra -5% w klubie" |
| No code | No | 1369,00 zł | — | „1300,55 zł ekstra -5% w klubie" |
| No code | Yes | 1300,55 zł | 1369,00 zł | „Aktywne ekstra -5% w klubie" |

Czyli **`No` = obietnica** („dołącz i zapłacisz tyle"), **`Yes` = stan** („zniżka już działa"). Przełącznik
ma więc zmienić zdanie, nie tylko liczbę.

### Dlaczego przełącznik nie działał — przyczyna źródłowa

**Kwota i zdanie siedzą w jednej warstwie tekstowej** („137,94 zł ekstra -5% w klubie"). Każda realna
cena produktu wymaga więc **override'u na tej warstwie**, a override **przeżywa zmianę wariantu** — więc po
przełączeniu na `Yes` Figma pokazuje dalej stary napis. To nie błąd Figmy, to skutek anatomii komponentu.

### Naprawione (10 węzłów)

| Strona | Klasa błędu | Ile |
| --- | --- | --- |
| `├ 🟢 Sklep` | wariant `Yes`, a napis w formie oferty → „Aktywne…" | **2** |
| `├ Sklep` (Master files) | to samo | **1** |
| `├ Design explorations` | zakazane „zniżka" w linijce klubowej → „taniej" | **1** |
| `├ 🟢 Sklep` | **kwoty z mastera DS na realnych kartach** | **4** |
| `├ Sklep` (Master files) | to samo | **2** |

Druga klasa to dokładnie to, co Jarek widział na zrzucie: karta miała realną cenę główną, ale
**przekreślona cena nigdy nie dostała override'u**, więc po przełączeniu na `Yes` wychodziło
demo-1190,00 zł z design systemu. Wyliczyłem brakujące kwoty z tych, które na karcie już były:

- Special: cena regularna = cena klubowa / 0,6 → „66,78 zł" ⇒ **111,30 zł**; „33,18 zł" ⇒ **55,30 zł**
- Code: przekreślona = cena regularna z omnibusa → **39,20 zł**

**Nietknięte świadomie:** 18 (🟢 Sklep) + 8 (Master files) + 11 (explorations) wierszy, w których
**wszystkie** kwoty są demo z DS — to karty-placeholdery, nie realne ekrany. Podmiana zrobiłaby z nich
fałszywe dane.

### Stan końcowy

Zero rozjazdów „wariant vs napis" na wszystkich stronach z treścią: `🟢 Sklep` (85 `PriceRow`),
`Sklep` masters (85), `Design explorations` (103), `Roboczy` (0). Puste: `Wyniki badań`,
`Koszyk i checkout`, `Profil`, `Dashboard`. Autentykacja — zero linijek klubowych.

### Do decyzji — dwie rzeczy w samym DS

**1. `PriceRow` Special + klubowicz (`777:6273`) jest wewnętrznie sprzeczny.** Cena główna
**1369,00 zł** jest **wyższa** niż przekreślona **1190,00 zł**, a 1190 nie jest –40% z 1369 (to 821,40).
Propozycja: główna **821,40 zł**, przekreślona **1369,00 zł** — tak jak w spójnym wariancie `No code + Yes`.
Nie ruszyłem, bo kwoty były odłożone „na sam koniec".

**2. `PriceRow` Code + klubowicz (`777:6290`) nie pokazuje klubowych 5%.** Główna 952,00 zł to cena
z kodem, a linijka mówi „Aktywne ekstra -5%" — tych 5% nie ma nigdzie w liczbach. Trzy poziomy ceny
(regularna → kod → klub) nie wchodzą w dwa pola. To decyzja projektowa, nie literówka.

**3. Trwałe rozwiązanie przełącznika: rozbić fioletową linijkę na dwie warstwy** — `Amount` +
`Phrase` (albo kwota jako property `✏️ Club price`). Wtedy override dotyka **tylko kwoty**, a zdanie
jedzie z wariantu i przełącznik działa. Koszt: edycja 6 wariantów `PriceRow`, republish i jeden
przebieg resetujący override'y na ekranach. Dopóki tego nie zrobimy, **każde przełączenie wariantu
będzie wymagało ręcznej korekty napisu.**

---

## Runda 4: podwojona linijka klubowa — **duplikat nazw warstw w `PriceRow`** (2026-09-09)

Po przełączeniu `ALAB club member` karta „Pakiet Zdrowie podstawowy" pokazała
**dwa razy „189,05 zł ekstra -5% w klubie"** i **zgubiła cenę główną**.

### Przyczyna: dwie warstwy o tej samej nazwie

Figma przy zmianie wariantu **przenosi override'y dopasowując warstwy po nazwie**. W `PriceRow`
warianty `Code` i `No code` miały **dwie warstwy nazwane `Label`** — cenę główną i linijkę klubową.
Nazwy kolidowały, więc override linijki klubowej trafiał na **oba** pola, a cena główna wyparowywała.
Do tego każdy wariant nazywał warstwy inaczej (`Basic`/`Discount` vs `Label`/`Label`), więc część
override'ów ginęła przy przejściu Special ↔ Code.

To było w komponencie od początku — nie powstało przy naszych podmianach copy (te szukały warstw
`Basic`, `Old price` i tekstu z „w klubie").

### Naprawione w DS

**Jeden spójny, unikalny schemat nazw we wszystkich 6 wariantach `PriceRow`:**
`Basic` (cena główna) · `Old price` (przekreślona) · `Discount` (linijka klubowa) · `Omnibus` ·
`Opłata za pobranie`. Zmienionych **8 nazw**; kontrola: w każdym wariancie nazwy są unikalne.

**Zresetowane override'y na zagnieżdżonych `PriceRow`** w masterach `CellPackage` (`777:6363`)
i `CellTest` (`777:6332`) — jedyny override to było „1190 zł" **bez groszy**, które blokowało
propagację z `PriceRow`. Po resecie mastery biorą „1190,00 zł" z komponentu. Warianty i boolean
`Collection fee` zachowane. Na stronie `❖ Cells` **zero override'ów** na `PriceRow`.

### Test: reset **nie wystarcza**, żeby przełącznik działał

Na czystej instancji `CellPackage` wpisałem realne dane i przełączyłem `ALAB club member` na `Yes`:

| Krok | Linijka klubowa |
| --- | --- |
| override realnych danych, `Code/No` | „189,05 zł ekstra -5% w klubie" |
| przełączam na `Yes` | „189,05 zł ekstra -5% w klubie" — **bez zmiany** |

**Override na warstwie tekstowej zawsze wygrywa z tekstem wariantu.** Skoro kwota i zdanie są
w **jednej** warstwie, wpisanie realnej ceny **na zawsze** zamraża brzmienie na tej karcie. Nie da się
mieć jednocześnie ręcznie wpisanej kwoty i działającego przełącznika — to nie kwestia resetu.

### Co trzeba zrobić, żeby propertiesy działały (do decyzji Jarka)

**Rozbić warstwę `Discount` na dwie:** `Amount` (tylko kwota) + `Phrase` (tylko zdanie), w poziomym
auto layoucie. `Amount` obecny we wszystkich 6 wariantach, **widoczny w `No`, ukryty w `Yes`**.
`Phrase` różny per wariant: „ekstra -5% w klubie" / „taniej -40% w klubie" w `No`,
„Aktywne ekstra -5% w klubie" / „Aktywne −40% w klubie" w `Yes`.

Wtedy projektant nadpisuje **tylko kwotę**, zdanie jedzie z wariantu i przełącznik działa.

**Kolejność prac (wymaga republishu w środku):**
1. Zapisuję obecne kwoty klubowe ze wszystkich kart (skrypt, ~200 węzłów na 3 stronach).
2. Rozbijam `Discount` w 6 wariantach `PriceRow`.
3. **Jarek publikuje bibliotekę.**
4. Wpisuję zapisane kwoty do nowej warstwy `Amount` na wszystkich kartach.

Bez tego: po samym republishu znika podwojenie linijki i cena główna przestaje ginąć, ale **zdanie
nadal nie przełączy się samo** — trzeba je poprawiać ręcznie po każdej zmianie wariantu.
