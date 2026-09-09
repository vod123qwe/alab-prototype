# Weryfikacja: czy zmiany zeszły do pliku Design

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

## Co z tego wynika

1. **Ścieżka DS → ekrany działa.** Trzy pozycje zeszły same na 10 ekranów Approved w Sklepie.
2. **Override wygrywa z biblioteką.** Kwoty i część linijek klubowych trzeba poprawić na ekranach.
3. **Zostały dwa komponenty ze słowem „zniżka":** `AlabBannerLarge` i mały baner klubu
   (`AlabClubBannerSmall` / `ClubPromo`). Nie ruszałem ich, bo nie leżą na stronie „❖ Cells" —
   są poza zakresem listy, którą przechodziliśmy. **To jedyne pozostałe naruszenie zakazu klienta w DS.**
4. **Hi-fi autentykacji jest niezaktualizowane w 13 pozycjach**, w tym dwie literówki. Prototyp ma
   je wszystkie poprawione, więc może służyć jako referencja.
