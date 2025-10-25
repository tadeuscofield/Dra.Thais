# 🗄️ Banco de Dados e Deploy no Vercel

## 📋 Sistema Atual: LocalStorage

### Como Funciona Atualmente

O sistema **Pediatria - Dra. Thais Cordeiro** atualmente utiliza **LocalStorage** do navegador para armazenar todos os dados:

- ✅ **Vantagens:**
  - Desenvolvimento rápido (MVP)
  - Sem custos de servidor
  - Funciona offline
  - Privacidade total (dados ficam no dispositivo)

- ❌ **Limitações:**
  - Dados ficam apenas no navegador local
  - Não sincroniza entre dispositivos
  - Risco de perda se limpar cache do navegador
  - Limite de ~5-10MB por domínio
  - Não permite múltiplos usuários simultâneos

### Sistema de Backup Implementado

Para mitigar os riscos do LocalStorage, implementamos:

1. **Exportar Backup** (botão verde)
   - Exporta TODOS os dados em formato JSON
   - Inclui: lista de pacientes + todos os módulos (neonatal, crescimento, vacinação, etc.)
   - Arquivo nomeado: `backup-pediatria-YYYY-MM-DD.json`

2. **Importar Backup** (botão azul)
   - Restaura dados de um arquivo JSON
   - Modo MESCLAR: mantém dados existentes + adiciona novos
   - Validação de integridade do arquivo

**Recomendação:** Fazer backup semanal e guardar em múltiplos locais (Google Drive, Dropbox, etc.)

---

## 🚀 Deploy no Vercel

### O Que é o Vercel?

Vercel é uma plataforma de hospedagem **GRATUITA** para aplicações front-end (React, Vue, etc.)

### Vercel NÃO Tem Banco de Dados Embutido

⚠️ **IMPORTANTE:** O Vercel é apenas para hospedar o **front-end** (interface). Ele NÃO oferece banco de dados próprio.

Ao fazer deploy no Vercel com LocalStorage:
- ✅ O site fica acessível publicamente
- ✅ Interface funciona perfeitamente
- ❌ Cada usuário/dispositivo terá seus próprios dados locais
- ❌ Não há sincronização entre dispositivos

---

## 💡 Soluções de Banco de Dados para Produção

Se você quer que os dados sejam **compartilhados** e **persistentes**, precisa adicionar um backend + banco de dados.

### Opção 1: Supabase (RECOMENDADA) 💚

**O que é:** Backend completo (PostgreSQL + Auth + Storage)

**Plano Gratuito:**
- ✅ 500MB de banco de dados
- ✅ Até 50.000 usuários ativos/mês
- ✅ Autenticação inclusa
- ✅ API REST automática
- ✅ Tempo real (opcional)

**Custo:**
- Grátis até 500MB
- Plano Pro: $25/mês (2GB)

**Integração:**
```bash
npm install @supabase/supabase-js
```

**Código exemplo:**
```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://sua-url.supabase.co',
  'sua-chave-publica'
)

// Salvar paciente
const { data, error } = await supabase
  .from('pacientes')
  .insert({ nome: 'João', dataNascimento: '2023-01-01' })

// Buscar pacientes
const { data: pacientes } = await supabase
  .from('pacientes')
  .select('*')
```

**Vantagens:**
- ✅ Fácil de usar
- ✅ Documentação excelente
- ✅ Dashboard visual
- ✅ Backup automático
- ✅ Segurança RLS (Row Level Security)

**Site:** https://supabase.com

---

### Opção 2: Firebase (Google) 🔥

**O que é:** Plataforma completa do Google

**Plano Gratuito (Spark):**
- ✅ 1GB de armazenamento
- ✅ 10GB de transferência/mês
- ✅ Autenticação gratuita
- ✅ Firestore (NoSQL)

**Custo:**
- Grátis até 1GB
- Pay-as-you-go depois

**Integração:**
```bash
npm install firebase
```

**Vantagens:**
- ✅ Muito popular
- ✅ Muitos tutoriais
- ✅ Integração Google
- ✅ Tempo real nativo

**Desvantagens:**
- ⚠️ Mais complexo que Supabase
- ⚠️ NoSQL (diferente de SQL tradicional)

**Site:** https://firebase.google.com

---

### Opção 3: Vercel Postgres + Vercel KV

**O que é:** Banco de dados serverless da própria Vercel

**Plano Gratuito (Hobby):**
- ✅ 256MB PostgreSQL
- ✅ 256MB Redis (KV)
- ✅ Integração nativa com Vercel

**Custo:**
- Grátis até 256MB
- Pro: $20/mês

**Integração:**
```bash
npm install @vercel/postgres
```

**Vantagens:**
- ✅ Mesma plataforma
- ✅ Deploy simplificado
- ✅ Edge Functions

**Desvantagens:**
- ⚠️ Limite pequeno no gratuito
- ⚠️ Precisa de backend (API Routes)

**Site:** https://vercel.com/storage/postgres

---

### Opção 4: PocketBase (Auto-hospedada) 🎒

**O que é:** Backend em um único arquivo executável

**Custo:**
- ✅ **100% GRATUITO** (open source)
- Você hospeda onde quiser

