# Zwrotka z wdrożenia: paczka dla Kaspra (stan 2026-09-09)

Cel: oddać to, czego dowiedzieliśmy się, wdrażając paczkę `ALAB-copy-dla-Jarka-2026-09-09` w prototypie
i w Figmie (design system klienta + plik `Alab • Design`). Nie jest to nowa mapa copy. To **lista zmian
proponowanych do leksykonu i do zasad**, plus wykaz tego, co już stoi w produkcie, żeby kanon i pliki
przestały się rozjeżdżać.

Paczka jest odpowiedzią na Twoją, więc trzyma tę samą konwencję: data w nazwie, plików nie edytujemy
po wysłaniu, poprawka idzie do nowej wersji.

## Pliki i kolejność czytania

1. `README-czytaj-najpierw.md`: ten plik.
2. `leksykon-propozycje-zmian-2026-09-09.md`: **rzecz najważniejsza.** 13 punktów, każdy w układzie
   „kanon dziś · co stoi w produkcie · powód · o co prosimy · koszt". Punkty **L1, L3 i L5 są
   konfliktami z kanonem**, nie propozycjami kosmetycznymi.
3. `zasady-i-format-propozycje-2026-09-09.md`: 6 punktów o procesie i o formacie mapy copy. Wyszły
   z mechanik Figmy, które przy wdrażaniu copy kosztowały najwięcej czasu i dwa razy wyglądały
   jak błąd copy, a były błędem struktury.
4. `wdrozenie-2026-09-09.md`: co faktycznie podmienione, w jakiej skali i gdzie.
5. `pytania-otwarte-2026-09-09.md`: pytania do Ciebie, do ALAB i do devów, z rekomendacjami.
6. `zrodla-fm/`: nasze dzienniki robocze, gdyby trzeba było wejść w szczegół.

## Jedna rzecz do przeczytania od razu

Leksykon (sekcja 3a, `decisions-log` **CXXIV.L**, decyzja F1) ma na liście **NIE** frazę
**„ekstra -5% w klubie"**. Dokładnie ta fraza stoi dziś w komponencie `PriceRow` w design systemie
klienta i na wszystkich ekranach sklepu, bo Jarek świadomie odrzucił kanoniczne
„5% taniej, już naliczone". Uzasadnienie i propozycja są w **L1**. Dopóki tego nie rozstrzygniemy,
kanon i pliki mówią co innego.

## Hierarchia źródeł - bez zmian

1. Ustalenia klienta (lista zwrotów + odpowiedzi z 7 września). Wygrywa zawsze.
2. Leksykon.
3. Web klienta jako słownictwo tam, gdzie 1 i 2 milczą.
4. Hi-fi to stan do zmiany, nie źródło.

Ta paczka nie zmienia hierarchii. Wszystkie propozycje mieszczą się w punkcie 2 i żadna nie dotyka
punktu 1 - z jednym wyjątkiem, który wprost zaznaczamy: **L10** mówi, że zakaz słowa „promocja"
powinien obejmować także podpisy tablic i nazwy warstw w pliku, który oglada klient.

## Sprostowanie po naszej stronie

W trakcie wdrożenia cytowaliśmy leksykon numerami reguł („109", „322", „234"). **Leksykon nie ma
numerowanych reguł** - dzieli się na sekcje i odsyła do rzymskich wpisów `decisions-log.md`. Te numery
były nasze i nie ma ich w Twoim pliku. W tej paczce cytujemy sekcją i wpisem z logu.
