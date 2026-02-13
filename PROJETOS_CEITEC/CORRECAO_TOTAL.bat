@echo off
set "PATH=%PATH%;C:\Program Files\nodejs"
echo ==========================================
echo   CORRECAO TOTAL DE DEPENDENCIAS CEITEC
echo ==========================================
echo.
cd /d "C:\Users\genez\PROJETOS_CEITEC\SISTEMA_CEITEC_FINAL"
echo [1/3] Limpando arquivos corrompidos...
if exist node_modules rd /s /q node_modules
if exist package-lock.json del /f /q package-lock.json

echo.
echo [2/3] Reinstalando pacotes (Aguarde alguns minutos)...
call npm install --no-audit

echo.
echo [3/3] Verificando se o Vite foi instalado...
if exist node_modules\.bin\vite.cmd (
    echo [SUCESSO] Vite instalado corretamente!
) else (
    echo [ERRO] Falha na instalacao. Tente rodar: pnpm install
)

echo.
echo Concluido! Agora tente abrir pelo INICIAR_SISTEMAS.bat
pause
