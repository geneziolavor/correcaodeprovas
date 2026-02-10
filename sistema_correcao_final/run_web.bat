@echo off
echo ===================================================
echo   INICIANDO NO NAVEGADOR (CHROME)
echo   Esta opcao funciona mesmo sem Visual Studio C++
echo ===================================================

echo 1. Habilitando suporte Web...
call "C:\flutter\bin\flutter.bat" config --enable-web

echo 2. Criando arquivos Web (se necessario)...
call "C:\flutter\bin\flutter.bat" create . --platforms=web

echo 3. Lançando no Chrome...
echo (Aguarde alguns instantes para compilar)
call "C:\flutter\bin\flutter.bat" run -d chrome

pause
