@echo off
title CEITEC - RESET ESTAVEL (Tailwind v3)
echo ==========================================
echo   LIMPANDO CACHE E SINCRONIZANDO V3
echo ==========================================
echo.
echo [1/3] Finalizando processos do Node...
taskkill /F /IM node.exe /T >nul 2>&1

echo [2/3] Removendo cache do Vite...
cd /d "C:\Users\genez\PROJETOS_CEITEC\SISTEMA_CEITEC_FINAL"
if exist node_modules\.vite rd /s /q node_modules\.vite

echo [3/3] Verificando integridade do CSS...
:: Garante que o PostCSS config v3 esteja no lugar
if exist postcss.config.mjs del /f /q postcss.config.mjs

echo.
echo ==========================================
echo   RESET CONCLUIDO! MODO ESTAVEL ATIVO.
echo   Use a OPCAO 1 no Iniciar_Sistemas.bat
echo ==========================================
pause
