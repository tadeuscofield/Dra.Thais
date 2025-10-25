import { useState, useEffect } from 'react';
import { Save, Calendar, Plus, Trash2, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { PERMISSIONS } from '../config/roles';

const Puericultura = ({ pacienteId, onSave }) => {
  const { checkPermission } = useAuth();
  const canEdit = checkPermission(PERMISSIONS.PUERICULTURA_WRITE);

  const [consultas, setConsultas] = useState([]);
  const [novaConsulta, setNovaConsulta] = useState({
    data: new Date().toISOString().split('T')[0],
    peso: '',
    altura: '',
    perimetroCefalico: '',
    temperatura: '',
    frequenciaCardiaca: '',
    frequenciaRespiratoria: '',
    avaliacaoGeral: '',
    queixas: '',
    conduta: '',
    retorno: ''
  });
  const [saved, setSaved] = useState(false);

  // Carregar consultas salvas
  useEffect(() => {
    if (pacienteId) {
      const savedConsultas = localStorage.getItem(`puericultura-${pacienteId}`);
      if (savedConsultas) {
        setConsultas(JSON.parse(savedConsultas));
      }
    }
  }, [pacienteId]);

  const handleAddConsulta = () => {
    if (!canEdit) {
      alert('Você não tem permissão para adicionar consultas');
      return;
    }

    if (!novaConsulta.data) {
      alert('Preencha pelo menos a data da consulta');
      return;
    }

    const consultaCompleta = {
      ...novaConsulta,
      id: Date.now()
    };

    const novasConsultas = [consultaCompleta, ...consultas];
    setConsultas(novasConsultas);
    localStorage.setItem(`puericultura-${pacienteId}`, JSON.stringify(novasConsultas));

    // Resetar form
    setNovaConsulta({
      data: new Date().toISOString().split('T')[0],
      peso: '',
      altura: '',
      perimetroCefalico: '',
      temperatura: '',
      frequenciaCardiaca: '',
      frequenciaRespiratoria: '',
      avaliacaoGeral: '',
      queixas: '',
      conduta: '',
      retorno: ''
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleRemoveConsulta = (id) => {
    if (!canEdit) {
      alert('Você não tem permissão para remover consultas');
      return;
    }

    if (window.confirm('Deseja remover esta consulta de puericultura?')) {
      const novasConsultas = consultas.filter(c => c.id !== id);
      setConsultas(novasConsultas);
      localStorage.setItem(`puericultura-${pacienteId}`, JSON.stringify(novasConsultas));
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-pediatria-700 flex items-center gap-2">
          <Calendar className="w-7 h-7" />
          Consultas de Puericultura
        </h2>
        {!canEdit && (
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1 rounded">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">Apenas visualização</span>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Puericultura:</strong> Acompanhamento periódico do crescimento e desenvolvimento da criança.
          Calendário recomendado: 1ª semana, 1 mês, 2 meses, 4 meses, 6 meses, 9 meses, 12 meses, 15 meses, 18 meses e anual após 2 anos.
        </p>
      </div>

      {/* Nova Consulta */}
      {canEdit && (
        <div className="border-2 border-pediatria-200 rounded-lg p-6 bg-pediatria-50">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Registrar Nova Consulta
          </h3>

          <div className="space-y-4">
            {/* Data e Medidas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data da Consulta *
                </label>
                <input
                  type="date"
                  value={novaConsulta.data}
                  onChange={(e) => setNovaConsulta({ ...novaConsulta, data: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={novaConsulta.peso}
                  onChange={(e) => setNovaConsulta({ ...novaConsulta, peso: e.target.value })}
                  placeholder="Ex: 8.5"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Altura (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={novaConsulta.altura}
                  onChange={(e) => setNovaConsulta({ ...novaConsulta, altura: e.target.value })}
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
                  value={novaConsulta.perimetroCefalico}
                  onChange={(e) => setNovaConsulta({ ...novaConsulta, perimetroCefalico: e.target.value })}
                  placeholder="Ex: 45.5"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500"
                />
              </div>
            </div>

            {/* Sinais Vitais */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Temperatura (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={novaConsulta.temperatura}
                  onChange={(e) => setNovaConsulta({ ...novaConsulta, temperatura: e.target.value })}
                  placeholder="Ex: 36.5"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  FC (bpm)
                </label>
                <input
                  type="number"
                  value={novaConsulta.frequenciaCardiaca}
                  onChange={(e) => setNovaConsulta({ ...novaConsulta, frequenciaCardiaca: e.target.value })}
                  placeholder="Ex: 120"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  FR (irpm)
                </label>
                <input
                  type="number"
                  value={novaConsulta.frequenciaRespiratoria}
                  onChange={(e) => setNovaConsulta({ ...novaConsulta, frequenciaRespiratoria: e.target.value })}
                  placeholder="Ex: 30"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500"
                />
              </div>
            </div>

            {/* Avaliação */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Avaliação Geral
              </label>
              <textarea
                value={novaConsulta.avaliacaoGeral}
                onChange={(e) => setNovaConsulta({ ...novaConsulta, avaliacaoGeral: e.target.value })}
                rows="3"
                placeholder="Estado geral, atividade, desenvolvimento neuropsicomotor..."
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500"
              />
            </div>

            {/* Queixas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Queixas dos Pais/Responsáveis
              </label>
              <textarea
                value={novaConsulta.queixas}
                onChange={(e) => setNovaConsulta({ ...novaConsulta, queixas: e.target.value })}
                rows="2"
                placeholder="Queixas relatadas pelos pais..."
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500"
              />
            </div>

            {/* Conduta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Conduta e Orientações
              </label>
              <textarea
                value={novaConsulta.conduta}
                onChange={(e) => setNovaConsulta({ ...novaConsulta, conduta: e.target.value })}
                rows="3"
                placeholder="Conduta médica, orientações aos pais, prescrições..."
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500"
              />
            </div>

            {/* Retorno */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Retorno
                </label>
                <input
                  type="date"
                  value={novaConsulta.retorno}
                  onChange={(e) => setNovaConsulta({ ...novaConsulta, retorno: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleAddConsulta}
                  className="w-full flex items-center justify-center gap-2 bg-pediatria-600 text-white px-4 py-2 rounded-lg hover:bg-pediatria-700 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  Salvar Consulta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Consultas */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Histórico de Consultas</h3>
        {consultas.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>Nenhuma consulta de puericultura registrada ainda</p>
          </div>
        ) : (
          <div className="space-y-4">
            {consultas.map((consulta) => (
              <div
                key={consulta.id}
                className="border rounded-lg p-6 bg-gray-50 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-pediatria-100 p-2 rounded-lg">
                      <FileText className="w-5 h-5 text-pediatria-700" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Consulta de {new Date(consulta.data).toLocaleDateString('pt-BR')}
                      </p>
                      {consulta.retorno && (
                        <p className="text-sm text-gray-600">
                          Retorno: {new Date(consulta.retorno).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                    </div>
                  </div>
                  {canEdit && (
                    <button
                      onClick={() => handleRemoveConsulta(consulta.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {consulta.peso && (
                    <div>
                      <p className="text-xs text-gray-600">Peso</p>
                      <p className="font-medium">{consulta.peso} kg</p>
                    </div>
                  )}
                  {consulta.altura && (
                    <div>
                      <p className="text-xs text-gray-600">Altura</p>
                      <p className="font-medium">{consulta.altura} cm</p>
                    </div>
                  )}
                  {consulta.perimetroCefalico && (
                    <div>
                      <p className="text-xs text-gray-600">PC</p>
                      <p className="font-medium">{consulta.perimetroCefalico} cm</p>
                    </div>
                  )}
                  {consulta.temperatura && (
                    <div>
                      <p className="text-xs text-gray-600">Temperatura</p>
                      <p className="font-medium">{consulta.temperatura} °C</p>
                    </div>
                  )}
                </div>

                {consulta.avaliacaoGeral && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700">Avaliação Geral:</p>
                    <p className="text-sm text-gray-600 mt-1">{consulta.avaliacaoGeral}</p>
                  </div>
                )}

                {consulta.queixas && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700">Queixas:</p>
                    <p className="text-sm text-gray-600 mt-1">{consulta.queixas}</p>
                  </div>
                )}

                {consulta.conduta && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Conduta:</p>
                    <p className="text-sm text-gray-600 mt-1">{consulta.conduta}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {saved && (
        <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
          <CheckCircle className="w-5 h-5" />
          <span>Consulta salva com sucesso!</span>
        </div>
      )}
    </div>
  );
};

export default Puericultura;
