# Copy w prototypie: odstępstwa, wyjątki i rzeczy do wyjaśnienia

Stan na 2026-09-09, wersja prototypu **2026.09.09-110**. Kanon: paczka `ALAB-copy-dla-Jarka-2026-09-09`
(mapy `copy-hifi-mapa-M1-autentykacja`, `copy-hifi-mapa-M3-sklep`, `ux-writing-lexicon`) oraz źródła klienta.
Hierarchia źródeł przy konflikcie jest ta z README paczki: **ustalenia klienta → nasz leksykon → web klienta → hi-fi**.

Plik istnieje po to, żeby przy kolejnym generowaniu map nikt nie „poprawił" świadomej decyzji z powrotem,
i żeby Kasper widział w jednym miejscu, co u nas nie zgadza się z kanonem i dlaczego.

Jak czytać sekcje:

- **A. Wyjątki sugerowane** — świadomie łamiemy kanon, potrzebna zgoda. To jedyna sekcja, która wymaga decyzji ALAB albo Kaspra. Dziś trzy: wiersz ceny klubowej (A1), notacja liczników (A2) i przycisk arkusza filtrów (A3).
- **B. Odstępstwa z natury prototypu** — nie są tematem do zatwierdzania, ale trzeba o nich wiedzieć, żeby nie mylić ich z błędem.
- **C. Rozjazdy w samych mapach** — odwzorowane dosłownie, bo prototyp wykonuje mapy; decyzja po stronie autora map.
- **D. Poza kanonem** — teksty, których mapy nie obejmują. Nasze propozycje, nie kanon.
- **E. Co zostało zmienione** — pełna lista podmian z 9 września.
- **F. Nietknięte „do decyzji"** — wiersze map, których świadomie nie ruszaliśmy.

---

## A. Wyjątki sugerowane (wymagają zgody)

### A1 · Wiersz ceny klubowej na kartach i w hero PDP · **SUGEROWANY WYJĄTEK**

**Kanon (leksykon 109, decyzja F1 z 2026-09-09):**

| Stan | Kanon |
| --- | --- |
| Poza klubem | „64,60 zł 5% taniej w klubie" |
| Poza klubem, promocja klubowa | „66,78 zł 40% taniej w klubie" |
| Klubowicz | „5% taniej, już naliczone" |
| Klubowicz, promocja klubowa | „40% taniej, już naliczone" |

**Co jest w prototypie:**

| Stan | Prototyp |
| --- | --- |
| Poza klubem | „64,60 zł **ekstra -5%** w klubie" |
| Poza klubem, promocja klubowa | „66,78 zł **zniżka -40%** w klubie" |
| Klubowicz | „Aktywne −5% w klubie" — **poza wyjątkiem, zgodne z leksykonem** |
| Klubowicz, niższa cena klubowa | „Aktywne −40% w klubie" — **poza wyjątkiem, zgodne z leksykonem** |

**Powód.** Kanon F1 stawia procent bezpośrednio za kwotą, bez żadnego słowa między liczbami. „64,60 zł 5%
taniej w klubie" czyta się wtedy jak wyrażenie matematyczne — kwota i procent zlewają się w jedno. Klient
zgłaszał to już wcześniej i właśnie dlatego poprzednie formy miały przerywnik słowny („ekstra", „zniżka").
To był ukryty cel tych słów, o którym leksykon nie wspomina: **F1 rozstrzygało słownictwo, nie typografię
wiersza**, więc luki nie zamknęło. Skill `ux-writer` potwierdza czytanie klienta — dwie liczby bez separatora
słownego łamią regułę „jeden przekaz na raz".

**Koszt wyjątku.** Wraca słowo „zniżka", którego leksykon 321 zakazuje w interfejsie, bo prawnicy klienta
odradzają „rabat" i „zniżkę". To jest cała cena tej decyzji i trzeba ją wprost przyjąć albo odrzucić.

**Zakres zwężony 2026-09-09: tylko linijka Z KWOTĄ, dla Pacjenta poza klubem.** Stan klubowicza wyszedł
z wyjątku: brzmi **„Aktywne −5% w klubie"** / **„Aktywne −40% w klubie"** i żadnej reguły nie łamie —
„zniżka" i „ekstra" wypadły, a „w klubie" to krótka forma, którą leksykon 109 wprost zaleca przy cenie.
Problem „równania" tam nie występuje, bo **ten string nie ma kwoty** — dwie liczby nie stoją obok siebie.

