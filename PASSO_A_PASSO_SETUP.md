# 🏥 SETUP COMPLETO - SISTEMA DRA. THAIS PEDIATRA

## 📋 Visão Geral

Sistema de pediatria com **2 usuários compartilhando os mesmos pacientes**:
- 👩‍⚕️ **Dra. Thais** (Pediatra)
- 👤 **Secretária** (Atendimento)

Ambos acessam o mesmo sistema e veem os mesmos pacientes!

---

## 🎯 PASSO A PASSO COMPLETO

### PASSO 1: Criar Novo Projeto no Supabase

1. Acesse: https://supabase.com/dashboard
2. Clique em **"New Project"**
3. Preencha:
   - **Name:** `thais-pediatra`
   - **Database Password:** (escolha uma senha forte e ANOTE!)
   - **Region:** South America (São Paulo) - `sa-east-1`
   - **Pricing Plan:** FREE
4. Clique em **"Create new project"**
5. Aguarde ~2 minutos (criação do banco)

---

### PASSO 2: Executar SQL de Setup

1. No Supabase, vá em: **SQL Editor** (ícone `</>` no menu lateral)
2. Clique em **"New Query"**
3. Abra o arquivo: `SETUP_SUPABASE_THAIS.sql`
4. **Copie TODO o conteúdo**
5. **Cole** no SQL Editor
6. Clique em **"Run"** (ou Ctrl+Enter)
7. Aguarde mensagem: **"Success. No rows returned"**

**O que foi criado:**
- ✅ Tabela `clinicas` (clínica da Dra. Thais)
- ✅ Tabela `profissionais` (Dra + Secretária)
- ✅ Tabela `pacientes_pediatria` (pacientes compartilhados)
- ✅ Row Level Security (RLS) configurado
- ✅ Políticas de acesso (Dra e Secretária veem mesmos pacientes)

---

### PASSO 3: Criar Usuários no Authentication

#### 3.1. Criar usuário da Dra. Thais:

1. Vá em: **Authentication → Users**
2. Clique em **"Add user"** → **"Create new user"**
3. Preencha:
   - **Email:** `thais@pediatra.com` (ou email real da Dra)
   - **Password:** `ThaisPed@2025` (ou senha escolhida)
   - **Auto Confirm User:** ✅ **MARQUE ESTA OPÇÃO!**
4. Clique em **"Create user"**
5. **ANOTE o UUID** que aparecerá (exemplo: `550e8400-e29b-41d4-...`)

#### 3.2. Criar usuário da Secretária:

1. Clique em **"Add user"** novamente
2. Preencha:
   - **Email:** `secretaria@pediatra.com`
   - **Password:** `Secret@2025` (ou senha escolhida)
   - **Auto Confirm User:** ✅ **MARQUE!**
3. Clique em **"Create user"**
4. **ANOTE o UUID**

---

### PASSO 4: Vincular Usuários à Clínica

1. Abra o arquivo: `CRIAR_USUARIOS_THAIS.sql`
2. Localize as linhas:
   ```sql
   uuid_dra_thais UUID := 'COLE_UUID_DRA_THAIS_AQUI';
   uuid_secretaria UUID := 'COLE_UUID_SECRETARIA_AQUI';
   ```
3. **Substitua** pelos UUIDs anotados no Passo 3
4. **Copie TODO o conteúdo** atualizado
5. Volte ao **SQL Editor** → **"New Query"**
6. **Cole** o SQL
7. Clique em **"Run"**
8. Deve aparecer:
   ```
   NOTICE: Usuários criados com sucesso!
   NOTICE: Dra. Thais ID: 550e8400-...
   NOTICE: Secretária ID: ...
   ```

---

### PASSO 5: Anotar Credenciais do Projeto

1. No Supabase, vá em: **Settings → API**
2. **COPIE E ANOTE:**

   **Project URL:**
   ```
   https://XXXXXXXX.supabase.co
   ```

   **anon/public key:**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...
   ```

   **service_role key (SECRETA - NÃO COMPARTILHAR!):**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...
   ```

---

### PASSO 6: Testar Acesso

Execute este SQL para verificar se tudo está OK:

