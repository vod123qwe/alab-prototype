# Zasady i format mapy copy: propozycje po wdrożeniu (2026-09-09)

Sześć punktów o procesie, nie o słowach. Wszystkie wyszły z rzeczy, które przy wdrażaniu copy
**wyglądały jak błąd copy, a były błędem struktury pliku** - i dlatego warto, żeby kanon i format mapy
o nich mówiły. Uzupełnienia do `copy-hifi-mapa-format-spec.md`.

---

## Z1 · Override blokuje propagację z biblioteki

**Mechanika.** Komponenty na ekranach są zdalne, więc podmiana w design systemie ma drogę do ekranów.
Ale **każdy tekst wpisany ręcznie na instancji zostaje stary** - biblioteka nie ma jak go nadpisać.
Dotyczy to także override'ów **wewnątrz masterów DS**: master `CellTest` nadpisywał przekreśloną cenę,
więc poprawka w `PriceRow` nie miała jak dojść do kart. Komponent nadpisujący inny komponent łamie
cały łańcuch w dół.

**Dowód z pliku.** W jednej instancji `PriceRow` na masterze produktu: węzeł bez override'u przyjął
nowy tekst z DS, sąsiedni z override'em został stary. Ta sama runda, ta sama instancja.

**Wniosek dla formatu mapy.** Wiersz „podmień" powinien mówić **gdzie**:

| Wartość | Znaczenie |
| --- | --- |
| `main` | zmiana w main componencie, propaguje sama |
| `property` | zmiana wartości property komponentu (podać nazwę, np. `✏️ Price`) |
| `instancja` | tekst istnieje tylko jako override na ekranie, trzeba ruszyć każdą instancję |

Bez tej kolumny wykonawca robi podmianę w komponencie, widzi „gotowe", a na ekranach nic się nie
zmienia. Zdarzyło się nam to na 12 pozycjach.

---

## Z2 · Zdanie z wartością zmienną nie mieszka w jednej warstwie z tą wartością

**Case.** Linijka klubowa brzmiała „189,05 zł ekstra -5% w klubie" i była **jedną warstwą tekstową**.
Skutki, wszystkie policzone w pliku:

1. Każda realna cena produktu wymagała override'u na tej warstwie, a override zamrażał **całe zdanie**.
2. Przełącznik wariantu `ALAB club member` zmieniał warianty, ale **napis zostawał** - projektant
   klikał i nic się nie działo. 72 z 85 wierszy było w tym stanie.
3. Po przełączeniu na wariant klubowicza karta pokazywała ofertę dla nie-klubowicza, czyli
   **komunikat sprzeczny ze stanem**.

**Naprawa.** Warstwa rozbita na `Club price` (wartość, jako property komponentu) + `Club phrase`
(zdanie, jako tekst wariantu, nigdy nie nadpisywane). Wartość ukryta w wariantach dla klubowicza,
bo tam zdanie nie zawiera kwoty.

**Wniosek dla kanonu.** Tam, gdzie kanon podaje zdanie z wartością, **zapisujmy je jako dwa pola**:

```
wartość:  <kwota> zł
fraza:    ekstra -5% w klubie        (poza klubem)
fraza:    Aktywne ekstra -5% w klubie (klubowicz, bez wartości)
```

Inaczej implementacja zawsze skończy się jedną warstwą i punktem 2 powyżej. Ta sama uwaga dotyczy
liczników („Zobacz składowe pakietu • 4") i wszystkiego, co łączy tekst z liczbą z backendu.

---

## Z3 · Nazwy warstw są częścią higieny copy

Dwa razy w tym wdrożeniu objaw wyglądał jak błąd copy, a przyczyną była nazwa warstwy.

**Przypadek 1 - zdublowana linijka i znikająca cena.** Warianty `PriceRow` miały **dwie warstwy
nazwane `Label`**: cenę główną i linijkę klubową. Figma przy zmianie wariantu przenosi override'y
**dopasowując warstwy po nazwie**, więc nazwy kolidowały: override linijki trafiał na oba pola, karta
pokazywała dwa razy to samo zdanie i **gubiła cenę główną**. Do tego każdy wariant nazywał warstwy
inaczej (`Basic`/`Discount` obok `Label`/`Label`), więc część override'ów ginęła przy przejściu między
typami oferty.

**Przypadek 2 - czarny plus na niebieskim przycisku.** Biały kolor ikony to override wiązany do
zmiennej `Content/onAccent`, czyli poprawnie. Ale slot ikony miał wektor nazwany `Union`, a same ikony
nazywały swój różnie: `Shape` (125 ikon), `Icon (Stroke)` (22), `Vector (Stroke)` (9), luźne `pathNNNN`.
Przy podmianie ikony nazwy się nie zgadzały, override koloru przepadał i ikona wracała do swojego
ciemnego wiązania.

**Naprawa.** Unikalne, rolowe nazwy w każdym wariancie (`Basic` · `Old price` · `Discount` ·
`Omnibus`) i jedna nazwa dla pierwszego wektora w **958 komponentach ikon** (`Icon (Stroke)`).

**Wniosek.** Nie proponujemy, żeby copywriter nazywał warstwy. Proponujemy, żeby **sekcja 4 mapy
(„porządki poza copy") wymieniała kolizje nazw jako defekt do naprawy** - bo objawia się jako błąd
treści i tak jest raportowany.

---

## Z4 · Kanon powinien podawać nazwę property, nie tylko rolę kontenera

Format mapy mówi „rola tekstu w słowniku komponentów hi-fi". W komponencie sterowanym propertiesami
to już nie wystarcza: tekst nie jest warstwą do kliknięcia, tylko **wartością pola**. Dziś `PriceRow`
ma `✏️ Price`, `✏️ Old price`, `✏️ Club price`, a `ButtonTiny` ma `✏️ Label`.

**Propozycja.** W słowniku kontenerów (sekcja 2 mapy) dodać kolumnę „property", a w tabelach ekranów
podawać nazwę pola tam, gdzie tekst jest sterowany propertiesem. Wykonawca wtedy wie, że zmienia pole,
nie warstwę - a zmiana pola nie zakłada override'u na warstwie i nie blokuje propagacji (Z1).

---

## Z5 · Cytowanie leksykonu: sekcja plus wpis z logu, nie numer reguły

Leksykon nie ma numerowanych reguł. My w trakcie pracy cytowaliśmy „leksykon 109", „322", „234" -
to były numery nasze i **nie ma ich w pliku**, co utrudnia weryfikację i wprowadza w błąd każdego,
kto dostanie nasz raport.

**Propozycja.** Ustalić jeden sposób cytowania i trzymać go w obie strony: **sekcja leksykonu +
wpis `decisions-log`** (np. „sek. 3a, CXXIV.L, decyzja F1"). Jeśli wolisz numerację reguł, warto ją
wprowadzić w leksykonie - wtedy raporty da się przypiąć do konkretnego punktu.

---

## Z6 · Odświeżanie w drugą stronę

Twoja paczka mówi: pliki odświeżamy po każdej rundzie zmian w prototypie, nie edytujemy ich po
wysłaniu. Ta paczka trzyma tę samą zasadę - data w nazwie, brak edycji po wysłaniu, poprawka idzie do
nowej wersji.

**Propozycja procesowa.** Po każdej rundzie wdrożenia idzie zwrotka w tym formacie: konflikty
z kanonem, propozycje, wykaz wdrożonego, pytania. Dzięki temu leksykon dowiaduje się o rozjazdach
z pliku, a nie z pamięci osoby, która wdrażała.
