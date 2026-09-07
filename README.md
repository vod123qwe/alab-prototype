# ALAB • Prototyp aplikacji

Klikalny prototyp aplikacji mobilnej ALAB zbudowany na **kodowej wersji design systemu** ALAB.
Trzy warstwy, jeden zestaw komponentów:

| Warstwa | Ścieżka | Co to |
|---|---|---|
| **DS w kodzie** | `ds/` | tokeny (`tokens.css`), komponenty (`components.css` + `components.js`), ikony (`icons.js`), assety z Figmy (`assets/`) |
| **Storybook** | `storybook/index.html` | katalog fundamentów i komponentów z playgroundem, matrycą wariantów i tabelą props |
| **Prototyp** | `app/index.html` | ścieżka Splash → Onboarding → Start → Rejestracja (3 kroki) → Zgody ALAB club → Face ID → Dashboard, plus Logowanie i Reset hasła |
| Sklep (starszy) | `index.html` | pierwsza, responsywna wersja ekranu sklepu (poza prototypem; zostawiona dla porównania) |

## Uruchomienie

Bez buildu i zależności. Otwórz plik w przeglądarce albo odpal serwer statyczny:

```bash
python -m http.server 8802 --directory "F:/AI - Tests/alab/prototype"
```

- Storybook: http://localhost:8802/storybook/
- Prototyp: http://localhost:8802/app/

Ikony są generowane z `ds/assets/*.svg` skryptem `node ds/build-icons.js` (uruchamiać po dodaniu nowych SVG).

## Źródła prawdy

- **Design system:** Figma „Alab • Design system” (`xnsgOdaVVKCkzjyStSOdVv`). Wartości tokenów i komponentów pobrane przez oficjalny Figma MCP
  (`get_design_context`, `get_variable_defs`) z masterów DS (strona „❖ Buttons”: Button, ButtonTiny, IconButton, BottomActionsBar, NumberIndicator)
  oraz z ekranów.
- **Ekrany:** Figma „Alab • Design” (`Qsc72CoT02rxWM4jF7aIxw`), strona „Logowanie i rejestracja” → sekcja „Master designs” (Splash, Start,
  Onboarding krok 4–6, Zaloguj się, Rejestracja • PESEL / Data urodzenia, Weryfikacja telefonu, Dane podstawowe, Reset hasła, Sprawdź skrzynkę,
  FaceID, Zgody • ALAB club, Sklep • Wybór prefix). Komunikaty błędów wg nazw ekranów w sekcjach „Rejestracja • Błędy”, „Logowanie • Błędy”, „Reset hasła • Błędy”.

Nazwy w kodzie = nazwy w Figmie: zmienna `Content/onSurface` → `--content-on-surface`, styl `label/xlarge-emphasized` → `.t-label-xlarge-em`,
komponent `SelectableCell` → `DS.SelectableCell({...})` / `.ds-SelectableCell`.

## Sklep (dashboard) — natywny TopBar i TabBar

Zakładka **Sklep** to ekran „Sklep • Strona główna” (656:7311) zbudowany z komponentów DS (`ds/components.shop.js`): SearchField onColor, chipy typu odbioru,
CellOrderTypeStatus, siatka CategoryTile, sekcje z ProductCard (CellPackage/CellTest z badge’ami Code/Premium/Basic), BottomTabBar.

- **TopBar przy scrollu** (w Figmie brak opisu tego zachowania — przyjęte wg iOS, UINavigationBar + UISearchController): pole szukania zostaje przypięte na granatowym tle,
  rząd chipów zwija się w pierwszych ~72 px scrolla (wysokość, przezroczystość, lekki ruch w górę), zdjęcie w tle ma paralaksę, po zwinięciu pasek dostaje cień. Pozycja scrolla jest pamiętana między zakładkami.
- **TabBar** stoi zawsze na dole (safe area na telefonie), przełącza zakładki bez animacji push (crossfade), aktywna ikona „podskakuje”. Zakładki Start / Wyniki to zaślepki
  (nie ma ich masterów w tym module), Koszyk pokazuje dodane pozycje. „Do koszyka” podbija badge na zakładce Koszyk i pokazuje snackbar.
- **Wyszukiwarka** (klik w pole na hero → ekran „Wyszukiwarka • Start” 1177:15512): pole aktywne (border 2 `Outline/borderActive`, caret, Clear, „Anuluj”), chipy w wersji solid,
  trzy stany 1:1 z Figmy i specyfikacją P03 z inventory: **< 3 znaki → „Najczęściej szukane”**, **≥ 3 znaki → podpowiedzi** (licznik „N podpowiedzi”, fraza z podświetleniem,
  sekcje Pakiety badań / Badania / Kategorie z dividerami), **brak wyników → ikona + „Brak wyników dla „…”” + „Sprawdź pisownię lub wyszukaj inną frazę” + Najczęściej szukane**.
  Wyszukiwanie ignoruje diakrytyki. Klik w podpowiedź = snackbar (lista wyników to kolejny etap).

## Ruch i gesty

