// Sistema RBAC - Role Based Access Control

export const ROLES = {
  MEDICO: 'medico',
  SECRETARIA: 'secretaria'
};

export const PERMISSIONS = {
  // Cadastro de pacientes
  CADASTRO_CREATE: 'cadastro.create',
  CADASTRO_READ: 'cadastro.read',
  CADASTRO_UPDATE: 'cadastro.update',
  CADASTRO_DELETE: 'cadastro.delete',

  // Agendamento
  AGENDAMENTO_CREATE: 'agendamento.create',
  AGENDAMENTO_READ: 'agendamento.read',
  AGENDAMENTO_UPDATE: 'agendamento.update',
  AGENDAMENTO_DELETE: 'agendamento.delete',

  // Prontuário médico
  PRONTUARIO_READ: 'prontuario.read',
  PRONTUARIO_WRITE: 'prontuario.write',

  // Dados neonatais
  NEONATAL_READ: 'neonatal.read',
  NEONATAL_WRITE: 'neonatal.write',

  // Crescimento
  CRESCIMENTO_READ: 'crescimento.read',
  CRESCIMENTO_WRITE: 'crescimento.write',

  // Vacinação
  VACINACAO_READ: 'vacinacao.read',
  VACINACAO_WRITE: 'vacinacao.write',

  // Aleitamento
  ALEITAMENTO_READ: 'aleitamento.read',
  ALEITAMENTO_WRITE: 'aleitamento.write',

  // Puericultura
  PUERICULTURA_READ: 'puericultura.read',
  PUERICULTURA_WRITE: 'puericultura.write',

  // Intercorrências
  INTERCORRENCIAS_READ: 'intercorrencias.read',
  INTERCORRENCIAS_WRITE: 'intercorrencias.write',

  // Receituário
  RECEITUARIO_READ: 'receituario.read',
  RECEITUARIO_WRITE: 'receituario.write',

  // Atestados
  ATESTADO_READ: 'atestado.read',
  ATESTADO_WRITE: 'atestado.write',

  // Financeiro
  FINANCEIRO_READ: 'financeiro.read',
  FINANCEIRO_WRITE: 'financeiro.write',

  // Relatórios
  RELATORIOS_READ: 'relatorios.read',
  RELATORIOS_EXPORT: 'relatorios.export',

  // Configurações
  CONFIG_READ: 'config.read',
  CONFIG_WRITE: 'config.write'
};

// Mapeamento de permissões por role
export const ROLE_PERMISSIONS = {
  [ROLES.MEDICO]: [
    // Acesso total
    ...Object.values(PERMISSIONS)
  ],

  [ROLES.SECRETARIA]: [
    // Cadastro completo
    PERMISSIONS.CADASTRO_CREATE,
    PERMISSIONS.CADASTRO_READ,
    PERMISSIONS.CADASTRO_UPDATE,

    // Agendamento completo
    PERMISSIONS.AGENDAMENTO_CREATE,
    PERMISSIONS.AGENDAMENTO_READ,
    PERMISSIONS.AGENDAMENTO_UPDATE,
    PERMISSIONS.AGENDAMENTO_DELETE
  ]
};

// Função para verificar permissão
export const hasPermission = (userRole, permission) => {
  if (!userRole || !permission) return false;
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
};

// Função para verificar múltiplas permissões (precisa ter todas)
export const hasAllPermissions = (userRole, permissions) => {
  if (!Array.isArray(permissions)) return false;
  return permissions.every(permission => hasPermission(userRole, permission));
};

// Função para verificar se tem pelo menos uma permissão
export const hasAnyPermission = (userRole, permissions) => {
  if (!Array.isArray(permissions)) return false;
  return permissions.some(permission => hasPermission(userRole, permission));
};

// Dados do consultório
export const CONSULTORIO_INFO = {
  medica: 'Dra. Thais Cordeiro',
  crm: '52 101870-1',
  especialidade: 'Pediatria',
  whatsapp: '21987423808',
  whatsappFormatado: '(21) 98742-3808',
  endereco: '', // Adicionar endereço se necessário
  cidade: 'Rio de Janeiro',
  estado: 'RJ'
};

// Usuários do sistema (em produção, isso viria do backend)
export const USERS = {
  THAIS: {
    username: 'thais',
    password: 'THAIS2024', // Em produção, usar hash
    role: ROLES.MEDICO,
    name: 'Dra. Thais Cordeiro',
    crm: '52 101870-1',
    specialty: 'Pediatria'
  },
  SECRETARIA: {
    username: 'secretaria',
    password: 'SEC2024', // Em produção, usar hash
    role: ROLES.SECRETARIA,
    name: 'Secretária'
  }
};
