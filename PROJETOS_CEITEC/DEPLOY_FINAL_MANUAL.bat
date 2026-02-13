@echo off
title DEPLOY FINAL (V5 - CLEAN PROJECT) - INOVATEC EDU
cls
echo ===================================================
echo   DEPLOY MANUAL - TENTATIVA 5 (PROJETO NOVO)
echo ===================================================
echo.
echo PASSO 1: Preparando ambiente...
cd /d "c:\Users\genez\PROJETOS_CEITEC\Wireframeparainovatecedu"

echo.
echo PASSO 2: Build do React (Vite)...
call npm run build

echo.
echo PASSO 3: Copiando Scanner OCR para a pasta final...
if not exist "dist\scanner_ocr" mkdir "dist\scanner_ocr"
xcopy /E /Y /I public\scanner_ocr\* dist\scanner_ocr\

echo.
echo PASSO 4: Preparando Pasta DIST para Deploy Limpo...
cd dist
if exist .vercel rmdir /s /q .vercel
:: Criar vercel.json de rotas pra garantir que o SPA funcione
echo { "rewrites": [ { "source": "/scanner_ocr/:path*", "destination": "/scanner_ocr/:path*" }, { "source": "/assets/:path*", "destination": "/assets/:path*" }, { "source": "/(.*)", "destination": "/index.html" } ] } > vercel.json

echo.
echo PASSO 5: Enviando como NOVO PROJETO (Isso resolve o conflito de config)...
echo.
echo --- INSTRUCOES ---
echo 1. Set up and deploy? [Y]
echo 2. Which scope? [ENTER]
echo 3. Link to existing project? [N] (NAO linkar ao antigo que esta quebrado)
echo 4. Project Name? [inovatec-educacao-final] (Ou outro nome unico)
echo 5. In which directory? [.] (Ponto/Enter)
echo 6. Want to modify settings? [N]
echo.
echo ATENCAO: Responda N para "Link to existing project"!
echo.
call vercel deploy --prod

echo.
echo ===================================================
echo   DEPLOY CONCLUIDO!
echo   Copie a URL nova que apareceu acima!
echo ===================================================
echo.
pause
exit
