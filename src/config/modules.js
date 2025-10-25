// Configuração de módulos do sistema de Pediatria

export const TABS_PEDIATRIA = [
  {
    id: 'cadastro',
    label: 'Cadastro do Paciente',
    icon: 'User',
    permission: 'cadastro.read'
  },
  {
    id: 'neonatal',
    label: 'Dados Neonatais',
    icon: 'Baby',
    permission: 'neonatal.read'
  },
  {
    id: 'crescimento',
    label: 'Crescimento & Desenvolvimento',
    icon: 'TrendingUp',
    permission: 'crescimento.read'
  },
  {
    id: 'vacinacao',
    label: 'Vacinação',
    icon: 'Shield',
    permission: 'vacinacao.read'
  },
  {
    id: 'aleitamento',
    label: 'Aleitamento Materno',
    icon: 'Heart',
    permission: 'aleitamento.read'
  },
  {
    id: 'puericultura',
    label: 'Puericultura',
    icon: 'Calendar',
    permission: 'puericultura.read'
  },
  {
    id: 'intercorrencias',
    label: 'Intercorrências',
    icon: 'AlertTriangle',
    permission: 'intercorrencias.read'
  },
  {
    id: 'receituario',
    label: 'Receituário',
    icon: 'FileText',
    permission: 'receituario.read'
  },
  {
    id: 'atestados',
    label: 'Atestados',
    icon: 'FileBadge',
    permission: 'atestado.read'
  }
];

// Calendário Nacional de Vacinação 2024
export const CALENDARIO_VACINAL = [
  // Ao nascer
  { nome: 'BCG', doses: 1, idade: 'Ao nascer', protege: 'Tuberculose' },
  { nome: 'Hepatite B', doses: 1, idade: 'Ao nascer', protege: 'Hepatite B' },

  // 2 meses
  { nome: 'Pentavalente (DTP+Hib+HepB)', doses: 1, idade: '2 meses', protege: 'Difteria, Tétano, Coqueluche, Haemophilus, Hepatite B' },
  { nome: 'VIP (Polio inativada)', doses: 1, idade: '2 meses', protege: 'Poliomielite' },
  { nome: 'Pneumocócica 10', doses: 1, idade: '2 meses', protege: 'Pneumonia, Meningite' },
  { nome: 'Rotavírus', doses: 1, idade: '2 meses', protege: 'Diarreia por Rotavírus' },

  // 3 meses
  { nome: 'Meningocócica C', doses: 1, idade: '3 meses', protege: 'Meningite C' },

  // 4 meses
  { nome: 'Pentavalente (DTP+Hib+HepB)', doses: 2, idade: '4 meses', protege: 'Difteria, Tétano, Coqueluche, Haemophilus, Hepatite B' },
  { nome: 'VIP (Polio inativada)', doses: 2, idade: '4 meses', protege: 'Poliomielite' },
  { nome: 'Pneumocócica 10', doses: 2, idade: '4 meses', protege: 'Pneumonia, Meningite' },
  { nome: 'Rotavírus', doses: 2, idade: '4 meses', protege: 'Diarreia por Rotavírus' },

  // 5 meses
  { nome: 'Meningocócica C', doses: 2, idade: '5 meses', protege: 'Meningite C' },

  // 6 meses
  { nome: 'Pentavalente (DTP+Hib+HepB)', doses: 3, idade: '6 meses', protege: 'Difteria, Tétano, Coqueluche, Haemophilus, Hepatite B' },
  { nome: 'VIP (Polio inativada)', doses: 3, idade: '6 meses', protege: 'Poliomielite' },

  // 9 meses
  { nome: 'Febre Amarela', doses: 1, idade: '9 meses', protege: 'Febre Amarela' },

  // 12 meses
  { nome: 'Tríplice Viral (SCR)', doses: 1, idade: '12 meses', protege: 'Sarampo, Caxumba, Rubéola' },
  { nome: 'Pneumocócica 10', doses: 'Reforço', idade: '12 meses', protege: 'Pneumonia, Meningite' },
  { nome: 'Meningocócica C', doses: 'Reforço', idade: '12 meses', protege: 'Meningite C' },

  // 15 meses
  { nome: 'DTP (Tríplice Bacteriana)', doses: '1º Reforço', idade: '15 meses', protege: 'Difteria, Tétano, Coqueluche' },
  { nome: 'VOP (Polio oral)', doses: '1º Reforço', idade: '15 meses', protege: 'Poliomielite' },
  { nome: 'Hepatite A', doses: 1, idade: '15 meses', protege: 'Hepatite A' },
  { nome: 'Tetra Viral (SCR+Varicela)', doses: 1, idade: '15 meses', protege: 'Sarampo, Caxumba, Rubéola, Varicela' },

  // 4 anos
  { nome: 'DTP (Tríplice Bacteriana)', doses: '2º Reforço', idade: '4 anos', protege: 'Difteria, Tétano, Coqueluche' },
  { nome: 'VOP (Polio oral)', doses: '2º Reforço', idade: '4 anos', protege: 'Poliomielite' },
  { nome: 'Varicela', doses: 'Reforço', idade: '4 anos', protege: 'Varicela (Catapora)' },

  // 9-10 anos (meninas)
  { nome: 'HPV', doses: 2, idade: '9-14 anos', protege: 'Papilomavírus Humano' },

  // 11-12 anos (meninos)
  { nome: 'HPV', doses: 2, idade: '11-14 anos', protege: 'Papilomavírus Humano' },
  { nome: 'Meningocócica ACWY', doses: 1, idade: '11-12 anos', protege: 'Meningite A, C, W, Y' }
];

// Marcos do Desenvolvimento Infantil
export const MARCOS_DESENVOLVIMENTO = {
  '1_mes': [
    'Levanta a cabeça quando de bruços',
    'Focaliza objetos a 20-30 cm',
    'Reage a sons altos',
    'Movimentos reflexos'
  ],
  '2_meses': [
    'Sorri socialmente',
    'Acompanha objetos com os olhos',
    'Levanta cabeça e peito quando de bruços',
    'Vocaliza sons guturais'
  ],
  '4_meses': [
    'Sustenta a cabeça',
    'Ri alto',
    'Leva mãos à boca',
    'Rola de costas para lado'
  ],
  '6_meses': [
    'Senta com apoio',
    'Pega objetos',
    'Balbucia',
    'Reconhece pessoas familiares'
  ],
  '9_meses': [
    'Senta sem apoio',
    'Engatinha',
    'Fala "mamã", "papá"',
    'Brinca de esconder'
  ],
  '12_meses': [
    'Fica em pé com apoio',
    'Primeiros passos',
    'Fala 2-3 palavras',
    'Imita gestos'
  ],
  '18_meses': [
    'Anda sozinho',
    'Sobe escadas',
    'Vocabulário de 10-20 palavras',
    'Usa colher'
  ],
  '24_meses': [
    'Corre',
    'Chuta bola',
    'Frases de 2 palavras',
    'Tira roupas simples'
  ],
  '36_meses': [
    'Pedala triciclo',
    'Sobe e desce escadas alternando pés',
    'Frases completas',
    'Controle esfincteriano'
  ]
};

// Curvas de crescimento - Percentis OMS
export const PERCENTIS_OMS = {
  peso: [3, 10, 25, 50, 75, 90, 97],
  altura: [3, 10, 25, 50, 75, 90, 97],
  imc: [3, 10, 25, 50, 75, 90, 97],
  perimetroCefalico: [3, 10, 25, 50, 75, 90, 97]
};