**Recursos:**
- ✅ SQLite embutido
- ✅ Admin dashboard
- ✅ Autenticação
- ✅ API REST automática
- ✅ Realtime subscriptions
- ✅ File storage

**Hospedagem:**
- Fly.io: Grátis até 3GB
- Railway: $5/mês
- VPS própria: ~$5/mês

**Integração:**
```bash
npm install pocketbase
```

**Vantagens:**
- ✅ Totalmente gratuito
- ✅ Super simples
- ✅ Um único arquivo
- ✅ Dashboard admin visual

**Desvantagens:**
- ⚠️ Você gerencia a hospedagem
- ⚠️ SQLite (limite ~1TB)

**Site:** https://pocketbase.io

---

## 📊 Comparação Rápida

| Solução | Gratuito? | Facilidade | Backend Necessário? | Recomendado para |
|---------|-----------|------------|---------------------|------------------|
| **LocalStorage + Backup** | ✅ Sim | ⭐⭐⭐⭐⭐ | ❌ Não | MVP, teste, uso pessoal |
| **Supabase** | ✅ Sim (500MB) | ⭐⭐⭐⭐ | ❌ Não | **Produção (RECOMENDADO)** |
| **Firebase** | ✅ Sim (1GB) | ⭐⭐⭐ | ❌ Não | Aplicativos grandes |
| **Vercel Postgres** | ✅ Sim (256MB) | ⭐⭐⭐ | ✅ Sim (API Routes) | Apps Vercel |
| **PocketBase** | ✅ Sim (ilimitado) | ⭐⭐⭐⭐ | ⚠️ Auto-hospedagem | Controle total |

---

## 🎯 Recomendação Final

### Para Uso Atual (Teste/MVP)
**Continue com LocalStorage + Backup**
- Sistema funciona perfeitamente
- Faça backups semanais
- Sem custos

### Para Produção (Múltiplos Dispositivos/Usuários)
**Use Supabase**
- Plano gratuito generoso (500MB)
- Fácil migração
- Banco SQL (familiar)
- Segurança profissional
- Dashboard admin

### Roteiro de Migração para Supabase:

1. **Criar conta no Supabase** (grátis)
2. **Criar projeto**
3. **Criar tabelas:**
   - `pacientes`
   - `dados_neonatais`
   - `crescimento`
   - `vacinacao`
   - `aleitamento`
   - `puericultura`
   - `intercorrencias`
   - `receituario`
   - `atestados`

4. **Instalar biblioteca:**
   ```bash
   npm install @supabase/supabase-js
   ```

5. **Substituir localStorage por chamadas Supabase:**
   ```javascript
   // Antes (localStorage)
   localStorage.setItem('paciente-123', JSON.stringify(dados))

   // Depois (Supabase)
   await supabase.from('pacientes').upsert(dados)
   ```

6. **Deploy no Vercel** com variáveis de ambiente:
   ```
   NEXT_PUBLIC_SUPABASE_URL=sua-url
   NEXT_PUBLIC_SUPABASE_KEY=sua-chave
   ```

**Tempo estimado:** 2-4 horas para migração completa

---

## 💰 Estimativa de Custos

### Cenário 1: Uso Básico (1 médica)
- **Vercel (front-end):** Grátis
- **Supabase (banco):** Grátis (até 500MB)
- **Total:** R$ 0,00/mês

### Cenário 2: Consultório Médio (2-3 médicos)
- **Vercel (front-end):** Grátis
- **Supabase Pro:** ~R$ 125/mês (U$ 25)
- **Total:** R$ 125/mês

### Cenário 3: Clínica Grande (5+ médicos)
- **Vercel Pro:** ~R$ 100/mês (U$ 20)
- **Supabase Pro:** ~R$ 125/mês (U$ 25)
- **Total:** R$ 225/mês

---

## 🔒 Considerações de Segurança e LGPD

### LocalStorage
- ⚠️ Dados ficam no navegador (vulnerável se computador for comprometido)
- ✅ Dados não trafegam na internet
- ❌ Não atende LGPD para dados compartilhados

### Com Banco de Dados (Supabase/Firebase)
- ✅ Criptografia em trânsito (HTTPS)
- ✅ Criptografia em repouso
- ✅ Controle de acesso (RLS)
- ✅ Logs de auditoria
- ✅ Backup automático
- ✅ Conformidade LGPD (se configurado corretamente)

**Importante:** Para atender LGPD completamente:
1. Implementar autenticação robusta
2. Logs de acesso
3. Termo de consentimento
4. Política de privacidade
5. Direito ao esquecimento (delete)

---

## 📞 Próximos Passos

Se quiser migrar para produção com banco de dados, posso te ajudar com:

1. ✅ Criação das tabelas no Supabase
2. ✅ Migração do código localStorage → Supabase
3. ✅ Deploy no Vercel com banco de dados
4. ✅ Sistema de autenticação
5. ✅ Conformidade LGPD

**Tempo estimado total:** 4-8 horas de desenvolvimento

---

## 📚 Links Úteis

- **Vercel Deploy:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Firebase Docs:** https://firebase.google.com/docs
- **PocketBase:** https://pocketbase.io/docs
- **LGPD Brasil:** https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd

---

**Desenvolvido para Dra. Thais Cordeiro - Sistema Pediatria**
Data: Outubro 2024
