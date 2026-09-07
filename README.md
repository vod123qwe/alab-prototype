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
  rząd chipów zwija się w pierwszych ~72 px scrolla (wysokość, przezroczystość, lekki ruch w górę), zdjęcie w tle ma paralaksę, po zwinięciu pasek dostaje cień, dolna krawędź granatu kończy się **28 px pod polem wyszukiwania**, a boczne zaokrąglenia (24 px) zostają: pas narożników jest przezroczysty, więc treść prześwituje między „uszami” i wjeżdża pod pasek z ostrą krawędzią (bez rozmycia i gradientu na styku). Pozycja scrolla jest pamiętana między zakładkami.
- **TabBar** stoi zawsze na dole (safe area na telefonie), przełącza zakładki bez animacji push (crossfade), aktywna ikona „podskakuje”. Zakładki Start / Wyniki to zaślepki
  (nie ma ich masterów w tym module), Koszyk pokazuje dodane pozycje. „Do koszyka” podbija badge na zakładce Koszyk i pokazuje snackbar.
- **Kategorie**: 12 kategorii ALAB z ikonami ustalonymi w POC (test_tube, medicine_bottle, fork_and_knife, bubbles, heart_rate, syringe, heart, dna, virus, mirror, user, tube). Lista zależy od typu realizacji wybranego chipem; gdy kategorii jest więcej niż 6, siatka pokazuje 5 + kafel „Wszystkie kategorie” otwierający arkusz (1:1 z „Sklep • Wybór kategorii”: tytuł, podtytuł, lista cellek), przy 6 lub mniej pokazuje wszystkie bez arkusza. **Dostępność kategorii per typ realizacji to założenie prototypu** (Punkt Pobrań = 12, ALAB w domu = 8 badań z krwi, Zestaw wysyłkowy = 6 próbek do wysyłki), do zastąpienia danymi klienta.
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
Tło dokumentu (`html`) i `theme-color` zmieniają się z ekranem (granat na Splash/Start, biel na pozostałych), bo na iOS pas poza oknem PWA maluje właśnie tło dokumentu (wniosek z Parkove).
Menu prototypu otwiera 20-pikselowy pas tuż pod systemowym status barem (sam status bar w PWA nie przekazuje tapnięć do strony).

## Menu prototypu

Tapnięcie w status bar (na telefonie: górny pasek nad ekranem) otwiera arkusz z trzema akcjami: **Storybook** (design system), **Zacznij od nowa** (czyści dane i wraca do splasha) i **Sprawdź aktualizacje** (porównuje `version.js` z `version.json` na serwerze; przy nowej wersji odświeża pliki z pominięciem cache). Numer wersji podbijaj w obu plikach przy publikacji.

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

## Etap 3 (2026-09-07) — listing, karta produktu, arkusze z gestem iOS

Nowe ekrany, 1:1 z masterów na stronie `↳ 11.08.26` pliku Alab • Design:

- **Listing kategorii** `#/category/<id>` — „Listing • Kategoria” 1183:26762. Ten sam granatowy nagłówek co strona główna
  (tytuł kategorii, pole szukania + przycisk filtrów, chipy sposobu realizacji), pod nim komórka adresu, rząd filtrów
  („Badania i pakiety ⌵” otwiera arkusz wyboru: wszystko / badania / pakiety; chipy podkategorii z licznikiem) i sekcje
  „Pakiety badań • N” / „Badania • N”. Wejście z kafla kategorii, z arkusza „Wszystkie kategorie” i z podpowiedzi wyszukiwarki.