- **Przejścia jak w iOS**: push (nowy ekran wjeżdża z prawej, poprzedni odjeżdża w lewo i przyciemnia się), pop odwrotnie, fade dla splasha, startu i dashboardu. Treść nowego ekranu wchodzi kaskadą (`.anim-in`).
- **Gest cofania**: przeciągnij od lewej krawędzi (pierwsze 28 px) w prawo; ekran podąża za palcem, puszczenie za 30 % szerokości albo szybki ruch cofa z zachowaniem wpisanych danych.
- **Onboarding**: taśma trzech slajdów, swipe / drag myszą / „Dalej”; kropki i przyciski są stałe.
- **Mikrointerakcje DS** (`ds/components.css`, sekcja „Mikrointerakcje”): dociśnięcie przycisków (scale .97), pływająca etykieta i pierścień fokusu pola, potrząśnięcie pola i kodu przy błędzie, rysowany ptaszek checkboxa, sprężynka radio i chipów, wypełnianie pasków kroków, pop cyfr kodu SMS i zielone komórki po poprawnym kodzie, wjazd snackbara i arkusza. Szanuje `prefers-reduced-motion`.

## Na telefonie

**Najprościej:** publiczny link GitHub Pages: https://vod123qwe.github.io/alab-prototype/app/ (storybook: https://vod123qwe.github.io/alab-prototype/storybook/). Repo jest publiczne, więc ekrany i kod są widoczne dla każdego z linkiem.

Wariant w sieci lokalnej (bez publikacji):


1. Telefon i komputer w tej samej sieci Wi-Fi. Odpal `serve.bat` (serwer na 0.0.0.0:8802, otwiera `qr.html` z kodem QR do zeskanowania).
2. Adres ręcznie: `http://<IP komputera>:8802/app/` (IP wypisuje serve.bat, dziś 192.168.1.15).
3. iPhone: Udostępnij → „Do ekranu początkowego” — prototyp działa na pełnym ekranie (manifest + meta Apple), bez paska Safari, z prawdziwym status barem i safe area.
4. Jeśli telefon nie ładuje strony, zapora Windows blokuje Pythona w profilu „Publiczna”. Jednorazowo jako administrator:
   `netsh advfirewall firewall add rule name="ALAB prototyp 8802" dir=in action=allow protocol=TCP localport=8802`
   albo przełącz sieć Wi-Fi na profil „Prywatna”.

Na szerokości poniżej 900 px prototyp przełącza się w tryb telefonu: pełny ekran, makietowy status bar i home indicator ukryte, odstępy z `env(safe-area-inset-*)`.

## Dane testowe w prototypie

| Wpisz | Efekt |
|---|---|
| telefon `600 000 000` | „Numer już zarejestrowany” |
| kod SMS `000000` | „Kod nieprawidłowy” |
| e-mail `zajety@alab.pl` (krok 3) | „E-mail już wykorzystany” |
| hasło bez wielkiej litery / cyfry / <8 znaków | „Hasło za słabe” |
| logowanie, hasło `blokada` | „Konto zostało zablokowane” |
| logowanie, hasło `zle12345` | „Dane uwierzytelniające są nieprawidłowe” |
| reset, e-mail `fail@alab.pl` | „Nie udało się wysłać wiadomości” |

Poprawny PESEL testowy: `44051401359`.

## Założenia (nie ma ich w Figmie — do potwierdzenia)

- **Stan Error pola tekstowego** (border w kolorze `Functional/error`, tekst pomocniczy w tym kolorze) — w źródle są tylko nazwy ekranów błędów, bez mastera stanu.
- **Snackbar error/info** — w DS jest tylko wariant success; error użyty do komunikatów blokujących (kod SMS, brak zgody, konto zablokowane).
- **Ikona lupy** w polu wyszukiwania kraju narysowana ręcznie (eksport z Figmy zwrócił placeholder slotu).
- **Copy onboardingu krok 2 i 3** przybliżone (w źródle nieczytelne na miniaturze); krok 1 jest 1:1.
- **Zachowania**: auto-weryfikacja po wpisaniu 6. cyfry, licznik 29 s do ponownej wysyłki, reguły hasła podświetlane na zielono w trakcie pisania,
  scrim + arkusz kraju z filtrem. To interpretacja flow, nie decyzje z Figmy.

## Rozjazdy z leksykonem UX writing (copy 1:1 z Figmy, celowo nie poprawione)

- Sklep: ceny bez groszy („68 zł”, „85 zł”, „39 zł”) → leksykon: zawsze `149,00 zł`; badge „Niższa cena z ALAB **Club**” → `club` z małej.

- „Zarejestruj się do konta pacjenta” → leksykon: **Konto Pacjenta** (wielkie litery).
- „Chcę informację o promocjach i nowościach” → leksykon zakazuje słowa **promocja**.
- „Twoje dane sa bezpieczne” (brak „ą”), „Wpisz email użyty przy rejestracji, Jeśli istnieje…” (interpunkcja) — literówki ze źródła.
- Wariant „Nie mam PESEL” w Figmie ma etykietę „Krok 1 z 2”, główny wariant „Krok 1 z 3” — w prototypie ujednolicone do „z 3”.
