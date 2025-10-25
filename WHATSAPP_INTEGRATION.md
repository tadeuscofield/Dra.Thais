# 📱 Integração com WhatsApp - Lembretes Automáticos

## 🎯 Objetivo

Enviar lembretes automáticos via WhatsApp para os responsáveis dos pacientes **48 horas antes** da consulta agendada.

---

## 📋 Como Funciona

### 1. **Agendamento no Sistema**

No módulo de **Cadastro do Paciente**, existe uma seção de "Agendamento de Retorno" onde você pode:
- Definir data do retorno
- Definir horário
- Definir motivo (ex: "Consulta de rotina")
- Informar o WhatsApp do responsável

### 2. **Mensagem Automática**

48 horas antes da consulta, o sistema enviará automaticamente uma mensagem como:

```
Olá! 👋

Lembramos que [NOME DO PACIENTE] tem consulta agendada com a Dra. Thais Cordeiro (Pediatria) para:

📅 Data: DD/MM/AAAA
🕐 Horário: HH:MM
📍 Motivo: [Motivo da consulta]

Para confirmar ou reagendar, entre em contato:
📱 WhatsApp: (21) 98742-3808

Att,
Consultório Dra. Thais Cordeiro
CRM 52 101870-1
```

---

## 🔧 Opções de Implementação

### **Opção 1: WhatsApp Business API (Oficial)** ⭐ RECOMENDADO

**Vantagens:**
- ✅ Oficial e permitido pelo WhatsApp
- ✅ Mensagens automáticas permitidas
- ✅ Relatórios de entrega
- ✅ Não corre risco de bloqueio

**Requisitos:**
- Conta WhatsApp Business verificada
- Facebook Business Manager
- Servidor com webhook

**Custo:**
- Conversas iniciadas pelo negócio: ~R$ 0,30 por mensagem
- Mensagens de resposta: gratuitas (dentro de 24h)

**Implementação:**
```javascript
// Exemplo simplificado
const enviarLembrete = async (telefone, pacienteNome, data, horario) => {
  const response = await fetch('https://graph.facebook.com/v17.0/YOUR_PHONE_ID/messages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: telefone,
      type: 'template',
      template: {
        name: 'lembrete_consulta',
        language: { code: 'pt_BR' },
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: pacienteNome },
              { type: 'text', text: data },
              { type: 'text', text: horario }
            ]
          }
        ]
      }
    })
  });
};
```