- **Wyniki wyszukiwania** `#/results` — „Listing • Wyniki wyszukiwania” 1183:26765; Enter w wyszukiwarce albo pierwszy wiersz podpowiedzi.
- **Wszystkie pakiety / badania** `#/list/packages`, `#/list/tests` — z „Pokaż wszystkie” na stronie głównej.
- **Karta produktu** `#/product/<id>` — „Produkt • Badanie • Morfologia krwi” 1183:19461 i „Produkt • Pakiet • Tarczyca” 1183:19462:
  hero z granatem, karta z ceną (PriceBlock), kod rabatowy + zachęta ALAB club (PromoStack), „Kup badanie / Kup pakiet”,
  opis, składowe pakietu (klikalne → karta badania), oczekiwanie / materiał / gdzie można wykonać, przygotowanie,
  „Kupując w pakiecie, oszczędzasz” (karuzela), szczegóły (pełny opis, FAQ, symbol + ICD), baner klubu, produkty powiązane.
  Po zjechaniu poniżej głównego przycisku wjeżdża przyklejone CTA „Kup badanie • cena” (wzorzec iOS, w Figmie CTA jest na dole makiety).
- **Komórka pod paskiem zmienia się z chipem**: Punkt Pobrań → „Puławska 10, Warszawa / Dziś otwarte 7:00 - 11:00”;
  ALAB w domu → „Usługa pobrania krwi w domu / Kraków 109 zł” (1183:26770); Zestaw wysyłkowy → „Samodzielne pobranie próbki”
  bez drugiej linii (1183:26771, ikona `ic_home-pin`).
- **Arkusze (BottomSheet) zamykają się gestem jak w iOS** — `DS.presentSheet`: ciągnięcie w dół przesuwa arkusz za palcem
  i rozjaśnia scrim, odsłaniając ekran pod spodem; puszczenie poniżej 30% wysokości albo szybki ruch zamyka, inaczej arkusz
  wraca. Z listy przewijalnej gest startuje tylko na jej górze. Dotyczy: kategorie, rodzaj produktów, wybór kraju, menu prototypu.
- **Przejścia**: z ekranu „korzeniowego” (start, dashboard) w głąb = push z prawej, powrót = pop; fade tylko między korzeniami
  (splash → onboarding → start, → dashboard, zakładki, wyszukiwarka). Wcześniej start → rejestracja też robił fade.

### Katalog (dane przykładowe)

`app/data.catalog.js` — 12 kategorii i ~68 produktów (badania i pakiety) z podkategoriami, sposobami realizacji,
materiałem, czasem oczekiwania, ceną, promocjami (kod / ALAB club), opisem i przygotowaniem. **To dane do klikania,
nie cennik ALAB**: nazwy i część cen z masterów Figmy, reszta to realistyczne placeholdery. Kategorie na stronie głównej
i w arkuszu wynikają z produktów dostępnych dla wybranego sposobu realizacji (Punkt Pobrań 12, ALAB w domu 12, Zestaw wysyłkowy 6).
Ceny formatujemy zawsze z groszami (leksykon), choć część masterów pokazuje „96 zł”. Dla zestawów wysyłkowych nie ma dopisku
„+ opłata za pobranie” ani anchora punktu (inventory P04d). Do podmiany na prawdziwe badania z POC: wystarczy edytować ten plik.

### Założenia do potwierdzenia (etap 3)

- Zachowanie nagłówka listingu przy scrollu = jak na stronie głównej (chipy zwijają się); Figma tego nie opisuje.
- Przyklejone CTA na karcie produktu pojawia się dopiero po zjechaniu poniżej głównego przycisku (Figma pokazuje je statycznie).
- Użytkownik w ALAB club (zgoda w rejestracji) nie widzi zachęty i dużego banera klubu; wariantu „Z ALAB Club” (768:28253) nie odczytano 1:1.
- „Brak wyników po filtrach” (1183:26768) — copy przyjęte, master nie był odczytany 1:1.
- Decisions-log X.C: scope sprzedany ma 2 sposoby realizacji w filtrze katalogu (Punkt / dom), wysyłka jako typ produktu.
  Prototyp trzyma 3 chipy zgodnie z masterami Figmy (wariant idealny, oflagowany do odbicia ze stakeholderami).
- Ikona „Zestaw wysyłkowy” w Figmie nazywa się `ic_home-pin` (dom z pinem); użyta 1:1.

### Poprawki PDP (2026-09-07, wersje -11…-13)

