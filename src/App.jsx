import { useState, useEffect, useRef } from 'react';
import { User, LogOut, Plus, Search, Users, Eye, EyeOff, Baby, Download, Upload } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TABS_PEDIATRIA } from './config/modules';
import CadastroPaciente from './components/CadastroPaciente';
import DadosNeonatais from './modules/DadosNeonatais';
import Crescimento from './modules/Crescimento';
import Vacinacao from './modules/Vacinacao';
import Aleitamento from './modules/Aleitamento';
import Puericultura from './modules/Puericultura';
import Intercorrencias from './modules/Intercorrencias';
import Receituario from './modules/Receituario';
import Atestados from './modules/Atestados';

// Ícones
import * as Icons from 'lucide-react';

const STORAGE_PACIENTES = 'pediatria-pacientes';

function LoginScreen() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(username, password);
    if (!result.success) {
      setError(result.error);
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pediatria-500 to-pediatria-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Baby className="w-16 h-16 mx-auto text-pediatria-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-800">Sistema Pediatria</h1>
          <p className="text-gray-600 mt-2">Dra. Thais Cordeiro</p>
          <p className="text-gray-500 text-sm">CRM 52 101870-1</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usuário
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu usuário"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pediatria-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pediatria-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-pediatria-600 text-white py-3 rounded-lg hover:bg-pediatria-700 transition-colors font-medium"
          >
            Entrar
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Usuários de teste:</p>
          <p className="mt-1">Médico: <code className="bg-gray-100 px-2 py-1 rounded">thais / THAIS2024</code></p>
          <p className="mt-1">Secretária: <code className="bg-gray-100 px-2 py-1 rounded">secretaria / SEC2024</code></p>
        </div>
      </div>
    </div>
  );
}

