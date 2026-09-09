# Leksykon: aneks z wdrożenia (FM, 2026-09-09)

Do wklejenia w `ux-writing-lexicon.md`. Każdy wiersz jest w formacie leksykonu
(**Element · Kanon · NIE · Źródło**), żeby dało się go wciągnąć bez przepisywania.
Aneks nie zmienia hierarchii źródeł: nic tu nie dotyka ustaleń klienta.

Wiersze oznaczone **⚠ KONFLIKT** to miejsca, gdzie produkt mówi dziś coś, czego kanon wprost zabrania.
Nie da się być zgodnym z jednym i drugim, więc te dwie sprawy - linijka ceny klubowej i licznik
w filtrach - proszę rozstrzygnąć jako pierwsze.
Uzasadnienia, koszty i alternatywy: `leksykon-propozycje-zmian-2026-09-09.md` w tej samej paczce,
punkty L1 do L13. Wiersze o mechanice komponentów i o naszych wpadkach
zostały z tego aneksu wyjęte - trzymamy je u siebie.

---

## Do sekcji 2 (słownik sposobów realizacji)

| Element | Kanon proponowany | NIE | Źródło / uwaga |
|---|---|---|---|
| **⚠ KONFLIKT · Cena klubowa, Pacjent poza klubem** | `<kwota> zł ekstra −5% w klubie` · przy ofercie specjalnej `<kwota> zł taniej −40% w klubie` | „5% taniej w klubie" bez kwoty (nie mówi, ile Pacjent zapłaci) | L1. Kanon dziś (sek. 3a, CXXIV.L, F1) ma „ekstra −5% w klubie" na liście NIE. Wdrożone w `PriceRow` i na 85 wierszach ekranów |
| **⚠ KONFLIKT · Cena klubowa, Pacjent w klubie** | `Aktywne ekstra −5% w klubie` · `Aktywne −40% w klubie` | „5% taniej, już naliczone" (opisuje księgowanie, nie stan korzyści); „Aktywna zniżka klubowa"; „Naliczono 5% zniżki" | L1, L4 |
| **Dobór słowa: „taniej" czy „ekstra"** | `taniej` przy obniżce konkretnego badania (−40%, oferta specjalna) · `ekstra` przy stałej korzyści klubowej (−5%), która **dokłada się do** innych obniżek | używanie jednego słowa w obu wielkościach | L2. Sumowanie potwierdzone, `decisions-log` XXII |
| **⚠ KONFLIKT · Licznik łączny w filtrach i wyszukiwaniu** | do rozstrzygnięcia: `Pokaż 11 badań i pakietów` albo `Pokaż 11 pozycji` | `Pokaż 11 wyników` (dziś w produkcie); „Wyniki" jest nazwą obszaru nawigacji | L5. Wersja zgodna ze słownikiem nie mieści się w jednej linii przycisku |
| **CTA dodania do koszyka** | label `Dodaj`, plus **jako ikona wiodąca**, nie znak w tekście | `+ Dodaj` jako string (inny rozmiar niż ikona, brak odstępu z auto layoutu, czytnik przeczyta „plus") | L7. Mapa M3 zapisuje dziś „+ Dodaj" |
| **Nagłówek korzyści pakietu** | do rozstrzygnięcia; nazywa **zawartość** pakietu, nie różnicę ceny | „Kupując w pakiecie, oszczędzasz" (2 wystąpienia znalezione w hi-fi, mimo zakazu z CXV); nasze robocze „W pakiecie taniej" | L11 |
| **Podpisy tablic wariantów** | `Oferta z kodem` · `Oferta specjalna ALAB` · `Oferta standardowa` | „Promocja …" (9 wystąpień w pliku Design). Podmiana klienta „akcja profilaktyczna" tu nie pasuje: opisuje badania przesiewowe, nie typ obniżki | L10. Nie ruszone, czeka na decyzję |
| **Nazwanie Pacjenta w podpisach i nazwach warstw** | `Pacjent bez klubu` · `Pacjent w ALAB club` | „User basic", „User z ALAB club" (6 wystąpień) | L10 |

---

## Do sekcji 3 (reguły pisowni i formatów)

| Element | Kanon proponowany | NIE | Źródło / uwaga |
|---|---|---|---|
| **Znak minus w wartościach procentowych** | **U+2212** w każdej wartości, nie tylko w badge'u kodu: `−5%`, `−20%`, `−40%` | dywiz `-5%` | **Wdrożone 2026-09-09** wszędzie: DS, plik Design (590 węzłów) i prototyp. Kanon mówił „znak minus" tylko przy badge'u kodu - prosimy o rozszerzenie zapisu na każdą wartość |
| **Separator licznika przy etykiecie** | duża kropka `•`: `Zobacz składowe pakietu • 4`, `Pokaż wszystkie • 12` | kropka środkowa `·` (w Manrope 14 px SemiBold optycznie ginie przy liczbie); nawiasy `(4)` jako notacja techniczna | L6. Separator **zdaniowy** `·` zostaje bez zmian |
| **Wielokropek** | jeden znak `…` | trzy kropki `...` | L9. 2 wystąpienia w hi-fi |
| **Cudzysłów** | otwierający `„` i zamykający `”` | zamykający jako prosty `"` | L9. 1 wystąpienie w hi-fi |
| **Spacja na końcu warstwy tekstowej** | **zero** | spacja końcowa - niewidoczna w Figmie, psuje wyśrodkowanie i przechodzi do developmentu | L9. 48 warstw, w tym `-20% ` ×15; źródło było w komponentach DS |
| **Cena dla czytnika ekranu** | kanon jest („63 złote 65 groszy"), brak wdrożenia i brak ustalenia, kto generuje odmianę liczebnika | traktowanie tego jako stringu do napisania - odmiana „złoty/złote/złotych" to logika, nie tekst | L13 |

---

## Do sekcji 6 (utrzymanie) - jedna reguła procesu

Wyszła z rzeczy, która przy wdrażaniu copy **wyglądała jak błąd copy, a była błędem struktury pliku**.
Pełny opis: `zasady-i-format-propozycje-2026-09-09.md`, punkt Z1.

**Override blokuje propagację z biblioteki.** Każdy tekst wpisany ręcznie na instancji zostaje
stary - także override **wewnątrz mastera DS** (master `CellTest` nadpisywał cenę, więc poprawka
w `PriceRow` nie miała jak dojść do kart). Wniosek dla mapy copy: wiersz „podmień" musi mówić
**gdzie** - `main` / `property` (z nazwą pola) / `instancja`. Bez tego wykonawca zmienia komponent,
widzi „gotowe", a na ekranach nic się nie rusza. Zdarzyło się nam na 12 pozycjach.