- Hero karty produktu 1:1 z ProductBackground (583:22109): 468 px, blob 840,74 px / 75°, gradient do surfaceSecondary; strona pod kartami ma tło surfaceSecondary; karta zaczyna się 142 px od góry, z paddingiem 36 px (o 12 dp większym niż pozostałe karty).
- TopBar na PDP: na górze „Transparent - light”, po scrollu „On scroll” wg dokumentacji DS (surface 82% + blur 32 + cień 0 0 12 rgba(0,0,0,.04), tekst i ikony onSurface). Razem z paskiem zmienia się `theme-color` (granat ↔ biel), bo od niego zależy kolor tekstu systemowego status bara w PWA na iOS.
- Przyklejone CTA siedzi dokładnie na tab barze (wysokość liczona w JS, bo zależy od safe-area telefonu).
- Dodanie do koszyka nie zmienia przycisku (można dodać kolejną sztukę): potwierdzeniem jest snackbar, licznik na zakładce Koszyk (z ilością w koszyku) i lekka haptyka `DS.haptic()` — Android przez `navigator.vibrate`, iOS przez przełącznik `<input type="checkbox" switch>` klikany programowo (workaround z iOS 18, do sprawdzenia na telefonie).
- Naprawione: `BottomTabBar` ignorował klasę z `attrs` (drugi atrybut class), przez co `.shop__tabbar` nie istniał w DOM.

## Etap 4 (2026-09-07) — Wyniki badań, FAQ, webview

Nowe ekrany, 1:1 z sekcji „Wyniki badań” 2516:102053 i „Podstrony” 2265:66486 w pliku Alab • Design:

- **Lista wyników** `#/tab/results` — „Listing • Wyniki wyszukiwania” 2516:102054: tytuł „Wyniki badań”, grupy lat
  (rok + linia), karty `CellTestResult` (tytuł, osoba, data, pill statusu). Najnowszy wynik ma wariant „New”
  (2 px obwódki, cień, aureola) i liczbę na zakładce Wyniki; po wejściu w wynik znacznik gaśnie.
- **Stan pusty** `#/results-empty` — „Wyniki • Empty state” 2516:102079: ilustracja na blobie, tytuł, opis
  i „Przejdź do sklepu”. Wszystkie stany puste (wyniki, koszyk, zakładki) są wyśrodkowane w dostępnej wysokości.
- **Szczegóły badania** `#/result/<id>` — 2516:102083: karta „Aktualny wynik” (gradient, pierścień postępu, pill-e),
  segmenty Wszystkie / Poza normą, zwijane grupy parametrów (`AccordionGroup`) z trzema typami wiersza
  (`ParamRow`: wartość + norma, tor normy z kropką, wynik jakościowy ujemny/dodatni), wiersz „Dodatkowe informacje”,
  stała informacja „Wyniki skonsultuj z lekarzem” i pasek akcji Udostępnij / Pobierz PDF.
- **Dodatkowe informacje** `#/rinfo/<id>` — 2516:102151: materiał, metoda, laboratorium, data pobrania i wyniku, uwagi.
- **FAQ** — arkusz „Najczęstsze pytania” z rozwijanymi pytaniami (`AccordionCell`), otwierany z karty produktu.
  Cztery pytania na sztywno; pierwsza odpowiedź 1:1 z Figmy, pozostałe to treść prototypowa.
- **Webview** `#/webview/<klucz>` — „FlowPlaceholder” 2265:66488: zostaje tylko górna belka, treść to placeholder.
  Otwiera się z „Pełny opis badania” na karcie produktu i z zachęt ALAB club.

Zachowania dodane w tym etapie:

- **Pasek akcji chowa się przy przewijaniu w dół** i wraca po lekkim ruchu w górę (karta wyniku i przyklejone CTA
  na karcie produktu). Na samej górze i przy dole listy pasek jest zawsze widoczny.
- **Assety stanów ekranu** mają blob w tle (`il_blob.svg`) i są większe niż wcześniej — wzorzec PlaceholderAsset 349:293.
- **Akordeony rozwijają się łagodnie** (`DS.slideToggle`: wysokość + wygaszenie, easing jak w przejściach ekranów,
  chevron obraca się o 180°). Przy włączonym „Ogranicz ruch” w systemie stan przełącza się bez animacji.
