@echo off
echo ===================================================
echo   INICIANDO SISTEMA DE CORRECAO (WINDOWS MODE)
echo ===================================================

echo 1. Configurando ambiente...
set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
set "FLUTTER_BIN=C:\flutter\bin\flutter.bat"

echo 2. Verificando Flutter em: %FLUTTER_BIN%
if not exist "%FLUTTER_BIN%" (
    echo ERRO: Flutter nao encontrado em C:\flutter\bin\flutter.bat
    echo Verifique a instalacao do Flutter.
    pause
    exit /b
)

echo 3. Habilitando suporte a Windows Desktop...
call "%FLUTTER_BIN%" config --enable-windows-desktop

echo 4. Verificando dispositivos conectados...
call "%FLUTTER_BIN%" devices

echo 5. Executando o App no Windows...
echo (Isso pode demorar um pouco na primeira vez)
call "%FLUTTER_BIN%" run -d windows -v

echo.
echo Processo finalizado.
pause
