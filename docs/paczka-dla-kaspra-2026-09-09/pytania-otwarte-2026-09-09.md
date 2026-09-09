# Pytania otwarte (stan 2026-09-09)

Każde pytanie ma adresata i rekomendację. Numeracja: **K** do Kaspra, **A** do ALAB, **D** do devów.

---

## Do Kaspra

**K1. Linijka ceny klubowej.** Punkt L1 - konflikt z kanonem, najważniejsza rzecz w tej paczce.
Rekomendacja: przyjąć formę z kwotą i „Aktywne" dla klubowicza.

**K2. Znak minus w każdej wartości procentowej.** Punkt L3. Rekomendacja: U+2212 wszędzie, zgodnie
z zapisem o badge'u kodu.

**K3. Licznik łączny w filtrach.** Punkt L5. Rekomendacja: zapisać wyjątek dla „wyniki" w kontekście
filtrów albo dać kanon na „Pokaż 11 pozycji".

**K4. Separator liczników.** Punkt L6. Rekomendacja: wyjątek dla liczników z dużą kropką.

**K5. „Dodaj" wobec „Kup pakiet".** Punkt L7.2. Rekomendacja: ujednolicić na „Dodaj" w obu, bo
karta prowadzi do koszyka, nie do zakupu jednym krokiem.

**K6. Nagłówek pakietu zamiast „Kupując w pakiecie, oszczędzasz".** Punkt L11. Rekomendacja: nagłówek
nazywający zawartość, nie różnicę ceny - zgodnie z kanonem „mówimy, co pacjent dostaje".

**K7. Etykiety nad siatką kafli i chipami** - „Wybierz kategorię" i „Przeglądaj tylko" (Twoja mapa M3,
sekcja 6, punkt 5). Wciąż otwarte, prototyp nie ma tych etykiet.

**K8. Wyjście z logowania** - czy ma być linkiem tekstowym, czy przyciskiem. Dziś w prototypie
przycisk.

---

## Do ALAB

**A1. Model cenowy dla klubowicza z kodem.** W plikach stoją obok siebie dwie konwencje: cena główna
z wliczonymi klubowymi −5% (`29,79 zł`) i bez nich (`145,20 zł`). Master `PriceRow` idzie drugą drogą.
To pytanie o produkt, ale **wprost dotyczy copy**: linijka mówi „Aktywne ekstra -5% w klubie", a tych
5% w liczbach nie ma. Dopóki to nie jest rozstrzygnięte, komunikat obiecuje korzyść, której karta
nie pokazuje.

**A2. Kolejność naliczania.** Czy klubowe −5% liczy się od ceny regularnej, czy od ceny po kodzie.
Wyliczenia w plikach zakładają „po kodzie" (`39,20 → 31,36 → 29,79`), ale to nasze założenie.

**A3. Notacja jednostek w normach**, np. „10^9/L". Pytanie zadane wcześniej, wciąż bez odpowiedzi.

**A4. Zapisy z Twojej listy z 7 września, które nadal czekają:** brzmienie zgody na kroku 1, model
klubu w rejestracji, trzecia korzyść klubu, treść trzech slajdów intro i tagline splasha, FAQ
w formach neutralnych. Do rozstrzygnięcia poprawiamy w tych tekstach wyłącznie literówki.

---

## Do devów

**D1. Cena dla czytnika ekranu.** Punkt L13 - czy label „63 złote 65 groszy" generuje front z liczby.
Odmiana liczebników to logika, nie tekst.

**D2. Trzy reguły hasła z webu klienta** - czy API je sprawdza (pytanie z Twojej paczki, wciąż otwarte).

**D3. Pola tekstowe komponentu a treść z backendu.** `PriceRow` ma dziś trzy pola tekstowe na kwoty.
W implementacji te trzy wartości pochodzą z jednego obiektu ceny - warto sprawdzić, czy nazwy pól
w komponencie odpowiadają nazwom w kontrakcie API, żeby handoff był jednoznaczny.

---

## Ryzyko, na które warto patrzeć

**Wartość zmienna w zdaniu.** Po rozbiciu linijki klubowej to samo ryzyko zostaje we wszystkich
miejscach, gdzie kanon łączy tekst z liczbą: liczniki składowych pakietu, „Najniższa cena z 30 dni: …",
„Kraków 109 zł", timer „M:SS". Każde z nich w Figmie jest dziś jedną warstwą i przy pierwszej realnej
wartości zamrozi swoje brzmienie. Nie naprawialiśmy tego - sygnalizujemy, bo wróci.
