# Script PowerShell para corrigir problemas de case sensitivity e fazer o build EAS
Write-Host "===============================================================" -ForegroundColor Green
Write-Host "Corrigindo problemas de case sensitivity e preparando para build" -ForegroundColor Green
Write-Host "===============================================================" -ForegroundColor Green

# Verificar se o Git está instalado
if (!(Get-Command "git" -ErrorAction SilentlyContinue)) {
    Write-Host "Git não está instalado ou não está no PATH. Por favor, instale o Git." -ForegroundColor Red
    exit 1
}

# Configurar Git para ser case-sensitive
Write-Host "Configurando Git para ser case-sensitive..." -ForegroundColor Yellow
git config core.ignorecase false

# Limpar caches e temporários
Write-Host "Limpando caches e arquivos temporários..." -ForegroundColor Yellow
if (Test-Path "node_modules\.cache") { Remove-Item -Recurse -Force "node_modules\.cache" }
if (Test-Path ".expo") { Remove-Item -Recurse -Force ".expo" }
if (Test-Path ".tmp") { Remove-Item -Recurse -Force ".tmp" }

# Criar .gitignore específico para o build
Write-Host "Atualizando arquivo .gitignore..." -ForegroundColor Yellow
@"
# Node
node_modules/
npm-debug.log
yarn-error.log
package-lock.json

# Expo
.expo/
.expo-shared/
dist/
web-build/

# macOS
.DS_Store

# Temporary files
*.swp
*.swo
*.tmp
*.temp
.tmp/
*.log

# Cache & Generated files
.cache/
node_modules/.cache/
"@ | Out-File -FilePath ".gitignore" -Encoding utf8 -Force

# Atualizar diretórios do Git
Write-Host "Atualizando Git com as novas configurações..." -ForegroundColor Yellow
git add .
git status

# Criar arquivo de ambiente para garantir que o build use caminhos case-sensitive
Write-Host "Configurando variáveis de ambiente para o build..." -ForegroundColor Yellow
"EXPO_USE_CASE_SENSITIVE_PATHS=true" | Out-File -FilePath ".env.local" -Encoding utf8 -Force

# Configurações para EAS
Write-Host "Configurando EAS para o build..." -ForegroundColor Yellow
$easConfig = @"
{
  "cli": {
    "version": ">= 5.9.1"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      },
      "cache": {
        "disabled": true
      }
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
"@ | Out-File -FilePath "eas.json" -Encoding utf8 -Force

# Executar o build
Write-Host "Iniciando o build EAS..." -ForegroundColor Green
$env:EXPO_USE_CASE_SENSITIVE_PATHS = "true"
eas build --platform android --profile preview --non-interactive

Write-Host "Processo concluído! Verifique o status do build em:" -ForegroundColor Green
Write-Host "https://expo.dev/accounts/genezio" -ForegroundColor Cyan

Read-Host "Pressione Enter para sair" 