import { useState, useEffect } from 'react';
import { Save, AlertTriangle, Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { PERMISSIONS } from '../config/roles';

const Intercorrencias = ({ pacienteId, onSave }) => {
  const { checkPermission } = useAuth();
  const canEdit = checkPermission(PERMISSIONS.INTERCORRENCIAS_WRITE);

  const [intercorrencias, setIntercorrencias] = useState([]);
  const [novaIntercorrencia, setNovaIntercorrencia] = useState({
    data: new Date().toISOString().split('T')[0],
    tipo: '',
    descricao: '',
    sintomasQueixas: '',
    exameFisico: '',
    hipoteseDiagnostica: '',
    tratamentoPrescrito: '',
    evolucao: '',
    status: 'em_tratamento' // em_tratamento, resolvido, em_acompanhamento
  });

  const [alergias, setAlergias] = useState([]);
  const [novaAlergia, setNovaAlergia] = useState({ tipo: '', alergia: '', reacao: '' });

  const [saved, setSaved] = useState(false);

  const tiposIntercorrencia = [
    'Infecção Respiratória',
    'Gastroenterite',
    'Otite',
    'Amigdalite',
    'Bronquiolite',
    'Pneumonia',
    'Asma',
    'Dermatite',
    'Conjuntivite',
    'Infecção Urinária',
    'Febre sem foco',
    'Alergia',
    'Trauma/Acidente',
    'Outra'
  ];

  // Carregar dados salvos
  useEffect(() => {
    if (pacienteId) {
      const savedIntercorrencias = localStorage.getItem(`intercorrencias-${pacienteId}`);
      const savedAlergias = localStorage.getItem(`alergias-${pacienteId}`);

      if (savedIntercorrencias) {
        setIntercorrencias(JSON.parse(savedIntercorrencias));
      }
      if (savedAlergias) {
        setAlergias(JSON.parse(savedAlergias));
      }
    }
  }, [pacienteId]);

  const handleAddIntercorrencia = () => {
    if (!canEdit) {
      alert('Você não tem permissão para adicionar intercorrências');
      return;
    }

    if (!novaIntercorrencia.tipo || !novaIntercorrencia.descricao) {
      alert('Preencha pelo menos o tipo e a descrição da intercorrência');
      return;
    }

    const intercorrenciaCompleta = {
      ...novaIntercorrencia,
      id: Date.now()
    };

    const novasIntercorrencias = [intercorrenciaCompleta, ...intercorrencias];
    setIntercorrencias(novasIntercorrencias);
    localStorage.setItem(`intercorrencias-${pacienteId}`, JSON.stringify(novasIntercorrencias));

    // Resetar form
    setNovaIntercorrencia({
      data: new Date().toISOString().split('T')[0],
      tipo: '',
      descricao: '',
      sintomasQueixas: '',
      exameFisico: '',
      hipoteseDiagnostica: '',
      tratamentoPrescrito: '',
      evolucao: '',
      status: 'em_tratamento'
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleRemoveIntercorrencia = (id) => {
    if (!canEdit) {
      alert('Você não tem permissão para remover intercorrências');
      return;
    }

    if (window.confirm('Deseja remover esta intercorrência?')) {
      const novasIntercorrencias = intercorrencias.filter(i => i.id !== id);
      setIntercorrencias(novasIntercorrencias);
      localStorage.setItem(`intercorrencias-${pacienteId}`, JSON.stringify(novasIntercorrencias));
    }
  };

  const handleAddAlergia = () => {
    if (!canEdit) {
      alert('Você não tem permissão para adicionar alergias');
      return;
    }

    if (!novaAlergia.alergia) {
      alert('Preencha o nome da alergia');
      return;
    }

    const alergiaCompleta = {
      ...novaAlergia,
      id: Date.now()
    };

    const novasAlergias = [...alergias, alergiaCompleta];
    setAlergias(novasAlergias);
    localStorage.setItem(`alergias-${pacienteId}`, JSON.stringify(novasAlergias));

    setNovaAlergia({ tipo: '', alergia: '', reacao: '' });
  };

  const handleRemoveAlergia = (id) => {
    if (!canEdit) return;

    if (window.confirm('Deseja remover esta alergia?')) {
      const novasAlergias = alergias.filter(a => a.id !== id);
      setAlergias(novasAlergias);
      localStorage.setItem(`alergias-${pacienteId}`, JSON.stringify(novasAlergias));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      em_tratamento: 'bg-amber-100 text-amber-800',
      resolvido: 'bg-green-100 text-green-800',
      em_acompanhamento: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      em_tratamento: 'Em Tratamento',
      resolvido: 'Resolvido',
      em_acompanhamento: 'Em Acompanhamento'
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-pediatria-700 flex items-center gap-2">
          <AlertTriangle className="w-7 h-7" />
          Intercorrências e Alergias
        </h2>
        {!canEdit && (
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1 rounded">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">Apenas visualização</span>
          </div>
        )}
      </div>

      {/* Alergias */}
      <div className="border-2 border-red-200 rounded-lg p-6 bg-red-50">
        <h3 className="text-lg font-semibold text-red-800 mb-4">⚠️ Alergias Conhecidas</h3>

        {canEdit && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <select
              value={novaAlergia.tipo}
              onChange={(e) => setNovaAlergia({ ...novaAlergia, tipo: e.target.value })}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
            >
              <option value="">Tipo...</option>
              <option value="medicamento">Medicamento</option>
              <option value="alimento">Alimento</option>
              <option value="respiratoria">Respiratória</option>
              <option value="contato">Contato</option>
              <option value="outras">Outras</option>
            </select>

            <input
              type="text"
              value={novaAlergia.alergia}
              onChange={(e) => setNovaAlergia({ ...novaAlergia, alergia: e.target.value })}
              placeholder="Nome da alergia *"
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
            />

            <input
              type="text"
              value={novaAlergia.reacao}
              onChange={(e) => setNovaAlergia({ ...novaAlergia, reacao: e.target.value })}
              placeholder="Reação apresentada"
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
            />

            <button
              onClick={handleAddAlergia}
              className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              <Plus className="w-4 h-4" />
              Adicionar
            </button>
          </div>
        )}

        {alergias.length === 0 ? (
          <p className="text-center text-red-700">Nenhuma alergia conhecida</p>
        ) : (
          <div className="space-y-2">
            {alergias.map((alergia) => (
              <div
                key={alergia.id}
                className="flex items-center justify-between bg-white border border-red-300 rounded p-3"
              >
                <div>
                  <p className="font-semibold text-red-900">
                    {alergia.tipo && `[${alergia.tipo}] `}
                    {alergia.alergia}
                  </p>
                  {alergia.reacao && (
                    <p className="text-sm text-red-700">Reação: {alergia.reacao}</p>
                  )}
                </div>
                {canEdit && (
                  <button
                    onClick={() => handleRemoveAlergia(alergia.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Nova Intercorrência */}
      {canEdit && (
        <div className="border-2 border-pediatria-200 rounded-lg p-6 bg-pediatria-50">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Registrar Nova Intercorrência
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data *
                </label>
                <input
                  type="date"
                  value={novaIntercorrencia.data}
                  onChange={(e) => setNovaIntercorrencia({ ...novaIntercorrencia, data: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo *
                </label>
                <select
                  value={novaIntercorrencia.tipo}
                  onChange={(e) => setNovaIntercorrencia({ ...novaIntercorrencia, tipo: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500"
                >
                  <option value="">Selecione...</option>
                  {tiposIntercorrencia.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={novaIntercorrencia.status}
                  onChange={(e) => setNovaIntercorrencia({ ...novaIntercorrencia, status: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500"
                >
                  <option value="em_tratamento">Em Tratamento</option>
                  <option value="em_acompanhamento">Em Acompanhamento</option>
                  <option value="resolvido">Resolvido</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição *
              </label>
              <textarea
                value={novaIntercorrencia.descricao}
                onChange={(e) => setNovaIntercorrencia({ ...novaIntercorrencia, descricao: e.target.value })}
                rows="2"
                placeholder="Breve descrição da intercorrência..."
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sintomas e Queixas
              </label>
              <textarea
                value={novaIntercorrencia.sintomasQueixas}
                onChange={(e) => setNovaIntercorrencia({ ...novaIntercorrencia, sintomasQueixas: e.target.value })}
                rows="2"
                placeholder="Sintomas apresentados e queixas relatadas..."
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exame Físico
              </label>
              <textarea
                value={novaIntercorrencia.exameFisico}
                onChange={(e) => setNovaIntercorrencia({ ...novaIntercorrencia, exameFisico: e.target.value })}
                rows="2"
                placeholder="Achados do exame físico..."
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hipótese Diagnóstica
              </label>
              <input
                type="text"
                value={novaIntercorrencia.hipoteseDiagnostica}
                onChange={(e) => setNovaIntercorrencia({ ...novaIntercorrencia, hipoteseDiagnostica: e.target.value })}
                placeholder="Diagnóstico presumido..."
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tratamento Prescrito
              </label>
              <textarea
                value={novaIntercorrencia.tratamentoPrescrito}
                onChange={(e) => setNovaIntercorrencia({ ...novaIntercorrencia, tratamentoPrescrito: e.target.value })}
                rows="3"
                placeholder="Medicamentos, doses, orientações..."
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Evolução
              </label>
              <textarea
                value={novaIntercorrencia.evolucao}
                onChange={(e) => setNovaIntercorrencia({ ...novaIntercorrencia, evolucao: e.target.value })}
                rows="2"
                placeholder="Como evoluiu o quadro..."
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleAddIntercorrencia}
                className="flex items-center gap-2 bg-pediatria-600 text-white px-6 py-3 rounded-lg hover:bg-pediatria-700"
              >
                <Save className="w-5 h-5" />
                Salvar Intercorrência
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Intercorrências */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Histórico de Intercorrências</h3>
        {intercorrencias.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
            <AlertTriangle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>Nenhuma intercorrência registrada</p>
          </div>
        ) : (
          <div className="space-y-4">
            {intercorrencias.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-6 bg-gray-50 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {getStatusLabel(item.status)}
                      </span>
                      <p className="font-semibold text-gray-900">{item.tipo}</p>
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(item.data).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  {canEdit && (
                    <button
                      onClick={() => handleRemoveIntercorrencia(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-700">Descrição:</p>
                    <p className="text-gray-600">{item.descricao}</p>
                  </div>

                  {item.sintomasQueixas && (
                    <div>
                      <p className="font-medium text-gray-700">Sintomas/Queixas:</p>
                      <p className="text-gray-600">{item.sintomasQueixas}</p>
                    </div>
                  )}

                  {item.exameFisico && (
                    <div>
                      <p className="font-medium text-gray-700">Exame Físico:</p>
                      <p className="text-gray-600">{item.exameFisico}</p>
                    </div>
                  )}

                  {item.hipoteseDiagnostica && (
                    <div>
                      <p className="font-medium text-gray-700">Diagnóstico:</p>
                      <p className="text-gray-600">{item.hipoteseDiagnostica}</p>
                    </div>
                  )}

                  {item.tratamentoPrescrito && (
                    <div>
                      <p className="font-medium text-gray-700">Tratamento:</p>
                      <p className="text-gray-600 whitespace-pre-line">{item.tratamentoPrescrito}</p>
                    </div>
                  )}

                  {item.evolucao && (
                    <div>
                      <p className="font-medium text-gray-700">Evolução:</p>
                      <p className="text-gray-600">{item.evolucao}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {saved && (
        <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
          <CheckCircle className="w-5 h-5" />
          <span>Dados salvos com sucesso!</span>
        </div>
      )}
    </div>
  );
};

export default Intercorrencias;
