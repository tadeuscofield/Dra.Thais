const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://qtsgmogmtwbtrkwhtgpn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0c2dtb2dtdHdidHJrd2h0Z3BuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0OTIyMTEsImV4cCI6MjA3NzA2ODIxMX0.KwBcqFPbsdlGwHwMzc5jEKjmY_fep6okTex5gN-TvGA';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function vincularUsuarios() {
  console.log('\n🔧 VINCULANDO USUÁRIOS À CLÍNICA - DRA. THAIS\n');
  console.log('='.repeat(60));

  const uuid_dra_thais = 'f923a52e-5a71-49a0-8900-c63aa4f3fc13';
  const uuid_secretaria = '764050d8-7b75-4ba9-89d5-c4bc79b9ed0e';
  const clinica_id = 'c1234567-89ab-cdef-0123-456789abcdef';

  try {
    // 1. Inserir Dra. Thais
    console.log('\n1️⃣ Vinculando Dra. Thais...');
    const { data: dra, error: erroDra } = await supabase
      .from('profissionais')
      .upsert({
        id: uuid_dra_thais,
        clinica_id: clinica_id,
        nome: 'Dra. Thais',
        email: 'thais@pediatra.com',
        tipo: 'medico',
        crm: 'CRM-RJ 123456',
        especialidade: 'Pediatria'
      }, {
        onConflict: 'id'
      })
      .select();

    if (erroDra) {
      console.error('❌ Erro ao vincular Dra. Thais:', erroDra.message);
      return;
    }

    console.log('✅ Dra. Thais vinculada à clínica!');

    // 2. Inserir Secretária
    console.log('\n2️⃣ Vinculando Secretária...');
    const { data: sec, error: erroSec } = await supabase
      .from('profissionais')
      .upsert({
        id: uuid_secretaria,
        clinica_id: clinica_id,
        nome: 'Secretária',
        email: 'secretaria@pediatra.com',
        tipo: 'secretaria',
        crm: null,
        especialidade: null
      }, {
        onConflict: 'id'
      })
      .select();

    if (erroSec) {
      console.error('❌ Erro ao vincular Secretária:', erroSec.message);
      return;
    }

    console.log('✅ Secretária vinculada à clínica!');

    // 3. Verificar criação
    console.log('\n3️⃣ Verificando profissionais criados...');
    const { data: profissionais, error: erroVerif } = await supabase
      .from('profissionais')
      .select(`
        id,
        nome,
        email,
        tipo,
        crm,
        clinicas (nome)
      `)
      .order('tipo', { ascending: false });

    if (erroVerif) {
      console.error('❌ Erro ao verificar:', erroVerif.message);
      return;
    }

    console.log('\n📊 PROFISSIONAIS CADASTRADOS:\n');
    console.log('='.repeat(60));
    profissionais.forEach(p => {
      console.log(`\n👤 ${p.nome}`);
      console.log(`   Email: ${p.email}`);
      console.log(`   Tipo: ${p.tipo}`);
      console.log(`   CRM: ${p.crm || 'N/A'}`);
      console.log(`   Clínica: ${p.clinicas?.nome || 'N/A'}`);
      console.log(`   UUID: ${p.id}`);
    });

    console.log('\n' + '='.repeat(60));
    console.log('\n✅ SETUP COMPLETO! Ambos os usuários podem fazer login.\n');
    console.log('📋 PRÓXIMOS PASSOS:');
    console.log('   1. Testar login com thais@pediatra.com');
    console.log('   2. Testar login com secretaria@pediatra.com');
    console.log('   3. Ambos devem ver os mesmos pacientes!\n');

  } catch (error) {
    console.error('\n❌ ERRO:', error.message);
    console.error(error);
  }
}

vincularUsuarios();
