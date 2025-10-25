import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, TrendingUp, AlertCircle, CheckCircle, FileText } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { PERMISSIONS } from '../config/roles';
import { MARCOS_DESENVOLVIMENTO } from '../config/modules';

// Componente para Histórico Médico
const HistoricoMedico = ({ pacienteId, canEdit }) => {
  const [historico, setHistorico] = useState({
    periodo_0_12: '',
    periodo_12_24: '',
    periodo_24_36: ''
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (pacienteId) {
      const savedHistorico = localStorage.getItem(`historico-medico-${pacienteId}`);
      if (savedHistorico) {
        setHistorico(JSON.parse(savedHistorico));
      }
    }
  }, [pacienteId]);

  const handleChange = (campo, valor) => {
    const novoHistorico = { ...historico, [campo]: valor };
    setHistorico(novoHistorico);
    localStorage.setItem(`historico-medico-${pacienteId}`, JSON.stringify(novoHistorico));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="border-t pt-6 mt-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5" />
        Histórico Médico por Período
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            0 a 12 meses
          </label>
          <textarea
            value={historico.periodo_0_12}
            onChange={(e) => handleChange('periodo_0_12', e.target.value)}
            disabled={!canEdit}
            maxLength={300}
            rows="3"
            placeholder="Histórico médico do paciente de 0 a 12 meses..."
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
          />
          <p className="text-xs text-gray-500 mt-1">
            {historico.periodo_0_12.length}/300 caracteres
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            12 a 24 meses
          </label>
          <textarea
            value={historico.periodo_12_24}
            onChange={(e) => handleChange('periodo_12_24', e.target.value)}
            disabled={!canEdit}
            maxLength={300}
            rows="3"
            placeholder="Histórico médico do paciente de 12 a 24 meses..."
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
          />
          <p className="text-xs text-gray-500 mt-1">
            {historico.periodo_12_24.length}/300 caracteres
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            24 a 36 meses
          </label>
          <textarea
            value={historico.periodo_24_36}
            onChange={(e) => handleChange('periodo_24_36', e.target.value)}
            disabled={!canEdit}
            maxLength={300}
            rows="3"
            placeholder="Histórico médico do paciente de 24 a 36 meses..."
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
          />
          <p className="text-xs text-gray-500 mt-1">
            {historico.periodo_24_36.length}/300 caracteres
          </p>
        </div>

        {saved && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 p-2 rounded text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Histórico salvo automaticamente</span>
          </div>
        )}
      </div>
    </div>
  );
};

