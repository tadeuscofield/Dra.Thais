-- =====================================================
-- CRIAR USUÁRIOS - DRA. THAIS PEDIATRA
-- =====================================================

-- IMPORTANTE: Execute este script DEPOIS de criar os usuários
-- manualmente no Supabase Authentication!

-- Passos para criar usuários:
-- 1. Ir em Supabase → Authentication → Users → Add User
-- 2. Criar 2 usuários com emails abaixo
-- 3. Anotar os UUIDs gerados
-- 4. Atualizar os UUIDs neste script
-- 5. Executar este script

-- =====================================================
-- CONFIGURAÇÃO - ATUALIZE OS UUIDs AQUI
-- =====================================================

-- UUID da Dra. Thais (será gerado pelo Supabase)
-- Substitua pelo UUID real após criar o usuário
DO $$
DECLARE
  uuid_dra_thais UUID := 'COLE_UUID_DRA_THAIS_AQUI';
  uuid_secretaria UUID := 'COLE_UUID_SECRETARIA_AQUI';
  clinica_id UUID := 'c1234567-89ab-cdef-0123-456789abcdef';
BEGIN

  -- Inserir Dra. Thais
  INSERT INTO profissionais (id, clinica_id, nome, email, tipo, crm, especialidade)
  VALUES (
    uuid_dra_thais,
    clinica_id,
    'Dra. Thais',
    'thais@pediatra.com',
    'medico',
    'CRM-RJ 123456', -- Atualizar com CRM real
    'Pediatria'
  )
  ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    email = EXCLUDED.email,
    tipo = EXCLUDED.tipo,
    crm = EXCLUDED.crm,
    especialidade = EXCLUDED.especialidade;

  -- Inserir Secretária
  INSERT INTO profissionais (id, clinica_id, nome, email, tipo, crm, especialidade)
  VALUES (
    uuid_secretaria,
    clinica_id,
    'Secretária Clínica',
    'secretaria@pediatra.com',
    'secretaria',
    NULL,
    NULL
  )
  ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    email = EXCLUDED.email,
    tipo = EXCLUDED.tipo;

  RAISE NOTICE 'Usuários criados com sucesso!';
  RAISE NOTICE 'Dra. Thais ID: %', uuid_dra_thais;
  RAISE NOTICE 'Secretária ID: %', uuid_secretaria;

END $$;

-- =====================================================
-- VERIFICAR CRIAÇÃO
-- =====================================================

SELECT
  p.nome,
  p.email,
  p.tipo,
  p.crm,
  c.nome as clinica
FROM profissionais p
LEFT JOIN clinicas c ON p.clinica_id = c.id
ORDER BY p.tipo DESC;
