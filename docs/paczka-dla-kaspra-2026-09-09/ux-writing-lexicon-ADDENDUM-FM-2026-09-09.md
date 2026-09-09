# Leksykon: aneks z wdrożenia (FM, 2026-09-09)

Do wklejenia w `ux-writing-lexicon.md`. Każdy wiersz jest w formacie leksykonu
(**Element · Kanon · NIE · Źródło**), żeby dało się go wciągnąć bez przepisywania.
Aneks nie zmienia hierarchii źródeł: nic tu nie dotyka ustaleń klienta.

Trzy wiersze oznaczone **⚠ KONFLIKT** to miejsca, gdzie produkt mówi dziś coś, czego kanon wprost
zabrania. Nie da się być zgodnym z jednym i drugim, więc te trzy proszę rozstrzygnąć jako pierwsze.
Uzasadnienia, koszty i alternatywy: `leksykon-propozycje-zmian-2026-09-09.md` w tej samej paczce,
punkty L1 do L13.

---

## Do sekcji 2 (słownik sposobów realizacji)

| Element | Kanon proponowany | NIE | Źródło / uwaga |
|---|---|---|---|
| **⚠ KONFLIKT · Cena klubowa, Pacjent poza klubem** | `<kwota> zł ekstra -5% w klubie` · przy ofercie specjalnej `<kwota> zł taniej -40% w klubie` | „5% taniej w klubie" bez kwoty (nie mówi, ile Pacjent zapłaci) | L1. Kanon dziś (sek. 3a, CXXIV.L, F1) ma „ekstra -5% w klubie" na liście NIE. Wdrożone w `PriceRow` i na 85 wierszach ekranów |
| **⚠ KONFLIKT · Cena klubowa, Pacjent w klubie** | `Aktywne ekstra -5% w klubie` · `Aktywne −40% w klubie` | „5% taniej, już naliczone" (opisuje księgowanie, nie stan korzyści); „Aktywna zniżka klubowa"; „Naliczono 5% zniżki" | L1, L4 |
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
| **⚠ KONFLIKT · Znak minus w wartościach procentowych** | **U+2212** w każdej wartości, nie tylko w badge'u kodu: `−5%`, `−20%`, `−40%` | dywiz `-5%` (dziś w DS przy 5%, znak minus przy 40% - ta sama wielkość, dwa znaki) | L3. Kanon mówi już „znak minus" przy badge'u kodu |
| **Separator licznika przy etykiecie** | duża kropka `•`: `Zobacz składowe pakietu • 4`, `Pokaż wszystkie • 12` | kropka środkowa `·` (w Manrope 14 px SemiBold optycznie ginie przy liczbie); nawiasy `(4)` jako notacja techniczna | L6. Separator **zdaniowy** `·` zostaje bez zmian |
| **Wielokropek** | jeden znak `…` | trzy kropki `...` | L9. 2 wystąpienia w hi-fi |
| **Cudzysłów** | otwierający `„` i zamykający `”` | zamykający jako prosty `"` | L9. 1 wystąpienie w hi-fi |
| **Spacja na końcu warstwy tekstowej** | **zero** | spacja końcowa - niewidoczna w Figmie, psuje wyśrodkowanie i przechodzi do developmentu | L9. 48 warstw, w tym `-20% ` ×15; źródło było w komponentach DS |
| **Treść demo w komponentach** | podlega leksykonowi **tak samo jak copy produktu** | domyślne wartości typu „1190 zł" bez groszy, badge „ALAB **Club**" | L8. Te dwie wartości zeszły biblioteką na około 200 węzłów pliku Design; stara domyślna treść `BadgePremium` była **źródłem** frazy „Aktywna zniżka klubowa", którą gasiliśmy ręcznie na kilkudziesięciu ekranach |
| **Zakres reguły „nagłówek sekcji bez czasownika"** | tylko nagłówki i etykiety sekcji; **przyciski i linki zachowują czasownik** | skracanie CTA tą regułą - „Zobacz składowe pakietu" → „Składowe pakietu" | L12. Nasza wpadka, wyłapana przy przebiegu skillem `/ux-writer` |
| **Cena dla czytnika ekranu** | kanon jest („63 złote 65 groszy"), brak wdrożenia i brak ustalenia, kto generuje odmianę liczebnika | traktowanie tego jako stringu do napisania - odmiana „złoty/złote/złotych" to logika, nie tekst | L13 |

---

## Do sekcji 6 (utrzymanie) - trzy reguły procesu

Wyszły z rzeczy, które przy wdrażaniu copy **wyglądały jak błąd copy, a były błędem struktury pliku**.
Pełny opis: `zasady-i-format-propozycje-2026-09-09.md`, punkty Z1 do Z6.

**1. Override blokuje propagację z biblioteki.** Każdy tekst wpisany ręcznie na instancji zostaje
stary - także override **wewnątrz mastera DS** (master `CellTest` nadpisywał cenę, więc poprawka
w `PriceRow` nie miała jak dojść do kart). Wniosek dla mapy copy: wiersz „podmień" musi mówić
**gdzie** - `main` / `property` (z nazwą pola) / `instancja`. Bez tego wykonawca zmienia komponent,
widzi „gotowe", a na ekranach nic się nie rusza. Zdarzyło się nam na 12 pozycjach.

**2. Zdanie z wartością zmienną nie może siedzieć w jednej warstwie z tą wartością.** Linijka
„189,05 zł ekstra -5% w klubie" była jedną warstwą, więc realna cena wymagała override'u, a override
**zamrażał całe zdanie**: przełącznik „Pacjent w klubie" zmieniał warianty, a napis zostawał -
72 z 85 wierszy pokazywało komunikat sprzeczny ze stanem. Naprawione rozbiciem na `Club price`
(pole komponentu) i `Club phrase` (tekst wariantu, nigdy nie nadpisywany). **Wniosek dla kanonu:
zapisujmy takie zdania jako dwa pola - wartość osobno, fraza osobno.** To samo ryzyko siedzi
w „Najniższa cena z 30 dni: …", „Kraków 109 zł", licznikach składowych i timerze.

**3. Cytowanie leksykonu.** Leksykon nie ma numerowanych reguł. W trakcie pracy cytowaliśmy
„leksykon 109", „322", „234" - **te numery były nasze i nie ma ich w pliku**, co utrudnia
weryfikację. Proponujemy jeden sposób w obie strony: **sekcja + wpis `decisions-log`**
(np. „sek. 3a, CXXIV.L, decyzja F1"), albo wprowadzenie numeracji reguł w leksykonie.
