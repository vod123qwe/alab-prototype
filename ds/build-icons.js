// Buduje ds/icons.js z plików SVG w ds/assets (eksporty z Figmy przez MCP).
// Uruchom: node ds/build-icons.js   (z katalogu prototype)
// Ikony dostają fill/stroke = currentColor, żeby dało się je kolorować tokenami.
const fs = require('fs');
const path = require('path');

const ASSETS = path.join(__dirname, 'assets');
const OUT = path.join(__dirname, 'icons.js');

// nazwa w DS → plik
const ICONS = {
  'chevron-left': 'ic_outline_chevron_left.svg',
  'eye': 'ic_outline_eye.svg',
  'scan': 'ic_line_scan.svg',
  'info-square': 'ic_outline_info_square.svg',
  'x-close': 'ic_outline_x_close.svg',
  'x': 'ic_outline_x.svg',
  'tag': 'ic_outline_tag.svg',
  'gift': 'ic_line_gift.svg',
  'voucher': 'ic_voucher.svg',
  'check-circle': 'ic_snackbar_check.svg',
  'loading': 'ic_outline_loading_02.svg',
  'alabek': 'il_alabek.svg',
  'logo-club': 'il_logo_club_white.svg',
  'logo-laboratoria': 'il_logo_laboratoria_white.svg',
  'splash-loader': 'splash_loader.svg',
  'search-md': 'ic_outline_search_md.svg',
  'search-active': 'ic_outline_search_lg_active.svg',
  'home': 'ic_outline_home_04.svg',
  'folder': 'ic_file_folder_document.svg',
  'cart': 'ic_shopping_cart_02.svg',
  'location-check': 'ic_line_location_check.svg',
  'chevron-right': 'ic_outline_chevron_right.svg',
  'test-tube': 'ic_line_test_tube.svg',
  'medicine-bottle': 'ic_line_medicine_bottle.svg',
  'fork-knife': 'ic_line_fork_and_knife.svg',
  'bubbles': 'ic_line_bubbles.svg',
  'heart-rate': 'ic_line_heart_rate.svg',
  'plus-square': 'ic_line_plus_sq_fr.svg',
  'unavailable': 'ic_badge_unavailable.svg',
  'file-note-search': 'ic_file_note_search.svg',
  'clear': 'ic_clear.svg',
  'file-check': 'ic_line_file_check.svg',
  'view-list': 'ic_line_view_list.svg',
};

function clean(svg) {
  return svg
    .replace(/\s(width|height|style|preserveAspectRatio|overflow)="[^"]*"/g, '')
    .replace(/fill="(#[0-9a-fA-F]{3,8}|white|black)"/g, 'fill="currentColor"')
    .replace(/stroke="(#[0-9a-fA-F]{3,8}|white|black)"/g, 'stroke="currentColor"')
    .replace(/\sid="[^"]*"/g, '')
    .replace(/\n\s*/g, '')
    .trim();
}

const out = {};
// Lupa: eksport z Figmy zwrócił placeholder slotu (ramka skanu), więc glif lupy jest narysowany ręcznie wg ic_outline_search_lg (założenie do potwierdzenia).
out.search = '<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.167 3.333a5.833 5.833 0 1 0 0 11.667 5.833 5.833 0 0 0 0-11.667Zm-7.5 5.834a7.5 7.5 0 1 1 13.37 4.69l2.97 2.97a.833.833 0 1 1-1.179 1.179l-2.97-2.97A7.5 7.5 0 0 1 1.667 9.167Z" fill="currentColor"/></svg>';
for (const [name, file] of Object.entries(ICONS)) {
  const p = path.join(ASSETS, file);
  if (!fs.existsSync(p)) { console.warn('brak', file); continue; }
  out[name] = clean(fs.readFileSync(p, 'utf8'));
}

const body = '// Wygenerowane przez ds/build-icons.js — nie edytuj ręcznie.\n' +
  'window.DS = window.DS || {};\n' +
  'DS.ICONS = ' + JSON.stringify(out, null, 1) + ';\n';
fs.writeFileSync(OUT, body, 'utf8');
console.log('OK', Object.keys(out).length, 'ikon →', OUT);
