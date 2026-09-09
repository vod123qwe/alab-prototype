# Co zostało wdrożone (stan 2026-09-09)

Wykaz, żeby kanon wiedział, na czym stoi produkt. Szczegóły per pozycja są w `zrodla-fm/`.

## 1. Prototyp klikalny (`alab/prototype`)

Około **90 zmian copy** z map M1 i M3, plus trzy pozycje własne. Wersja **2026.09.09-112**, na żywo
na GitHub Pages i Netlify.

**Sklep (M3):** słownik cen klubowych, badge typu „Niższa cena z ALAB club", CTA karty „Dodaj",
„Niedostępne w wybranym Punkcie Pobrań", „Zmień punkt", omnibus „Najniższa cena z 30 dni: …",
dane techniczne „Symbol … · Kod ICD …", etykiety arkusza filtrów „Typ" i „Kategorie", puste stany
rozdzielone po przyczynie (fraza bez trafień osobno od filtrów).

**Autentykacja (M1):** 19 pozycji, m.in. „Masz już konto? Zaloguj się", „E-mail", „Nie pamiętasz
hasła?", „Brak numeru PESEL", „Płeć", CTA „Zarejestruj się", „Wpisz swoje dane, aby założyć Konto
Pacjenta", „Sprawdź też folder spam.", „akceptuję", „Sp. z o.o.", maska daty DD.MM.RRRR
z automatycznym separatorem.

**Weryfikacja.** Całość przeszła przez skill `/ux-writer` - dwa przebiegi, M3 i M1. Wyłapał trzy realne
defekty, w tym L12 z pliku propozycji (skrócenie przycisku regułą dla nagłówków).

## 2. Design system klienta (`xnsgOdaVVKCkzjyStSOdVv`)

**Copy.** Przegląd wszystkich 14 stron komponentów, **41 poprawionych węzłów tekstowych na 6 stronach**.
Zero „zniżk", zero „rabat", zero „ALAB Club" z wielkiej litery, kwoty z groszami.

**Struktura, wymuszona przez copy** (opis w `zasady-i-format-propozycje`, Z2 i Z3):

- `PriceRow`: ujednolicone nazwy warstw w 6 wariantach; linijka klubowa rozbita na `Club price`
  (property) + `Club phrase` (tekst wariantu); trzy pola tekstowe `✏️ Price`, `✏️ Old price`,
  `✏️ Club price`.
- `CellPackage` i `CellTest`: zresetowane override'y na zagnieżdżonym `PriceRow` (blokowały propagację).
- Ikony: jedna nazwa pierwszego wektora w **958 komponentach**, żeby podmiana ikony nie gubiła koloru.

## 3. Plik `Alab • Design` (`Qsc72CoT02rxWM4jF7aIxw`)

**Runda copy.** Około **200 poprawionych override'ów** na stronach `🟢 Sklep`, `Sklep` (mastery)
i autentykacji: słowa zakazane, „ALAB club" z małą literą, kwoty z groszami.

**Przebudowa masterów sklepu** (`├ Sklep`, node `429:4`): wszystkie **91 cellek** przebudowane
w kolejności reset override'ów → wariant → wartości przez pola. Kontrola: 85 wierszy `PriceRow`,
`Club phrase` bez ani jednego override'u, każde pole ceny zawiera kwotę.

**Audyt sekcji `🟢 Approved`** (node `2546:107869`): 1513 widocznych tekstów, 43 poprawki. Zero
kwot bez groszy, zero „ALAB Club", zero em dashy, zero „Email", zero małego „pacjent" i „punkt
pobrań". Naprawione: „oszczędzasz" ×2, wielokropek ×2, cudzysłów ×1, 14 kwot klubowych, 24 spacje
na końcu warstwy.

## 4. Czego nie ruszaliśmy

- **Hi-fi autentykacji jest niezaktualizowane w 13 pozycjach**, w tym dwie literówki („Twoje dane
  **sa** bezpieczne", „wykonaj w **punkcie pobran**"). Rozstrzygnięcia z mapy M1 wdrożyliśmy tylko
  w prototypie - mapa jest zleceniem na hi-fi, którego jeszcze nie wykonaliśmy. Prototyp może służyć
  jako referencja.
- **Podpisy tablic wariantów** („Promocja …", „User basic") - punkt L10, decyzja Jarka i Twoja.
- **Teksty klienta** (zgody, klauzule) - bez redakcji, zgodnie z zasadą z Twojej paczki.
- **Karty poglądowe z kwotami demo** - 2 wiersze `Special/No` z ceną `1369,00 zł`; spójne z kanonem
  komponentu, czekają na realną cenę.
- **Strona `Design explorations`** - 191 linijek klubowych ze starym słownictwem. To strona robocza,
  nie deliverable; poprawiliśmy tam tylko rozjazdy wariant/napis i jedno „zniżka".