function MainApp() {
  const { user, logout, isMedico, isSecretaria } = useAuth();
  const [pacientes, setPacientes] = useState([]);
  const [view, setView] = useState('lista'); // lista, prontuario
  const [pacienteAtual, setPacienteAtual] = useState(null);
  const [activeTab, setActiveTab] = useState('cadastro');
  const [busca, setBusca] = useState('');

  // Carregar pacientes
  useEffect(() => {
    const savedPacientes = localStorage.getItem(STORAGE_PACIENTES);
    if (savedPacientes) {
      setPacientes(JSON.parse(savedPacientes));
    }
  }, []);

  const handleNovoPaciente = () => {
    const id = `pac_${Date.now()}`;
    const novoPaciente = {
      id,
      nome: 'Novo Paciente',
      dataNascimento: '',
      sexo: 'M',
      dataCadastro: new Date().toISOString()
    };

    const novosPacientes = [...pacientes, novoPaciente];
    setPacientes(novosPacientes);
    localStorage.setItem(STORAGE_PACIENTES, JSON.stringify(novosPacientes));

    setPacienteAtual(novoPaciente);
    setView('prontuario');
    setActiveTab('cadastro');
  };

  const handleSelecionarPaciente = (paciente) => {
    setPacienteAtual(paciente);
    setView('prontuario');
    setActiveTab('cadastro');
  };

  const handleVoltar = () => {
    setView('lista');
    setPacienteAtual(null);
  };

  const handleSaveCadastro = (dados) => {
    const novosPacientes = pacientes.map(p =>
      p.id === pacienteAtual.id ? { ...p, ...dados } : p
    );
    setPacientes(novosPacientes);
    localStorage.setItem(STORAGE_PACIENTES, JSON.stringify(novosPacientes));

    setPacienteAtual({ ...pacienteAtual, ...dados });
  };

  const handleDeletePaciente = (pacienteId) => {
    const novosPacientes = pacientes.filter(p => p.id !== pacienteId);
    setPacientes(novosPacientes);
    localStorage.setItem(STORAGE_PACIENTES, JSON.stringify(novosPacientes));

    // Volta para a lista de pacientes
    setView('lista');
    setPacienteAtual(null);
  };

  const handleExportarDados = () => {
    // Coleta TODOS os dados do localStorage
    const backup = {
      versao: '1.0',
      dataExportacao: new Date().toISOString(),
      pacientes: pacientes,
      dadosCompletos: {}
    };

    // Exporta todos os dados de cada paciente
    pacientes.forEach(paciente => {
      const dadosPaciente = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes(paciente.id)) {
          dadosPaciente[key] = JSON.parse(localStorage.getItem(key));
        }
      }
      backup.dadosCompletos[paciente.id] = dadosPaciente;
    });

    // Cria arquivo JSON para download
    const dataStr = JSON.stringify(backup, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup-pediatria-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    alert('✅ Backup exportado com sucesso!\n\nO arquivo foi baixado para sua pasta de Downloads.');
  };

  const fileInputRef = useRef(null);

  const handleImportarDados = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target.result);

        if (!backup.versao || !backup.pacientes || !backup.dadosCompletos) {
          alert('❌ Arquivo de backup inválido!');
          return;
        }

        const confirmacao = window.confirm(
          `⚠️ ATENÇÃO!\n\nVocê está prestes a IMPORTAR um backup.\n\n` +
          `Este backup contém ${backup.pacientes.length} paciente(s).\n` +
          `Data do backup: ${new Date(backup.dataExportacao).toLocaleString('pt-BR')}\n\n` +
          `Deseja MESCLAR com os dados existentes ou SUBSTITUIR tudo?\n\n` +
          `Clique OK para MESCLAR (recomendado)\n` +
          `Clique CANCELAR para abortar`
        );

        if (!confirmacao) return;

        // Importa a lista de pacientes
        const pacientesExistentes = JSON.parse(localStorage.getItem(STORAGE_PACIENTES) || '[]');
        const todosIds = new Set(pacientesExistentes.map(p => p.id));

        backup.pacientes.forEach(paciente => {
          if (!todosIds.has(paciente.id)) {
            pacientesExistentes.push(paciente);
          }
        });

        localStorage.setItem(STORAGE_PACIENTES, JSON.stringify(pacientesExistentes));
        setPacientes(pacientesExistentes);

        // Importa todos os dados detalhados
        Object.keys(backup.dadosCompletos).forEach(pacienteId => {
          const dadosPaciente = backup.dadosCompletos[pacienteId];
          Object.keys(dadosPaciente).forEach(key => {
            localStorage.setItem(key, JSON.stringify(dadosPaciente[key]));
          });
        });

        alert(`✅ Backup importado com sucesso!\n\n${backup.pacientes.length} paciente(s) importado(s).`);
      } catch (error) {
        alert('❌ Erro ao importar backup:\n\n' + error.message);
      }
    };

    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  const pacientesFiltrados = pacientes.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const renderTabContent = () => {
    if (!pacienteAtual) return null;

    // Calcular idade do paciente
    const calcularIdade = () => {
      if (!pacienteAtual.dataNascimento) return '';
      const hoje = new Date();
      const nasc = new Date(pacienteAtual.dataNascimento);
      const meses = (hoje.getFullYear() - nasc.getFullYear()) * 12 + (hoje.getMonth() - nasc.getMonth());
      if (meses < 24) return `${meses} meses`;
      const anos = Math.floor(meses / 12);
      return `${anos} ano${anos > 1 ? 's' : ''}`;
    };

    switch (activeTab) {
      case 'cadastro':
        return <CadastroPaciente pacienteId={pacienteAtual.id} onSave={handleSaveCadastro} onDelete={handleDeletePaciente} />;
      case 'neonatal':
        return <DadosNeonatais pacienteId={pacienteAtual.id} />;
      case 'crescimento':
        return <Crescimento pacienteId={pacienteAtual.id} dataNascimento={pacienteAtual.dataNascimento} sexo={pacienteAtual.sexo} />;
      case 'vacinacao':
        return <Vacinacao pacienteId={pacienteAtual.id} pacienteNome={pacienteAtual.nome} dataNascimento={pacienteAtual.dataNascimento} />;
      case 'aleitamento':
        return <Aleitamento pacienteId={pacienteAtual.id} />;
      case 'puericultura':
        return <Puericultura pacienteId={pacienteAtual.id} />;
      case 'intercorrencias':
        return <Intercorrencias pacienteId={pacienteAtual.id} />;
      case 'receituario':
        return <Receituario pacienteId={pacienteAtual.id} pacienteNome={pacienteAtual.nome} pacienteIdade={calcularIdade()} />;
      case 'atestados':
        return <Atestados pacienteId={pacienteAtual.id} pacienteNome={pacienteAtual.nome} pacienteIdade={calcularIdade()} responsavelNome={pacienteAtual.nomeMae || pacienteAtual.nomePai} />;
      default:
        return <div className="text-center p-8 text-gray-500">Módulo em desenvolvimento</div>;
    }
  };

  const getIcon = (iconName) => {
    const Icon = Icons[iconName];
    return Icon ? <Icon className="w-5 h-5" /> : <Icons.FileText className="w-5 h-5" />;
  };

  if (view === 'prontuario' && pacienteAtual) {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleVoltar}
                  className="text-pediatria-600 hover:text-pediatria-700 font-medium"
                >
                  ← Voltar
                </button>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">{pacienteAtual.nome}</h1>
                  <p className="text-sm text-gray-600">
                    {pacienteAtual.dataNascimento && `Nascimento: ${new Date(pacienteAtual.dataNascimento).toLocaleDateString('pt-BR')}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">{user.name}</p>
                  {user.crm && <p className="text-xs text-gray-500">CRM: {user.crm}</p>}
                  <p className="text-xs text-gray-500">{isMedico() ? 'Pediatria' : 'Secretária'}</p>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  title="Sair"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {TABS_PEDIATRIA.filter(tab => {
                // Se for médico, mostra todas as tabs
                if (isMedico()) return true;
                // Se for secretária, mostra apenas cadastro
                return tab.id === 'cadastro';
              }).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-pediatria-600 text-pediatria-600'
                      : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {getIcon(tab.icon)}
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.id === 'cadastro' ? 'Cadastro' : tab.id === 'neonatal' ? 'Neonatal' : tab.id === 'crescimento' ? 'Crescimento' : tab.id === 'vacinacao' ? 'Vacinas' : tab.id === 'aleitamento' ? 'Aleitamento' : tab.id === 'puericultura' ? 'Puericultura' : tab.id === 'intercorrencias' ? 'Intercorrências' : tab.id === 'receituario' ? 'Receituário' : 'Atestados'}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          {renderTabContent()}
        </main>
      </div>
    );
  }

  // Lista de Pacientes
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Baby className="w-8 h-8 text-pediatria-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Sistema Pediatria</h1>
                <p className="text-sm text-gray-600">Dra. Thais Cordeiro - CRM 52 101870-1</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">{user.name}</p>
                {user.crm && <p className="text-xs text-gray-500">CRM: {user.crm}</p>}
                <p className="text-xs text-gray-500">{isMedico() ? 'Pediatria' : 'Secretária'}</p>
              </div>
              <button
                onClick={logout}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Actions */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar paciente..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pediatria-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={handleExportarDados}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            title="Exportar todos os dados para backup"
          >
            <Download className="w-5 h-5" />
            Exportar Backup
          </button>

          <button
            onClick={handleImportarDados}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            title="Importar backup de dados"
          >
            <Upload className="w-5 h-5" />
            Importar Backup
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileImport}
            style={{ display: 'none' }}
          />

          <button
            onClick={handleNovoPaciente}
            className="flex items-center gap-2 bg-pediatria-600 text-white px-6 py-3 rounded-lg hover:bg-pediatria-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Novo Paciente
          </button>
        </div>

        {/* Lista de Pacientes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-800">
              Pacientes ({pacientesFiltrados.length})
            </h2>
          </div>

          {pacientesFiltrados.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Nenhum paciente encontrado</p>
              <p className="text-sm mt-2">Clique em "Novo Paciente" para começar</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {pacientesFiltrados.map(paciente => (
                <div
                  key={paciente.id}
                  onClick={() => handleSelecionarPaciente(paciente)}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-pediatria-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-pediatria-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{paciente.nome}</p>
                        <p className="text-sm text-gray-600">
                          {paciente.dataNascimento && `Nascimento: ${new Date(paciente.dataNascimento).toLocaleDateString('pt-BR')}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      Cadastrado em {new Date(paciente.dataCadastro).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <MainApp /> : <LoginScreen />;
}

export default App;
