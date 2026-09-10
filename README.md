# ALAB • Prototyp aplikacji

Klikalny prototyp aplikacji mobilnej ALAB zbudowany na **kodowej wersji design systemu** ALAB.
Trzy warstwy, jeden zestaw komponentów:

| Warstwa | Ścieżka | Co to |
|---|---|---|
| **DS w kodzie** | `ds/` | tokeny (`tokens.css`), komponenty (`components.css` + `components.js`), ikony (`icons.js`), assety z Figmy (`assets/`) |
| **Storybook** | `storybook/index.html` | katalog fundamentów i komponentów z playgroundem, matrycą wariantów i tabelą props |
| **Prototyp** | `app/index.html` | ścieżka Splash → Onboarding → Start → Rejestracja (3 kroki) → Zgody ALAB club → Dashboard; Logowanie → zachęta o biometrię → Dashboard; plus Reset hasła |
| Sklep (starszy) | `index.html` | pierwsza, responsywna wersja ekranu sklepu (poza prototypem; zostawiona dla porównania) |

## Uruchomienie

Bez buildu i zależności, ale **potrzebny jest serwer** — prototyp używa routera na ścieżkach
(`/app/produkt/...`), więc adres ekranu nie ma swojego pliku na dysku i otwarcie `index.html`
z dysku (`file://`) nie zadziała w pełni (przeglądarka blokuje tam zmianę adresu; router spada
wtedy na stary tryb z hashem).

```bash
python "F:/AI - Tests/alab/prototype/serve.py" 8802
```

`serve.py` robi lokalnie to samo co reguła na Netlify: nieznany adres pod `/app/` oddaje
`/app/index.html`, więc odświeżenie strony i wklejony link do konkretnego ekranu działają.
Zwykły `python -m http.server` tego nie umie i przy odświeżeniu głębokiego adresu da 404.
`serve.bat` (dwuklik) uruchamia to samo i otwiera stronę z kodem QR dla telefonu.

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

**Najprościej:** publiczny link Netlify: https://alab-prototype.netlify.app/ (storybook: https://alab-prototype.netlify.app/storybook/).
Wejście na `/` przekierowuje do prototypu. Stary adres GitHub Pages nadal działa: https://vod123qwe.github.io/alab-prototype/app/

Wdrożenie na Netlify (konto j.pastuszak@futuremind.com, projekt `alab-prototype`, publish = katalog repo):

```bash
npx netlify-cli deploy --prod --dir=.
```

Netlify nie jest jeszcze podłączone do repozytorium, więc deploy robimy komendą wyżej. Automat po każdym pushu
można włączyć w panelu Netlify (Project configuration → Build & deploy → Link repository).. Repo jest publiczne, więc ekrany i kod są widoczne dla każdego z linkiem.

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

## Realna treść z alab.pl na kartach produktów z zadań (2026-09-09)

Trzy produkty, które są celami zadań badawczych, mają treść **przepisaną z alab.pl** (odczyt 2026-09-09),
żeby uczestnik czytał to samo, co w produkcie: nazwę, symbol, kod ICD, cenę, najniższą cenę z 30 dni, czas
oczekiwania, opis i przygotowanie. Reszta katalogu zostaje danymi przykładowymi.

| Zadanie | Produkt | Źródło | Co przyszło z alab.pl |
| --- | --- | --- | --- |
| 1 | **Badanie ogólne moczu** | `/badanie/badanie-ogolne-moczu-a01` | symbol MOCZ, ICD A01, 31,00 zł, 30 dni 21,70 zł, 1 dzień roboczy, opis, 4 punkty przygotowania |
| 2 | **Pakiet tarczycowy** | `/pakiet/pakiet-tarczycowy` | symbol PKTARPP, skład FT3 + FT4 + TSH, 153,00 zł, 30 dni 107,10 zł, 1 dzień roboczy, opis, 5 punktów przygotowania |
| 3 | **Morfologia krwi obwodowej** | `/badanie/morfologia-krwi-c55` | symbol MORF, ICD C55, 31,00 zł, 30 dni 21,70 zł, 1 dzień roboczy, opis, 5 punktów przygotowania |

**Runda uwag zespołu (2026-09-10).** Cztery zmiany w scenariuszu badania:

- **Koniec zadania to wyśrodkowany komunikat, nie arkusz.** Marginesy 32 px, zielony tick 64 px,
  wyśrodkowany tekst, **zero akcji**: bez dwóch przycisków i bez „x" w narożniku. Tapnięcie
  w dowolnym miejscu wraca na listę zadań. Poprzedni arkusz dawał wyjście „Przeglądaj dalej", więc
  część osób nagrywała ścieżkę już poza zadaniem i mieszała wynik. Adres nadal zmienia się na
  `/app/koniec/<produkt>`, żeby w Useberry dało się rozdzielić zakup z ALAB club i bez.
- **Zadanie 3 zalicza się tylko w „ALAB w domu".** Wpis zadania ma teraz siódme pole z wymaganym
  sposobem realizacji. Ta sama morfologia dodana w Punkcie Pobrań nie kończy zadania, bo w realnym
  produkcie pobranie w domu jest inną usługą.
- **Wyszukiwarka nie oddaje celu zadania za pierwszym trafieniem.** Produkt z `demoteUnless` zjeżdża
  na trzecią pozycję, dopóki zapytanie nie trafia w jego wyróżnik: „pakiet" pokazuje Pakiet tarczycowy
  jako trzeci, „tarczycowy" znów jako pierwszy.
- **Wejście w zadanie zależy od zadania.** Zadanie 1 ma cel na Starcie, więc po splashu zostaje na tym
  ekranie, a Start mówi wtedy „Zamów badanie ogólne moczu · Zacznij w zakładce Sklep" zamiast zaślepki
  „w przygotowaniu". Zadania 2 i 3 są w całości w Sklepie, więc splash prowadzi prosto do zakładki
  Sklep; Start odwiedzony z ciekawości pokazuje zwykłą zaślepkę.

**Arkusz składowych pakietu (2026-09-10, `3309:33789`).** Stopka karty pakietu („Zobacz składowe
pakietu • N") otwiera arkusz z nazwą pakietu, podtytułem „Składowe pakietu • N" i listą badań. Każdy
wiersz prowadzi do karty tego badania; to samo działa teraz w sekcji „Składowe pakietu" na PDP, gdzie
wiersze miały `data-open`, ale nie miały akcji. Pod listą stoi **przyklejony `BottomActionsBar`**
z przyciskiem „Szczegóły pakietu" — lista przewija się **pod** paskiem i wygasza w jego gradiencie
(ten sam komponent DS co na innych ekranach: `linear-gradient(to top, #fff 34.9%, transparent)`
plus `backdrop-filter: blur(22px)`). Pasek jest pozycjonowany absolutnie, a jego `bottom` ustawia JS
zmierzoną wysokością wskaźnika ekranu głównego: **w arkuszu ma on 16 px, nie 34 px** jak samodzielny,
więc zaszyta stała zostawiała 18 px dziury. Arkusz hugguje treść (3 składowe = 433 px), a przy
największym pakiecie (9 składowych) zatrzymuje się na `max-height: 92%` i lista dostaje własny scroll.

**Pakiet Sport wypadł z katalogu (2026-09-09).** Po przeniesieniu zadania 2 na Pakiet tarczycowy nie miał
już żadnej roli, a jako siódmy pakiet profilaktyczny tylko wydłużał listing. **Morfologia nazywa się teraz
„Morfologia krwi"** (wcześniej „Morfologia krwi obwodowej") — tą samą nazwą mówi zadanie 3 i karta produktu,
żeby uczestnik nie szukał dwóch różnych rzeczy. W aplikacji jest dokładnie jedna morfologia.

**Zadanie 2 to teraz Pakiet tarczycowy, nie Pakiet Sport** — realny produkt z oferty ALAB. Został **poza
ekranem głównym** (bez `popular`), bo zadanie ma zmusić do przejścia przez kategorie albo wyszukiwarkę; ta
sama zasada trzymała wcześniej poza nim Pakiet Sport. Skład zmienił się z czterech badań na trzy (wypadło
anty-TPO), bo tak wygląda pakiet na alab.pl — anty-TPO zostaje w pakiecie rozszerzonym.

Kategorie sprawdzone „z grubsza" wobec alab.pl: Pakiet tarczycowy → Hormony / Tarczyca, Morfologia → Układ
krążenia i Hematologia / Anemia (plus drugie miejsce w Profilaktyce podstawowej), Badanie ogólne moczu →
Ciąża i Układ moczowy / Układ moczowy i nerki (plus drugie miejsce w Badaniach z moczu). Zgodne z tym, gdzie
te produkty stoją w katalogu ALAB.

**Do sprawdzenia przez Jarka:** cena Badania ogólnego moczu odczytała się identycznie jak morfologii
(31,00 zł / 21,70 zł). Może tak być — to dwa najtańsze badania podstawowe — ale para tych samych liczb
wygląda też jak wspólny blok promocyjny na stronie. Warto zerknąć na produkcie.

Przy okazji: dane techniczne na karcie produktu mówią teraz **„Symbol MORF · Kod ICD C55"** — kropka środkowa
i bez dwukropka, jak w mapie M3 3.3. To separator między słowami, więc wyjątek A2 (duża kropka przy licznikach)
go nie dotyczy.

## Copy do kanonu map M1/M3 (2026-09-09)

Paczka `ALAB-copy-dla-Jarka-2026-09-09` (mapy copy POC → hi-fi dla modułów M1 i M3 plus leksykon) przyniosła
decyzje z 9 września, których prototyp jeszcze nie miał. Część rozjazdów powstała w prototypie świeżo, przy
budowie arkusza filtrów i pillsów. Podmienione:

**Zakazane słowa (leksykon 321, zakaz klienta: „zniżka", „rabat", „promocja", „oszczędzasz")**