- Odstęp między pierścieniem a liczbą w karcie „Aktualny wynik” to 24 px (w Figmie 16 px — na telefonie było za ciasno).
- **Ikony statusów zachowują własne kolory** (zielone kółko z tickiem, pomarańczowy trójkąt) — dla nich `build-icons.js`
  nie podmienia wypełnień na `currentColor`, bo spłaszczyłoby dwukolorowy glif do jednolitej plamy.
- **TopBar na szczegółach wyniku i dodatkowych informacjach** unosi się nad treścią i po przewinięciu przechodzi
  w wariant „On scroll” (Background/surface 82% + blur 32 + cień), tak jak na karcie produktu.
- **Karuzela** („Kupując w pakiecie, oszczędzasz”) trzyma margines ekranu także po przewinięciu (`scroll-padding-inline`).
- **Nagłówek listingu**: przy przewijaniu w dół cały blok pod paskiem (wyszukiwarka z filtrami + chipy sposobu
  realizacji) schodzi **jednym ruchem** — te same czasy i easing, żeby nic nie zjeżdżało kaskadowo. Lekki ruch w górę
  przywraca wyszukiwarkę z filtrami, a chipy wracają dopiero na samej górze. W stanie ze schowaną wyszukiwarką pasek
  jest węższy (pas narożników 24 → 16 px, bez dolnego odstępu). Na stronie głównej sklepu wyszukiwarka zostaje
  przypięta, a chipy zwijają się proporcjonalnie do ruchu palca, jak dotąd.
- **Ikony dolnej nawigacji parami z DS** (BottomTabBar 156:1388): nieaktywna zakładka ma ikonę outline w kolorze
  Content/onSurfaceTertiary, aktywna wypełnioną w Main/accent.
- **Karta produktu ma jednolite tło** Background/surfaceSecondary — ta sama szarość, którą kończy się gradient hero.
- **Karta „Aktualny wynik”**: gdy wszystkie parametry są w normie, pierścień dostaje zieloną odznakę z tickiem,
  a ekran nie pokazuje segmentów Wszystkie / Poza normą ani pill-a „Poza normą” — nie ma czego filtrować.
- Stany puste centrują ilustrację, tekst i przycisk jako jedną grupę w polu **nad** dolną nawigacją
  (wysokość paska podaje JS w zmiennej `--tabbar-h`).

Nowe komponenty DS (w storybooku): `CellTestResult`, `BadgeStatus`, `YearRule`, `ResultSummary`, `SwitchableTabRow`,
`AccordionGroup`, `AccordionCell`, `ParamRow`, `StatusLabel`, `RangeSlider`, `ToastMessage`, `CellContent`.

### Założenia (etap 4)

- Wyniki, parametry i normy w `app/data.results.js` to **szablony z danymi przykładowymi**, nie wyniki Pacjenta.
  Liczby w karcie „Aktualny wynik” wyliczamy z listy parametrów (w Figmie karta pokazuje 52/56 przy kilku wierszach).
- Nazwy grup parametrów morfologii są nasze („Parametry główne”, „Krwinki białe”, „Wskaźniki czerwonokrwinkowe”) —
  w Figmie zostały domyślne nazwy z komponentu („Pokarmowe • 4”, „Hormony tarczycy • 5”).
- Odpowiedzi FAQ 2-4 i podpisy statusów („Poniżej normy”) to treść prototypowa do potwierdzenia.
- `RangeSlider` liczy pozycję liniowo: norma zajmuje środkowe 50% toru, wynik poza normą przyklejamy do krawędzi
  z marginesem 5% (zgodnie z opisem komponentu w DS 2483:41824).
- Daty piszemy z miesiącem z małej litery (leksykon ALAB); listing w Figmie ma „12 Marca 2026”.
- „Udostępnij” i „Pobierz PDF” pokazują snackbar — to funkcje systemowe, poza zakresem prototypu.
