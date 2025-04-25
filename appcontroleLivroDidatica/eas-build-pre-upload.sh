#!/bin/bash
# Este script é executado antes do upload do projeto para o EAS Build
# Ele ajuda a resolver problemas de case sensitivity

echo "Executando script de pré-upload para resolver inconsistências..."

# Exibir informações do git
git config --get core.ignorecase

# Ignorar arquivos com case sensitivity inconsistente
echo "# Arquivos temporários gerados pelo script de pré-upload" >> .gitignore
echo "node_modules/.cache" >> .gitignore
echo ".expo" >> .gitignore
echo "__generated__" >> .gitignore

# Garantir que todos os arquivos estejam consistentes
git add .
git status

echo "Pré-processamento concluído." 