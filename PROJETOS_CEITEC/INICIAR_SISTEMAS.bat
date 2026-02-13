@echo off
:: CEITEC CONTROL PANEL - VERSAO DEFINITIVA E CORRIGIDA
set "PORTAL_DIR=C:\Users\genez\PROJETOS_CEITEC\SISTEMA_CEITEC_FINAL"
set "SCANNER_DIR=C:\Users\genez\PROJETOS_CEITEC\sistema_correcao_final"
:: Usaremos comandos diretos para evitar problemas de aspas aninhadas
set "VITE_CMD=npx vite --port 3000 --open"
set "FLUTTER_CMD=flutter run -d chrome"

:menu
cls
echo ===================================================
echo   CEITEC - CENTRAL DE COMANDO (INTEGRACAO PRO)
echo ===================================================
echo.
echo [1] Iniciar PORTAL CEITEC (React - Port 3000)
echo [2] Iniciar SCANNER OCR (Flutter - ORIGINAL)
echo [3] INICIAR AMBOS (Portal + Scanner)
echo.
echo [R] RESET/REPARAR PORTAL (Se o portal der erro)
echo [4] Sair
echo.
set /p opt="Digite a opcao: "

if /I "%opt%"=="R" goto reset
if "%opt%"=="1" goto p1
if "%opt%"=="2" goto p2
if "%opt%"=="3" goto p3
if "%opt%"=="4" exit
goto menu

:reset
echo [INFO] Iniciando reparo...
call "C:\Users\genez\PROJETOS_CEITEC\RESET_TOTAL.bat"
goto menu

:p1
echo.
echo [INFO] Abrindo Portal na porta 3000...
cd /d "%PORTAL_DIR%"
start "PORTAL_CEITEC" cmd /k "npx vite --port 3000 --open"
goto finish

:p2
echo.
echo [INFO] Abrindo Scanner (Original)...
cd /d "%SCANNER_DIR%"
start "SCANNER_OCR" cmd /k "C:\flutter\bin\flutter.bat run -d chrome"
goto finish

:p3
echo.
echo [INFO] Abrindo Ecossistema Completo...
:: Abre o Portal primeiro
cd /d "%PORTAL_DIR%"
start "PORTAL_CEITEC" cmd /k "npx vite --port 3000 --open"
:: Aguarda um pouco e abre o Scanner
timeout /t 3
cd /d "%SCANNER_DIR%"
start "SCANNER_OCR" cmd /k "C:\flutter\bin\flutter.bat run -d chrome"
goto finish

:finish
echo.
echo [SUCESSO] Comandos enviados para o Windows!
echo Verifique se as novas abas abriram no seu Chrome.
timeout /t 5
exit
