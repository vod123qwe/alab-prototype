/* Storybook — komponenty Wyników badań (Moduł 7) i FAQ. Dopisuje się do SB.COMPONENTS. */
(function () {
  const { COMPONENTS, text, sel, bool, cell } = window.SB;
  const num = (name, label, def) => text(name, label, String(def));   // storybook ma tylko kontrolki tekstowe/select/bool
  const W = (html) => `<div style="width:335px">${html}</div>`;

  COMPONENTS.celltestresult = { fn: 'CellTestResult', title: 'CellTestResult · BadgeStatus · YearRule', figma: 'CellTestResult 2483:45462 · Listing 2516:102054',
    desc: 'Karta wyniku na liście: tytuł 14 Bold, wiersz osoby (ikona 16 + imię 12 Bold secondary), data 11 SemiBold tertiary, chevron 20 i pill BadgeStatus. Wariant „New” ma 2 px obwódki Outline/borderActive, cień i delikatną aureolę. Grupy lat rozdziela YearRule.',
    controls: [text('title', 'Tytuł', 'Morfologia krwi obwodowej'), text('person', 'Osoba', 'Anna Kowalska'), text('date', 'Data', '12 marca 2026'), bool('isNew', 'Nowy wynik')],
    render: p => W(DS.CellTestResult({ ...p, badge: { status: 'ok', label: 'Wszystko w normie' } })),
    matrix: () => cell('lista z grupą roku', W(DS.YearRule({ label: '2026' }) + '<div style="height:24px"></div>' +
      DS.CellTestResult({ title: 'Morfologia krwi obwodowej', person: 'Anna Kowalska', date: '12 marca 2026', isNew: true, badge: { status: 'warn', label: '3 z 14 poza normą' } }) + '<div style="height:12px"></div>' +
      DS.CellTestResult({ title: 'Lipidogram', person: 'Anna Kowalska', date: '2 lutego 2026', badge: { status: 'ok', label: 'Wszystko w normie' } }))) +
      cell('BadgeStatus', `${DS.BadgeStatus({ status: 'ok', label: 'Wszystko w normie' })} ${DS.BadgeStatus({ status: 'warn', label: '4 z 56 poza normą' })}`),
    props: [['title · person · date', 'string', ''], ['badge', '{status, label}', 'status: ok | warn'], ['isNew', 'boolean', 'wariant „New”']] };

  COMPONENTS.resultsummary = { fn: 'ResultSummary', title: 'ResultSummary · SwitchableTabRow', figma: 'Szczegóły badania 2516:102091 · SwitchableTabRow 2516:102113',
    desc: 'Karta „Aktualny wynik”: gradient Main/primary → Main/accent (59°), pierścień postępu 28 px, licznik Display/Large, podpis i pill-e na półprzezroczystym tle. Pod nią segmenty Wszystkie / Poza normą (aktywny = biały kafel z cieniem).',
    controls: [num('ok', 'W normie', 52), num('total', 'Wszystkich', 56)],
    render: p => { const ok = +p.ok, total = +p.total; return W(DS.ResultSummary({ ok, total, note: `${ok} wyników w normie`, chips: [{ label: 'W normie', value: ok }, { label: 'Poza normą', value: total - ok }] })); },
    matrix: () => cell('segmenty', W(DS.SwitchableTabRow({ items: [{ id: 'all', label: 'Wszystkie' }, { id: 'abn', label: 'Poza normą' }], active: 'all' }))),
    props: [['ok · total', 'number', 'pierścień liczy ok/total'], ['note', 'string', ''], ['chips', '[{label, value}]', '']] };

  COMPONENTS.paramrow = { fn: 'ParamRow', title: 'ParamRow · StatusLabel · RangeSlider', figma: 'CellParameter 2483:100492 · StatusLabel 2483:41802 · RangeSlider 2483:41824',
    desc: 'Wiersz parametru w trzech typach: Value (liczba + norma), Scale (dodatkowo tor z zieloną strefą normy i kropką wyniku), Qualitative (wynik ujemny / dodatni z klasą). Status niesie ikonę: check w normie, chevron poza normą, trójkąt dla wyniku dodatniego.',
    controls: [sel('type', 'Typ', ['value', 'scale', 'qual'], 'scale'), text('name', 'Parametr', 'Neutrocyty (NEU)'), text('value', 'Wynik', '3,2 10^9/L'), sel('status', 'Status', ['ok', 'above', 'below', 'pos', 'neg'], 'ok')],
    render: p => W(DS.ParamRow({ ...p, num: 3.2, min: 1.9, max: 7, norm: 'Norma: 1,90 - 7,00' })),
    matrix: () => cell('typy wiersza', W(`<div class="ds-AccordionGroup" style="width:100%">
        <div class="ds-AccordionGroup__content" style="padding-top:0">
          ${DS.ParamRow({ type: 'value', name: 'WBC (Leukocyty)', value: '11,2 10^9/L', status: 'above', norm: 'Norma: 4,0 - 10,0' })}${DS.Divider()}
          ${DS.ParamRow({ type: 'scale', name: 'Neutrocyty (NEU)', value: '3,2 10^9/L', status: 'ok', num: 3.2, min: 1.9, max: 7, norm: 'Norma: 1,90 - 7,00' })}${DS.Divider()}
          ${DS.ParamRow({ type: 'scale', name: 'Monocyty (MONO)', value: '0,9 10^9/L', status: 'above', num: 0.9, min: 0.2, max: 0.8, norm: 'Norma: 0,20 - 0,80' })}${DS.Divider()}
          ${DS.ParamRow({ type: 'qual', name: 'Roztocze kurzu domowego (d1)', status: 'pos', statusLabel: 'Dodatni • klasa 4' })}${DS.Divider()}
          ${DS.ParamRow({ type: 'qual', name: 'Pszenica (f4)', status: 'neg', statusLabel: 'Ujemny' })}
        </div></div>`)),
    props: [['type', 'value | scale | qual', ''], ['status', 'ok | above | below | pos | neg', 'ikona i kolor'], ['norm', 'string', 'tekst normy'], ['min · max · num', 'number', 'pozycja kropki na torze']] };

  COMPONENTS.accordiongroup = { fn: 'AccordionGroup', title: 'AccordionGroup · AccordionCell (FAQ)', figma: 'AccordionGroup 2483:42754 · AccordionCell 2291:134295',
    desc: 'AccordionGroup grupuje parametry wyniku (nagłówek 16 Bold z licznikiem, chevron 20 w polu 40, treść z dywidentami). AccordionCell to wiersz FAQ w arkuszu: ikona pytania, pytanie 14 Bold i rozwijana odpowiedź.',
    controls: [text('title', 'Nagłówek', 'Parametry główne'), num('count', 'Licznik', 5), bool('open', 'Rozwinięty')],
    render: p => W(DS.AccordionGroup({ ...p, count: +p.count, content: DS.Divider() + DS.ParamRow({ type: 'value', name: 'HGB (Hemoglobina)', value: '13,9 g/dl', status: 'ok', norm: 'Norma: 12,0 - 16,0' }) })),
    matrix: () => cell('FAQ', W(DS.AccordionCell({ question: 'Jak przygotować się do badania morfologii krwi?', answer: 'Do badania należy zgłosić się na czczo (8-12 godzin bez jedzenia), najlepiej w godzinach porannych.', open: true }) + '<div style="height:12px"></div>' + DS.AccordionCell({ question: 'Czy potrzebuję skierowania?', answer: '' }))),
    props: [['title · count', 'string · number', ''], ['open', 'boolean', ''], ['content', 'html', 'wiersze ParamRow z dywidentami']] };

  COMPONENTS.toastmessage = { fn: 'ToastMessage', title: 'ToastMessage · CellContent', figma: 'ToastMessage 2483:96493 · CellContent 2516:102160',
    desc: 'ToastMessage to stała informacja w treści (wariant Info: tło Functional/infoSubtle, ikona 20, tytuł 14 Bold, opis 12 SemiBold). CellContent to wiersz „etykieta + wartość” z ikoną — używany na ekranie Dodatkowe informacje.',
    controls: [text('title', 'Tytuł', 'Wyniki skonsultuj z lekarzem'), text('body', 'Opis', 'Aplikacja nie stawia diagnozy, wynik zawsze interpretuje lekarz')],
    render: p => W(DS.ToastMessage(p)),
    matrix: () => cell('CellContent', W(`${DS.Divider()}<div style="height:32px"></div>${DS.CellContent({ icon: 'material', label: 'Pobierany materiał', value: 'Krew żylna (EDTA)' })}<div style="height:32px"></div>${DS.Divider()}<div style="height:32px"></div>${DS.CellContent({ icon: 'calendar', label: 'Data pobrania', value: '12 marca 2026 • 08:40' })}`)),
    props: [['title · body', 'string', ''], ['action', 'string', 'opcjonalny link po prawej'], ['CellContent.icon', 'nazwa ikony', 'material · method · lab-pin · calendar · clock · info-circle']] };

  window.SB.route();
})();
