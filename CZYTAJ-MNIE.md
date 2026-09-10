# ALAB • Prototyp — instrukcja obsługi

Klikalny prototyp aplikacji ALAB do badania niemoderowanego (Useberry) plus katalog komponentów
design systemu w kodzie. Czysty HTML, CSS i JavaScript — **bez builda, bez npm, bez frameworka**.
Otwierasz, edytujesz plik, odświeżasz.

Wersja w tej paczce: patrz `app/version.json`.

---

## 1. Jak uruchomić

**Najprościej (Windows):** dwuklik na **`serve.bat`**. Skrypt startuje lokalny serwer na porcie 8802,
wypisuje adres w sieci Wi-Fi i otwiera stronę z kodem QR do zeskanowania telefonem.

**Ręcznie:** `python serve.py 8802`, potem `http://localhost:8802/app/`.

| Adres | Co to |
| --- | --- |
| `http://localhost:8802/app/` | prototyp aplikacji |
| `http://localhost:8802/storybook/` | katalog komponentów design systemu |
| `http://localhost:8802/qr.html` | kod QR do otwarcia na telefonie |

**Dlaczego nie wystarczy dwuklik na `app/index.html`?** Prototyp używa routera **na ścieżkach**
(`/app/produkt/morfologia-krwi`, nie `#/product/t-morf`), więc adres ekranu nie ma swojego pliku na
dysku. `serve.py` robi to samo co reguła na Netlify: nieznany adres pod `/app/` oddaje
`app/index.html`, a aplikacja rysuje właściwy ekran. Z pliku (`file://`) aplikacja też się otworzy,
ale przełączy się na adresy z `#` i wklejone linki do ekranów nie zadziałają.

Jeśli telefon nie ładuje strony, zapora Windows blokuje Pythona w sieci publicznej. Raz, jako
administrator:

```
netsh advfirewall firewall add rule name="ALAB prototyp 8802" dir=in action=allow protocol=TCP localport=8802
```

---

## 2. Linki startowe do badania

Wersja na żywo: **https://alab-prototype.netlify.app/app/**

Do Useberry idą adresy z konkretnym zadaniem i stanem klubu:

```
https://alab-prototype.netlify.app/app/zadanie/1/bez-klubu
https://alab-prototype.netlify.app/app/zadanie/2/bez-klubu
https://alab-prototype.netlify.app/app/zadanie/2/w-klubie
https://alab-prototype.netlify.app/app/zadanie/3/bez-klubu
https://alab-prototype.netlify.app/app/zadanie/3/w-klubie
```

Końcowy segment **ustawia członkostwo w ALAB club**, więc każdy link daje ten sam stan wejścia
niezależnie od tego, co uczestnik robił wcześniej w tej samej karcie. Zadanie 1 ma jeden link, bo
klub zdobywa się dopiero w trakcie zadania.

⚠️ **Bierz linki z Netlify, nie z GitHub Pages.** Pages nie ma przekierowania dla routera
ścieżkowego i na głębokich adresach oddaje 404. Pages nadaje się tylko do wejścia przez `/app/`.

Po skończonym zadaniu adres zmienia się na `/app/koniec/<produkt>`, więc w nagraniu widać, czym
ścieżka się skończyła.

---

## 3. Co gdzie leży

```
app/                    prototyp aplikacji
  index.html            szkielet: wczytuje DS i moduły aplikacji
  app.js                router, stan, layout, snackbary, nawigacja
  app.shop.js           sklep: listingi, karta produktu, filtry, wyszukiwarka, model ceny
  app.results.js        wyniki badań
  app.stubs.js          badanie: zadania, ekrany-zaślepki, komunikat końca zadania
  app.devmenu.js        ukryte menu prototypu (tapnięcie w status bar)
  data.catalog.js       KATALOG: badania, pakiety, kategorie, ceny
  data.results.js       dane wyników
  app.css               style ekranów aplikacji
  version.js/.json      numer wersji (patrz sekcja 5)

ds/                     design system w kodzie
  tokens.css            zmienne: kolory, typografia, odstępy, promienie
  components.css        style komponentów
  components*.js        komponenty jako funkcje zwracające HTML (DS.Button, DS.Cell, …)
  icons.js              ikony jako inline SVG (generowane z ds/build-icons.js)
  assets/               tła, ilustracje, logotypy (eksporty @3x z Figmy)

storybook/              katalog komponentów DS
docs/                   dzienniki decyzji: copy, zmiany w DS, weryfikacja Figmy
README.md               pełna dokumentacja decyzji projektowych
netlify.toml            konfiguracja hostingu (przekierowania, nagłówki cache)
serve.py / serve.bat    lokalny serwer
qr.html                 kod QR
```

---

## 4. Najczęstsze zmiany

**Katalog badań i pakietów** → `app/data.catalog.js`. Jeden wpis = jedna linijka:
`t(...)` to badanie, `p(...)` to pakiet. Ważniejsze pola:

| Pole | Znaczenie |
| --- | --- |
| `types` | gdzie dostępne: `['punkt']`, `MAIL`, `KIT`; brak = wszędzie |
| `popular` | pokazuje na stronie głównej sklepu we wszystkich sposobach realizacji |
| `popularIn: ['dom']` | pokazuje tylko w wybranym sposobie realizacji |
| `demoteUnless: 'tarczyc'` | zjeżdża w wyszukiwarce na trzecią pozycję, dopóki zapytanie nie trafi w ten wyróżnik |
| `also: [[kategoria, podkategoria]]` | drugie miejsce w drzewie kategorii |
| `code`, `old`, `lowest` | kod rabatowy, cena przed obniżką, najniższa cena z 30 dni |

