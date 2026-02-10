@echo off
set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo ==================================================
echo   CORRIGINDO JAVA_HOME E LANÇANDO NO LDPLAYER
echo ==================================================
echo JAVA_HOME definido para: %JAVA_HOME%
echo.

echo 1. Verificando conexao com o emulador...
call flutter devices
echo.

echo 2. Iniciando instalacao no LDPlayer (emulator-5554)...
echo (Isso pode levar alguns minutos na primeira vez)
call flutter run -d emulator-5554

echo.
echo Se o app nao abrir, feche esta janela e tente novamente.
pause

