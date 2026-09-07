@echo off
rem Uruchamia prototyp ALAB dla telefonu w tej samej sieci Wi-Fi.
rem Wymaga Pythona. Otwiera stronę z kodem QR do zeskanowania telefonem.
setlocal
cd /d "%~dp0"
set IP=
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do if not defined IP set IP=%%a
set IP=%IP: =%
echo.
echo  ALAB prototyp  -  http://%IP%:8802/app/
echo  Storybook      -  http://%IP%:8802/storybook/
echo  Kod QR         -  http://%IP%:8802/qr.html
echo.
echo  Jesli telefon nie laduje strony, zapora Windows blokuje Pythona w sieci publicznej.
echo  Uruchom raz jako administrator:  netsh advfirewall firewall add rule name="ALAB prototyp 8802" dir=in action=allow protocol=TCP localport=8802
echo.
start "" "http://%IP%:8802/qr.html"
python -m http.server 8802 --bind 0.0.0.0
