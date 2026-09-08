# -*- coding: utf-8 -*-
"""Lokalny serwer prototypu ALAB.

Prototyp używa routera na ścieżkach (/app/produkt/..., a nie #/product/...), więc adres ekranu
nie ma swojego pliku na dysku. Ten serwer robi to samo co reguła na Netlify: nieznany adres
pod /app/ oddaje /app/index.html, a aplikacja rysuje właściwy ekran. Dzięki temu odświeżenie
strony i wklejony link do konkretnego ekranu działają też lokalnie.

Uruchomienie:  python serve.py [port]     (domyślnie 8802, nasłuch na wszystkich interfejsach)
"""
import http.server
import os
import socketserver
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8802
ROOT = os.path.dirname(os.path.abspath(__file__))
APP_INDEX = os.path.join(ROOT, 'app', 'index.html')


class Handler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        real = super().translate_path(path)
        clean = path.split('?')[0].split('#')[0]
        last = clean.rstrip('/').rsplit('/', 1)[-1]
        # tylko adresy ekranów (bez kropki = bez rozszerzenia); brakujący plik ma dalej dawać 404
        if clean.startswith('/app/') and '.' not in last and not os.path.exists(real):
            return APP_INDEX
        return real

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def log_message(self, fmt, *args):
        sys.stderr.write('%s %s\n' % (self.address_string(), fmt % args))


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


if __name__ == '__main__':
    os.chdir(ROOT)
    with Server(('0.0.0.0', PORT), Handler) as httpd:
        print('ALAB prototyp  ->  http://localhost:%d/app/' % PORT)
        print('Storybook      ->  http://localhost:%d/storybook/' % PORT)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass
