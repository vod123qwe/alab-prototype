# -*- coding: utf-8 -*-
"""Wypalenie tel ProductBackground z Figmy: zdjecie + PROGRESYWNE rozmycie + gradient.

Figma wygasza "background blur" alfa warstwy Content Background, wiec rozmycie narasta razem
z gradientem: u gory zero, u dolu pelne. Tego CSS nie zrobi wiernie, wiec skladamy raz, offline,
i wrzucamy jako gotowa grafike (dokladnie tak, jak dzialal wczesniejszy eksport 375x468 na PDP).
"""
import io, os
from PIL import Image, ImageFilter
import numpy as np

os.chdir('F:/AI - Tests/alab/prototype')
SRC = 'ds/assets/img_shop_bg.png'          # zdjecie zrodlowe z Figmy (freepik__enhance__43198 2), 4096x4096
S = 3                                       # 3x pod ekrany telefonow
W, H = 375 * S, 468 * S

# Zdjecie z Figmy ma kanal alfa (babel na przezroczystosci). convert('RGB') zamienialo przezroczystosc
# w CZERN, dlatego gorny pas wychodzil czarny - trzymamy RGBA i skladamy na granacie przez maske.
photo = Image.open(SRC).convert('RGBA')

def hexrgb(h):
    h = h.lstrip('#'); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))

NAVY = hexrgb('04387c')                     # --main-primary / background/surfaceinverse
GREY = hexrgb('f6f7f8')                     # --background-surface-secondary

def ramp(deg, p0, a0, p1, a1):
    """Rampa alfy jak gradient CSS: kat deg (180 = w dol), stopy w procentach, alfa a0->a1."""
    import math
    # kierunek gradientu w CSS: 180deg = z gory na dol. Wektor jednostkowy:
    rad = math.radians(deg)
    dx, dy = math.sin(rad), -math.cos(rad)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float64)
    # dlugosc linii gradientu dla prostokata (wzor CSS)
    L = abs(W * dx) + abs(H * dy)
    # rzut na os gradientu, znormalizowany do [0,1] wzgledem srodka
    t = ((xx - W / 2) * dx + (yy - H / 2) * dy) / L + 0.5
    a = (t - p0 / 100) / ((p1 - p0) / 100)
    return np.clip(a, 0, 1) * (a1 - a0) + a0

def place(cx, cy, size, rot=75):
    """Zdjecie: kwadrat `size` obrocony o `rot`, srodek w (cx, cy) - wszystko w px po skali S."""
    side = int(round(size * S))
    # RGBA + fillcolor przezroczysty: `rotate(expand=True)` na RGB wypelnia narozniki CZERNIA, a obrocony
    # kwadrat 840.738 jest tak duzy, ze te narozniki zakrywaja caly kadr - tlo wychodzilo wtedy czarne.
    im = photo.resize((side, side), Image.LANCZOS)         .rotate(rot, resample=Image.BICUBIC, expand=True, fillcolor=(0, 0, 0, 0))
    canvas = Image.new('RGB', (W, H), NAVY)
    canvas.paste(im, (int(round(cx * S - im.width / 2)), int(round(cy * S - im.height / 2))), im)
    return canvas

def bake(out, cx, cy, blur, deg, p0, a0, p1, a1, c0, c1, tint=True):
    base = place(cx, cy, 840.738)
    # progresywne rozmycie: mieszamy ostry i rozmyty obraz ta sama rampa, ktora nosi gradient
    soft = base.filter(ImageFilter.GaussianBlur(blur * S))
    a = ramp(deg, p0, a0, p1, a1)[..., None]
    mixed = np.asarray(base, np.float64) * (1 - a) + np.asarray(soft, np.float64) * a
    # gradient koloru: c0 -> c1 na tej samej osi, z ta sama alfa
    tint_px = np.asarray(c0, np.float64) * (1 - ramp(deg, p0, 0, p1, 1)[..., None]) \
         + np.asarray(c1, np.float64) * ramp(deg, p0, 0, p1, 1)[..., None]
    final = mixed * (1 - a) + tint_px * a if tint else mixed
    img = Image.fromarray(np.clip(final, 0, 255).astype('uint8'))
    img.save(out, optimize=True)
    print(out, img.size, os.path.getsize(out) // 1024, 'kB')

# Naglowek sklepu (Top Nav 3185:44676): srodek 50%+287.34 / 162.84, blur 46,
# Content Background 181.69deg, przezroczysty 6.09% -> granat 98.39%.
# Pas gradientu w projekcie ma 331px od dolu Top Nav; wypalamy go na calej wysokosci 468,
# bo naglowek w prototypie jest nizszy niz 331 i tak widzi tylko gorna czesc grafiki.
# Gradient wypalamy razem ze zdjeciem, na calej wysokosci 468. Kotwiczenie gradientu w CSS do dolu naglowka
# (jak w projekcie: 331px od dolu Top Nav) wychodzi ZLE, bo nasz naglowek jest nizszy niz Top Nav w Figmie
# (195-251 vs 266) - granat wjezdzal wtedy na babel i gasil go u samej gory.
bake('ds/assets/img_shop_bg_blur.png', 187.5 + 287.34, 162.84, 46, 181.69, 6.09, 0.0, 98.39, 1.0, NAVY, NAVY)

# Karta produktu (ProductBackground I1183:19461;574:1884): srodek 50%+251.34 / 213.84, blur 50,
# Content Background 182.41deg, granat 30% 1.62% -> #f6f7f8 82.43%.
bake('ds/assets/img_product_bg.png', 187.5 + 251.34, 213.84, 50, 182.41, 1.62, 0.3, 82.43, 1.0, NAVY, GREY)
