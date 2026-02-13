@echo off
title DEPLOY EMERGENCIAL - VERCEL
cls
echo ===================================================
echo   DEPLOY EMERGENCIAL VIA VERCEL CLI
echo ===================================================
echo.
echo Este script vai fazer o deploy manual do seu projeto.
echo.
echo PASSO 1: Instalando Vercel CLI...
call npm install -g vercel
echo.
echo PASSO 2: Fazendo login no Vercel...
echo (Uma janela do navegador vai abrir)
cd /d "c:\Users\genez\PROJETOS_CEITEC\Wireframeparainovatecedu"
call vercel login
echo.
echo PASSO 3: Fazendo deploy de producao...
call vercel --prod
echo.
echo ===================================================
echo   DEPLOY CONCLUIDO!
echo ===================================================
echo.
echo ANOTE A URL QUE APARECEU ACIMA!
echo.
pause
exit
