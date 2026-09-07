/* ============================================================
   ALAB • Sklep — logika prototypu
   ============================================================ */

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const esc = (s) => String(s).replace(/[&<>"]/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const icon = (name, cls = 'ic') =>
  `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ''}</svg>`;

/* ---------------- Kategorie ---------------- */

function renderCategories() {
  const list = CATEGORIES.slice(0, HOME_CATEGORY_COUNT);
  const rest = CATEGORIES.length - list.length;

  const tiles = list.map(c => `
    <li>
      <button class="tile" type="button">
        ${icon(c.icon, 'ic tile__ic')}
        <span class="tile__name">${esc(c.name)}</span>
      </button>
    </li>`).join('');

  const all = `
    <li>
      <button class="tile tile--all" type="button" aria-label="Wszystkie kategorie, ${rest} więcej">
        ${icon('plus_square', 'ic tile__ic')}
        <span class="tile__name">Wszystkie kategorie</span>
      </button>
    </li>`;

  $('#tiles').innerHTML = tiles + all;
}

/* ---------------- Karty produktów ---------------- */

function card(item, kindLabel) {
  const hasOld = Boolean(item.priceOld);
  return `
    <li>
      <article class="card">
        ${item.discount ? `<span class="card__badge">${esc(item.discount)}</span>` : ''}

        <p class="card__kind t-label-medium-em">${esc(item.kind)}</p>
        <h3 class="card__name t-headline-large">${esc(item.name)}</h3>

        <p class="card__meta t-body-small">
          ${icon('clock')}<span>${esc(item.wait)}</span>
        </p>

        <div class="card__foot">
          <button class="btn btn--tiny" type="button" data-add="${esc(item.name)}">Do koszyka</button>
          <div class="card__prices">
            <span class="card__price">${esc(item.price)}</span>
            ${hasOld ? `<span class="card__price-old t-body-small">${esc(item.priceOld)}</span>` : ''}
            ${item.priceMin ? `<span class="card__price-min t-label-xsmall">${esc(item.priceMin)}</span>` : ''}
          </div>
        </div>

        ${item.parts ? `<button class="link card__link t-label-large-em" type="button">Zobacz składowe pakietu • ${item.parts}</button>` : ''}
      </article>
    </li>`;
}

function renderProducts() {
  $('#packages').innerHTML = PACKAGES.map(p => card(p)).join('');
  $('#tests').innerHTML    = TESTS.map(t => card(t)).join('');
}

/* ---------------- Koszyk ---------------- */

let cart = 0;

function updateCart() {
  $$('[data-cart-count]').forEach(el => {
    el.textContent = cart;
    el.hidden = cart === 0;
  });
}

/* ---------------- Interakcje ---------------- */

function wireEvents() {
  // chipy sposobu realizacji — zachowanie radiogroup
  $$('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      $$('.chip').forEach(c => {
        c.classList.remove('is-selected');
        c.setAttribute('aria-checked', 'false');
      });
      chip.classList.add('is-selected');
      chip.setAttribute('aria-checked', 'true');
    });
  });

  // dodawanie do koszyka
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-add]');
    if (!btn) return;
    if (btn.dataset.added === '1') return;
    btn.dataset.added = '1';
    btn.textContent = 'W koszyku';
    cart += 1;
    updateCart();
  });
}

/* ---------------- Start ---------------- */

renderCategories();
renderProducts();
wireEvents();
updateCart();
