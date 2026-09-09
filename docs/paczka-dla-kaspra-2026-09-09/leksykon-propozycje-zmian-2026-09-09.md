# Leksykon: propozycje zmian po wdrożeniu (2026-09-09)

Każdy punkt ma ten sam układ: **kanon dziś · co stoi w produkcie · powód · o co prosimy · koszt**.
Punkty oznaczone **KONFLIKT** to miejsca, gdzie produkt mówi coś, czego kanon wprost zabrania -
te trzeba rozstrzygnąć, bo dziś nie da się być zgodnym z jednym i drugim.

---

## L1 · KONFLIKT · Linijka ceny klubowej: forma z kwotą zamiast „już naliczone"

**Kanon dziś** (sek. 3a, `decisions-log` CXXIV.L, decyzja F1): przy cenie fioletowy dopisek
**„5% taniej w klubie"** poza klubem i **„5% taniej, już naliczone"** dla klubowicza; przy ofercie
specjalnej **„40% taniej w klubie"** i **„40% taniej, już naliczone"**. Na liście **NIE** stoi wprost
**„ekstra -5% w klubie"** i **„zniżka -40% w klubie"**.

**Co stoi w produkcie** (komponent `PriceRow`, DS klienta `777:6266`, 85 wierszy na ekranach sklepu
oraz cały prototyp):

| Stan | Oferta specjalna (−40%) | Klub standardowy (−5%) |
| --- | --- | --- |
| Pacjent poza klubem | „66,78 zł taniej -40% w klubie" | „189,05 zł ekstra -5% w klubie" |
| Pacjent w klubie | „Aktywne −40% w klubie" | „Aktywne ekstra -5% w klubie" |

**Powód.** Kanoniczna forma bez kwoty stoi w karcie obok dwóch liczb (cena główna i przekreślona)
i czyta się jak trzeci element równania: „199,00 zł · 248,75 zł · 5% taniej w klubie". Pacjent nie
dowiaduje się, ile ostatecznie zapłaci. Jarek chciał, żeby ta linijka odpowiadała na pytanie
**„ile zapłacę w klubie"**, a dla klubowicza - **„czy to już działa"**. „już naliczone" opisuje
mechanikę naliczania, „Aktywne" opisuje stan korzyści.

**O co prosimy.** Rozstrzygnięcie w jedną stronę:

- **(A, rekomendacja)** kanon przyjmuje formę z kwotą i słowo „Aktywne" dla klubowicza. Wtedy z listy
  NIE wypada „ekstra -5% w klubie", a wchodzi reguła doboru słowa z **L2**.
- **(B)** wracamy do kanonu bez kwoty. Wtedy potrzebujemy **innego miejsca na cenę klubową** na
  karcie, bo dziś nie ma gdzie jej pokazać, a jest to najmocniejszy argument klubu.

**Koszt.** (A) zero zmian w plikach, tylko wpis w leksykonie. (B) dwa stringi w DS, jeden przebieg po
pliku Design (≈85 wierszy), zmiana w prototypie i **projektowo nowy element karty** na cenę klubową.

---

## L2 · Reguła doboru: „taniej" czy „ekstra"

**Kanon dziś.** Brak rozróżnienia - kanon używa „taniej" w obu wielkościach.

**Co stoi w produkcie.** −40% (oferta specjalna ALAB) mówi **„taniej"**, −5% (stała korzyść klubowa)
mówi **„ekstra"**.

**Powód.** To dwa różne mechanizmy: −40% to obniżka konkretnego badania, −5% to stała korzyść, która
dokłada się **do** innych obniżek (sumowanie potwierdzone, `decisions-log` XXII). „ekstra" nazywa tę
dokładkę; „taniej" nazwałoby ją tym samym słowem co obniżkę bazową i zatarłoby różnicę.

**O co prosimy.** Zapis reguły doboru słowa, żeby w kolejnych ekranach nie trafiały na przemian.

**Koszt.** Wpis w leksykonie.