**Zadania badawcze** → `app/app.stubs.js`, tablica `TASKS`. Jeden wpis to:

```
[numer, 'Zadanie N', tytuł, scenariusz, [punkty do zrobienia], id produktu, wymagany sposób realizacji, dopisek]
```

Dwa ostatnie pola są opcjonalne. **Wymagany sposób realizacji** decyduje, kiedy zadanie się zalicza:
zadanie 3 ma `'dom'`, więc ta sama morfologia dodana w Punkcie Pobrań **nie** kończy zadania.

**Copy** → tam, gdzie tekst stoi w kodzie ekranu. Przy każdej zmianie sprawdź leksykon UX writing:
`ALAB club` z małym „c", `Pacjent` / `Punkt Pobrań` / `Konto Pacjenta` z dużej, kwoty **zawsze
z groszami** (`149,00 zł`), zakaz słów „promocja", „rabat", „zniżka", „oszczędzasz", znak minus
U+2212 w wartościach procentowych (`−20%`). Odstępstwa i otwarte pytania: `docs/`.

**Tła (hero sklepu, karta produktu)** → gotowe eksporty **@3x z Figmy** w `ds/assets/`. Progresywnego
rozmycia z Figmy nie da się wiernie odtworzyć w CSS, więc bierzemy je jako obraz. Jeśli trzeba
mocniej rozmyć, jest do tego zmienna `--bg-blur` na `.shop__bg` w `app/app.css`.

---

## 5. Wersja i „Sprawdź aktualizacje"

Numer wersji stoi w **dwóch** miejscach i muszą się zgadzać:

- `app/version.js` — wczytywany przez aplikację,
- `app/version.json` — czytany przez menu „Sprawdź aktualizacje".

Format: `RRRR.MM.DD-N`. Menu prototypu porównuje jedno z drugim: jeśli `version.json` jest nowszy,
aplikacja dociąga pliki z pominięciem cache i odświeża się sama. **Podbij oba przy każdej zmianie,
którą ktoś ma zobaczyć** — inaczej uczestnik zostanie na starej wersji z cache przeglądarki.

---

## 6. Publikacja

**Netlify** (główny hosting badania):

```bash
npx netlify-cli deploy --prod --dir=.
```

⚠️ Ta paczka **nie zawiera** `.git` ani `.netlify`, więc jest zdjęciem stanu, nie kopią roboczą.
Deploy z rozpakowanej paczki wymaga najpierw `npx netlify-cli link` (wskazanie projektu
`alab-prototype`). Normalnie publikujemy z repozytorium `vod123qwe/alab-prototype`.

**GitHub Pages** — publikuje się sam z gałęzi `main`, adres
`https://vod123qwe.github.io/alab-prototype/app/`. Build trwa od kilkudziesięciu sekund do kilku
minut; stan sprawdzisz przez `app/version.json`. Pamiętaj o ograniczeniu z sekcji 2: głębokie adresy
tam nie działają.

Po każdym wdrożeniu warto sprawdzić, czy oba adresy oddają tę samą wersję:

```bash
curl -s https://alab-prototype.netlify.app/app/version.json
```

---

## 7. Menu prototypu i reset

Prototyp ma ukryte menu — **tapnięcie w górny pasek** (status bar). Trzy pozycje: przejście do
katalogu DS, „Zacznij od nowa" i „Sprawdź aktualizacje". W katalogu DS ten sam arkusz otwiera
**przycisk w pasku u góry**: powrót do prototypu i reset.

Na ekranie wyboru zadania jest jeszcze link **„Resetuj prototyp"** — czyści postęp razem
z członkostwem w klubie.

Cały stan aplikacji żyje w pamięci strony. Jedyna trwała rzecz to `alab:club` w `sessionStorage`
(członkostwo przechodzi między zadaniami w tej samej karcie). Reset usuwa właśnie ten klucz.

---

## 8. Na co uważać

- **Nie edytuj `ds/icons.js` ręcznie** — jest generowany. Ikony dodaje się przez `ds/build-icons.js`
  z plików SVG w `ds/assets/`.
- **Komponenty bierz z `ds/`**, nie pisz lokalnych odpowiedników w kodzie ekranu. Jeśli czegoś
  brakuje, dołóż komponent do DS — inaczej ekrany rozjadą się z design systemem.
- **Kwoty i teksty w `storybook/` też są copy.** Przy zmianie kanonu poprawiaj je razem z aplikacją,
  bo katalog komponentów jest pokazywany klientowi.
- **Przeglądarka trzyma pliki w cache.** Przy sprawdzaniu zmian rób twarde odświeżenie
  (Ctrl+Shift+R) albo dopisz `?v=cokolwiek` do adresu.
- **Prototyp jest po polsku i mobile-first.** Szerokość odniesienia to 375 px; na desktopie ekran
  siedzi w makiecie telefonu.

---

## 9. Skąd wziąć kontekst decyzji

`README.md` w tej paczce to pełny dziennik: co zbudowane, dlaczego tak, co odrzucone i z jakiego
powodu. Katalog `docs/` trzyma trzy rzeczy osobno:

| Plik | O czym |
| --- | --- |
| `copy-odstepstwa-*.md` | odstępstwa od leksykonu, ich koszt i alternatywy |
| `ds-cells-zmiany-copy-*.md` | zmiany copy w komponentach design systemu |
| `weryfikacja-figma-*.md` | co zeszło z biblioteki na ekrany, co blokowały override'y |
| `paczka-dla-kaspra-*/` | zwrotka do UX writera: propozycje zmian w leksykonie |
