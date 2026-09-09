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
