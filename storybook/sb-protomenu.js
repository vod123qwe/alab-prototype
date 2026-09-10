/* ALAB • Storybook — pasek z menu prototypu.
   Do katalogu DS wchodzi się z ukrytego menu prototypu („Storybook — design system"), a stamtąd nie było
   drogi powrotnej ani resetu — trzeba było ręcznie poprawiać adres. Ten pasek daje jedno i drugie
   w tym samym arkuszu, którym prototyp otwiera swoje menu.

   Uwaga: DS nie ma ikony burgera. Zamiast dorysowywać własną (reguła projektu: ikony bierzemy z zestawu)
   używamy `view-list` — tej samej, którą menu prototypu opisuje wejście do katalogu. */
(function () {
  const bar = document.getElementById('sb-topbar');
  if (!bar || !window.DS) return;

  bar.innerHTML = DS.IconButton({ icon: 'view-list', size: 'medium', variant: 'transparent', label: 'Menu prototypu', attrs: { id: 'sb-burger' } }) +
    `<span class="sb-topbar__title">ALAB • Design system</span>`;

  // Reset prototypu z tej strony: jedyny trwały stan aplikacji to `alab:club` w sessionStorage
  // (reszta żyje w pamięci i ginie przy przejściu). Czyścimy go i wracamy na start prototypu.
  const resetProto = () => {
    try { sessionStorage.removeItem('alab:club'); } catch (e) { /* prywatne okno */ }
    location.href = '../app/index.html';
  };

  let open = false;
  document.getElementById('sb-burger').addEventListener('click', () => {
    if (open) return; open = true;
    const sheet = DS.presentSheet({ title: 'Prototyp ALAB', className: 'devmenu', closeAttrs: { 'data-sb': 'close' },
      onClose: () => { open = false; }, content:
      `<div class="devmenu__list">
        ${DS.Cell({ icon: 'home', title: 'Wróć do prototypu', subtitle: 'Ekran wyboru zadania', attrs: { 'data-sb': 'proto' } })}
        ${DS.Cell({ icon: 'loading', title: 'Resetuj prototyp', subtitle: 'Czyści postęp i członkostwo w ALAB club', attrs: { 'data-sb': 'reset' } })}
      </div>
      <p class="devmenu__foot">Katalog komponentów design systemu ALAB. Prototyp Future Mind dla ALAB laboratoria.</p>` });
    sheet.wrap.addEventListener('click', (e) => {
      const t = e.target.closest('[data-sb]'); if (!t) return;
      const k = t.dataset.sb;
      if (k === 'close') return sheet.close();
      if (k === 'proto') { location.href = '../app/index.html'; return; }
      if (k === 'reset') { resetProto(); return; }
    });
  });
})();
