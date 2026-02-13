# Plano de Integração: Inovatec Edu + Sistema de Correção

Este plano descreve a unificação técnica e pedagógica das duas plataformas para operarem como um ecossistema único sob o mesmo banco de dados Supabase e hospedagem Vercel.

## 🎯 Objetivos
- Unificar o banco de dados Supabase (Single Source of Truth).
- Implementar Single Sign-On (SSO) ou compartilhamento de sessão.
- Sincronização automática de notas entre o módulo de OCR e o Dashboard do professor.
- interface unificada via Portal Inovatec.

## 🏗️ Arquitetura Proposta

### 1. Camada de Dados (Supabase)
Utilizaremos o projeto Supabase do **Inovatec Edu** como principal.
- **Tabelas Existentes (Web):** `classes`, `students`, `activities`, `submissions`.
- **Novas Tabelas/Adaptações:** 
  - Adicionar suporte a "Gabaritos" e "Questões de OCR" na tabela `activities` (ou usar a estrutura de metadados JSON já existente).
  - Mapear `alunos` (Flutter) para `students` (Web).
  - Mapear `provas` (Flutter) para `activities` (Web) de tipo `exam`.

### 2. Módulo de Correção (Flutter)
- Migrar o Flutter para o projeto Supabase Web.
- Alterar as queries para lerem das tabelas `students` e `activities` do Inovatec.
- Quando uma correção for finalizada, o Flutter enviará os dados para a tabela `submissions` do Inovatec.

### 3. Portal do Professor (React)
- Adicionar no Dashboard a opção "Abrir Scaneador de Provas".
- Passar o contexto da turma e da atividade via URL Parameters.

---

## 📅 Fases de Implementação

### Fase 1: Unificação do Backend (Supabase)
- [ ] Exportar schema do Flutter e adaptar para o Supabase Web.
- [ ] Configurar políticas de RLS (Row Level Security) unificadas.
- [ ] Atualizar `.env.local` e `main.dart` com as mesmas chaves.

### Fase 2: Sincronização de Identidade (Auth)
- [ ] Configurar o Flutter para usar o Supabase Auth ou o sistema de `access_code` já existente no Inovatec.
- [ ] Garantir que o `student_id` seja consistente entre as duas apps.

### Fase 3: Fluxo de Correção Real-Time
- [ ] Implementar no Flutter a gravação direta em `submissions`.
- [ ] Adicionar trigger no Supabase para notificar o Dashboard Web quando uma correção chegar.

### Fase 4: Experiência Unificada (Frontend)
- [ ] Adicionar botão "Corrigir com IA" nas atividades do Inovatec.
- [ ] Implementar Deep Link ou redirecionamento para o Vercel do Flutter.

---

## 🛠️ Próximos Passos (Imediato)
1. Atualizar o `main.dart` do Flutter para apontar para o Supabase do Inovatec Edu.
2. Criar as colunas de suporte a OCR na tabela de `activities` do Supabase Web.
