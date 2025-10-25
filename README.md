# 🏥 Sistema de Gestão para Consultório de Pediatria

## 📋 Sobre o Projeto

Sistema completo de gestão para consultório de pediatria com módulos especializados e sistema de permissões (RBAC).

**Desenvolvido para:** Dra. Thais Cordeiro - CRM 52 101870-1
**Consultório:** WhatsApp (21) 98742-3808

---

## ✨ Funcionalidades Principais

### 🔐 Sistema de Autenticação e Permissões (RBAC)

- **Médico:** Acesso total a todos os módulos
- **Secretária:** Acesso limitado apenas a:
  - Cadastro de pacientes
  - Agendamento de consultas

### 📊 Módulos de Pediatria

1. **👶 Dados Neonatais**
   - Informações do parto
   - Antropometria ao nascer
   - Escala de Apgar
   - Triagem neonatal (Teste do Pezinho, Olhinho, etc.)

2. **📈 Crescimento & Desenvolvimento**
   - Curvas de crescimento (Peso, Altura, IMC, PC)
   - Gráficos interativos
   - Marcos do desenvolvimento (OMS)
   - Cálculo automático de IMC
   - **Histórico Médico por Período** (0-12m, 12-24m, 24-36m)

3. **💉 Vacinação**
   - Calendário Nacional de Vacinação 2024
   - Controle de doses aplicadas
   - Alertas de vacinas pendentes
   - Exportação de cartão vacinal em PDF

4. **🤱 Aleitamento Materno**
   - Avaliação de mamas e mamilos
   - Pega e posicionamento
   - Complementação com fórmula
   - Introdução alimentar

5. **📅 Puericultura**
   - Consultas de rotina
   - Sinais vitais
   - Avaliação geral
   - Histórico de consultas

6. **⚠️ Intercorrências**
   - Registro de doenças infantis
   - Hipótese diagnóstica
   - Tratamento prescrito
   - Controle de alergias

7. **📝 Receituário Médico**
   - Criação de receitas com múltiplos medicamentos
   - Dosagem, via de administração, frequência
   - **Exportação em PDF** com cabeçalho profissional
   - Assinatura digital (Dra. Thais Cordeiro - CRM 52 101870-1)
   - Histórico de receitas por paciente

8. **🏥 Atestados e Declarações**
   - Atestados médicos (modelo CREMERJ)
   - Declarações de comparecimento
   - Templates prontos (repouso, acompanhamento)
   - **Exportação em PDF**
   - CID opcional, período de afastamento

9. **📅 Agendamento de Retorno**
   - Agendar consultas de retorno no cadastro
   - **Lembrete automático via WhatsApp** 48h antes
   - Integração com WhatsApp do consultório (21 98742-3808)

---

## 💾 Sistema de Backup e Gerenciamento

### 📤 Exportar Backup
- Botão **verde "Exportar Backup"** na tela principal
- Exporta **TODOS os dados** em formato JSON:
  - Lista completa de pacientes
  - Todos os módulos (neonatal, crescimento, vacinação, etc.)
  - Receituário e atestados
  - Histórico médico completo
- Arquivo nomeado: `backup-pediatria-YYYY-MM-DD.json`
- **Recomendação:** Fazer backup semanal!

### 📥 Importar Backup
- Botão **azul "Importar Backup"** na tela principal
- Restaura dados de arquivo JSON exportado
- Modo **MESCLAR**: mantém dados existentes + adiciona novos
- Validação de integridade do arquivo
- Proteção contra arquivos corrompidos

### 🗑️ Excluir Paciente
- Botão **vermelho "Excluir Paciente"** na aba Cadastro
- Confirmação dupla antes de excluir
- Remove **TODOS os dados** do paciente:
  - Cadastro completo
  - Todos os módulos associados
  - Receitas e atestados
  - Histórico médico
- ⚠️ **ATENÇÃO:** Ação irreversível!

### 💡 Como os Dados são Salvos?

**Atualmente:** LocalStorage do Navegador
- ✅ Desenvolvimento rápido (MVP)
- ✅ Sem custos de servidor
- ✅ Funciona offline
- ✅ Privacidade total (dados ficam no dispositivo)
- ❌ Dados não sincronizam entre dispositivos
- ❌ Risco de perda se limpar cache do navegador

**Para Produção:** Banco de Dados
- 📖 Veja documentação completa em: [`BANCO_DE_DADOS_VERCEL.md`](./BANCO_DE_DADOS_VERCEL.md)
- Opções recomendadas:
  - **Supabase** (PostgreSQL) - Grátis até 500MB
  - **Firebase** (Google) - Grátis até 1GB
  - **Vercel Postgres** - Grátis até 256MB
  - **PocketBase** - Grátis ilimitado (auto-hospedado)

