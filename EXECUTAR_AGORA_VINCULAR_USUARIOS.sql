-- =====================================================
-- VINCULAR USUÁRIOS À CLÍNICA - DRA. THAIS
-- =====================================================
-- EXECUTE ESTE SQL NO SUPABASE SQL EDITOR AGORA!
-- =====================================================

-- UUIDs dos usuários criados:
-- Dra. Thais: f923a52e-5a71-49a0-8900-c63aa4f3fc13
-- Secretária: 764050d8-7b75-4ba9-89d5-c4bc79b9ed0e

DO $$
DECLARE
  uuid_dra_thais UUID := 'f923a52e-5a71-49a0-8900-c63aa4f3fc13';
  uuid_secretaria UUID := '764050d8-7b75-4ba9-89d5-c4bc79b9ed0e';
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
    'CRM-RJ 123456',
    'Pediatria'
  )
  ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    email = EXCLUDED.email,
    tipo = EXCLUDED.tipo,
    crm = EXCLUDED.crm,
    especialidade = EXCLUDED.especialidade;

  RAISE NOTICE 'Dra. Thais vinculada à clínica!';

  -- Inserir Secretária
  INSERT INTO profissionais (id, clinica_id, nome, email, tipo, crm, especialidade)
  VALUES (
    uuid_secretaria,
    clinica_id,
    'Secretária',
    'secretaria@pediatra.com',
    'secretaria',
    NULL,
    NULL
  )
  ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    email = EXCLUDED.email,
    tipo = EXCLUDED.tipo;

  RAISE NOTICE 'Secretária vinculada à clínica!';
  RAISE NOTICE '✅ SETUP COMPLETO! Ambos os usuários podem fazer login.';

END $$;

-- Verificar se foi criado corretamente
SELECT
  p.id,
  p.nome,
  p.email,
  p.tipo,
  p.crm,
  c.nome as clinica
FROM profissionais p
LEFT JOIN clinicas c ON p.clinica_id = c.id
ORDER BY p.tipo DESC;
