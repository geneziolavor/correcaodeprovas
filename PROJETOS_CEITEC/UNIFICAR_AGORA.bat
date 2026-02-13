@echo off
title CEITEC - Unificador de Sistemas (V2 CORRIGIDA)
cls
echo ===================================================
echo   CEITEC - EXECUTOR DE UNIFICACAO AUTOMATICA
echo ===================================================
echo.
echo [1/3] Limpando e preparando arquivos Flutter...
cd /d "c:\Users\genez\PROJETOS_CEITEC\sistema_correcao_final"
call "C:\flutter\bin\flutter.bat" clean
echo.
echo [2/3] Gerando versao Web do Scanner (Aguarde, isso pode demorar)...
:: Removido o parametro problematico --web-renderer
call "C:\flutter\bin\flutter.bat" build web --release
echo.
echo [3/3] Movendo arquivos para o Portal Principal...
if not exist "c:\Users\genez\PROJETOS_CEITEC\SISTEMA_CEITEC_FINAL\public\scanner_ocr" mkdir "c:\Users\genez\PROJETOS_CEITEC\SISTEMA_CEITEC_FINAL\public\scanner_ocr"

:: Verifica se a pasta build\web realmente existe antes de copiar
if exist "build\web\index.html" (
    xcopy /E /Y /I build\web\* "c:\Users\genez\PROJETOS_CEITEC\SISTEMA_CEITEC_FINAL\public\scanner_ocr\"
    echo.
    echo ===================================================
    echo   UNIFICACAO LOCAL CONCLUIDA COM SUCESSO!
    echo ===================================================
) else (
    echo.
    echo [ERRO] A pasta de construcao (build\web) nao foi encontrada.
    echo O Flutter pode ter falhado ao compilar. Verifique as mensagens acima.
)

echo.
echo AGORA, PARA SUBIR PARA O SITE:
echo 1. Va para a pasta SISTEMA_CEITEC_FINAL
echo 2. Use o VS Code para fazer Commit e Push (Sincronizar)
echo.
pause
exit

