/* ALAB • Prototyp — Wyniki badań (Moduł 7), FAQ i placeholder webview.
   Ekrany 1:1 z sekcji „Wyniki badań” 2516:102053: lista „Listing • Wyniki wyszukiwania” 2516:102054,
   „Wyniki • Empty state” 2516:102079, „Szczegóły badania” 2516:102083, „Dodatkowe informacje” 2516:102151;
   arkusz FAQ i ekran webview z „Podstrony” 2265:66486. Dane: app/data.results.js (szablony). */
(function () {
  const APP = window.APP; const { SCREENS, ACTIONS, FADE_ROUTES, go, back, snack, current } = APP;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = DS.esc;
  const R = window.RESULTS_DATA; const { RESULTS, FAQ, WEBVIEWS, allParams, summary, isOk } = R;

  const plural = (n, one, few, many) => `${n} ${n === 1 ? one : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? few : many)}`;

  const st = () => { const s = APP.S; if (!s.res) s.res = { filter: 'all', open: {}, read: {}, scroll: {} }; return s.res; };
  const byId = (id) => RESULTS.find(r => r.id === id);
  const newCount = () => RESULTS.filter(r => r.isNew && !st().read[r.id]).length;

  // ---------------- lista wyników ----------------
  const badgeFor = (r) => { const s = summary(r); return s.abnormal
    ? { status: 'warn', label: s.qual ? `${s.abnormal} z ${s.total} dodatnich` : `${s.abnormal} z ${s.total} poza normą` }
    : { status: 'ok', label: 'Wszystko w normie' }; };
  const resultCard = (r) => DS.CellTestResult({ id: r.id, title: r.title, person: r.person, date: r.date,
    badge: badgeFor(r), isNew: r.isNew && !st().read[r.id], attrs: { 'data-action': 'open-result', 'data-id': r.id } });
  const yearGroups = () => {
    const years = [...new Set(RESULTS.map(r => r.year))];
    return years.map(y => `<section class="results__group">${DS.YearRule({ label: y })}` +
      `<div class="results__cards">${RESULTS.filter(r => r.year === y).map(resultCard).join('')}</div></section>`).join('');
  };
  const emptyState = () => DS.ScreenState({ asset: DS.ASSETS + 'il_results_empty.png', title: 'Tu znajdziesz swoje wyniki',
    body: 'Gdy wykonasz badanie, wynik pojawi się tutaj automatycznie', buttons: [DS.Button({ label: 'Przejdź do sklepu', block: true, attrs: { 'data-tab': 'shop' } })] });

  const resultsScreen = (empty) => `<div class="screen shop results" data-tab="results">
      <div class="screen__top results__top">${DS.StatusBar()}</div>
      <div class="screen__body results__body" id="res-list">
        ${empty ? emptyState() : `<h1 class="results__title">Wyniki badań</h1><div class="results__groups">${yearGroups()}</div>`}
      </div>
    </div>`;
  SCREENS['tab/results'] = () => resultsScreen(!RESULTS.length);
  SCREENS['results-empty'] = () => resultsScreen(true);   // stan pusty do podglądu z panelu prototypu

  // ---------------- szczegóły badania ----------------
  const paramsOf = (g) => st().filter === 'abn' ? g.params.filter(x => !isOk(x)) : g.params;
  const groupsHtml = (r) => r.groups.map((g, i) => {
    const list = paramsOf(g);
    if (!list.length) return '';
    const open = st().open[r.id + g.id] !== undefined ? st().open[r.id + g.id] : (st().filter === 'abn' || i === 0);
    const rows = list.map((x, j) => (j ? DS.Divider() : '') + DS.ParamRow(x)).join('');
    return DS.AccordionGroup({ id: r.id + g.id, title: g.title, count: list.length, open, content: DS.Divider() + rows });
  }).join('');

  SCREENS['result/:id'] = (id) => {
    const r = byId(id); if (!r) return SCREENS['tab/results']();
    const s = summary(r);
    // wszystko w normie → nie ma czego filtrować ani czego liczyć „poza normą”: bez segmentów i bez drugiego pill-a
    const allOk = s.abnormal === 0;
    if (allOk) st().filter = 'all';
    const chips = allOk ? [{ label: s.qual ? 'Ujemne' : 'W normie', value: s.ok }]
      : s.qual ? [{ label: 'Ujemne', value: s.ok }, { label: 'Dodatnie', value: s.abnormal }]
      : [{ label: 'W normie', value: s.ok }, { label: 'Poza normą', value: s.abnormal }];
    const note = s.qual ? plural(s.ok, 'wynik ujemny', 'wyniki ujemne', 'wyników ujemnych') : plural(s.ok, 'wynik w normie', 'wyniki w normie', 'wyników w normie');
    const barNote = `${s.ok} z ${s.total} ${s.qual ? 'ujemnych' : 'w normie'}`;   // druga linia belki po zwinięciu karty
    return `<div class="screen shop result" data-tab="results">
      <div class="screen__top">${DS.TopBar({ title: 'Szczegóły badania', subtitle: barNote, trailing: { icon: 'info-circle', label: 'Dodatkowe informacje', attrs: { 'data-action': 'result-info', 'data-id': r.id } } })}</div>
      <div class="screen__body result__body" id="res-scroll">
        <h1 class="result__title">${esc(r.title)}</h1>
        <p class="result__person">${DS.icon('user-01', 16)}<span>${esc(r.person)} • ${esc(r.date)}</span></p>
        ${DS.ResultSummary({ ok: s.ok, total: s.total, note, chips })}
        ${allOk ? '' : DS.SwitchableTabRow({ items: [{ id: 'all', label: 'Wszystkie' }, { id: 'abn', label: s.qual ? 'Dodatnie' : 'Poza normą' }], active: st().filter })}
        <div class="result__groups" id="res-groups">${groupsHtml(r) || DS.SearchEmpty({ icon: 'check-circle-outline', title: s.qual ? 'Brak wyników dodatnich' : 'Wszystkie parametry w normie', hint: 'Przełącz na „Wszystkie”, żeby zobaczyć pełną listę' })}</div>
        <div class="result__more">${DS.Divider()}${DS.Cell({ icon: 'file-text', title: 'Dodatkowe informacje', attrs: { 'data-action': 'result-info', 'data-id': r.id } })}${DS.Divider()}</div>
        ${DS.ToastMessage({ title: 'Wyniki skonsultuj z lekarzem', body: 'Aplikacja nie stawia diagnozy, wynik zawsze interpretuje lekarz' })}
      </div>
      ${DS.BottomActionsBar({ layout: 'horizontal', homeIndicator: false, attrs: { class: 'result__actions' }, buttons: [
        DS.Button({ label: 'Udostępnij', type: 'secondary', attrs: { 'data-action': 'result-share' } }),
        DS.Button({ label: 'Pobierz PDF', attrs: { 'data-action': 'result-pdf' } })] })}
    </div>`;
  };

  // ---------------- dodatkowe informacje ----------------
  SCREENS['rinfo/:id'] = (id) => {
    const r = byId(id); if (!r) return SCREENS['tab/results']();
    const m = r.meta;
    const rows = [['material', 'Pobierany materiał', m.material], ['method', 'Metoda', m.method], ['lab-pin', 'Laboratorium', m.lab],
      ['calendar', 'Data pobrania', m.collected], ['clock', 'Data wyniku', m.ready], ['info-circle', 'Uwagi', m.note]];
    return `<div class="screen rinfo">
      <div class="screen__top">${DS.TopBar({ leading: 'x-close', title: 'Dodatkowe informacje' })}</div>
      <div class="screen__body rinfo__body">
        <h1 class="result__title">${esc(r.title)}</h1>
        <p class="result__person">${DS.icon('user-01', 16)}<span>${esc(r.person)}</span></p>
        <div class="rinfo__rows">${DS.Divider()}${rows.map(([ic, label, value]) => DS.CellContent({ icon: ic, label, value }) + DS.Divider()).join('')}</div>
        ${DS.ToastMessage({ title: 'Wyniki skonsultuj z lekarzem', body: 'Aplikacja nie stawia diagnozy, wynik zawsze interpretuje lekarz' })}
      </div>
      ${DS.HomeIndicator()}
    </div>`;
  };

  // ---------------- webview (placeholder treści z serwisu ALAB) ----------------
  SCREENS['webview/:id'] = (key) => {
    const w = WEBVIEWS[key] || { title: 'Informacje', about: 'treść tej części aplikacji' };
    return `<div class="screen webview">
      <div class="screen__top">${DS.TopBar({ leading: 'x-close', title: w.title })}</div>
      <div class="screen__body webview__body">${DS.ScreenState({ title: 'Tu wczytamy stronę ALAB',
        body: `Ta część aplikacji pokazuje treść z serwisu ALAB w oknie aplikacji — zostaje tylko belka u góry z tytułem.

W gotowej wersji znajdziesz tu ${w.about}.` })}</div>
      ${DS.HomeIndicator()}
    </div>`;
  };

  // ---------------- arkusz FAQ ----------------
  function faqSheet() {
    const open = { q1: true };
    const list = () => `<div class="ds-BottomSheet__scroll faq__list">${FAQ.map(f => DS.AccordionCell({ id: f.id, question: f.q, answer: f.a, open: !!open[f.id] })).join('')}</div>`;
    const sheet = DS.presentSheet({ title: 'Najczęstsze pytania', height: '750px', content: list() });
    sheet.wrap.addEventListener('click', (e) => {
      const t = e.target.closest('[data-faq-toggle]'); if (!t) return;
      const cell = t.closest('[data-faq]'); const id = cell.dataset.faq;
      open[id] = !cell.classList.contains('is-open');
      cell.classList.toggle('is-open', open[id]);
      t.setAttribute('aria-expanded', String(open[id]));
      DS.slideToggle(cell.querySelector('.ds-AccordionCell__answer'), open[id]);
    });
  }

  // ---------------- akcje ----------------
  const info = (t) => snack(t, 'info', 110);
  Object.assign(ACTIONS, {
    'open-result': (el) => { const id = el.dataset.id; st().read[id] = true; go('result/' + id); },
    'result-info': (el) => go('rinfo/' + el.dataset.id),
    'result-share': () => info('Udostępnianie wyniku — systemowy arkusz, poza prototypem'),
    'result-pdf': () => info('Pobieranie PDF — poza prototypem'),
    'faq': () => faqSheet(),
    'open-webview': (el) => go('webview/' + (el.dataset.web || 'desc')),
  });
  // PDP: „Pełny opis badania” otwiera webview zamiast snackbara.
  // Zachęta do ALAB club prowadzi na ekran zgód (app.shop.js), nie na webview — dlatego tu jej nie nadpisujemy.
  ACTIONS['full-desc'] = () => go('webview/desc');

  document.addEventListener('click', (e) => {
    // akordeony wyniku
    const acc = e.target.closest('[data-accordion-toggle]');
    if (acc) {
      const sec = acc.closest('[data-accordion]'); const key = sec.dataset.accordion;
      const openNow = sec.classList.contains('is-open');
      st().open[key] = !openNow;
      sec.classList.toggle('is-open', !openNow);
      acc.setAttribute('aria-expanded', String(!openNow));
      DS.slideToggle(sec.querySelector('.ds-AccordionGroup__content'), !openNow);
      return;
    }
    // segmenty Wszystkie / Poza normą
    const seg = e.target.closest('[data-tab-pick]');
    if (seg && seg.closest('.result')) {
      st().filter = seg.dataset.tabPick;
      $$('[data-tab-pick]').forEach(b => { const on = b.dataset.tabPick === st().filter; b.classList.toggle('is-active', on); b.setAttribute('aria-selected', String(on)); });
      const r = byId(current().split('/')[1]); const box = $('#res-groups');
      if (r && box) { box.classList.add('is-swapping'); setTimeout(() => { box.innerHTML = groupsHtml(r) || DS.SearchEmpty({ icon: 'check-circle-outline', title: summary(r).qual ? 'Brak wyników dodatnich' : 'Wszystkie parametry w normie', hint: 'Przełącz na „Wszystkie”, żeby zobaczyć pełną listę' }); box.classList.remove('is-swapping'); DS.enhance(box); }, 120); }
    }
  });

  // przyklejony pasek akcji siedzi dokładnie na tab barze (jego wysokość zależy od safe-area telefonu)
  APP.afterRender.push((route, root) => {
    const bar = $('#tabbar'), actions = $('.result__actions', root);
    if (bar) { const setH = () => root.style.setProperty('--tabbar-h', bar.offsetHeight + 'px'); setH(); window.addEventListener('resize', setH, { passive: true }); }
    if (bar && actions) { const place = () => { actions.style.bottom = bar.offsetHeight + 'px'; }; place(); window.addEventListener('resize', place, { passive: true });
      APP.hideOnScrollDown($('#res-scroll', root), actions); }
    // TopBar przechodzi w wariant „On scroll” (surface 82% + blur 32), treść przewija się pod belką
    const top = $('.screen__top', root), body = $('.result__body, .rinfo__body', root);
    if (top && body) {
      const pad = () => { body.style.paddingTop = (top.offsetHeight + 32) + 'px'; };
      pad(); window.addEventListener('resize', pad, { passive: true });
      // Karta „Aktualny wynik” zwija się do belki (wzorzec dużego tytułu z HIG i zwijanego paska Material 3):
      // przesuwa się wolniej niż treść, delikatnie maleje i gaśnie, a jej liczba pojawia się jako druga linia belki.
      const card = $('.ds-ResultSummary', root);
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const D = card ? Math.max(120, card.offsetHeight) : 200;   // droga zwinięcia = wysokość karty
      let raf = 0;
      const onScroll = () => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0; const y = body.scrollTop, p = Math.max(0, Math.min(1, y / D));
          top.classList.toggle('is-scrolled', y > 8);
          top.classList.toggle('is-summary', p > 0.55);
          // prosty ruch: karta jedzie wolniej niż treść i wsuwa się pod belkę; bez wygaszania i bez skalowania
          if (card && !reduce) card.style.setProperty('--py', (y * 0.18).toFixed(1) + 'px');
        });
      };
      body.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    }
    const sc = $('#res-list, #res-scroll', root);
    if (sc) { if (route === 'tab/results') sc.scrollTop = st().scroll[route] || 0; sc.addEventListener('scroll', () => { st().scroll[route] = sc.scrollTop; }, { passive: true }); }
  });

  // Czytelne adresy wyników — te same slugi dla szczegółu i dla ekranu informacji dodatkowych
  const rslug = {}; RESULTS.forEach(r => { rslug[r.id] = r.title.toLowerCase().replace(/ł/g, 'l').normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 52).replace(/-+$/, ''); });
  APP.slugs('result', rslug); APP.slugs('rinfo', rslug);

  APP.results = { newCount };
  APP.ROUTES.push(['— Wyniki'], ['Wyniki · lista', 'tab/results'], ['Wyniki · stan pusty', 'results-empty'],
    ['Wynik · morfologia', 'result/r1'], ['Wynik · panel alergiczny', 'result/r5'], ['Dodatkowe informacje', 'rinfo/r1'], ['Webview', 'webview/desc']);
  APP.renderNav();
})();
