@echo off
echo Configurando JAVA_HOME para: C:\Program Files\Android\Android Studio\jbr
set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
set PATH=%JAVA_HOME%\bin;%PATH%

echo Limpando build anterior...
call flutter clean

echo Iniciando o app...
call flutter run