---

## L3 · KONFLIKT · Znak minus: kanon jest, egzekucji nie ma

**Kanon dziś.** Badge kodu to **„−20% z kodem b26cz"** - wprost „znak minus, bez dwukropka",
a na liście NIE stoi „-20% rabat" z dywizem.

**Co stoi w produkcie.** Rozjazd w obrębie jednego komponentu:

| Miejsce | −5% | −40% |
| --- | --- | --- |
| DS (`PriceRow`, `❖ Pills`) | **dywiz** `-5%` | znak minus `−40%` |
| Plik Design | dywiz | znak minus |
| Prototyp | znak minus | znak minus |

**Powód rozjazdu.** Pierwsza runda poprawek podstawiła znak minus, potem autorskie brzmienia wróciły
z dywizem, a my wyrównaliśmy plik Design **do DS**, żeby komponent i ekrany mówiły to samo. Efekt:
ta sama wielkość ma dwa znaki zależnie od procentu.

**O co prosimy.** Potwierdzenie, że **U+2212 obowiązuje w każdej wartości procentowej**, nie tylko
w badge'u kodu. Wtedy poprawiamy DS jednym przebiegiem, a plik Design za nim.

**Koszt.** Dwa stringi w DS, jeden skrypt po pliku Design. Prototyp jest już zgodny.

---

## L4 · „Aktywne" jako słowo dla stanu korzyści

**Kanon dziś.** „już naliczone".

**Co stoi w produkcie.** „Aktywne ekstra -5% w klubie", „Aktywne −40% w klubie". Wcześniej w DS stały
**dwa różne brzmienia dla tego samego stanu** („Naliczono 5% zniżki" i „Aktywna zniżka klubowa ekstra
-5%") - oba ze słowem zakazanym. Ujednoliciliśmy je na jedno.

**Powód.** Jak L1: „naliczone" mówi o księgowaniu, „Aktywne" o tym, że korzyść działa. Do tego
„Aktywne" jest krótsze, a linijka stoi w karcie o szerokości 335 px.

**O co prosimy.** Przyjęcie „Aktywne …" jako kanonicznego słowa dla stanu korzyści klubowej (spójnie
z L1A) albo wskazanie własnego brzmienia, które opisuje stan, nie naliczanie.

**Koszt.** Wpis w leksykonie; produkt już tak mówi.

---

## L5 · KONFLIKT · „Pokaż N wyników" wobec słownika wyszukiwania

**Kanon dziś.** „Wyniki" to **nazwa obszaru nawigacji** (wyniki badań). Dla wyszukiwania leksykon
podaje osobne słownictwo: „badania i pakiety", „znalezione badania".

**Co stoi w produkcie.** Przycisk zatwierdzający w arkuszu filtrów mówi **„Pokaż 11 wyników"**.

**Powód.** Wersja zgodna ze słownikiem - „Pokaż 4 pakiety i 7 badań" - nie mieści się w jednej linii
przycisku i przy większych liczbach zawija się na dwie. Licznik łączny jest tu potrzebny, bo filtry
zwracają jednocześnie badania i pakiety.

**O co prosimy.** Kanon dla **licznika łącznego** w filtrach i wyszukiwaniu. Propozycje:
„Pokaż 11 badań i pakietów" (długie, ale zgodne), „Pokaż 11 pozycji", albo zgoda na „wyniki"
w tym jednym kontekście z zapisem wyjątku.

**Koszt.** Jeden string w prototypie, jeden w DS.

---

## L6 · Separator liczników: duża kropka zamiast kropki środkowej

**Kanon dziś.** Kropka środkowa „·" jako separator inline.

