@echo off
echo Limpando cache do projeto...
if exist node_modules\.cache rd /s /q node_modules\.cache
if exist .expo rd /s /q .expo
if exist .tmp rd /s /q .tmp
del /f yarn.lock 2>NUL
echo Configurando para build...
call npx expo prebuild --clean
echo Iniciando o build...
call eas build -p android --profile preview
echo Build concluido!
pause 