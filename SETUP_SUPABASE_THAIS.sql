-- =====================================================
-- SETUP COMPLETO SUPABASE - DRA. THAIS PEDIATRA
-- Sistema de Pediatria com 2 usuários (Dra + Secretária)
-- =====================================================

-- 1. CRIAR TABELA DE CLÍNICAS
-- Permite múltiplos usuários compartilharem os mesmos pacientes
CREATE TABLE IF NOT EXISTS clinicas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  especialidade TEXT NOT NULL DEFAULT 'Pediatria',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CRIAR TABELA DE PROFISSIONAIS (Médicos + Secretárias)
CREATE TABLE IF NOT EXISTS profissionais (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  clinica_id UUID REFERENCES clinicas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  tipo TEXT NOT NULL CHECK (tipo IN ('medico', 'secretaria')),
  crm TEXT, -- Apenas para médicos
  especialidade TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CRIAR TABELA DE PACIENTES (Pediatria)
CREATE TABLE IF NOT EXISTS pacientes_pediatria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinica_id UUID NOT NULL REFERENCES clinicas(id) ON DELETE CASCADE,
  criado_por UUID REFERENCES auth.users(id),

  -- Dados básicos
  nome TEXT NOT NULL,
  data_nascimento DATE,
  sexo TEXT,
  nome_mae TEXT,
  nome_pai TEXT,
  telefone_responsavel TEXT,
  email_responsavel TEXT,
  cpf_responsavel TEXT,
  endereco JSONB,

  -- Dados completos (JSONB para flexibilidade)
  dados_completos JSONB,

  -- Controle
  arquivado BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_pacientes_ped_clinica ON pacientes_pediatria(clinica_id);
CREATE INDEX IF NOT EXISTS idx_pacientes_ped_nome ON pacientes_pediatria(nome);
CREATE INDEX IF NOT EXISTS idx_pacientes_ped_arquivado ON pacientes_pediatria(arquivado);
CREATE INDEX IF NOT EXISTS idx_profissionais_clinica ON profissionais(clinica_id);

-- 5. TRIGGER PARA ATUALIZAR updated_at AUTOMATICAMENTE
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_clinicas_updated_at BEFORE UPDATE ON clinicas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profissionais_updated_at BEFORE UPDATE ON profissionais
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pacientes_pediatria_updated_at BEFORE UPDATE ON pacientes_pediatria
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE clinicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE profissionais ENABLE ROW LEVEL SECURITY;
ALTER TABLE pacientes_pediatria ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS RLS - CLÍNICAS
-- =====================================================

-- Profissionais podem ver apenas sua própria clínica
CREATE POLICY "Profissionais veem sua clinica"
  ON clinicas FOR SELECT
  USING (
    id IN (
      SELECT clinica_id FROM profissionais WHERE id = auth.uid()
    )
  );

-- =====================================================
-- POLÍTICAS RLS - PROFISSIONAIS
-- =====================================================

-- Profissionais podem ver outros profissionais da mesma clínica
CREATE POLICY "Profissionais veem colegas da clinica"
  ON profissionais FOR SELECT
  USING (
    clinica_id IN (
      SELECT clinica_id FROM profissionais WHERE id = auth.uid()
    )
  );

-- Profissionais podem atualizar seus próprios dados
CREATE POLICY "Profissionais atualizam seus dados"
  ON profissionais FOR UPDATE
  USING (id = auth.uid());

-- =====================================================
-- POLÍTICAS RLS - PACIENTES PEDIATRIA
-- =====================================================

-- SELECT: Profissionais veem pacientes da sua clínica
CREATE POLICY "Profissionais veem pacientes da clinica"
  ON pacientes_pediatria FOR SELECT
  USING (
    clinica_id IN (
      SELECT clinica_id FROM profissionais WHERE id = auth.uid()
    )
  );

-- INSERT: Profissionais podem criar pacientes na sua clínica
CREATE POLICY "Profissionais criam pacientes na clinica"
  ON pacientes_pediatria FOR INSERT
  WITH CHECK (
    clinica_id IN (
      SELECT clinica_id FROM profissionais WHERE id = auth.uid()
    )
  );

-- UPDATE: Profissionais podem atualizar pacientes da sua clínica
CREATE POLICY "Profissionais atualizam pacientes da clinica"
  ON pacientes_pediatria FOR UPDATE
  USING (
    clinica_id IN (
      SELECT clinica_id FROM profissionais WHERE id = auth.uid()
    )
  );

-- DELETE: Profissionais podem deletar pacientes da sua clínica
CREATE POLICY "Profissionais deletam pacientes da clinica"
  ON pacientes_pediatria FOR DELETE
  USING (
    clinica_id IN (
      SELECT clinica_id FROM profissionais WHERE id = auth.uid()
    )
  );

-- =====================================================
-- 7. INSERIR DADOS INICIAIS
-- =====================================================

-- Criar clínica da Dra. Thais
INSERT INTO clinicas (id, nome, especialidade)
VALUES (
  'c1234567-89ab-cdef-0123-456789abcdef',
  'Clínica Pediátrica Dra. Thais',
  'Pediatria'
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- COMENTÁRIOS PARA DOCUMENTAÇÃO
-- =====================================================

COMMENT ON TABLE clinicas IS 'Clínicas médicas - permite múltiplos profissionais compartilharem pacientes';
COMMENT ON TABLE profissionais IS 'Profissionais da saúde (médicos e secretárias)';
COMMENT ON TABLE pacientes_pediatria IS 'Pacientes de pediatria - compartilhados por profissionais da mesma clínica';

COMMENT ON COLUMN profissionais.tipo IS 'Tipo: medico ou secretaria';
COMMENT ON COLUMN pacientes_pediatria.clinica_id IS 'Clínica à qual o paciente pertence - permite acesso compartilhado';
COMMENT ON COLUMN pacientes_pediatria.dados_completos IS 'Dados completos do paciente em formato JSON flexível';

-- =====================================================
-- FIM DO SETUP
-- =====================================================

-- Para verificar se tudo foi criado:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