Dlaczego nie kanoniczne „5% taniej, już naliczone": w tym slocie cena główna JEST już ceną klubową,
a regularna stoi przekreślona obok. Comparativus „taniej" nie ma wtedy punktu odniesienia — tańsze niż co,
jeśli niższa cena jest już na ekranie (uwaga Jarka). Słowo „Aktywne" niesie to, czego nie niesie sama cena:
że Pacjent **już to ma**, a nie że może mieć — i tylko ta forma odróżnia stan klubowicza od zachęty.

**Reszta produktu mówi „taniej"** i została nietknięta: mały baner pod ceną, duży baner klubu, karuzela na
ekranie zgód klubu, webview, rozwinięcia zgód, toast po dołączeniu. Sprawdzone po zmianie: na ekranie
klubowicza nie ma żadnego z zakazanych słów.

**Alternatywa bez zakazanego słowa.** Przestawienie kolejności daje ten sam efekt i nie wychodzi poza słownik
zatwierdzony w F1:

> „64,60 zł **w klubie, 5% taniej**" · „66,78 zł **w klubie, 40% taniej**"

Kwota nadal prowadzi, między liczbami stoi słowo, żadne nowe wyrazy nie wchodzą. Wariant klubowicza
(„5% taniej, już naliczone") nie ma kwoty, więc problemu w nim nie ma i może zostać w brzmieniu F1.
Kropka środkowa problemu **nie** rozwiązuje: „·" to znak mnożenia, więc zrobiłaby z wiersza dosłowne równanie.
Półpauza też nie, bo czyta się jako minus.

**Status:** wprowadzone w prototypie decyzją Jarka 2026-09-09, do rozstrzygnięcia z Kasprem i klientem.
Zmiana to jedna linia (`app/app.shop.js`, `clubOffer` i `clubActive`).

### A2 · Liczniki przy etykietach: duża kropka, nie nawias · **SUGEROWANY WYJĄTEK**

**Kanon (mapa M3 wiersze 69 i 166, leksykon 234):** licznik w nawiasie, uzasadniony spójnością z licznikami
w przyciskach.

> wiersz 69: `Składowe pakietu | Zobacz składowe pakietu • 4 | Zobacz składowe pakietu (4) | podmień (licznik w nawiasie, jak „Pokaż wszystkie pakiety (6)")`
>
> wiersz 166: `Chipy podkategorii | Tarczyca • 2 | Tarczyca (2) | podmień separator na nawias, jak liczniki w przyciskach`

**Co jest w prototypie:** licznik po **dużej kropce** `•`, z odstępem 4px z każdej strony.

| Miejsce | Kanon | Prototyp |
| --- | --- | --- |
| Chipy typu i podkategorii | „Tarczyca (6)" | **„Tarczyca • 6"** |
| Wiersz składowych na karcie | „Zobacz składowe pakietu (4)" | **„Zobacz składowe pakietu • 4"** |
| Wiersze w arkuszu filtrów | „Tarczyca (6)" | **„Tarczyca • 6"** |
| Przyciski „Pokaż wszystkie…" | „Pokaż wszystkie pakiety (16)" | **„Pokaż wszystkie pakiety • 16"** |
| Nagłówki sekcji | — (kanon ich nie rusza) | „Pakiety badań • 3" (bez zmian, tak było od początku) |

**Powód (decyzja Jarka 2026-09-09).** Kropka środkowa `·`, którą mapa narzuca jako separator w linii, jest
**za mała przy naszym foncie i skali interfejsu** — na ekranie telefonu gubi się między etykietą a liczbą
i przestaje pełnić rolę separatora. Nawias z kolei domyka liczbę jako przypis do etykiety, co działa
w przycisku, ale na chipie i w wierszu listy czyta się ciszej niż powinno: licznik jest tam informacją,
której uczestnik szuka wzrokiem, a nie dopiskiem.

**Konsekwencja spójności, która przemawia za wyjątkiem:** nagłówki sekcji („Pakiety badań • 3") miały dużą
kropkę od początku i kanon ich nie dotyka. Przy nawiasach w chipach i przyciskach mielibyśmy w jednym
ekranie **dwie notacje tej samej liczby**. Po tej decyzji jest jedna, wszędzie.

**Koszt wyjątku.** Dwa odstępstwa naraz, oba do przyjęcia albo odrzucenia łącznie:

1. **forma** — duża kropka zamiast nawiasu (mapa M3, wiersze 69 i 166; leksykon 234),
2. **glif** — `•` zamiast `·`, wbrew regule nr 1 mapy M3: *„Separator w jednej linii to kropka środkowa • Tak: Pakiet · 4 badania • Nie: •"*.

Reguła została w mocy tam, gdzie separator rozdziela **słowa**, nie liczniki: meta karty to nadal
„Pakiet · 4 badania", a dane techniczne „Symbol MORF · Kod ICD C55". Wyjątek dotyczy **wyłącznie licznika
doklejonego do etykiety** na chipie, w wierszu listy i w przycisku.

**Status:** wprowadzone w prototypie 2026-09-09, do rozstrzygnięcia z Kasprem. Jeśli klient zostanie przy
dużej kropce, trzeba poprawić regułę nr 1 mapy M3 i leksykon 234, żeby przestały sobie przeczyć.
Zmiana to trzy komponenty: `DS.FilterChip`, `DS.ProductCard` (wiersz składowych) i etykieta przycisku
„Pokaż wszystkie…" w `app/app.shop.js`.

### A3 · Przycisk arkusza filtrów: „Pokaż N wyników" · **SUGEROWANY WYJĄTEK**

**Kanon (mapa M3, P02):** `Akcja główna | Pokaż 5 wyników | Pokaż 2 pakiety i 1 badanie (licznik nazywa to,
co pacjent zobaczy) | podmień` — bo słowo „wyniki" należy w tej aplikacji do **wyników badań**, nie do
trafień na liście (leksykon 1).

**Co jest w prototypie:** „Pokaż 11 wyników".

**Powód (decyzja Jarka 2026-09-09).** Rozbicie na dwie liczby nie mieści się na przycisku: „Pokaż 4 pakiety
i 7 badań" zajmuje całą szerokość obok „Wyczyść" i przy dłuższych liczebnikach zaczyna łamać się na dwie
linie. Krótka forma trzyma przycisk w jednej linii w każdym stanie filtrów.

**Koszt wyjątku.** Wraca słowo „wyniki" w znaczeniu trafień — dokładnie to, czego leksykon 1 nie chce,
żeby zakładka „Wyniki" znaczyła jedno. Łagodzi to fakt, że **ten sam dług wisi już w kanonie**: pusty stan
wyszukiwarki („Brak wyników dla „X”") mapa przyjmuje świadomie (LXXVI, rozjazd C4). Po tej decyzji obie
formy są spójne między sobą, choć niespójne z leksykonem.

**Alternatywy, gdyby klient nie chciał słowa „wyniki":**

- „Pokaż 11 badań i pakietów" — dłuższe od formy kanonicznej, więc nie rozwiązuje problemu miejsca,
- „Pokaż 11 pozycji" — krótkie i neutralne, ale „pozycja" to słownik koszyka, nie katalogu,
- **„Pokaż wszystkie • 11"** — najkrótsze, używa notacji licznika, którą już mamy w przyciskach
  („Pokaż wszystkie pakiety • 16"), i nie nazywa trafień żadnym słowem. Do rozważenia, jeśli „wyniki" padną.

**Status:** wprowadzone w prototypie 2026-09-09, do rozstrzygnięcia z Kasprem. Zmiana to jedna linia
(`showLabel` w `app/app.shop.js`).

---

## B. Odstępstwa z natury prototypu (do wiedzy, nie do zatwierdzania)

| # | Rzecz | Kanon | U nas | Dlaczego |
| --- | --- | --- | --- | --- |
| B1 | Odliczanie ponownego wysłania kodu | 0:59 | **0:29** | API blokuje wysłanie na minutę, ale w prototypie uczestnik nie ma po co czekać minuty na ekranie, którego i tak nie testujemy |
| B2 | Komunikaty o samym prototypie | leksykon zakazuje em dasha | „Pełny opis **—** treść z API w kolejnym etapie", „FAQ badania — w kolejnym etapie", „Pobieranie PDF — poza prototypem", „Udostępnianie wyniku — systemowy arkusz, poza prototypem" | To nie jest copy produktu, tylko informacja, że dalej nic nie ma. Do decyzji, czy leksykon obejmuje tę warstwę; jeśli tak, zamieniamy pauzy na dwukropek |
| B3 | Liczniki w tekstach | mapy podają przykłady z POC („Pokaż wszystkie pakiety (6)") | „• 16", „• 53" | Nasz katalog ma 73 pozycje, POC 25 — liczby w copy są wyliczane, nie wpisane. Notacja licznika: patrz wyjątek A2 |
| B4 | Ekrany autentykacji | trzynaście ekranów M1 | ukryte w badaniu | Badanie zaczyna się od hubu zadań; copy M1 doprowadziliśmy do kanonu, ale uczestnik go nie zobaczy |
| B5 | Zestaw wysyłkowy | POC ma 5 badań w 3 kategoriach | to samo, ale nasze nazwy | Przypisania kanałów wyrównane do zasady POC 2026-09-09; nazwy produktów są nasze, bo katalog jest większy |

---

## C. Rozjazdy w samych mapach, odwzorowane dosłownie

Prototyp wykonuje mapy wiersz po wierszu, więc jeśli dwie mapy mówią co innego, w prototypie widać oba.
Decyzja należy do autora map.

| # | Rozjazd | Skutek w prototypie | Status |
| --- | --- | --- | --- |
| C1 | „bon 20%" (M3 3.2) vs „Voucher 20%" (M3 3.4, M1 A14) | — | **ROZSTRZYGNIĘTE 2026-09-09: wszędzie „voucher".** Do poprawy w leksykonie 330, mapie M1 wiersz 99 i M3 wiersz 84 |
| C2 | Kolejność korzyści klubu: M1 A14 daje 5% → urodziny → voucher, M3 3.4 daje 5% → voucher → urodziny | ekran klubu ma kolejność M1, baner na karcie produktu kolejność M3 | otwarte |
| C3 | „Niedostępne w wybranym punkcie" (M3 3.1) przeczy regule z sekcji 1 tej samej mapy: „Punkt Pobrań dwiema wielkimi literami we wszystkich formach" | prototyp trzyma regułę: „Niedostępne w wybranym **Punkcie Pobrań**" | otwarte |
| C4 | Słowo „wyniki": w belce P05 wychodzi, w pustym stanie wyszukiwarki zostaje jako świadomy dług (LXXVI) | belka „Znalezione badania i pakiety", ale pusty stan „Brak wyników dla „xyz"" | otwarte |
| C5 | Kropka na końcu tytułu „Brak badań dla tych filtrów." | pozostałe tytuły pustych stanów u nas kropki nie mają | otwarte |
| C6 | Zakres godzin z dywizem („07:00 - 11:00"), gdy ta sama sekcja zakazuje em dasha i narzuca kropkę środkową jako separator w linii | zakres z dywizem, jak w mapie | otwarte, zakres to typowo półpauza |
| C7 | Ta sama korzyść klubu ma dwie akcje: M1 A14 „zostaje do odpowiedzi ALAB (K6)", M3 3.4 „podmień wg K6" | podmienione (wersja M3) | otwarte |

---

## D. Poza kanonem: teksty, których mapy nie obejmują

To nasze propozycje, nie kanon. Zgłaszam je, zamiast dopisywać do leksykonu jednostronnie.

| # | Gdzie | Nasz tekst | Uwaga |
| --- | --- | --- | --- |
| D1 | Pusty stan sheeta wyboru kraju | „Brak wyników" + „Spróbuj wpisać nazwę kraju inaczej." | **Trzecia** wersja tego zdania obok hi-fi („Sprawdź pisownię lub wyczyść wyszukiwanie…") i wyszukiwarki sklepu („Sprawdź pisownię lub wyszukaj inną frazę"). Mapa M1 mówi „zostaje", ale ujednolicenie warto zaplanować razem z długiem na słowie „wyniki" (C4) |
| D2 | Brak wymaganej zgody, krok 1 | „Brak zgody wymaganej" | Kanon M1: „Bez zgody na Regulamin i Politykę prywatności nie założymy konta". Nasz tekst nazywa stan, a nie mówi, co zrobić — do podmiany, gdy domkniemy formę (decyzja 5.10: zdanie przy przycisku czy snackbar) |
| D3 | Brak zgód klubowych | „Zaznacz wymagane zgody, żeby dołączyć do ALAB club" | Kanon M1 A14: „Bez obu zgód nie dołączymy Cię do klubu" |
| D4 | Błędny kod SMS | „Kod nieprawidłowy. Sprawdź SMS i spróbuj ponownie." | Leksykon 5b nie ma jeszcze tej treści (mapa M1 to zauważa). Nasza propozycja do dopisania albo podmiany |
| D5 | Nazwy alergenów w wyniku | „Trawy — mieszanka (gx)", „Kot — nabłonek (e1)" | Dane przykładowe z em dashem. Realne nazwy ALAB używają dywizu; do wyrównania, gdy przyjdą z API |
| D6 | Wyjście do logowania na intro i hubie | **przycisk** „Masz już konto? Zaloguj się" | Kanon M1 (K3) mówi „tekst z linkiem, jak stopka logowania". Podmieniłem same słowa; zamiana przycisku na link zmienia hierarchię ekranu, zwłaszcza na hubie, gdzie to przycisk `oncolor`. **Decyzja Jarka.** Skill zgłasza dodatkowo, że pytanie w etykiecie przycisku to słaby wzorzec CTA |

### D7 · Plus przy „Dodaj" · **ROZSTRZYGNIĘTE 2026-09-09: plus jako IKONA + etykieta „Dodaj"**

Zauważone przez Jarka 2026-09-09. Ta sama akcja — dodanie produktu do koszyka, w kodzie jedno
`data-action="add-to-cart"` — ma w kanonie **dwie różne etykiety, i plus tylko w jednej**:

| Gdzie | Kanon | Akcja w kodzie |
| --- | --- | --- |
| Kafelek na liście | „**+** Dodaj" (decyzja F2) | `add-to-cart` |
| Karta produktu, przycisk główny | „Kup badanie" · „Kup pakiet" (M3 3.2, „zostaje") | `add-to-cart` |
| Karta produktu, przyklejone CTA | „Kup badanie • 29,45 zł" | `add-to-cart` |

Uzasadnienie F2 brzmi: *„plus mówi, co się stanie"*. Jeśli to prawda, to na karcie produktu, gdzie ta sama
akcja nazywa się „Kup badanie", plusa brakuje. Jeśli plus nie jest potrzebny przy „Kup", nie jest potrzebny
przy „Dodaj". Dodatkowo **czasownik jest inny w obu miejscach** — raz „dodaj", raz „kup" — więc produkt uczy
dwóch nazw jednej czynności.

Trzy drogi, każda spójna wewnętrznie:

1. **Akcja to dodawanie do koszyka.** Kafelek „Dodaj do koszyka" (kandydat z webu klienta), karta produktu
   to samo. Plus zbędny, bo dopełnienie mówi wszystko. Minus: dłuższa etykieta na wąskim kafelku.
2. **Akcja to kupowanie.** Kafelek „Kup", karta produktu „Kup badanie" / „Kup pakiet". Krótko, spójnie,
   bez plusa. Minus: „Kup" na kafelku sugeruje przejście do płatności, a lądujemy w koszyku.
3. **Plus jako IKONA, nie znak w tekście.** Kafelek: ikona `plus` w `leadingIcon` plus etykieta „Dodaj";
   karta produktu bez zmian. Wtedy plus jest elementem interfejsu, nie stringiem — nie trzeba go tłumaczyć,
   a czytnik ekranu nie odczyta „plus Dodaj" jako treści.

**Rekomendacja: droga 1.** „Dodaj do koszyka" nazywa akcję i cel, nie potrzebuje plusa, jest kandydatem
z webu klienta (więc zgodna z hierarchią źródeł) i spełnia wzorzec CTA „czasownik + obiekt", którego
„+ Dodaj" nie spełnia. Karta produktu zostaje przy „Kup badanie", bo tam przycisk jest głównym działaniem
ekranu i ma inną wagę — ale wtedy warto to rozstrzygnąć wprost, a nie zostawiać jako przypadek.

**Decyzja Jarka 2026-09-09: droga 3 — plus jest ikoną, etykieta brzmi „Dodaj".** Jarek dodał to wprost
w Figmie: w `ButtonTiny` na kafelku slot `iconPlaceholder` trzyma ikonę **`ic_outline_plus`** 16×16
w `content/onaccent`, a obok stoi tekst „Dodaj" (CellTest `1897:55043` w „Listing • Kategoria" `653:6660`).

Prototyp odwzorowuje to 1:1: ikona `plus` doszła do zestawu (`ds/assets/ic_outline_plus.svg` → `ds/icons.js`,
`fill` przepisany na `currentColor`), `DS.ProductCard` dostał parametr `ctaIcon`, domyślnie `plus`. Zmierzone:
ikona 16×16, biała, odstęp 4px do etykiety — zgodnie z `gap-[4px]` i `size-[16px]` z Figmy.

**Dlaczego to jest dobre rozwiązanie, a nie kompromis.** Znika jedyny realny zarzut wobec „+ Dodaj": plus
przestał być znakiem w stringu. Nie trzeba go tłumaczyć, nie wchodzi do leksykonu, a **czytnik ekranu
odczytuje samą etykietę „Dodaj"** — sprawdzone, `textContent` przycisku to dokładnie „Dodaj". Wcześniej
odczytałby „plus Dodaj" jako treść. Wariant niedostępny („Zmień punkt") ikony nie ma, też sprawdzone.

**Zostało otwarte:** karta produktu nadal mówi „Kup badanie" / „Kup pakiet" (kanon M3 3.2, „zostaje"), więc
ta sama akcja ma w produkcie **dwa czasowniki** — „dodaj" na kafelku, „kup" na karcie. To już nie kwestia
plusa, tylko nazwy czynności; do rozstrzygnięcia, czy karta produktu też mówi „Dodaj", czy zostaje przy
„Kup", bo tam przycisk jest głównym działaniem ekranu.

Poprawione już przy tym przebiegu, bez czekania na decyzję, bo kanon jest jednoznaczny:

- toast po dołączeniu do klubu: „Witaj w ALAB club. Ceny klubowe są już aktywne." → **„Witaj w ALAB club · od teraz 5% taniej"** (leksykon 330)
- powitanie po rejestracji: „Konto gotowe. Witaj w ALAB club!" → **„Konto gotowe · witaj w ALAB club"** (bez wykrzyknika, kropka środkowa jak w 330)
- blokada konta: „…infolinią ALAB." → **„…infolinią ALAB laboratoria."** (gołe „ALAB" nie jest nazwą firmy, CXV.B)
- opis Borelioza wysyłkowa: em dash → przecinek (leksykon 3)

---

## E. Co zostało zmienione 9 września

Pełne tabele podmian są w `README.md`. W skrócie:

| Obszar | Podmian | Najważniejsze |
| --- | --- | --- |
| M3, zakazane słowa | 7 | ceny klubowe, banery klubu, „Kupując w pakiecie, oszczędzasz" → „Pakiety z tym badaniem", webview |
| M3, kanon leksykonu | 20 | meta karty „Pakiet · 4 badania", CTA „+ Dodaj", belka „Znalezione badania i pakiety", etykiety filtrów rzeczownikiem, „Sposób realizacji", godziny dwucyfrowe, wielokropek, znak minus, liczniki w nawiasach |
| Przebieg `/ux-writer` | 3 | „Zobacz składowe pakietu (4)" (mój błąd: wziąłem kanon nagłówka sekcji i przyłożyłem do przycisku), stany puste rozróżniają przyczynę, przycisk „Wyczyść filtry" |
| M1, autentykacja | 19 | „Masz już konto? Zaloguj się", „E-mail", „Brak numeru PESEL", data DD.MM.RRRR z automatycznym separatorem, „Płeć", CTA „Zarejestruj się", „rozwiń/zwiń", `aria-label` na sześciu polach kodu SMS, „akceptuję", „Sp. z o.o." |
| M1, ósme „zniżki" | 1 | rozwinięcie zgody klubowej: „naliczania **zniżek**" → „naliczania korzyści i komunikacji o nich" — przeoczone przy M3, bo nie dotyczy cen |
| Cofnięcie F1 | 1 | wiersz ceny klubowej, patrz sekcja A1 |
| Ten przebieg | 4 | toast klubu, powitanie, infolinia, em dash w opisie produktu |

---

## F. Nietknięte „do decyzji"

Wiersze, których świadomie nie ruszaliśmy, bo mapy oznaczają je jako otwarte.

**Mapa M1, sekcja 5:** treść trzech slajdów intro i tagline splasha (5.4, decyzja ALAB), ekran biometrii A15
(5.5), przycisk „Zaloguj się z Face ID" (5.6), reguły hasła (5.8), gwiazdka „* Wymagane" i forma komunikatu
o brakującej zgodzie (5.10), stopka huba (5.11), „Zmień numer" i „Potwierdź" na ekranie kodu SMS (5.12).

**Mapa M3, sekcja 6:** etykiety „Wybierz kategorię" nad siatką kafli i „Przeglądaj tylko" nad chipami
(punkt 5) — **decyzja Jarka**, w prototypie ich nie ma.

**Do ALAB:** brzmienie zgody na kroku 1, model klubu w rejestracji, trzecia korzyść klubu (K6), FAQ w formach
neutralnych, pełna klauzula zgody na przetwarzanie danych w klubie (w prototypie mamy skrót, nie wymyślamy
treści prawnej).

**Do devów:** czy API sprawdza trzy reguły hasła z webu klienta (5.8).