```sql
-- Ver clínica criada
SELECT * FROM clinicas;

-- Ver profissionais criados
SELECT
  p.nome,
  p.email,
  p.tipo,
  c.nome as clinica
FROM profissionais p
LEFT JOIN clinicas c ON p.clinica_id = c.id;

-- Ver políticas RLS ativas
SELECT tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename;
```

**Deve retornar:**
- 1 clínica: "Clínica Pediátrica Dra. Thais"
- 2 profissionais: Dra. Thais (medico) + Secretária (secretaria)
- Múltiplas políticas RLS ativas

---

## 📊 ARQUITETURA DO SISTEMA

### Como funciona o acesso compartilhado:

```
┌─────────────────────────────────────────────┐
│         CLÍNICA PEDIÁTRICA DRA. THAIS       │
│              (clinica_id: c123...)          │
└─────────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
  ┌──────────┐            ┌──────────────┐
  │ Dra.     │            │ Secretária   │
  │ Thais    │            │              │
  └──────────┘            └──────────────┘
        │                         │
        └────────────┬────────────┘
                     ▼
        ┌─────────────────────────┐
        │   PACIENTES PEDIATRIA   │
        │  (compartilhados!)      │
        │                         │
        │  • João (3 anos)        │
        │  • Maria (5 anos)       │
        │  • Pedro (1 ano)        │
        └─────────────────────────┘
```

**Ambas veem e editam os mesmos pacientes!**

---

## 🔐 Segurança (RLS)

### O que cada usuário pode fazer:

**Dra. Thais:**
- ✅ Ver todos os pacientes da clínica
- ✅ Criar novos pacientes
- ✅ Editar pacientes existentes
- ✅ Deletar pacientes
- ✅ Ver dados da secretária

**Secretária:**
- ✅ Ver todos os pacientes da clínica
- ✅ Criar novos pacientes
- ✅ Editar pacientes existentes
- ✅ Deletar pacientes
- ✅ Ver dados da Dra. Thais

**Outros usuários (se existirem):**
- ❌ NÃO veem nada da clínica da Dra. Thais
- ❌ Isolamento total entre clínicas

---

## 💰 Custos

### Plano FREE Supabase:
- ✅ **500 MB** de banco de dados
- ✅ **50.000 usuários** ativos/mês
- ✅ **2 GB** de transferência
- ✅ **R$ 0,00 / mês**

**Estimativa:**
- 2 usuários (Dra + Secretária) = **0,004%** do limite
- 1000 pacientes ≈ **10 MB** = **2%** do espaço
- **Suporta tranquilamente 10.000+ pacientes no FREE!**

---

## 📝 Credenciais Finais

Após completar todos os passos, anote aqui:

```
PROJETO: thais-pediatra

SUPABASE:
- URL: https://_____________.supabase.co
- anon key: eyJhbGciOiJIUzI1NiIsI_____________
- service_role: eyJhbGciOiJIUzI1NiIs_____________ (SECRETO!)

USUÁRIOS:
1. Dra. Thais
   - Email: thais@pediatra.com
   - Senha: ThaisPed@2025
   - UUID: ________________________

2. Secretária
   - Email: secretaria@pediatra.com
   - Senha: Secret@2025
   - UUID: ________________________

CLÍNICA:
- ID: c1234567-89ab-cdef-0123-456789abcdef
- Nome: Clínica Pediátrica Dra. Thais
```

---

## ✅ CHECKLIST FINAL

- [ ] Projeto Supabase criado
- [ ] SQL de setup executado (tabelas criadas)
- [ ] Usuário Dra. Thais criado no Authentication
- [ ] Usuário Secretária criado no Authentication
- [ ] UUIDs copiados e colados no SQL
- [ ] SQL de usuários executado (vinculação à clínica)
- [ ] Credenciais anotadas
- [ ] Teste executado (SELECT nas tabelas)

---

## 🚀 PRÓXIMOS PASSOS

Agora que o banco está pronto, você pode:

1. **Criar o frontend** para Dra. Thais (similar ao da Paula)
2. **Adaptar campos** para pediatria (idade, vacinas, etc)
3. **Testar login** com ambos os usuários
4. **Criar pacientes** e verificar que ambos veem os mesmos

---

**Data de criação:** 2025-10-26
**Desenvolvido por:** Eng. Tadeu Santana
**Status:** ✅ Pronto para uso!
