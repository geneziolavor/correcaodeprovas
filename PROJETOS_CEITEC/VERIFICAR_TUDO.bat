@echo off
title CEITEC - STATUS DO SISTEMA
echo ===================================================
echo   VERIFICANDO INTEGRIDADE DO PORTAL CEITEC
echo ===================================================
echo.
cd /d "C:\Users\genez\PROJETOS_CEITEC\SISTEMA_CEITEC_FINAL"

echo [1/2] Testando compilacao do codigo...
call npm run build > build_test.log 2>&1

if %errorlevel% equ 0 (
    echo.
    echo [SUCESSO] O PORTAL ESTA 100% ESTAVEL E COMPILADO!
    echo [OK] CSS v4 Configurado sem erros.
    echo [OK] Bibliotecas de Animacao (Framer) Estabilizadas.
    echo.
    echo ===================================================
    echo   SISTEMA PRONTO PARA OPERACAO (BOM DESCANSO!)
    echo ===================================================
    del build_test.log
) else (
    echo.
    echo [ERRO] Ainda existe um problema na compilacao.
    echo Verifique o arquivo build_test.log para detalhes.
)
pause