**Co stoi w produkcie.** Duża kropka **„•"** w licznikach: chipy filtrów, wiersze podkategorii,
stopka karty pakietu („Zobacz składowe pakietu • 4"), przyciski „Pokaż wszystkie • 12".

**Powód.** W Manrope w rozmiarze interfejsu (14 px, SemiBold) „·" jest optycznie za mała i przy
liczbie ginie - sprawdzone na ekranie, nie w druku. Wcześniej te liczniki stały w nawiasach, co Jarek
odrzucił jako notację techniczną. Kanon separatora zdaniowego („·") **zostaje bez zmian** - chodzi
wyłącznie o licznik przy etykiecie.

**O co prosimy.** Zapis wyjątku dla liczników albo zmiana separatora liczników w całym kanonie.

**Koszt.** Wyjątek: zero. Zmiana kanonu: około 6 miejsc w prototypie i DS.

---

## L7 · Plus przy „Dodaj" jest ikoną, nie znakiem w tekście

**Kanon dziś.** Leksykon milczy; mapa M3 zapisuje CTA karty jako **„+ Dodaj"**.

**Co stoi w produkcie.** Label to samo **„Dodaj"**, a plus to **ikona** `ic_outline_plus` w slocie
leading icon komponentu `ButtonTiny`. Zapis „+ Dodaj" w kanonie sugeruje znak w tekście, co
w implementacji byłoby błędem: inny rozmiar niż ikona, brak odstępu z auto layoutu, a czytnik ekranu
przeczyta „plus".

**O co prosimy.**
1. Zapis w kanonie jako label **„Dodaj"** z adnotacją „plus jako ikona wiodąca", nie jako część tekstu.
2. Rozstrzygnięcie osobne: **„Kup pakiet" nie ma plusa, „Dodaj" ma**, a to ta sama akcja - dodanie do
   koszyka. Czy oba mają brzmieć „Dodaj do koszyka"? Jarek testował „Dodaj do koszyka" i „Dodaj";
   dziś w produkcie stoi „Dodaj".

**Koszt.** Punkt 1: wpis. Punkt 2: dwa stringi w DS.

---

## L8 · Wartości przykładowe w komponentach też podlegają leksykonowi

**Kanon dziś.** Kwoty zawsze z groszami, „ALAB club" z małym „c" - bez adnotacji, czy dotyczy to
treści demo w komponentach.

**Co się stało.** Design system wysyłał jako **domyślne wartości** komponentów „1190 zł" (bez groszy)
i badge „Niższa cena z ALAB **Club**" (wielkie C). Te wartości zeszły przez bibliotekę na ekrany
i poprawialiśmy je potem w **około 200 węzłach** pliku Design. Najbardziej pouczający przypadek: stara
domyślna treść komponentu `BadgePremium` była **źródłem** frazy „Aktywna zniżka klubowa", którą
wcześniej gasiliśmy ręcznie na kilkudziesięciu ekranach.

**O co prosimy.** Jedno zdanie w leksykonie: **treść demo w komponentach jest copy i podlega kanonowi.**
To najtańsza reguła w tej paczce, a zdejmuje całą klasę wycieków.

**Koszt.** Wpis. Same wartości są już poprawione.

---

## L9 · Detale typograficzne do dopisania

Wyszły z audytu **1513 widocznych węzłów tekstowych** w sekcji `🟢 Approved` pliku Design. Kanon ich
nie wymienia, a każdy przeciekł do pliku:

| Detal | Kanon proponowany | Co znaleźliśmy |
| --- | --- | --- |
| Wielokropek | jeden znak **„…"** | trzy kropki `...` w skróconym opisie badania (2×) |
| Cudzysłów | otwierający **„** i zamykający **”** | zamykający jako prosty `"` w „Morfologia" (1×) |
| Spacja na końcu warstwy | **zero** | 48 warstw, w tym `-20% ` ×15 i nazwa badania ×21 - u źródła w DS |
| NBSP przed „zł" | kanon **jest** | brak kontroli; nie sprawdzaliśmy, czy w plikach stoi twarda spacja |

**O co prosimy.** Dopisanie trzech pierwszych do sekcji 3, a jeśli prowadzisz linter - dorzucenie ich
do listy sprawdzeń. Spacja na końcu jest w Figmie niewidoczna, psuje wyśrodkowanie i przechodzi do
developmentu.

**Koszt.** Wpis; znalezione wystąpienia są już poprawione.

---

## L10 · Podpisy tablic i nazwy warstw są w zakresie, gdy klient oglada plik

**Kanon dziś.** Zakaz „promocji", „rabatu", „zniżki" dotyczy interfejsu.

**Co stoi w pliku Design.** Nad kolumnami wariantów na stronie `🟢 Sklep` i w masterach:

- **„Promocja z kodem" · „Promocja specjalna ALAB" · „Promocja standardowa"** - 9 wystąpień, słowo
  zakazane. Propozycja: **„Oferta z kodem" · „Oferta specjalna ALAB" · „Oferta standardowa"**.
- **„User basic" · „User z ALAB club"** - 6 wystąpień, po angielsku, i „User" tam, gdzie kanon każe
  mówić „Pacjent". Propozycja: **„Pacjent bez klubu"** i **„Pacjent w ALAB club"**.

Te napisy są jednocześnie **nazwami warstw**, więc zmiana idzie w dwóch miejscach.

**O co prosimy.** Zdanie o zakresie: podpisy tablic, nazwy sekcji i nazwy warstw w plikach, które
oglada klient, trzymają kanon terminologiczny. Nazwy techniczne komponentów (`PriceRow`, `CellTest`)
zostają po angielsku - to nie copy.

**Koszt.** 15 tekstów plus tyle samo nazw warstw. **Nie ruszyliśmy ich** - to podpisy autorskie
tablicy, więc decyzja należy do Ciebie i Jarka.

---

## L11 · Sprostowanie: „oszczędzasz" był już zakazany, a stał w hi-fi

**Kanon dziś.** „**oszczędzasz** w żadnej formie" (`decisions-log` CXV), powód strategiczny.

**Co znaleźliśmy.** Nagłówek na PDP pakietu **„Kupując w pakiecie, oszczędzasz"** - 2 wystąpienia
w sekcji `🟢 Approved`. Podmieniliśmy na **„W pakiecie taniej"**.

**O co prosimy.** Kanoniczne brzmienie tego nagłówka. Nasze jest robocze; rozważaliśmy też „Taniej
w pakiecie" i „Pakiet jest tańszy niż badania osobno". Kanon mówi „mówimy, co pacjent dostaje, nie ile
zaoszczędzi" - możliwe, że ten nagłówek powinien nazywać zawartość pakietu, a nie różnicę ceny.

**Koszt.** Dwa teksty.

---

## L12 · Reguła „nagłówek sekcji bez czasownika" tylko do nagłówków

**Co się stało.** Zastosowałem tę regułę do **przycisku** i skróciłem „Zobacz składowe pakietu" do
„Składowe pakietu". Wyszło dopiero przy kontrolnym przebiegu skillem `/ux-writer`; wróciliśmy do
„Zobacz składowe pakietu".

**O co prosimy.** Jawne ograniczenie zakresu reguły do nagłówków i etykiet sekcji, z adnotacją, że
przyciski i linki zachowują czasownik (spójnie z regułą CTA w imperatywie).

**Koszt.** Wpis.

---

## L13 · Cena dla czytnika ekranu - kanon jest, wdrożenia nie ma

**Kanon dziś.** Label dla czytnika rozpisuje kwotę: **„63 złote 65 groszy"**, nie „63,65 zł".

**Stan.** Nie ma tego ani w prototypie, ani w DS - żadna kwota nie ma osobnego labela dla czytnika.

**O co prosimy.** Potwierdzenie, czy to zakres MVP. Jeśli tak, potrzebna reguła, kto to tworzy: copy
podaje wzór, czy front generuje z liczby. Odmiana „złoty/złote/złotych" i „grosz/grosze/groszy" to
logika, nie tekst, więc kanon powinien podać wzór, a nie listę stringów.

**Koszt.** Do rozpoznania po stronie devów; z copy tylko wzór odmiany.
