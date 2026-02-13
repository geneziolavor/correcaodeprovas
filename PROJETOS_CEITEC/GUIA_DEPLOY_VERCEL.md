# 🚀 GUIA DE DEPLOY MANUAL - INOVATEC EDU + SCANNER OCR

## ⚠️ PROBLEMA ATUAL
O Vercel não está encontrando o deployment. Isso pode acontecer por:
- O projeto não está conectado ao repositório GitHub correto
- O domínio foi deletado ou renomeado
- As configurações do Vercel precisam ser refeitas

## ✅ SOLUÇÃO: DEPLOY MANUAL VIA VERCEL CLI

### PASSO 1: Instalar Vercel CLI (Execute UMA VEZ)
```powershell
npm install -g vercel
```

### PASSO 2: Fazer Login no Vercel
```powershell
cd c:\Users\genez\PROJETOS_CEITEC\Wireframeparainovatecedu
vercel login
```
(Vai abrir o navegador para você fazer login)

### PASSO 3: Deploy do Projeto
```powershell
vercel --prod
```

### PASSO 4: Anotar a URL
Após o deploy, o Vercel vai mostrar a URL final. Anote ela!

---

## 🎯 ALTERNATIVA MAIS SIMPLES: RECONECTAR NO SITE DO VERCEL

1. Acesse: https://vercel.com/dashboard
2. Clique em "Add New" → "Project"
3. Conecte o repositório: `itagenezio/Wireframeparainovatecedu`
4. Configure:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Clique em "Deploy"

---

## 📋 INFORMAÇÕES DO PROJETO

**Repositório GitHub:**
https://github.com/itagenezio/Wireframeparainovatecedu.git

**Estrutura:**
- Portal React: `/` (raiz)
- Scanner OCR: `/public/scanner_ocr/`

**Variáveis de Ambiente Necessárias:**
```
VITE_SUPABASE_URL=https://zscbibomcdrzyllgktob.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzY2JpYm9tY2RyenlsbGdrdG9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMTE1OTQsImV4cCI6MjA4NTc4NzU5NH0.Xz3ubrGRqjAomF6jtB091v9g5yXWkadE_6pT5Yenzso
```
