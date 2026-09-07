/* ============================================================
   ALAB • Sklep — dane prototypu
   Treść 1:1 z mastera „Sklep • Strona główna” (Figma 656:7311)
   oraz z uzgodnionej listy 12 kategorii ALAB.
   ============================================================ */

/* Ikony kategorii — odpowiedniki duotone z DS (ic_dt_*), uproszczone do konturu */
const ICONS = {
  test_tube:       '<path d="M9 3h6M10 3v13a2 2 0 0 0 4 0V3"/><path d="M10 11h4"/>',
  medicine_bottle: '<path d="M9 3h6v3H9z"/><rect x="6" y="6" width="12" height="15" rx="3"/><path d="M12 11v6M9 14h6"/>',
  fork_and_knife:  '<path d="M7 3v7a2 2 0 0 0 4 0V3M9 12v9"/><path d="M16 3c2 1.5 2 5 0 6v12"/>',
  bubbles:         '<circle cx="10" cy="13" r="6"/><circle cx="17" cy="7" r="2.5"/>',
  heart_rate:      '<path d="M3 12h3l2-4 3 8 3-10 2 6h5"/>',
  syringe:         '<path d="m14 4 6 6M16.5 6.5 9 14l-3 6 6-3 7.5-7.5"/><path d="m11 9 4 4"/>',
  heart:           '<path d="M12 20s-7-4.4-7-9.4A4.1 4.1 0 0 1 12 8a4.1 4.1 0 0 1 7 2.6c0 5-7 9.4-7 9.4Z"/>',
  dna:             '<path d="M8 3c0 6 8 6 8 12M16 3c0 6-8 6-8 12"/><path d="M9 7h6M9 13h6M10 19h4"/>',
  virus:           '<circle cx="12" cy="12" r="5"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M6 6l1.4 1.4M16.6 16.6 18 18M18 6l-1.4 1.4M7.4 16.6 6 18"/>',
  mirror:          '<ellipse cx="12" cy="9" rx="6" ry="7"/><path d="M12 16v5M9 21h6"/>',
  user:            '<circle cx="12" cy="8" r="4"/><path d="M5 21c0-4 3.2-6 7-6s7 2 7 6"/>',
  tube:            '<path d="M8 3h8l-1 4H9z"/><path d="M9 7h6v11a3 3 0 0 1-6 0z"/>',
  plus_square:     '<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 9v6M9 12h6"/>',
  clock:           '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>'
};

/* 12 kategorii ALAB — na stronie głównej pokazujemy 5 + wejście do pełnej listy */
const CATEGORIES = [
  { name: 'Badania i pakiety ogólne',              icon: 'test_tube',       count: 9 },
  { name: 'Hormony',                               icon: 'medicine_bottle', count: 2 },
  { name: 'Alergie i nietolerancje pokarmowe',     icon: 'fork_and_knife',  count: 1 },
  { name: 'Układ pokarmowy',                       icon: 'bubbles',         count: 2 },
  { name: 'Układ krążenia i Hematologia',          icon: 'heart_rate',      count: 4 },
  { name: 'Cukrzyca i Otyłość',                    icon: 'syringe',         count: 1 },
  { name: 'Ciąża, Zdrowie intymne i Układ moczowy',icon: 'heart',           count: 2 },
  { name: 'Genetyka i Nowotwory',                  icon: 'dna',             count: null },
  { name: 'Infekcje i choroby zakaźne',            icon: 'virus',           count: 3 },
  { name: 'Lifestylowe i Uroda',                   icon: 'mirror',          count: 2 },
  { name: 'Zdrowie psychiczne',                    icon: 'user',            count: null },
  { name: 'Reumatologia i Dermatologia',           icon: 'tube',            count: null }
];

const HOME_CATEGORY_COUNT = 5;   // reszta pod „Wszystkie kategorie”

const PACKAGES = [
  { kind: 'Pakiet • 4 badania', name: 'Pakiet TARCZYCA',
    wait: 'Wynik za 2 dni robocze',
    price: '84,55 zł', priceOld: '89,00 zł', priceMin: 'Najniższa cena z 30 dni: 85,00 zł',
    discount: '-10%', parts: 4 },
  { kind: 'Pakiet • 8 badań', name: 'Pakiet Zdrowie podstawowy',
    wait: 'Wynik za 2 dni robocze',
    price: '141,55 zł', priceOld: '149,00 zł', priceMin: 'Najniższa cena z 30 dni: 141,00 zł',
    discount: '-10%', parts: 8 }
];

const TESTS = [
  { kind: 'Badanie: Krew', name: 'Cholesterol całkowity', wait: 'Wynik za 1 dzień roboczy',
    price: '24,30 zł', priceOld: '27,00 zł', priceMin: 'Najniższa cena z 30 dni: 27,00 zł', discount: '-10%' },
  { kind: 'Badanie: Krew', name: 'Białko C-reaktywne (CRP)', wait: 'Wynik za 1 dzień roboczy',
    price: '28,00 zł' },
  { kind: 'Badanie: Krew', name: 'Glukoza', wait: 'Wynik za 1 dzień roboczy',
    price: '22,50 zł', priceOld: '25,00 zł', priceMin: 'Najniższa cena z 30 dni: 25,00 zł', discount: '-10%' },
  { kind: 'Badanie: Krew', name: 'Morfologia krwi (pełna)', wait: 'Wynik za 1 dzień roboczy',
    price: '29,45 zł' },
  { kind: 'Badanie: Krew', name: 'TSH', wait: 'Wynik za 1 dzień roboczy',
    price: '31,00 zł' },
  { kind: 'Badanie: Krew', name: 'Ferrytyna', wait: 'Wynik za 2 dni robocze',
    price: '44,00 zł', priceOld: '49,00 zł', priceMin: 'Najniższa cena z 30 dni: 46,00 zł', discount: '-10%' }
];
