@echo off
echo ===================================================
echo Corrigindo problemas de case sensitivity no projeto
echo ===================================================

echo Limpando cache...
if exist node_modules\.cache rd /s /q node_modules\.cache
if exist .expo rd /s /q .expo
if exist .tmp rd /s /q .tmp

echo Atualizando configuração git para case sensitivity...
git config core.ignorecase false

echo Removendo arquivos temporários...
del /f yarn.lock 2>NUL
del /f package-lock.json 2>NUL

echo Configurando ambiente...
set EXPO_USE_CASE_SENSITIVE_PATHS=true

echo Executando build EAS com configurações otimizadas...
call eas build --platform android --profile preview --non-interactive --no-wait

echo Build iniciado! Por favor, acompanhe o progresso no site do Expo.
echo Visite: https://expo.dev/accounts/genezio
pause 