---

## 🚀 Instalação

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn

### Passo a Passo

1. **Clone ou extraia o projeto**
```bash
cd thais-pediatra
```

2. **Instale as dependências**
```bash
npm install
```

3. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

4. **Acesse no navegador**
```
http://localhost:5175
```

---

## 🔑 Credenciais de Acesso

### Médico (Acesso Total)
- **Usuário:** `thais`
- **Senha:** `THAIS2024`

### Secretária (Acesso Limitado)
- **Usuário:** `secretaria`
- **Senha:** `SEC2024`

---

## 🛠️ Tecnologias Utilizadas

- **React 18.2** - Framework frontend
- **TailwindCSS 3.3** - Estilização
- **Lucide React** - Ícones
- **Recharts** - Gráficos de crescimento
- **jsPDF** - Exportação de relatórios
- **XLSX** - Exportação de dados
- **Vite** - Build tool

---

## 📁 Estrutura do Projeto

```
thais-pediatra/
├── src/
│   ├── config/
│   │   ├── modules.js          # Configuração dos módulos
│   │   └── roles.js            # Sistema RBAC
│   ├── contexts/
│   │   └── AuthContext.jsx     # Contexto de autenticação
│   ├── components/
│   │   └── CadastroPaciente.jsx
│   ├── modules/
│   │   ├── DadosNeonatais.jsx
│   │   ├── Crescimento.jsx
│   │   ├── Vacinacao.jsx
│   │   ├── Aleitamento.jsx
│   │   ├── Puericultura.jsx
│   │   └── Intercorrencias.jsx
│   ├── App.jsx                 # Componente principal
│   ├── main.jsx
│   └── index.css
├── package.json
└── README.md
```

---

## 💰 Modelo de Precificação Sugerido

### Plano Solo (1 usuário)
- **Implantação:** R$ 1.500
- **Mensalidade:** R$ 147 (anual: R$ 1.764)
- **Inclui:** 1 especialidade, suporte por email

### Plano Clínica (até 3 usuários)
- **Implantação:** R$ 2.500
- **Mensalidade:** R$ 247 (anual: R$ 2.964)
- **Inclui:** 2 especialidades, sistema de permissões, suporte prioritário

### Plano Premium (usuários ilimitados)
- **Implantação:** R$ 3.500
- **Mensalidade:** R$ 397 (anual: R$ 4.764)
- **Inclui:** Todas especialidades, white-label, suporte 24/7

---

## 🎯 Diferenciais do Produto

✅ **Modular:** Sistema adaptável por especialidade
✅ **RBAC:** Controle granular de permissões
✅ **Multi-tenancy:** Suporta múltiplos profissionais
✅ **Curvas OMS:** Gráficos de crescimento oficiais
✅ **Calendário Vacinal 2024:** Sempre atualizado
✅ **Exportação PDF:** Relatórios profissionais
✅ **Sem mensalidade de servidor:** Dados locais (LocalStorage)

---

## 🔄 Próximas Funcionalidades

- [ ] Backend com banco de dados (PostgreSQL/MongoDB)
- [ ] Integração com WhatsApp para lembretes
- [ ] Sistema de agendamento
- [ ] Módulo financeiro completo
- [ ] Receituário digital com assinatura eletrônica
- [ ] Integrações com laboratórios
- [ ] App mobile (React Native)
- [ ] Backup em nuvem automático

---

## 🏗️ Como Expandir para Outras Especialidades

### Clínica Médica Geral
Adicione ao `src/config/modules.js`:
```javascript
CLINICA_GERAL: {
  name: 'Clínica Médica',
  tabs: [
    { id: 'anamnese', label: 'Anamnese Completa' },
    { id: 'exames', label: 'Exames Laboratoriais' },
    { id: 'prescricoes', label: 'Prescrições' },
    // ...
  ]
}
```

---

## 📞 Suporte

Para dúvidas ou customizações, entre em contato:

**Email:** seu-email@exemplo.com
**WhatsApp:** (00) 00000-0000

---

## 📄 Licença

Este é um software proprietário desenvolvido como MVP para demonstração.

---

## 🙏 Créditos

**Desenvolvido por:** Eng. Tadeu Santana
**Data:** Outubro 2024
**Versão:** 1.0.0 MVP

---

## 🚀 Build para Produção

```bash
# Gerar build otimizado
npm run build

# Preview do build
npm run preview
```

Os arquivos estarão em `dist/` prontos para deploy em:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Qualquer servidor web

---

**🎉 Sistema pronto para demonstração!**