| Było | Jest |
| --- | --- |
| „X zł ekstra -5% w klubie" · „zniżka -40% w klubie" | ~~„5% taniej w klubie"~~ — **cofnięte 2026-09-09**, patrz sekcja o wierszu ceny |
| „Aktywna zniżka klubowa ekstra -5%" | ~~„5% taniej, już naliczone"~~ — **cofnięte 2026-09-09** |
| baner mały: „zyskaj dodatkowe zniżki" | „5% taniej + voucher 20% po pierwszym badaniu" |
| baner duży i karuzela klubu: „5% dodatkowej zniżki", „Akcje profilaktyczne…" | trzy korzyści wg mapy M3, 3.4 |
| sekcja PDP „Kupując w pakiecie, oszczędzasz" | „Pakiety z tym badaniem" |
| webview klubu: „zasady ALAB club: zniżki, voucher…" | „… 5% taniej, voucher po pierwszym badaniu…" |

**Kanon leksykonu**

| Było | Jest | Źródło |
| --- | --- | --- |
| „Liczba badań: 4" · „Materiał: Krew" | „Pakiet · 4 badania" · „Badanie · krew" | leksykon 136 |
| CTA karty „Do koszyka" | **ikona `plus` + „Dodaj"** — plus jest ikoną w slocie ButtonTiny, nie znakiem w tekście (Figma 1897:55043; D7 w rejestrze) | decyzja F2 + Figma |
| „Zobacz składowe pakietu • 4" | „Składowe pakietu (4)" | leksykon 234 |
| belka „Wyniki wyszukiwania" | „Znalezione badania i pakiety" | leksykon 238 |
| „Pokaż 5 wyników" | „Pokaż 3 pakiety i 8 badań" | mapa M3, P02 |
| „Wybierz typ" · „Zawęź w kategorii: Hormony" | „Typ" · „Kategorie" | etykieta rzeczownikiem |
| „Gdzie można wykonać" | „Sposób realizacji" | leksykon 60 |
| „Dziś otwarte 7:00 - 11:00" | „07:00 - 11:00" | leksykon 3 |
| „Brak badań dla wybranych filtrów" | „Brak badań dla tych filtrów." + „Bez filtrów zobaczysz tu N badań" | mapa M3, P02 |
| „Szukaj badania**...**" | „Szukaj badania…" (jeden znak) | leksykon 3a |
| „**-**20%" (dywiz) · „z kodem**:**" | „−20%" (znak minus) · „z kodem" | leksykon 109 |
| „Pokaż wszystkie pakiety" | „… pakiety (16)" | mapa M3, P01 |
| chipy i wiersze filtrów „Tarczyca • 6" | ~~„Tarczyca (6)"~~ — **cofnięte 2026-09-09**, duża kropka zostaje (wyjątek A2 w rejestrze) | mapa M3, P01 |
| baner klubu „Twój klub na całe życie" · CTA „Sprawdź" | „Bezpłatny program dla Pacjentów" · „Dołącz do ALAB club" | mapa M3 3.4, decyzja F4 |
| ekran klubu: „Trzy korzyści, jedna decyzja." · sheet kategorii z podtytułem | zdjęte | M1 A14, decyzja F3 |
| „1 podpowiedzi" · etykieta pola „Wpisz kraj..." | odmiana po liczbie · „Kraj" | polszczyzna, reguła 3a |

> **Rejestr odstępstw copy:** [`docs/copy-odstepstwa-2026-09-09.md`](docs/copy-odstepstwa-2026-09-09.md) —
> wyjątki sugerowane, rozjazdy w mapach, teksty poza kanonem i pełna lista podmian z 9 września.
> Czytaj to przed kolejną rundą z map, żeby nie cofnąć świadomej decyzji.

### Wiersz ceny klubowej: cofnięta decyzja F1 (2026-09-09)

**Decyzja Jarka po komentarzu klienta: na kartach i w hero PDP wracają poprzednie formy.**

| Stan | Kanon leksykonu 109 (F1) | Co jest w prototypie |
| --- | --- | --- |
| Poza klubem | „64,60 zł 5% taniej w klubie" | **„64,60 zł ekstra -5% w klubie"** |
| Poza klubem, promocja klubowa | „66,78 zł 40% taniej w klubie" | **„66,78 zł zniżka -40% w klubie"** |
| Klubowicz | „5% taniej, już naliczone" | **„Aktywna zniżka klubowa ekstra -5%"** |
| Klubowicz, promocja klubowa | „40% taniej, już naliczone" | **„Aktywna zniżka klubowa -40%"** |

**Powód.** Kanon F1 stawia procent bezpośrednio za kwotą, bez żadnego słowa między liczbami: „64,60 zł 5%
taniej w klubie" czyta się jak wyrażenie matematyczne. Klient zgłaszał to już wcześniej i właśnie dlatego
poprzednie formy miały przerywnik słowny („ekstra", „zniżka") — to był jego ukryty cel, o którym leksykon
nie wspomina. F1 rozstrzygało słownictwo, nie typografię wiersza, więc luki nie zamknęło.

**Świadomy koszt.** Wraca słowo „zniżka", którego leksykon 321 zakazuje w interfejsie (prawnicy klienta
odradzają „rabat" i „zniżkę"). To wyjątek do zalogowania u Kaspra, nie zmiana kierunku: **dotyczy wyłącznie
wiersza ceny na kartach i w hero PDP**. Reszta produktu nadal mówi „taniej" — mały baner pod ceną, duży baner
klubu, karuzela na ekranie klubu, webview i rozwinięcia zgód. Sprawdzone po zmianie.

**Alternatywa, gdyby klient nie chciał „zniżki".** Przestawienie kolejności daje ten sam efekt bez zakazanego
słowa i bez wychodzenia poza słownik F1: „64,60 zł w klubie, 5% taniej" — kwota nadal prowadzi, a między
liczbami stoi słowo. Kropka środkowa problemu nie rozwiązuje, bo „·" to znak mnożenia.

### Copy autentykacji (M1) do kanonu (2026-09-09)