const Crescimento = ({ pacienteId, dataNascimento, sexo, onSave }) => {
  const { checkPermission } = useAuth();
  const canEdit = checkPermission(PERMISSIONS.CRESCIMENTO_WRITE);

  const [medicoes, setMedicoes] = useState([]);
  const [novaMedicao, setNovaMedicao] = useState({
    data: new Date().toISOString().split('T')[0],
    peso: '',
    altura: '',
    perimetroCefalico: '',
    imc: ''
  });
  const [marcos, setMarcos] = useState([]);
  const [saved, setSaved] = useState(false);

  // Carregar dados salvos
  useEffect(() => {
    if (pacienteId) {
      const savedMedicoes = localStorage.getItem(`crescimento-${pacienteId}`);
      const savedMarcos = localStorage.getItem(`marcos-${pacienteId}`);

      if (savedMedicoes) {
        setMedicoes(JSON.parse(savedMedicoes));
      }
      if (savedMarcos) {
        setMarcos(JSON.parse(savedMarcos));
      }
    }
  }, [pacienteId]);

  // Calcular idade em meses
  const calcularIdadeMeses = (dataNasc, dataMedicao) => {
    const nasc = new Date(dataNasc);
    const med = new Date(dataMedicao);
    const meses = (med.getFullYear() - nasc.getFullYear()) * 12 +
                   (med.getMonth() - nasc.getMonth());
    return meses;
  };

  // Calcular IMC
  const calcularIMC = (peso, altura) => {
    if (!peso || !altura) return '';
    const alturaM = altura / 100;
    return (peso / (alturaM * alturaM)).toFixed(2);
  };

  const handleAddMedicao = () => {
    if (!canEdit) {
      alert('Você não tem permissão para adicionar medições');
      return;
    }

    if (!novaMedicao.peso || !novaMedicao.altura) {
      alert('Preencha pelo menos Peso e Altura');
      return;
    }

    const imc = calcularIMC(novaMedicao.peso, novaMedicao.altura);
    const idadeMeses = calcularIdadeMeses(dataNascimento, novaMedicao.data);

    const medicaoCompleta = {
      ...novaMedicao,
      imc,
      idadeMeses,
      id: Date.now()
    };

    const novasMedicoes = [...medicoes, medicaoCompleta].sort((a, b) =>
      new Date(a.data) - new Date(b.data)
    );

    setMedicoes(novasMedicoes);
    localStorage.setItem(`crescimento-${pacienteId}`, JSON.stringify(novasMedicoes));

    // Resetar form
    setNovaMedicao({
      data: new Date().toISOString().split('T')[0],
      peso: '',
      altura: '',
      perimetroCefalico: '',
      imc: ''
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleRemoveMedicao = (id) => {
    if (!canEdit) {
      alert('Você não tem permissão para remover medições');
      return;
    }

    if (window.confirm('Deseja remover esta medição?')) {
      const novasMedicoes = medicoes.filter(m => m.id !== id);
      setMedicoes(novasMedicoes);
      localStorage.setItem(`crescimento-${pacienteId}`, JSON.stringify(novasMedicoes));
    }
  };

  const handleMarcoChange = (faixaEtaria, marco, checked) => {
    if (!canEdit) return;

    const novosMarcos = checked
      ? [...marcos, { faixaEtaria, marco, data: new Date().toISOString().split('T')[0] }]
      : marcos.filter(m => !(m.faixaEtaria === faixaEtaria && m.marco === marco));

    setMarcos(novosMarcos);
    localStorage.setItem(`marcos-${pacienteId}`, JSON.stringify(novosMarcos));
  };

  const isMarcoChecked = (faixaEtaria, marco) => {
    return marcos.some(m => m.faixaEtaria === faixaEtaria && m.marco === marco);
  };

  // Preparar dados para gráficos
  const dadosGraficoPeso = medicoes.map(m => ({
    idade: `${m.idadeMeses}m`,
    peso: parseFloat(m.peso)
  }));

  const dadosGraficoAltura = medicoes.map(m => ({
    idade: `${m.idadeMeses}m`,
    altura: parseFloat(m.altura)
  }));

  const dadosGraficoIMC = medicoes.map(m => ({
    idade: `${m.idadeMeses}m`,
    imc: parseFloat(m.imc)
  }));

  const dadosGraficoPC = medicoes
    .filter(m => m.perimetroCefalico)
    .map(m => ({
      idade: `${m.idadeMeses}m`,
      pc: parseFloat(m.perimetroCefalico)
    }));

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-pediatria-700 flex items-center gap-2">
          <TrendingUp className="w-7 h-7" />
          Crescimento & Desenvolvimento
        </h2>
        {!canEdit && (
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1 rounded">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">Apenas visualização</span>
          </div>
        )}
      </div>

      {/* Adicionar Nova Medição */}
      {canEdit && (
        <div className="border-2 border-pediatria-200 rounded-lg p-6 bg-pediatria-50">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Nova Medição</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data *
              </label>
              <input
                type="date"
                value={novaMedicao.data}
                onChange={(e) => setNovaMedicao({ ...novaMedicao, data: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Peso (kg) *
              </label>
              <input
                type="number"
                step="0.01"
                value={novaMedicao.peso}
                onChange={(e) => setNovaMedicao({ ...novaMedicao, peso: e.target.value })}
                placeholder="Ex: 8.5"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Altura (cm) *
              </label>
              <input
                type="number"
                step="0.1"
                value={novaMedicao.altura}
                onChange={(e) => setNovaMedicao({ ...novaMedicao, altura: e.target.value })}
                placeholder="Ex: 72.5"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Perímetro Cefálico (cm)
              </label>
              <input
                type="number"
                step="0.1"
                value={novaMedicao.perimetroCefalico}
                onChange={(e) => setNovaMedicao({ ...novaMedicao, perimetroCefalico: e.target.value })}
                placeholder="Ex: 45.5"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleAddMedicao}
                className="w-full flex items-center justify-center gap-2 bg-pediatria-600 text-white px-4 py-2 rounded-lg hover:bg-pediatria-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabela de Medições */}
      <div className="border rounded-lg overflow-hidden">
        <h3 className="text-lg font-semibold text-gray-700 p-4 bg-gray-50 border-b">
          Histórico de Medições
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Data</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Idade</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Peso (kg)</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Altura (cm)</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">IMC</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">PC (cm)</th>
                {canEdit && <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ações</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {medicoes.length === 0 ? (
                <tr>
                  <td colSpan={canEdit ? 7 : 6} className="px-4 py-8 text-center text-gray-500">
                    Nenhuma medição registrada ainda
                  </td>
                </tr>
              ) : (
                medicoes.map(medicao => (
                  <tr key={medicao.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">
                      {new Date(medicao.data).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-3 text-sm">{medicao.idadeMeses} meses</td>
                    <td className="px-4 py-3 text-sm font-medium">{medicao.peso}</td>
                    <td className="px-4 py-3 text-sm font-medium">{medicao.altura}</td>
                    <td className="px-4 py-3 text-sm">{medicao.imc}</td>
                    <td className="px-4 py-3 text-sm">{medicao.perimetroCefalico || '-'}</td>
                    {canEdit && (
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => handleRemoveMedicao(medicao.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gráficos de Crescimento */}
      {medicoes.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-700">Curvas de Crescimento</h3>

          {/* Gráfico de Peso */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium text-gray-700 mb-4">Peso x Idade</h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dadosGraficoPeso}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="idade" />
                <YAxis label={{ value: 'Peso (kg)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="peso" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Altura */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium text-gray-700 mb-4">Altura x Idade</h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dadosGraficoAltura}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="idade" />
                <YAxis label={{ value: 'Altura (cm)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="altura" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de IMC */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium text-gray-700 mb-4">IMC x Idade</h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dadosGraficoIMC}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="idade" />
                <YAxis label={{ value: 'IMC', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="imc" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Perímetro Cefálico */}
          {dadosGraficoPC.length > 0 && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium text-gray-700 mb-4">Perímetro Cefálico x Idade</h4>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={dadosGraficoPC}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="idade" />
                  <YAxis label={{ value: 'PC (cm)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="pc" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Marcos do Desenvolvimento */}
      <div className="border-t pt-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Marcos do Desenvolvimento</h3>
        <div className="space-y-4">
          {Object.entries(MARCOS_DESENVOLVIMENTO).map(([faixa, marcos_lista]) => {
            const label = faixa.replace('_', ' ').replace('meses', ' meses').replace('mes', ' mês');
            return (
              <div key={faixa} className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium text-pediatria-700 mb-3 capitalize">{label}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {marcos_lista.map((marco, idx) => (
                    <label key={idx} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={isMarcoChecked(faixa, marco)}
                        onChange={(e) => handleMarcoChange(faixa, marco, e.target.checked)}
                        disabled={!canEdit}
                        className="rounded text-pediatria-600 focus:ring-pediatria-500"
                      />
                      <span>{marco}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Histórico Médico por Período */}
      <HistoricoMedico pacienteId={pacienteId} canEdit={canEdit} />

      {saved && (
        <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
          <CheckCircle className="w-5 h-5" />
          <span>Dados salvos com sucesso!</span>
        </div>
      )}
    </div>
  );
};

export default Crescimento;