**Links úteis:**
- [WhatsApp Business API](https://business.whatsapp.com/products/business-platform)
- [Documentação Meta](https://developers.facebook.com/docs/whatsapp)

---

### **Opção 2: Serviços de Terceiros (Mais Fácil)**

**Provedores Brasileiros:**

1. **Z-API** (zapi.com.br)
   - Plano Starter: R$ 29/mês
   - Não precisa da API oficial
   - Fácil integração

2. **Evolution API** (Open Source)
   - Gratuito (self-hosted)
   - Baseado em WhatsApp Web
   - Simples de configurar

3. **Waha** (WhatsApp HTTP API)
   - Open Source
   - Docker ready
   - Gratuito

**Exemplo com Z-API:**
```javascript
const enviarLembreteZAPI = async (telefone, mensagem) => {
  const response = await fetch('https://api.z-api.io/instances/YOUR_INSTANCE/token/YOUR_TOKEN/send-text', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phone: telefone,
      message: mensagem
    })
  });
};
```

---

### **Opção 3: Automação via Node.js (Backend Necessário)**

**Tecnologias:**
- Node.js + Express
- Biblioteca `whatsapp-web.js`
- Cron job para verificar agendamentos

**Exemplo de estrutura:**

```javascript
// backend/services/whatsapp.js
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client();

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('WhatsApp conectado!');
});

client.initialize();

// Função para enviar lembrete
const enviarLembrete = async (numero, mensagem) => {
  const chatId = numero.includes('@c.us') ? numero : `${numero}@c.us`;
  await client.sendMessage(chatId, mensagem);
};

module.exports = { enviarLembrete };
```

```javascript
// backend/jobs/verificarAgendamentos.js
const cron = require('node-cron');
const { enviarLembrete } = require('../services/whatsapp');

// Rodar a cada hora
cron.schedule('0 * * * *', async () => {
  // 1. Buscar agendamentos nas próximas 48h
  const agendamentos = await buscarAgendamentosProximos();

  // 2. Para cada agendamento
  for (const agendamento of agendamentos) {
    const mensagem = `
Olá! 👋

Lembramos que ${agendamento.pacienteNome} tem consulta agendada com a Dra. Thais Cordeiro (Pediatria) para:

📅 Data: ${agendamento.data}
🕐 Horário: ${agendamento.horario}
📍 Motivo: ${agendamento.motivo}

Para confirmar ou reagendar, entre em contato:
📱 WhatsApp: (21) 98742-3808

Att,
Consultório Dra. Thais Cordeiro
CRM 52 101870-1
    `.trim();

    await enviarLembrete(agendamento.whatsapp, mensagem);

    // 3. Marcar como lembrete enviado
    await marcarLembreteEnviado(agendamento.id);
  }
});
```

---

## 🚀 Implementação Recomendada (Step by Step)

### **Fase 1: Setup Básico (WhatsApp Business API)**

1. **Criar conta Facebook Business**
   - Acesse: business.facebook.com
   - Crie uma conta para o consultório

2. **Registrar número**
   - Use o número (21) 98742-3808
   - Verificar via SMS

3. **Criar templates de mensagem**
   - Criar template "lembrete_consulta"
   - Aguardar aprovação do Meta (1-2 dias)

4. **Obter credenciais**
   - Token de acesso
   - Phone Number ID
   - Business Account ID

### **Fase 2: Backend**

Criar um backend simples em Node.js:

```bash
mkdir whatsapp-backend
cd whatsapp-backend
npm init -y
npm install express node-cron axios dotenv
```

Estrutura:
```
whatsapp-backend/
├── .env
├── server.js
├── routes/
│   └── agendamentos.js
├── services/
│   ├── whatsapp.js
│   └── database.js
└── jobs/
    └── lembretes.js
```

### **Fase 3: Integração com o Sistema**

No sistema React atual, ao salvar um agendamento:

```javascript
// Ao salvar agendamento no cadastro
const handleSaveAgendamento = async (dados) => {
  // 1. Salvar no localStorage (como já faz)
  localStorage.setItem(`paciente-${pacienteId}`, JSON.stringify(dados));

  // 2. Enviar para o backend
  if (dados.dataRetorno && dados.whatsappResponsavel) {
    await fetch('http://localhost:3001/api/agendamentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pacienteId,
        pacienteNome: dados.nome,
        dataRetorno: dados.dataRetorno,
        horarioRetorno: dados.horarioRetorno,
        motivoRetorno: dados.motivoRetorno,
        whatsapp: dados.whatsappResponsavel
      })
    });
  }
};
```

---

## 💰 Custos Estimados

| Opção | Custo Mensal | Custo por Mensagem |
|-------|--------------|-------------------|
| WhatsApp Business API (oficial) | R$ 0 + mensagens | ~R$ 0,30 |
| Z-API | R$ 29 - R$ 99 | Ilimitadas |
| Evolution API (self-hosted) | R$ 0 (apenas servidor) | R$ 0 |
| Waha (self-hosted) | R$ 0 (apenas servidor) | R$ 0 |

**Exemplo de cálculo:**
- 100 pacientes/mês com retorno agendado
- Custo WhatsApp API oficial: 100 × R$ 0,30 = R$ 30/mês
- Custo Z-API: R$ 29/mês (ilimitado)

---

## ⚠️ Considerações Legais (LGPD)

1. **Consentimento**: Obter autorização para envio de mensagens
2. **Opt-out**: Permitir cancelamento de lembretes
3. **Dados sensíveis**: Não enviar informações médicas detalhadas
4. **Segurança**: Criptografar dados de contato

**Adicionar no cadastro:**
```javascript
<label className="flex items-center gap-2">
  <input
    type="checkbox"
    checked={dados.aceitaLembretes}
    onChange={(e) => handleChange('aceitaLembretes', e.target.checked)}
  />
  <span className="text-sm">
    Aceito receber lembretes de consulta via WhatsApp
  </span>
</label>
```

---

## 🎯 Próximos Passos

1. ✅ Sistema já está preparado para agendamentos
2. ⏳ Escolher provedor de WhatsApp
3. ⏳ Configurar backend (Node.js)
4. ⏳ Criar cron job para verificar agendamentos
5. ⏳ Testar envio de mensagens
6. ⏳ Implementar em produção

---

## 📞 Suporte

Para implementação e suporte técnico, entre em contato.

**Desenvolvimento:** Eng. Tadeu Santana