Autentykacja jest w badaniu **ukryta**, ale prototyp jest deklarowanym kanonem dla hi-fi, więc jej copy też
musi się zgadzać. Przebieg mapą M1 razem ze skillem `/ux-writer` dał **19 podmian** — wykonane są wyłącznie
wiersze rozstrzygnięte („podmień"), wiersze „do decyzji" zostały nietknięte.

| Ekran | Było | Jest | Źródło |
| --- | --- | --- | --- |
| A02, A03 | „Mam już konto" | „Masz już konto? Zaloguj się" | K3 |
| A04 | „Wpisz dane, których używasz w aplikacji ALAB" | „… w aplikacji." | gołe ALAB, kropka |
| A04, A07/3, A10 | „Email" | „E-mail" | CX |
| A04 | „Nie pamiętam hasła" | „Nie pamiętasz hasła?" | K3 |
| A04 | „Nie masz jeszcze konta?" | „Nie masz konta?" | mapa M1 |
| A07/1 | „Wyślemy SMS z kodem potwierdzającym" | „Wyślemy SMS z kodem" | mapa M1 |
| A07/1 | „Nie mam numeru PESEL" | „Brak numeru PESEL" | K4 |
| A07/1 | „Wpisz w formacie DD/MM/RRRR" | „… DD.MM.RRRR" + separator wstawiany automatycznie | decyzja 5.1 |
| A07/1 | „Wybierz płeć" | „Płeć" | reguła klienta 3a |
| A07/1 | „Chcę informacje o akcjach profilaktycznych…" | „… o ofertach i nowościach" | mapa M1, sekcja 6 |
| A07/1 | CTA „Dalej" | „Zarejestruj się" + wyjście „Masz już konto? Zaloguj się" | K1, K3 |
| A07/1, A14 | „Więcej" / „Mniej" | „rozwiń" / „zwiń" | leksykon 5 |
| A08 | „Wyślij kod ponownie" · toast „Kod wysłany ponownie" | „Wyślij ponownie" · „Wysłaliśmy nowy kod" | mapa M1 |
| A08 | sześć pól bez etykiety | `aria-label` „Kod weryfikacyjny" | mapa M1, a11y |
| A07/3 | „Dane podstawowe" | „Wpisz swoje dane, aby założyć Konto Pacjenta" | K2 |
| A10 | „Sprawdź folder spam." | „Sprawdź też folder spam." | mapa M1 |
| A14 | „… i akceptuje jego postanowienia" · cudzysłów “” | „akceptuję" · „" | mapa M1 |
| A14 | „ALAB laboratoria Sp. z." | „Sp. z o.o." | mapa M1 (ucięta klauzula) |
| A14 | rozwinięcie zgody: „naliczania **zniżek**" | „naliczania korzyści i komunikacji o nich" | zakaz klienta |

Ostatni wiersz to **ósme naruszenie zakazu „zniżki"**, przeoczone przy przebiegu M3, bo siedzi w rozwinięciu
zgody klubowej, nie w cenach.

**Zostawione jako „do decyzji" (mapa M1, sekcja 5):** treść slajdów intro i tagline splasha (5.4, decyzja ALAB),
ekran biometrii A15 (5.5), przycisk „Zaloguj się z Face ID" (5.6), reguły hasła (5.8), gwiazdka „* Wymagane"
(5.10), stopka huba (5.11), „Zmień numer" i „Potwierdź" na OTP (5.12).

**Poza kanonem, zgłoszone:** wyjście do logowania na A02 i A03 jest u nas **przyciskiem**, a kanon mówi „tekst
z linkiem, jak stopka logowania". Podmieniłem same słowa; zamiana przycisku na link to zmiana hierarchii
ekranu, więc decyzja Jarka. Pusty stan sheeta kraju („Brak wyników" + „Spróbuj wpisać nazwę kraju inaczej.")
jest trzecią wersją tego zdania obok hi-fi i wyszukiwarki sklepu — mapa mówi „zostaje", ale ujednolicenie
warto zaplanować razem z długiem na słowie „wyniki". Odliczanie OTP mamy na 0:29, a mapa mówi 0:59, bo API
blokuje ponowne wysłanie na minutę — u nas krótsze celowo, żeby prototyp nie nudził.

### Przebieg skillem `/ux-writer` (2026-09-09, po wdrożeniu)

Paczka mówi „pracujesz z Claude i skillem UX writer"; pierwsze wdrożenie poszło bez niego, więc copy
przepuściliśmy przez skill drugim przebiegiem. Znalazł trzy rzeczy:

1. **Błąd w podmianie: zniknęło „Zobacz" z wiersza składowych.** Wziąłem kanon z leksykonu 234
   („Składowe pakietu (N)"), a ten wiersz dotyczy **nagłówka sekcji na karcie produktu**, nie przycisku
   na kafelku. Mapa M3 3.1 zmienia tam tylko separator. Wróciło „Zobacz składowe pakietu (4)".
2. **Stan pusty nie nazywał przyczyny.** Fraza bez trafień w żadnym sposobie realizacji kończyła się
   komunikatem o filtrach — uczestnik tracił swoją frazę i dostawał radę nie na temat. Teraz szukanie bez
   trafień daje „Brak wyników dla „x” w Punkcie Pobrań" + „Sprawdź pisownię…", a zawężenie filtrami
   „Brak badań dla tych filtrów." + „Bez filtrów zobaczysz tu N badań".
3. **Stan pusty po filtrach był ślepym zaułkiem** — sam komunikat, bez wyjścia. Doszedł przycisk
   **„Wyczyść filtry"** (kanon z mapy M3, P02 „Brak wyników po filtrach"), który zdejmuje typ i podkategorie
   i czyści adres. Pokazuje się tylko wtedy, gdy filtry faktycznie są włączone.

Napięcia między skillem a leksykonem, w których **wygrywa leksykon** (hierarchia źródeł z README paczki):

- **„+ Dodaj"** — skill chce „czasownik + obiekt", to jest goły czasownik. Decyzja F2 wprost to rozstrzyga
  („plus mówi, co się stanie"), więc zostaje.
- **„Wyczyść"** w arkuszu filtrów bez dopełnienia — kontekst niesie tytuł arkusza „Filtry"; mapa M3 P02
  zostawia tę formę w arkuszu, a „Wyczyść filtry" na ekranie pustego stanu. Trzymamy oba, tak jak mapa.
- **Kropka na końcu „Brak badań dla tych filtrów."** — pozostałe tytuły pustych stanów u nas kropki nie mają.
  Kanon mapy ma ją dosłownie, więc zostaje; do wyrównania w leksykonie przy następnej rundzie.
- **„Brak wyników dla „x”"** używa słowa „wyniki" w znaczeniu trafień — mapa przyjmuje to świadomie
  jako dług (LXXVI).

Skill potwierdził też czytanie Jarka, że „64,60 zł 5% taniej w klubie" czyta się jak równanie (dwie liczby
bez słowa między nimi łamią regułę „jeden przekaz na raz"). Czeka na decyzję Kaspra.

### Sprzeczności w mapach — zgłoszone, nierozstrzygnięte

Prototyp wykonuje mapy dosłownie, więc te rozjazdy w nim zostały. Do rozmowy z Kasprem:

1. **„bon" vs „voucher" — ROZSTRZYGNIĘTE 2026-09-09: wszędzie „voucher".** Mapa M3 3.2 (mały baner pod ceną)
   miała „bon 20%", a M3 3.4 i M1 A14 „Voucher 20%" — dwie nazwy jednego mechanizmu na jednej karcie produktu.
   Kanon to „voucher": leksykon używa go w czterech wierszach (316 trzy korzyści, 331 aktywacja, 332 pusty stan
   AC02, 333 baner na dashboardzie), a plik mapowania klienta pokazuje, że to **jego słowo** z webu („Voucher
   ze zniżką 20% na kolejne zakupy") — leksykon 316 wprost zabrania ruszać treść tych korzyści. „bon" wszedł
   raz, 1 września (leksykon 330, slajd intro), przy okazji zmiany o notacji „taniej", a w wierszu 333 stoi po
   stronie odrzuconych („gamifikacja 3/5 / bon 50 zł (OUT)"). Do poprawy poza prototypem: leksykon 330,
   mapa M1 wiersz 99, mapa M3 wiersz 84.
2. **Kolejność korzyści klubu** — M1 A14: 5% → Oferta urodzinowa → Voucher; M3 3.4: 5% → Voucher → Oferta
   urodzinowa. Ekran klubu trzyma kolejność M1, baner na PDP kolejność M3.
3. **Ta sama korzyść ma dwie akcje** — M1 A14 „zostaje do odpowiedzi ALAB (K6)", M3 3.4 „podmień wg K6".
4. **„Niedostępne w wybranym punkcie" (M3 3.1)** przeczy własnej regule „Punkt Pobrań dwiema wielkimi literami
   we wszystkich formach". Prototyp trzyma regułę: „Niedostępne w wybranym Punkcie Pobrań".
5. **Słowo „wyniki" ma dwa losy** — w belce P05 wychodzi, w pustym stanie wyszukiwarki zostaje jako dług.
   Prototyp tak samo: belka „Znalezione badania i pakiety", pusty stan „Brak wyników dla „X”".
6. **Zakres godzin** ma dywiz („07:00 - 11:00"), gdy ta sama sekcja mapy zakazuje em dasha i narzuca kropkę
   środkową jako separator w linii. Zakres to typowo półpauza.

### Do decyzji Jarka (mapa M3, sekcja 6, punkt 5)

Etykiety „Wybierz kategorię" nad siatką kafli i „Przeglądaj tylko" nad chipami. W prototypie ich nie ma
i świadomie nie dopisujemy, dopóki nie ma decyzji.

## Leksykon UX writing (przejście 2026-09-08)

Copy było wcześniej 1:1 z Figmy, razem z rozjazdami wobec leksykonu. Na prośbę Jarka zostały poprawione:

| Było | Jest | Reguła |
| --- | --- | --- |
| „w punkcie pobran” (onboarding) | „w Punkcie Pobrań” | Punkt Pobrań z dużej, także w odmianie |
| „konta pacjenta” (rejestracja) | „Konta Pacjenta” | Konto Pacjenta z dużej |
| „dla pacjentów” (ALAB club) | „dla Pacjentów” | Pacjent z dużej |
| „Chcę informację o promocjach i nowościach” | „Chcę informacje o akcjach profilaktycznych i nowościach” | zakaz słowa „promocja” |
| „Promocje, oferta urodzinowa…” (banner klubu) | „Akcje profilaktyczne, oferta urodzinowa…” | zakaz słowa „promocja” |
| „Niższa cena z ALAB Club” | „Niższa cena z ALAB club” | ALAB wersalikami, `club` z małej |
| „Niedostępne w wybranym punkcie” | „Niedostępne w wybranym Punkcie Pobrań” | Punkt Pobrań z dużej |
| „Warszawa 109 zł” | „Warszawa 109,00 zł” | kwoty zawsze z groszami |
| „Twoje dane sa bezpieczne” | „…są bezpieczne” | literówka |
| „nowego hasla”, przecinek zamiast kropki | „nowego hasła”, dwa zdania | literówka i interpunkcja |
| „Akceptuje Regulamin i politykę prywatności” | „Akceptuję Regulamin i Politykę prywatności” | literówka i spójność nazw dokumentów |

Pozostałe kwoty w interfejsie liczy helper `zl()`, który zawsze dopisuje grosze, więc reszta cen była zgodna.

Świadomie **nie** zmienione:

- klauzula RODO w zgodach ALAB club mówi „Państwu”, a leksykon każe zwracać się „Ciebie / Tobie” —
  to treść prawna, a nie copy interfejsu; do decyzji z klientem,
- „Krok 1 z 3” w wariancie bez numeru PESEL (w Figmie „Krok 1 z 2”) — u nas kroków jest trzy niezależnie
  od PESEL, więc licznik pokazuje 3; to rozjazd z Figmą, nie z leksykonem.

## Wcześniejsze rozjazdy z leksykonem (historycznie: copy 1:1 z Figmy)

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
- **Wyniki wyszukiwania** `/app/wyniki-wyszukiwania` — „Listing • Wyniki wyszukiwania” 1183:26765; Enter w wyszukiwarce albo pierwszy wiersz podpowiedzi.
- **Wszystkie pakiety / badania** `/app/lista/pakiety`, `/app/lista/badania` — z „Pokaż wszystkie” na stronie głównej.
- **Karta produktu** `#/product/<id>` — „Produkt • Badanie • Morfologia krwi” 1183:19461 i „Produkt • Pakiet • Tarczyca” 1183:19462:
  hero z granatem, karta z ceną (PriceBlock), kod rabatowy + zachęta ALAB club (PromoStack), „Kup badanie / Kup pakiet”,
  opis, składowe pakietu (klikalne → karta badania), oczekiwanie / materiał / gdzie można wykonać, przygotowanie,
  „Kupując w pakiecie, oszczędzasz” (karuzela), szczegóły (pełny opis, FAQ, symbol + ICD), baner klubu, produkty powiązane.
  Po zjechaniu poniżej głównego przycisku wjeżdża przyklejone CTA „Kup badanie • cena” (wzorzec iOS, w Figmie CTA jest na dole makiety).
- **Komórka pod paskiem zmienia się z chipem**: Punkt Pobrań → „Puławska 10, Warszawa / Dziś otwarte 7:00 - 11:00”;
  ALAB w domu → „Usługa pobrania krwi w domu / Warszawa 109 zł” (master 1183:26770 ma „Kraków” — miasto zmienione
  świadomie, bo plan badania stawia Pacjenta w Warszawie, a Punkt Pobrań jest na Puławskiej); Zestaw wysyłkowy →
  „Samodzielne pobranie próbki”
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

- **Lista wyników** `/app/zakladka/wyniki` — „Listing • Wyniki wyszukiwania” 2516:102054: tytuł „Wyniki badań”, grupy lat
  (rok + linia), karty `CellTestResult` (tytuł, osoba, data, pill statusu). Najnowszy wynik ma wariant „New”
  (2 px obwódki, cień, aureola) i liczbę na zakładce Wyniki; po wejściu w wynik znacznik gaśnie.
- **Stan pusty** `/app/wyniki-brak` — „Wyniki • Empty state” 2516:102079: ilustracja na blobie, tytuł, opis
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
- **Dolna nawigacja jest trwałym elementem ramki telefonu** (`#tabbar`), a nie częścią ekranów — przy zmianie
  podstrony nie bierze udziału w przejściu, tak jak UITabBar w iOS. Przerysowuje się tylko wtedy, gdy zmienia się
  aktywna zakładka albo licznik. Na ekranach pełnoekranowych (wyszukiwarka, webview, dodatkowe informacje,
  rejestracja) zjeżdża w dół.
- **Karta „Aktualny wynik” zwija się do belki** (wzorzec dużego tytułu z Human Interface Guidelines i zwijanego
  paska Material 3): przy przewijaniu jedzie wolniej niż treść i wsuwa się pod matową belkę,
  a jej liczba wjeżdża jako druga linia belki („11 z 14 w normie”). Bez skalowania i bez wygaszania, żeby ruch był
  spokojny i karta pozostała czytelna do końca. Lista parametrów przechodzi nad kartą.
- **W tle karty jest bardzo delikatny blask** — miękkie światło z lewej góry, które powoli oddycha (16 s).
  Przy włączonym „Ogranicz ruch” w systemie blask stoi, a karta nie animuje się przy przewijaniu.
- **Chipy sposobu realizacji gasną szybciej, niż zwija się ich pas** — nie widać obcięcia od dołu i nie wchodzą
  pod wyszukiwarkę.
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

### Biometria (2026-09-07)

Zachęta „Loguj się szybciej” pojawia się **po logowaniu**, nie w rejestracji — tak jak w docelowym flow.
Pytamy raz: dopóki Pacjent nie zdecyduje (`faceId === null`), ekran pokazuje się po każdym poprawnym logowaniu;
po wyborze („Włącz Face ID” albo „Nie teraz”) logowanie prowadzi prosto na dashboard. Rejestracja kończy się
na zgodach ALAB club i od razu wchodzi na dashboard z powitalnym snackbarem (przy okazji poprawione:
rejestracja ustawia teraz stan zalogowania, wcześniej po rejestracji Pacjent formalnie nie był zalogowany).

## Pod badania z użytkownikami (2026-09-07)

Zadanie testowe: **znajdź badanie morfologii krwi**. Prototyp jest ułożony tak, żeby zadanie było wykonalne
kilkoma drogami, ale odpowiedź nie leżała na wierzchu:

- **Ekranu głównego sklepu nie zdradza nic** — morfologia nie jest w „Popularnych badaniach” ani w „Popularnych
  pakietach” (dla żadnego sposobu realizacji). Sprawdzone: tekst ekranu nie zawiera słowa „morfolog”.
- **„Morfologia” nie jest podpowiedzią** w „Najczęściej szukane” (byłoby to znalezienie zadania w jednym tapnięciu).
  Podpowiedzi: CRP, Witamina D, TSH, Ferrytyna, Lipidogram.
- **Wyszukiwarka** znajduje morfologię po nazwie, skrócie i potocznej frazie. Dopasowanie działa po SŁOWACH
  (nie po całej frazie), na nazwie, podkategorii, materiale, symbolu i polu `keywords`, z lekką normalizacją
  końcówek. Sprawdzone frazy: „morfologia”, „morfo”, „morfologia krwi”, „badania krwi morfologii”, „badanie krwi”,
  „krew”, „cbc”, „mrf”. Fraza bez sensu („xyzqwe”) daje pusty stan, więc ścieżka błędu też jest do przetestowania.
- **Przez kategorie**: kafel „Badania i pakiety ogólne” → listing z oboma badaniami morfologii.
- **Przez ALAB w domu**: oba badania są dostępne w tym sposobie realizacji (chip „ALAB w domu” na listingu i w sklepie).
- **Przez „Pokaż wszystkie badania”** na ekranie głównym również prowadzi do listingu z morfologią.

W katalogu jest **jedno** badanie morfologii — „Morfologia krwi” (21,70 zł). Wariant z rozmazem został usunięty,
bo dwie bardzo podobne pozycje rozmywały obraz w zadaniu 3. Morfologia leży **czwarta** na liście w podkategorii
Krew (po OB, CRP i glukozie), więc nie wpada w oko od razu — uczestnik ma ją znaleźć, a nie zobaczyć na wierzchu.

### Podkategorie z drzewka klienta (2026-09-09)

Katalog dostał **12 kategorii i 62 podkategorie z drzewka klienta** („Nowe drzewko kategorii final 1.pdf”,
2026-07-29), przepisane 1:1 z najnowszego POC (`js/data.js` → `CATEGORY_TREE` na insider-future-poc.netlify.app).
Pełna lista podkategorii siedzi w polu `subs` przy każdej kategorii w `app/data.catalog.js`, a każdy produkt ma
`sub` z tej listy — wcześniej podkategorie były naszym wymysłem („Krew”, „Pakiety”, „Uroda”).

W filtrach pokazujemy podkategorie **w kolejności z drzewka** i tylko te, które mają produkty, więc uczestnik
nie trafia na puste zaułki. Po zmianie każda z 12 kategorii ma co najmniej dwie podkategorie do zawężenia,
a Hormony mają wszystkie cztery, dokładnie jak wariant filtrów 724:32918 w Figmie:

| Kategoria | Podkategorie z produktami |
| --- | --- |
| Badania i pakiety ogólne | Profilaktyka podstawowa 7 · Profilaktyka rozszerzona 2 · Pakiety dla kobiet 1 · Badania z moczu 1 |
| Hormony | Tarczyca 6 · Hormony kobiece 3 · Hormony męskie 1 · Diagnostyka płodności 1 |
| Układ krążenia i Hematologia | Cholesterol i lipidy 2 · Ryzyko sercowo-naczyniowe 2 · Anemia / niedokrwistość 3 |
| Lifestylowe i Uroda | Witaminy i minerały 2 · Skóra, włosy i paznokcie 2 · Długowieczność 2 |

Żeby filtr miał sens w każdej kategorii, doszły trzy badania przykładowe: Testosteron całkowity (Hormony męskie),
Leptyna (Otyłość i apetyt) i Wapń całkowity (Osteoporoza) — katalog ma teraz 70 pozycji.

Dwie zmiany kategorii wobec naszego wcześniejszego katalogu, zgodne z POC: **Witamina D i Witamina B12** przeszły
z „Badań ogólnych” do „Lifestylowe i Uroda / Witaminy i minerały”.

#### Drugie miejsce w drzewku (`also`) — przypisania jak w POC (2026-09-09)

W POC część badań stoi w **dwóch** miejscach drzewka naraz: raz merytorycznie, raz w „Badaniach ogólnych”.
Przenieśliśmy to 1:1 — produkt ma miejsce główne (`cat` + `sub`) i opcjonalne `also: [[kategoria, podkategoria]]`.
Wszystkie listy, liczniki i filtry pytają o przynależność przez `inCat` / `subOf` (`app/app.shop.js`), więc drugie
miejsce działa dokładnie tak jak główne — także w adresie (`pod-<slug>`).

| Badanie | Miejsce główne | Drugie miejsce |
| --- | --- | --- |
| Morfologia krwi | Układ krążenia / Anemia | Badania ogólne / Profilaktyka podstawowa |
| Panel lipidowy | Układ krążenia / Cholesterol i lipidy | Badania ogólne / Profilaktyka podstawowa |
| CRP | Infekcje / Infekcje bakteryjne | Badania ogólne / Profilaktyka podstawowa |
| Glukoza | Cukrzyca / Diagnostyka cukrzycy | Badania ogólne / Profilaktyka podstawowa |
| Badanie ogólne moczu | Ciąża i Układ moczowy / Układ moczowy i nerki | Badania ogólne / Badania z moczu |
| HIV, Chlamydia | Infekcje / wirusowe • bakteryjne | Ciąża / Choroby przenoszone drogą płciową |
| HPV, Pakiet STD | Ciąża / Diagnostyka HPV • Choroby przenoszone drogą płciową | Infekcje / Infekcje wirusowe |

Domknęło to otwarty punkt z poprzedniej wersji (HPV i STD należą w drzewku klienta do „Ciąża, Zdrowie intymne
i Układ moczowy”). Mikrobiota jelitowa przeszła z „Lifestylowych” do „Układ pokarmowy / Jelita”.

**Lista kategorii różni się per sposób realizacji** i wynika z danych, nie z osobnej konfiguracji: Punkt Pobrań
i ALAB w domu mają wszystkie 12 kategorii, zestaw wysyłkowy — 7 (Alergie, Układ pokarmowy, Ciąża, Genetyka,
Infekcje, Lifestyle, Zdrowie psychiczne). Ten sam mechanizm działa na ekranie głównym sklepu i na podstronach.

Ścieżki badawcze sprawdzone po zmianie: morfologia nadal w „Badaniach ogólnych”, czwarta na liście, poza
ekranem głównym, dostępna w Punkcie Pobrań i w domu; badanie moczu tylko w Punkcie Pobrań (i dodatkowo
znajdowalne filtrem „Badania z moczu”); morfologia poza ekranem głównym Punktu Pobrań.

### Filtry pod ikoną, nie na ekranie (2026-09-09)

Z listingów zniknął rząd filtrów — chip „Badania i pakiety” i chipy podkategorii. Cały wybór siedzi teraz
w arkuszu **„Filtry”** pod ikoną w pasku wyszukiwania, w dwóch wariantach z Figmy:

- **wyniki wyszukiwania** (724:34766): tylko „Wybierz typ” (Wszystko / Badania / Pakiety badań z licznikami)
  i przycisk „Pokaż N wyników”,
- **listing kategorii** (724:32918): to samo plus „Zawęź w kategorii: <nazwa>” z checkboxami podkategorii
  i licznikami, a na dole „Wyczyść” obok „Pokaż N wyników”.

Wybór w arkuszu jest brudnopisem: liczniki chipów i liczba na przycisku przeliczają się na bieżąco, ale stan
listingu i adres zmieniają się dopiero po „Pokaż N wyników”. Na ekranach „Wszystkie badania” i „Wszystkie
pakiety” ikony filtrów nie ma — tam rodzaj jest z definicji ustawiony, więc nie byłoby czego filtrować.

#### Szybkie filtrowanie pillsami na PLP kategorii (2026-09-09)

Na **listingu kategorii** wrócił rząd pillsów (724:77102): chip rozwijany z typem (otwiera arkusz „Filtry”),
separator, a za nim pillsy podkategorii z licznikami. Tapnięcie pillsa działa **od razu** — bez arkusza — i od
razu zmienia adres, więc szybkie zawężanie da się policzyć w nagraniu. Wyników wyszukiwania i ekranów
„Wszystkie badania / pakiety” to nie dotyczy: tam cały wybór zostaje pod ikoną filtrów.

**Zawężenie w kategorii jest wielokrotne** — i w pillsach, i w arkuszu (checkboxy, nie radio, jak w 724:32918).
Stan trzymamy jako listę nazw, a w adresie ląduje po jednym segmencie `pod-<slug>` na każdą zaznaczoną
podkategorię, w kolejności z drzewka — ten sam wybór zawsze daje ten sam adres, np.
`/app/kategoria/alergie-i-nietolerancje-pokarmowe/pod-panele-alergiczne/pod-nietolerancje-pokarmowe/punkt-pobran/bez-klubu`.
Licznik przy podkategorii pokazuje, ile jest w niej samej przy wybranym typie, żeby liczby nie skakały pod palcem
przy dokładaniu kolejnych zaznaczeń; liczba na przycisku „Pokaż N wyników” liczy sumę wyboru.

Wyniki wyszukiwania **zastępują ekran wyszukiwarki w historii**: cofnięcie z wyników wraca do kroku przed
szukaniem (np. do listingu kategorii), a nie do pola wyszukiwania. Wyszukiwarka jest przystankiem, nie ekranem.

#### Zestaw wysyłkowy wg zasady POC (2026-09-09)

Porównanie kategorii per sposób realizacji z POC pokazało, że Punkt Pobrań i ALAB w domu są u nas świadomym
nadzbiorem (POC nie ma produktów w Genetyce, Zdrowiu psychicznym i Reumatologii, my dorobiliśmy je, żeby każda
z 12 kategorii miała treść), ale **zestaw wysyłkowy rozjeżdzał się zasadą**: miał 12 badań w 7 kategoriach,
POC — 5 w 3. Przyjęliśmy regułę POC (`js/data.js`: *„badania wysyłkowe nie mają 'punkt' ani 'dom', poza HPV,
które ALAB przełącza w koszyku”*) — zestaw wysyłkowy jest osobnym produktem, nie drugim kanałem dla badania
z Punktu Pobrań.

Co się zmieniło w `app/data.catalog.js`:

- **`MAIL = ['wysylka']`** — nowa stała kanału. `KIT = ['punkt', 'wysylka']` zostało wyłącznie dla HPV.
- **wypadły z wysyłki:** panel IgG (materiał krew), genetyka (BRCA, MTHFR), kortyzol ze śliny,
  neuroprzekaźniki w moczu, Chlamydia PCR — zostały w Punkcie Pobrań (IgG też w domu),
- **kał do laboratorium wraca do samego Punktu:** kalprotektyna, krew utajona, H. pylori i Pakiet zdrowe jelita
  — dokładnie jak w POC, gdzie te badania są `punkt`, a nie `mail`,
- **mikrobiom jelitowy jest teraz wyłącznie wysyłkowy** (w POC `mail`),
- **doszły trzy badania wysyłkowe z POC:** SIBO (test oddechowy, 489,00 zł), ORGANIX GASTRO (mocz, 498,00 zł)
  i Borelioza IgM / IgG — zestaw wysyłkowy (159,00 zł). Katalog ma teraz 73 pozycje.

Borelioza wysyłkowa jest u nas **badaniem, nie pakietem** — w POC to pakiet dwóch oznaczeń (Borrelia IgM + IgG),
a u nas Borelioza IgM / IgG od początku jest jednym badaniem, więc pakiet z jedną pozycją pokazywałby
„Liczba badań: 1”.

Po zmianie zestaw wysyłkowy ma **5 badań w 3 kategoriach** (Układ pokarmowy, Ciąża i Układ moczowy, Infekcje),
tak jak POC. Konsekwencja dla badania: w pozostałych 9 kategoriach uczestnik zobaczy stan pusty z wyjściem do
Punktu Pobrań i ALAB w domu — to realne odwzorowanie oferty i akurat ten stan Maciek chce sprawdzić.
Sprawdzone: ekran główny w trybie wysyłkowym pokazuje 3 kategorie, pusta kategoria daje oba wyjścia,
a wszystkie trzy ścieżki zadań (mocz w Punkcie, Pakiet tarczycowy, morfologia w domu) dochodzą do ekranu sukcesu.

#### Tło hero na karcie produktu 1:1 z ProductBackground (2026-09-09)

Karta produktu miała **spłaszczony eksport 375×468** (`img_product_bg.png`) rozciągany na szerokość ekranu
(`width: 100%`, `object-fit: cover`), więc na szerszym telefonie zdjęcie się skalowało i nie miało ani gradientu,
ani rozmycia z projektu. Teraz składamy je z tego samego zdjęcia źródłowego co nagłówek sklepu, wg
**ProductBackground z 1183:19461** (`I1183:19461;574:1884`) — spłaszczony eksport usunięty z assetów.

**Tła bierzemy jako gotowe eksporty z Figmy** (od Jarka, @3x): `ds/assets/img_search_cover_bg@3x.png`
(1125×1167 = 375×389, nagłówek sklepu) i `ds/assets/ProductBackground@3x.png` (1125×1404 = 375×468, karta
produktu). Każdy plik ma w sobie zdjęcie, **progresywne rozmycie** i gradient.

**Why:** rozmycia z tych tła nie da się wiernie odtworzyć w CSS. W Figmie „background blur” jest wygaszany
alfą warstwy Content Background, więc narasta razem z gradientem — u góry zero, u dołu pełne. `backdrop-filter`
rozmywa równo całą powierzchnię elementu (góra nagłówka robi się bezkształtną mazią), wygaszanie maską alfy
dawało własne artefakty, a na karcie produktu wywracało kompozycję w Chromium: nad tłem jadącym transformem
przemalowywało białą kartę. Próba składania tła offline też poszła do kosza — eksport z Figmy jest prostszy
i jednoznacznie zgodny z projektem.

**How to apply:** przy zmianie tła wyeksportuj z Figmy cały frame (ProductBackground / cover) w @3x i podmień
plik — nie odtwarzaj geometrii, rozmycia ani gradientu w CSS. Blok ma stałe 375px szerokości przy prawej
krawędzi (bo tak jest w projekcie); na szerszym telefonie lewą resztę dopełnia `--main-primary` w nagłówku
sklepu i `.product__bgFill` (ten sam gradient na pełną szerokość) na karcie produktu — sprawdzone na 430px,
szwu nie ma.

Różnice wobec nagłówka sklepu (dwa różne warianty tego samego tła, nie pomyłka):Różnice wobec nagłówka sklepu (dwa różne warianty tego samego tła, nie pomyłka):Różnice wobec nagłówka sklepu (dwa różne warianty tego samego tła, nie pomyłka):

| | Nagłówek sklepu (3185:44676) | Karta produktu (1183:19461) |
| --- | --- | --- |
| Wysokość grafiki | 375×389 | 375×468 |
| Gradient | `181.69deg`, przezroczysty → granat | `182.41deg`, granat 30% → `#f6f7f8` |

Na karcie produktu gradient kończy się kolorem strony (`--background-surface-secondary`), dlatego hero płynnie
wchodzi w tło pod białą kartą — w sklepie kończy się granatem, bo pod nagłówkiem zaczyna się biała treść.
Zdjęcie (840.738px, obrót 75°) i parallaks przy przewijaniu bez zmian.

#### Tło nagłówka sklepu 1:1 z Top Nav (2026-09-09)

Nagłówek sklepu odtwarza **Top Nav 3185:44676** z pliku Design. Zdjęcie jest to samo, co mieliśmy
(`ds/assets/img_shop_bg.png` — bajt w bajt to, co oddała Figma), rozjazd siedział w składaniu warstw:

- **zdjęcie nie ma własnego rozmycia.** Mieliśmy na nim `filter: blur(50px)`, przez co cały bąbel był
  jednolitą plamą. W projekcie rozmycie robi **Content Background** przez `backdrop-blur(46px)`,
- **pas gradientu ma stałe 331px i liczy się od dołu nagłówka**, nie od dołu zdjęcia — w Figmie Content
  Background jest dzieckiem Top Nav, więc u nas przeniósł się z `.shop__bg` do `.shop__fill`,
- **ProductBackground ma stałe 375×468 i jest przyklejony do prawej krawędzi.** Mieliśmy go na pełną
  szerokość, a środek zdjęcia liczy się od jego połowy (`50% + 287.34px`) — na szerszym telefonie bąbel
  odjeżdżał w prawo. Teraz z lewej zostaje sam `--main-primary`, dokładnie jak w projekcie,
- gradient dokładnie z Figmy: `181.69deg`, `rgba(4,56,125,0) 6.09%` → `--background-surface-inverse 98.39%`.

Geometria zdjęcia bez zmian i zgodna z projektem: kwadrat 840.738px obrócony o 75°, środek w
`(50% + 287.34px, 162.84px)`.

### Snackbar 1:1 z DS i „funkcja niedostępna” (2026-09-08)

Komórka z adresem pod paskiem (Punkt Pobrań, adres dla ALAB w domu) oraz przycisk „Zmień punkt” **nie prowadzą
już na zaślepkę** — pokazują snackbar „Ta funkcja nie jest dostępna w prototypie”. Wcześniej każdy sposób
realizacji trafiał na ten sam ekran Punktu Pobrań, co wprowadzało w błąd. Ekran `/app/punkt-pobran` został
w kodzie i w panelu prototypu jako podgląd, ale nic już do niego nie prowadzi.

Przy tej okazji snackbar wyrównany do dokumentacji „Snackbar” 746:9380 z DS: padding 16, gap 8, promień 12,
cień `0 2 8 rgba(0,0,0,.05)`. Sukces to zielona plama z białym tekstem i białą ikoną, a **błąd, informacja
i ostrzeżenie siedzą na białej powierzchni z obwódką**, mają ciemny tekst i ikonę w kolorze funkcjonalnym
(czerwony `x-circle`, niebieski `info-square`, pomarańczowy trójkąt). Wcześniej błąd był czerwoną, a informacja
grafitową plamą — to było nasze założenie z czasów, gdy w DS istniał tylko wariant Success. Doszły dwie ikony
z DS (`ic_outline_x_circle`, `ic_outline_warning_triangle`) i token `--functional-warning: #ff9500`.

### Brak wyników w wybranym sposobie realizacji (2026-09-08)

Wzór 2546:109588 (wyszukiwarka) i 2265:66501 (listing): gdy w wybranym sposobie realizacji nic nie ma, nie
zostawiamy ślepego zaułka. Nagłówek mówi, GDZIE nic nie ma („Brak wyników dla «witamina» w zestawie
wysyłkowym”), a pod podpowiedzią jest separator „Lub” i wyjścia do pozostałych sposobów realizacji z liczbami:
„Szukaj w Punkcie Pobrań — 3 pakiety i 7 badań”. Tapnięcie wiersza przełącza sposób realizacji, odświeża treść
i zmienia adres — dokładnie jak chip, bo wiersze niosą ten sam atrybut.

Rytm bloku jest 1:1 z masterem: ikona 32, 12 px do tekstu, 12 px między linijkami, 48 px do separatora „Lub”
(16 px wysokości), 16 px do listy wyjść i 16 px między wierszami; nagłówek i wiersze mają tę samą szerokość
treści, a odstęp od filtrów jest taki sam w wyszukiwarce i na listingu.

Działa w trzech miejscach: w wyszukiwarce (podpowiedzi), na wynikach wyszukiwania i na listingu kategorii —
w tym w scenariuszu, od którego się zaczęło: uczestnik wchodzi w kategorię w Punkcie Pobrań, przełącza na
zestaw wysyłkowy i kategoria jest pusta. Gdy frazy nie ma nigdzie, zostaje stara podpowiedź „Sprawdź pisownię”
i sekcja „Najczęściej szukane”. Stan pusty z wyjściami nie centruje się w całej wysokości listingu, bo wtedy
wiersze wypadały pod krawędź ekranu.

### ALAB club: podstrona ze zgód i tryb członka (2026-09-08)

Zachęta do klubu (mały banner pod ceną i duży banner w treści karty produktu) prowadzi teraz na **ekran zgód
ALAB club** pod adresem `/app/alab-club` — ten sam, który był w rejestracji. Zaznaczenie dwóch wymaganych zgód
i „Dołącz do ALAB club” **przełącza tryb użytkownika** i wraca dokładnie na ekran, z którego uczestnik przyszedł,
z potwierdzeniem w snackbarze. „Nie teraz” wraca bez dołączania. Bez zgód przycisk pokazuje błąd — to zaznaczenie
zgody jest momentem zmiany trybu.

Ceny w trybie członka zmieniają się wszędzie, 1:1 z wariantami z Figmy („Warianty • Banner PDP hero” 2726:16353,
karta badania 2726:16368, karta pakietu 2726:16383):

| | Bez klubu | W ALAB club |
| --- | --- | --- |
| Cena główna | cena podstawowa | cena klubowa (−5%, a przy produktach premium −40%) |
| Cena przekreślona | tylko przy promocji z kodem | cena podstawowa |
| Fioletowa linijka | zachęta „20,61 zł ekstra −5% w klubie” | potwierdzenie „Aktywna zniżka klubowa ekstra −5%” |
| Karta produktu (PDP) | zachęta do klubu pod ceną | odznaka nad tytułem, bez fioletowej linijki |
| Kolor ceny | zielony tylko przy kodzie rabatowym, inaczej onSurface | tak samo |

Odznaka nad tytułem na karcie produktu ma tło `Background/surfaceLoyalitySubtle` (#f8f0ff, nowy token
`--background-surface-loyality-subtle`) i tekst w `content/onSurface` — nie fioletowy, choć intuicja podpowiada
inaczej; sprawdzone w masterze. Sygnet ALAB w odznace ma własny kolor `Main/accent-loyalty` i nie dziedziczy
koloru tekstu. Zielona cena to wyłącznie sygnał promocji z kodem: wcześniej PriceBlock miał
zieleń zawsze, teraz zieleni się przez wariant `ds-PriceBlock--promo`.

**Zasada łączenia zniżek (decyzja Jarka, 2026-09-08):** kod rabatowy **łączy się** ze zniżką klubową −5%
(cena z kodem × 0,95), ale **nie łączy się** z klubową ceną −40% przy produktach premium. Przy premium w klubie
liczy się tylko −40% od ceny regularnej, a kod nie jest pokazywany, żeby nie sugerować kumulacji — dziś żaden
produkt nie ma obu naraz, więc to zabezpieczenie na przyszłość (`codeApplies` w `app.shop.js`). Przykład:
morfologia z rozmazem 31,00 zł regularnie, 24,80 zł z kodem, 23,56 zł z kodem i klubem; ferrytyna 49,00 zł
regularnie i 29,40 zł w klubie, bez kodu.

Wejście w zadanie czyści też zgody klubowe i tryb członka, więc każdy uczestnik zaczyna poza klubem — zgodnie
z założeniem Maćka z tablicy.

### Karta produktu niedostępnego (2026-09-08)

Gdy badania lub pakietu nie da się kupić w wybranym kontekście (Punkt Pobrań / sposób realizacji), karta
nie pokazuje już zachęty do ALAB club nad przyciskiem. Zniżka dotyczyłaby czegoś, czego nie można dodać do
koszyka, a jedyne sensowne działanie to zmiana Punktu Pobrań albo sposobu realizacji — i to zostaje jedynym
przyciskiem. Karta wygląda wtedy tak: tytuł → pigułka „Niedostępne w wybranym Punkcie Pobrań” z podpowiedzią
→ przycisk „Zmień punkt”. Duży banner klubu niżej w treści zostaje, bo nie jest częścią decyzji o zakupie.
Kod rabatowy zostaje w kodzie warunkowo, ale dziś żaden niedostępny produkt go nie ma.

### Poprawki z planu badawczego (2026-09-08)

- ~~**Pakiet Sport ma 6 składowych i nie zawiera morfologii**: CRP, ferrytyna, żelazo w surowicy, witamina D,
  witamina B12, kreatynina. Wcześniej miał 4 składowe, w tym morfologię z rozmazem — a to dawało obejście
  zadania „znajdź morfologię” (Pacjent trafiałby na nią przez pakiet) i przeczyło liczbie badań z planu.
  Cena zmieniona z 280,50 zł na **199,00 zł**, bo suma składowych to 245,40 zł, a opis pakietu obiecuje,
  że w pakiecie płaci się mniej niż za każde badanie osobno.
- **ALAB w domu pokazuje Warszawę, nie Kraków** — plan badania stawia Pacjenta w Warszawie, a Punkt Pobrań
  w prototypie jest na Puławskiej. Dwa różne miasta na jednym ekranie byłyby dla uczestnika zgrzytem.
  Kwota 109 zł bez zmian.

- **Morfologii nie ma też w „Pakiecie Zdrowie podstawowy”**, bo ten pakiet jest oznaczony jako popularny,
  czyli stoi na ekranie głównym sklepu — wystarczyłoby go otworzyć, żeby znaleźć morfologię w składowych.
  W jej miejsce weszło żelazo w surowicy (nadal 8 badań). W pozostałych pakietach morfologia zostaje:
  są realistyczne i żaden nie jest na ekranie głównym.
- **Ceny pakietów wyrównane tak, żeby każdy był tańszy od sumy składowych** — opis pakietu obiecuje, że
  „kupując w pakiecie, płacisz mniej niż za każde badanie osobno”, a trzy pakiety były droższe:
  Zdrowie podstawowy 199,00 → **149,00 zł** (suma 178,08), dla kobiet 540,90 → **279,00 zł** (suma 322,54),
  alergiczny wziewny 189,00 → **72,00 zł** (suma 84,70). Czwarty, tarczycowy rozszerzony, miał cenę regularną
  181,50 zł przy sumie 185,08 zł, czyli oszczędność na papierze — teraz 159,00 zł regularnie i 127,20 zł z kodem.
  Sprawdzone skryptem: każdy pakiet ma cenę poniżej 95% sumy składowych.

Dwa punkty z planu domknięte decyzją Jarka (2026-09-08): **Pakiet Sport** miał nie być widoczny na ekranie głównym
sklepu i tak jest — nie jest oznaczony jako popularny, więc dochodzi się do niego przez kategorię, filtry albo
wyszukiwarkę. **Kwota opłaty za pobranie** zostaje w prototypie bez liczby (dopisek „+ opłata za pobranie”);
pytanie 1.1 planu trzeba więc czytać jako cenę samego badania.

### Zaślepki zakładek (test niemoderowany)

Start, Wyniki i Koszyk to zaślepki wg wzoru „Rejestracja - krok 8” 3136:31878. Wartości 1:1 z Figmy:

- **klocki szkieletu**: Background/surfaceQuaternary (#eaf0f9), promień 12 px dla każdego klocka, bez ramek
  (klocki w białych kartach z obwódką zlewały się w plamę — pozycje listy Wyników rozdziela teraz odstęp 44 px),
- **karta**: szerokość 335, promień 44, padding 48/20/36, gap 24 (grupa tekstu i przycisk), tło rgba(255,255,255,.01),
  rozmycie 22, cień 0 4 60 rgba(33,55,163,.1), środek 13 px nad środkiem ekranu,
- **wnętrze karty**: pigułka „Niedostępne w badaniu” i tekst jako jedna grupa z gapem 20, tytuł (display/medium)
  i opis (body/xsmall) z gapem 12, w opisie dwie linijki rozdzielone pustą linią,
- **przycisk** (tylko w Koszyku): Button secondary „Zakończ zadanie”.

Szkielet Wyników odwzorowuje karty wyniku jako białe kontenery z obwódką i klockami w środku (tytuł, osoba,
data, pill statusu), a nie jednolite szare bloki. Zakładka Wyniki nie pokazuje licznika nowych wyników, bo jest
zaślepką — licznik wróci sam, gdy zdejmiemy `APP.resultsStub`. Licznik Koszyka działa dalej.

Tytuły: „Ekran startowy”, „Wyniki badań”, „Koszyk”. Szkielet Startu jest 1:1 z wzoru; szkielety Wyników
i Koszyka odwzorowują ich własne układy (lista kart wyniku, pozycje koszyka z podsumowaniem) — to nasze założenie,
bo wzór był tylko dla Startu.

Pełny moduł Wyników nie został usunięty — jest pod trasą `/app/wyniki-pelne` (poza ścieżką badania,
wejście z panelu prototypu). Kod: `app/app.stubs.js`.

### Elementy UI systemu i Punkt Pobrań (etap 1 domknięty)

W prototypie nie ma zegara, sygnału, baterii ani kreski gestu — `app/app.js` ustawia `DS.SYSTEM_UI = false`,
a pasek statusu trzyma wtedy tylko wysokość (odstęp pod notch zostaje). Storybook pokazuje komponenty
w pełnej wersji, bo tam dokumentujemy design system, nie prototyp badawczy.

Tapnięcie w komórkę adresu na ekranie sklepu (oraz CTA „Zmień punkt” na karcie niedostępnego badania)
otwiera zaślepkę Punktu Pobrań pod adresem `/app/punkt-pobran`: belka z krzyżykiem, szkielet listy punktów
i karta z komunikatem, w której drugie zdanie brzmi „Wróć do poprzedniego ekranu.” Wcześniej był tam snackbar.

### Zadania badawcze: arkusz z treścią, koniec zadania i adresy

Kliknięcie karty zadania otwiera **arkusz z treścią zadania**, rozłożony na cztery części: nagłówek
(„Zadanie 1”), krótki tytuł, scenariusz w jednym zdaniu i **punktowaną listę wymagań** pod etykietą
„W tym zadaniu”. Punktatorem jest zielony tick, więc od razu widać, że to lista rzeczy do zrobienia —
to znaczniki, nie pola do klikania, żeby nie dawać uczestnikowi kolejnej rzeczy do obsłużenia. Akcje to
„Rozpocznij zadanie” i „Zamknij” (w naszym DS Button `ghost`, czyli trzeci wariant; osobnego `tertiary`
ten system nie ma).

Arkusz końca zadania jest **celowo prosty**: tick, co wylądowało w koszyku, jedno zdanie i dwie drogi dalej.
Bez powtarzania wymagań — uczestnik ma je już za sobą.

Scenariusze i wymagania są rozpisane z różowych naklejek „Treść” z tablicy 11:757 i **tablica pozostaje
źródłem prawdy** — gdy Maciej je zmieni, aktualizujemy `TASKS` w `app/app.stubs.js`.

Arkusz sukcesu pojawia się **tylko po dodaniu właściwego produktu** dla danego zadania (mocz → `t-mocz`,
Pakiet tarczycowy → `p-tarcz`, morfologia → `t-morf`; produkt jest ostatnim polem wpisu w `TASKS`). Inny produkt
normalnie wpada do koszyka — uczestnik może się pomylić i szukać dalej — ale sukcesu nie ogłaszamy i adres
końca zadania się nie zmienia. Gdy uczestnik w ogóle nie trafi, zadanie kończy przyciskiem w zakładce Koszyk.

Po dodaniu właściwego produktu pojawia się **arkusz „Zadanie wykonane”**: zielony tick, nazwa produktu,
zdanie o tym, że można jeszcze poklikać i wrócić przyciskiem w zakładce Koszyk, oraz akcje „Przejdź do kolejnego
zadania” i „Przeglądaj dalej”. Arkusz nie zamyka eksploracji i pokazuje się raz na zadanie.

W tym samym momencie adres zmienia się na **`/app/koniec/<produkt>/<tryb klubu>`**, na przykład
`/app/koniec/badanie-ogolne-moczu/w-klubie`. To jest ten warunek ukończenia zadania, o który prosił Maciej:
osobny adres per produkt i per wersja z klubem oraz bez. „Przeglądaj dalej” cicho wraca adresem na kartę produktu,
a wejście wprost na adres końca (odświeżenie, wklejony link) rysuje kartę produktu z tym samym arkuszem.

### „Resetuj prototyp" na ekranie startowym (2026-09-09)

Pod listą zadań siedzi mały link **„Resetuj prototyp"** (`.tasks__reset`, podkreślony, na granacie). Czyści cały
stan sesji — także **członkostwo w ALAB club**, które normalnie przechodzi między zadaniami — więc uczestnik
zaczyna dokładnie jak nowy: pusty koszyk, Punkt Pobrań, poza klubem, bez filtrów. Potrzebne, gdy ktoś testuje
kilka razy z rzędu albo gdy moderator chce zacząć sesję od czystego stanu.

Po resecie pokazujemy snackbar. Nie zakładamy, że się udało: sprawdzamy stan po `APP.reset()` (brak `shop`, brak
klubu w pamięci i w `sessionStorage`) i dopiero wtedy dajemy „Prototyp zresetowany" w wariancie success —
w prywatnym oknie `sessionStorage` może być niedostępny, wtedy leci wariant error.

### Ekran startowy i wejście w zadanie

**Ekran startowy `/app/zadania` jest wejściem do prototypu** — wpisanie `/app/` prowadzi wprost na niego, a proces
rejestracji, logowania i onboardingu jest **schowany**: nie ma go w panelu prototypu i nie da się na niego trafić
z flow. Ekrany zostają w kodzie i działają pod swoimi adresami (`/app/logowanie`, `/app/rejestracja/1`,
`/app/alab-club`…), więc wrócą, gdy będą potrzebne — np. ekran zgód ALAB club, który ma się otwierać z karty
produktu. Wejście ustawia `APP.setHome('zadania')` w `app/app.stubs.js`; tam też jest lista schowanych tras
i tam wraca każdy nieznany adres.

Ekran zbudowany 1:1 z „Start screen” 3153:32180: granat `#04387c`, kadr ProductBackground (568×612 od −24,−94)
z blobem 841 obróconym o 75° (ten sam asset co splash — sprawdzone, plik z Figmy jest identyczny), gradient
184,15° i rozmyta poświata `#096BCD` z Ellipse 393. Treść: logo ALAB laboratoria 224×36, nadtytuł „Prototyp do
badań ALAB” (800 12/20, uppercase), tytuł „Wybierz zadanie” (display/large 36/36) i lead „Każde zadanie zaczyna
się od nowa, z pustym koszykiem” (body/small 13/20, onScrimSecondary). Odstępy 80 / 32 / 12, treść 63 px od dołu,
marginesy 44. Karty: w Figmie CellTestResult z wyłączonymi wierszami, w kodzie `DS.Cell` bez ikony, z podtytułem
i chevronem 20, zgrupowane w jeden blok (zaokrąglone tylko skrajne narożniki 28, 1 px przerwy, wysokość 84).
Bez dolnej nawigacji.

Podtytuły kart nazywają produkty („Zamów badanie ogólne moczu”, „Zamów Pakiet tarczycowy”, „Zamów morfologię krwi”),
zgodnie z makietą. Warto o tym pamiętać przy analizie: uczestnik czyta całą listę przy pierwszym wejściu, więc
przed zadaniem 2 wie, że szuka Pakietu Sport, a przed zadaniem 3 — że istnieje dostawa do domu. Wariant z samymi
numerami to jedna linijka w tablicy `TASKS`.

- `/app/zadanie/1`, `/app/zadanie/2`, `/app/zadanie/3` — wejście w zadanie. Wygląda jak **uruchomienie aplikacji**:
  najpierw krótki ekran ładowania (ten sam splash z logo i spinnerem, co przy starcie apki, 1,2 s), potem przejście
  fade na ekran Start. Adres przez cały czas zostaje `/app/zadanie/N`, więc narzędzie badawcze widzi wejście
  w zadanie, a uczestnik nie widzi, że stan jest po cichu czyszczony: pusty koszyk, brak ALAB club, sposób
  realizacji na Punkcie Pobrań, wyczyszczone filtry i przeczytane wyniki. Podczas ładowania dolna nawigacja jest
  schowana (`APP.hideTabBar`), a kolor systemowego paska przechodzi na granat. Działa tak samo po kliknięciu karty
  i po wejściu wprost z linku — Useberry może linkować od razu w `/app/zadanie/2`.
- Zaślepka Koszyka ma pod tekstem przycisk **„Zakończ zadanie”**, który prowadzi na ekran wyboru zadań.
  Drugie zdanie w karcie brzmi „Jeśli zadanie jest skończone, kliknij poniżej.”

Webview (`/app/strona/...`) nie mówi już „placeholder”: belka trzyma tytuł przestrzeni („Opis badania”,
„Najczęstsze pytania”, „ALAB club”, „Regulamin”), a treść wyjaśnia, że ta część pokazuje stronę ALAB w oknie
aplikacji, i wymienia, co znajdzie się pod nią w gotowej wersji. Opisy są w polu `about` w `app/data.results.js`,
więc nowy webview dopisuje się jedną linijką.

Otwarte: pytanie 1.1 z planu badawczego („ile zapłacisz za to badanie”) nie ma odpowiedzi w koszyku, bo koszyk
został zaślepką. Uczestnik musi odczytać kwotę z karty produktu, gdzie widnieje cena i dopisek „+ opłata za pobranie”
bez kwoty. Do rozstrzygnięcia: pokazać kwotę opłaty na karcie produktu albo zmienić treść pytania.

## Adresy ekranów (ścieżki, nie hash) — 2026-09-08

Każdy ekran ma własny adres jako **ścieżkę**: `/app/produkt/morfologia-krwi`, a nie
`/app/index.html#/product/t-morf`. Powód jest badawczy, nie estetyczny: fragment po `#` nigdy nie
dociera do serwera, a narzędzia analityczne i badawcze rozpoznają ekran po adresie. Przy routerze
na hashu cała sesja uczestnika mogła zapisać się jako jeden adres (`/app/index.html`), więc nie dałoby
się policzyć, ile osób dotarło na kartę produktu ani ile zmieniło sposób realizacji. W Useberry
zadanie można kończyć na „specific URL”, i to działa tylko wtedy, gdy adres naprawdę się zmienia.

Jak to działa:

- **Router** (`app/app.js`) zmienia adres przez `history.pushState` i sam rysuje ekran — bez przeładowania,
  więc stan (koszyk, zgody) zostaje. Wstecz w przeglądarce i gest cofania działają normalnie.
- **Nazwy tras zostają wewnętrznie po angielsku** (`product/t-morf`), a w URL pokazujemy polski slug.
  Tłumaczenie siedzi w jednym miejscu: `PATH_WHOLE`, `PATH_SEG` i `PATH_ID` w `app/app.js`; mapy muszą być
  odwracalne, więc wartości nie mogą się powtarzać. Slugi produktów, kategorii i wyników powstają
  z ich nazw (`APP.slugs(...)` w `app.shop.js` i `app.results.js`), więc nowy produkt dostaje adres sam.
- **`<base href="/app/">`** w `app/index.html` trzyma ścieżki względne (CSS, JS, assety) przy katalogu
  aplikacji. Musi być statyczny i przed pierwszym `<link>`: preloader przeglądarki czyta go, zanim
  wykona jakikolwiek skrypt — ustawianie bazy z JS dawało falę 404 przy każdym głębokim adresie.
- **Netlify**: `netlify.toml` ma regułę `from = "/app/*" → to = "/app/index.html", status = 200`.
  Reguła nie zasłania istniejących plików, więc `version.json`, assety i storybook działają jak wcześniej.
- **Lokalnie**: `serve.py` (patrz „Uruchomienie”).
- **GitHub Pages** nie umie przepisać adresu na plik aplikacji, więc jest `404.html` w korzeniu: zapamiętuje
  ścieżkę ekranu, wraca do katalogu aplikacji, a skrypt w `app/index.html` odtwarza adres przez `replaceState`.
  Link do konkretnego ekranu działa więc i tam, tylko z jednym przeskokiem. **Do badania używamy Netlify** —
  tam adres ekranu jest oddawany od razu (reguła 200), bez przekierowania i bez sztuczek. Na Pages w konsoli
  widać kilkanaście nieudanych żądań przy każdym wejściu: statyczny `<base href="/app/">` jest dobrany pod
  Netlify, a Pages stoi w podkatalogu `/alab-prototype/`, więc preloader przeglądarki najpierw pyta o zły
  adres, a skrypt zaraz poprawia bazę i pliki wczytują się prawidłowo. Nic to nie psuje — to koszt trzymania
  jednego pliku dla dwóch hostingów.
- **Awaryjnie**: pod `file://` (bez serwera) router wraca do starych adresów z hashem, żeby prototyp
  dał się w ogóle otworzyć. Do badań używamy wersji z serwera.
- **Ścieżki do plików liczone raz na starcie, jako absolutne** (`DS.ASSETS`, `APP.file()` w `app/app.js`).
  Względny `src` renderowany z JS liczy się od adresu **bieżącego** dokumentu, a router go zmienia — więc po
  przejściu na `/app/produkt/...` `../ds/assets/` wskazywało `/app/ds/assets/` i zdjęcia (tło hero, banner klubu)
  się nie wczytywały. `new URL('../ds/assets/', document.baseURI)` na starcie rozwiązuje to raz na zawsze i działa
  nawet bez `<base>` (np. gdy przeglądarka trzyma w cache starszy `index.html`). To samo dotyczy „Sprawdź
  aktualizacje” w menu prototypu i linku do storybooka — inaczej pobierałyby pliki spod adresu ekranu.
- **`history.scrollRestoration = 'manual'`** — obowiązkowe przy tej zmianie. Odkąd ekrany mają prawdziwe
  adresy, przeglądarka próbuje przywrócić pozycję przewinięcia z historii i trafia w kontener innego ekranu
  (wszystkie mają tę samą strukturę DOM). Efekt: karta produktu otwierała się przewinięta o 2200 px,
  bez niebieskiego tła hero i z belką w stanie „on scroll”. Pozycje przewinięcia trzymamy sami w `st().scroll`.

Adresy ekranów, które są w ścieżce badania (do wklejenia w konfigurację zadań):

| Ekran | Adres |
| --- | --- |
| **Ekran startowy — wybór zadań (wejście)** | `/app/zadania` (albo samo `/app/`) |
| Wejście w zadanie 1 / 2 / 3 | `/app/zadanie/1`, `/app/zadanie/2`, `/app/zadanie/3` |
| Sklep — strona główna | `/app/sklep/punkt-pobran` (albo `/w-domu`, `/zestaw-wysylkowy`) |
| Wyszukiwarka (pusta) | `/app/szukaj/punkt-pobran` |
| Wyniki wyszukiwania | `/app/wyniki-wyszukiwania/punkt-pobran` |
| Kategoria „Badania i pakiety ogólne” | `/app/kategoria/badania-i-pakiety-ogolne/punkt-pobran` |
| Listing „Badania” / „Pakiety badań” | `/app/lista/badania/punkt-pobran`, `/app/lista/pakiety/punkt-pobran` |
| Karta produktu: morfologia z rozmazem | `/app/produkt/morfologia-krwi-obwodowej-z-rozmazem` |
| Karta produktu: morfologia krwi | `/app/produkt/morfologia-krwi` |
| Karta produktu: Pakiet tarczycowy | `/app/produkt/pakiet-tarczycowy` |
| Punkt Pobrań (zaślepka) | `/app/punkt-pobran` |
| Zakładki: Start / Wyniki / Koszyk | `/app/zakladka/start`, `/app/zakladka/wyniki`, `/app/zakladka/koszyk` |
| ALAB club — zgody | `/app/alab-club` |
| Rejestracja: krok 1 / 2 / 3 | `/app/rejestracja/1`, `/app/rejestracja/2`, `/app/rejestracja/3` |
| Logowanie, biometria, reset hasła | `/app/logowanie`, `/app/biometria`, `/app/reset-hasla` |
| Wyniki poza badaniem (pełny moduł) | `/app/wyniki-pelne`, `/app/wynik/morfologia-krwi-obwodowej` |

Adres każdego innego ekranu podejrzysz w konsoli: `APP.url('product/p-tarcz')`.

### Tryb ALAB club w adresie

Adres mówi też, czy uczestnik jest w klubie — bez tego nie da się policzyć, ile osób kupiło z klubem, a ile bez
(uwaga Maćka z tablicy). Segment `w-klubie` albo `bez-klubu` dokładamy tam, gdzie zmienia to, co widać: na
ekranach sklepu z cenami, na karcie produktu i w koszyku, czyli tam, gdzie kończy się zadanie:

| Ekran | Bez klubu | W klubie |
| --- | --- | --- |
| Sklep | `/app/sklep/punkt-pobran/bez-klubu` | `/app/sklep/punkt-pobran/w-klubie` |
| Karta produktu | `/app/produkt/pakiet-tarczycowy/bez-klubu` | `/app/produkt/pakiet-tarczycowy/w-klubie` |
| **Koszyk (koniec zadania)** | `/app/zakladka/koszyk/bez-klubu` | `/app/zakladka/koszyk/w-klubie` |

Ekran wyboru zadań, wejście w zadanie i ekran zgód zostają bez wariantu — tam tryb jeszcze nic nie zmienia.

**Filtry też są w adresie** („przejście w pakiety z filtrów → nowy url” z tablicy). Segment pojawia się tylko
wtedy, gdy filtr jest włączony, więc domyślne adresy zostają krótkie: rodzaj produktu jako `tylko-pakiety`
albo `tylko-badania`, podkategoria jako `pod-<nazwa>`. Pełny przykład:
`/app/kategoria/hormony/tylko-pakiety/pod-tarczyca/punkt-pobran/bez-klubu`. Prefiksy `tylko-` i `pod-` trzymają
wartości filtrów rozłączne z identyfikatorami ekranów (`lista/pakiety` to inny byt niż filtr „tylko pakiety”),
a wklejony link odtwarza oba filtry przed narysowaniem listingu.
Adres jest źródłem prawdy w obie strony: wklejony link z `w-klubie` ustawia tryb przed narysowaniem ekranu.

**Członkostwo przechodzi między zadaniami.** Kto dołączył w zadaniu 1, widzi zadania 2 i 3 już jako członek
klubu; kto nie dołączył, robi je bez klubu. Trzymamy to w sesji przeglądarki (`sessionStorage`), więc przetrwa
też wejście w kolejne zadanie z linku — a tak właśnie robi to Useberry. „Zacznij od nowa” w menu prototypu
czyści pamięć, więc kolejny uczestnik startuje poza klubem.

### Sposób realizacji w adresie

Sposób realizacji jest **segmentem ścieżki**, dopisywanym na końcu adresu tych ekranów, na których widać
chipy realizacji (strona główna sklepu, wyszukiwarka, wyniki wyszukiwania, listingi kategorii i „wszystkie”):

| Kontekst | Adres strony głównej | Adres listingu kategorii |
| --- | --- | --- |
| Punkt Pobrań | `/app/sklep/punkt-pobran` | `/app/kategoria/badania-i-pakiety-ogolne/punkt-pobran` |
| ALAB w domu | `/app/sklep/w-domu` | `/app/kategoria/badania-i-pakiety-ogolne/w-domu` |
| zestaw wysyłkowy | `/app/sklep/zestaw-wysylkowy` | `/app/kategoria/badania-i-pakiety-ogolne/zestaw-wysylkowy` |

Dlaczego segment, a nie `?dostawa=dom`: narzędzia analityczne i badawcze potrafią traktować dwa adresy
różniące się tylko parametrem jako ten sam ekran, a to jest pomiar, na którym zależy nam najbardziej
(ile osób realnie zmieniło kontekst na dostawę do domu). Ścieżka nie zostawia tu miejsca na interpretację.

Jak się zachowuje:

- Kliknięcie chipa zmienia adres i **dokłada wpis do historii**, ale nie przerysowuje ekranu — treść
  odświeża się punktowo, pozycja przewinięcia zostaje. Przełączenie jest więc widoczne w raporcie,
  a dla uczestnika wygląda jak zwykła zmiana filtra.
- Wstecz w przeglądarce wraca do poprzedniego sposobu realizacji (adres i stan ekranu się zgadzają).
- Wklejony link z wariantem (`/app/sklep/w-domu`) ustawia sposób realizacji przed narysowaniem ekranu.
- Wejście bez wariantu (`/app/sklep`) dostaje go automatycznie, więc adres zawsze mówi, w jakim
  kontekście jest uczestnik.
- Wejście w zadanie (`/app/zadanie/1`) czyści stan, więc sposób realizacji wraca na Punkt Pobrań.

**Karta produktu zostaje jednym adresem** (`/app/produkt/morfologia-krwi`) — inaczej każde badanie miałoby
trzy warianty adresu i raport zrobiłby się nieczytelny. Kontekst dostawy jest już policzony na listingu,
z którego uczestnik wszedł na kartę. Nadal poza adresem: wybrane filtry (rodzaj produktu, podkategoria).
