@echo off
echo ========================================
echo PUSH PARA GITHUB - sistemaceitec
echo ========================================
echo.

cd /d "C:\Users\genez\PROJETOS_CEITEC\SISTEMA_CEITEC_FINAL"

echo [1/5] Verificando status do Git...
"C:\Program Files\Git\bin\git.exe" status

echo.
echo [2/5] Adicionando todos os arquivos...
"C:\Program Files\Git\bin\git.exe" add .

echo.
echo [3/5] Fazendo commit...
"C:\Program Files\Git\bin\git.exe" commit -m "Add all project files including package.json"

echo.
echo [4/5] Verificando remote...
"C:\Program Files\Git\bin\git.exe" remote -v

echo.
echo [5/5] Fazendo push para GitHub...
echo IMPORTANTE: Se pedir autenticacao, use seu Personal Access Token como senha
echo.
"C:\Program Files\Git\bin\git.exe" push -u origin main --force

echo.
echo ========================================
echo PUSH CONCLUIDO!
echo ========================================
pause
