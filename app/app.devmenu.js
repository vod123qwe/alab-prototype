/* ALAB • Prototyp — ukryte menu pod status barem: Storybook, reset widoku, sprawdzanie aktualizacji.
   Otwiera się tapnięciem w górny pasek telefonu (makietowy status bar na desktopie, strefa safe-area na telefonie). */
(function () {
  const APP = window.APP; const { go, snack, file } = APP;   // file() = ścieżka względem katalogu aplikacji (patrz app.js)
  const $ = (s, r = document) => r.querySelector(s);
  const VERSION = window.APP_VERSION || 'dev';
  const ASSETS = ['index.html', 'app.js', 'app.css', 'app.shop.js', 'app.devmenu.js', 'version.js', '../ds/tokens.css', '../ds/components.css', '../ds/components.shop.css', '../ds/components.js', '../ds/components.shop.js', '../ds/icons.js'];

  // strefa dotyku na górze telefonu
  const zone = document.createElement('button');
  zone.type = 'button'; zone.id = 'devzone'; zone.className = 'devzone'; zone.setAttribute('aria-label', 'Menu prototypu');
  $('#phone').appendChild(zone);

  let open = false;
  function openMenu() {
    if (open) return; open = true;
    const sheet = DS.presentSheet({ title: 'Prototyp ALAB', className: 'devmenu', closeAttrs: { 'data-menu': 'close' }, onClose: () => { open = false; }, content:
      `<div class="devmenu__list">
        ${DS.Cell({ icon: 'view-list', title: 'Storybook — design system', subtitle: 'Tokeny, komponenty, warianty', attrs: { 'data-menu': 'storybook' } })}
        ${DS.Cell({ icon: 'home', title: 'Zacznij od nowa', subtitle: 'Czyści dane i wraca do splasha', attrs: { 'data-menu': 'reset' } })}
        ${DS.Cell({ icon: 'loading', title: 'Sprawdź aktualizacje', subtitle: 'Wersja ' + DS.esc(VERSION), attrs: { 'data-menu': 'update', id: 'menu-update' } })}
      </div>
      <p class="devmenu__foot">Prototyp Future Mind dla ALAB laboratoria. Dane testowe: telefon 600 000 000, kod 000000, e-mail zajety@alab.pl, hasła „blokada” i „zle12345”. Katalog badań i ceny są przykładowe.</p>` });
    const wrap = sheet.wrap; const close = () => sheet.close();
    wrap.addEventListener('click', async (e) => {
      const t = e.target.closest('[data-menu]'); if (!t) return;
      const k = t.dataset.menu;
      if (k === 'close') return close();
      if (k === 'storybook') { location.href = file('../storybook/index.html'); return; }
      if (k === 'reset') { close(); APP.reset(); snack('Prototyp zresetowany', 'success', 110); return; }
      if (k === 'update') {
        const sub = t.querySelector('.ds-Cell__subtitle'); sub.textContent = 'Sprawdzam…';
        try {
          const r = await fetch(file('version.json') + '?t=' + Date.now(), { cache: 'no-store' }); const j = await r.json();
          if (j.version === VERSION) { sub.textContent = `Masz najnowszą wersję (${VERSION})`; }
          else {
            sub.textContent = `Nowa wersja ${j.version} — odświeżam…`;
            await Promise.all(ASSETS.map(a => fetch(file(a), { cache: 'reload' }).catch(() => null)));
            setTimeout(() => location.reload(), 300);
          }
        } catch (err) { sub.textContent = 'Nie udało się sprawdzić (brak sieci?)'; }
      }
    });
  }
  zone.addEventListener('click', openMenu);
  document.addEventListener('click', (e) => { if (e.target.closest('.ds-StatusBar') && !open) openMenu(); });
})();
