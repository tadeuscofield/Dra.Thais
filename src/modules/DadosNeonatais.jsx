import { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { PERMISSIONS } from '../config/roles';

const DadosNeonatais = ({ pacienteId, onSave }) => {
  const { checkPermission } = useAuth();
  const canEdit = checkPermission(PERMISSIONS.NEONATAL_WRITE);

  const [dados, setDados] = useState({
    // Dados do parto
    tipoGravidez: 'unica', // unica, gemelar
    tipoParto: '', // normal, cesarea, forceps
    idadeGestacional: '', // semanas
    peso: '', // gramas
    comprimento: '', // cm
    perimetroCefalico: '', // cm
    perimeterToracico: '', // cm

    // Apgar
    apgar1min: '',
    apgar5min: '',
    apgar10min: '',

    // Triagem neonatal
    testeOlhinho: '',
    testeOlhinhoData: '',
    testePezinho: '',
    testePezinhoData: '',
    testeOrelhinha: '',
    testeOrelhinhaData: '',
    testeCoracaozinho: '',
    testeCoracaozinhoData: '',
    testeLinguinha: '',
    testeLinguinhaData: '',

    // Intercorrências no parto
    intercorrencias: '',
    reanimacao: false,
    oxigenioterapia: false,
    fototerapia: false,
    uti: false,
    diasInternacao: '',

    // Observações
    observacoes: ''
  });

  const [saved, setSaved] = useState(false);

  // Carregar dados salvos
  useEffect(() => {
    if (pacienteId) {
      const savedData = localStorage.getItem(`neonatal-${pacienteId}`);
      if (savedData) {
        setDados(JSON.parse(savedData));
      }
    }
  }, [pacienteId]);

  const handleChange = (field, value) => {
    setDados(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!canEdit) {
      alert('Você não tem permissão para editar estes dados');
      return;
    }

    localStorage.setItem(`neonatal-${pacienteId}`, JSON.stringify(dados));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);

    if (onSave) {
      onSave(dados);
    }
  };

  const interpretarApgar = (score) => {
    if (score === '') return '';
    const num = parseInt(score);
    if (num >= 8) return '🟢 Normal';
    if (num >= 5) return '🟡 Moderado';
    return '🔴 Baixo';
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-pediatria-700">Dados Neonatais</h2>
        {!canEdit && (
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1 rounded">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">Apenas visualização</span>
          </div>
        )}
      </div>

      {/* Dados do Parto */}
      <div className="border-b pb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Dados do Parto</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Gravidez
            </label>
            <select
              value={dados.tipoGravidez}
              onChange={(e) => handleChange('tipoGravidez', e.target.value)}
              disabled={!canEdit}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
            >
              <option value="unica">Única</option>
              <option value="gemelar">Gemelar</option>
              <option value="multipla">Múltipla</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Parto *
            </label>
            <select
              value={dados.tipoParto}
              onChange={(e) => handleChange('tipoParto', e.target.value)}
              disabled={!canEdit}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
            >
              <option value="">Selecione...</option>
              <option value="normal">Normal</option>
              <option value="cesarea">Cesárea</option>
              <option value="forceps">Fórceps</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Idade Gestacional (semanas) *
            </label>
            <input
              type="number"
              value={dados.idadeGestacional}
              onChange={(e) => handleChange('idadeGestacional', e.target.value)}
              disabled={!canEdit}
              placeholder="Ex: 38"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Antropometria ao Nascer */}
      <div className="border-b pb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Antropometria ao Nascer</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Peso (g) *
            </label>
            <input
              type="number"
              value={dados.peso}
              onChange={(e) => handleChange('peso', e.target.value)}
              disabled={!canEdit}
              placeholder="Ex: 3250"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comprimento (cm) *
            </label>
            <input
              type="number"
              step="0.1"
              value={dados.comprimento}
              onChange={(e) => handleChange('comprimento', e.target.value)}
              disabled={!canEdit}
              placeholder="Ex: 49.5"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Perímetro Cefálico (cm) *
            </label>
            <input
              type="number"
              step="0.1"
              value={dados.perimetroCefalico}
              onChange={(e) => handleChange('perimetroCefalico', e.target.value)}
              disabled={!canEdit}
              placeholder="Ex: 34.5"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Perímetro Torácico (cm)
            </label>
            <input
              type="number"
              step="0.1"
              value={dados.perimeterToracico}
              onChange={(e) => handleChange('perimeterToracico', e.target.value)}
              disabled={!canEdit}
              placeholder="Ex: 33.0"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Escala de Apgar */}
      <div className="border-b pb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Escala de Apgar</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Apgar 1° minuto *
            </label>
            <input
              type="number"
              min="0"
              max="10"
              value={dados.apgar1min}
              onChange={(e) => handleChange('apgar1min', e.target.value)}
              disabled={!canEdit}
              placeholder="0-10"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
            />
            {dados.apgar1min && (
              <p className="text-sm mt-1">{interpretarApgar(dados.apgar1min)}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Apgar 5° minuto *
            </label>
            <input
              type="number"
              min="0"
              max="10"
              value={dados.apgar5min}
              onChange={(e) => handleChange('apgar5min', e.target.value)}
              disabled={!canEdit}
              placeholder="0-10"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
            />
            {dados.apgar5min && (
              <p className="text-sm mt-1">{interpretarApgar(dados.apgar5min)}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Apgar 10° minuto
            </label>
            <input
              type="number"
              min="0"
              max="10"
              value={dados.apgar10min}
              onChange={(e) => handleChange('apgar10min', e.target.value)}
              disabled={!canEdit}
              placeholder="0-10"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
            />
            {dados.apgar10min && (
              <p className="text-sm mt-1">{interpretarApgar(dados.apgar10min)}</p>
            )}
          </div>
        </div>
      </div>

      {/* Triagem Neonatal (Teste do Pezinho, etc) */}
      <div className="border-b pb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Triagem Neonatal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'testeOlhinho', label: 'Teste do Olhinho' },
            { key: 'testePezinho', label: 'Teste do Pezinho' },
            { key: 'testeOrelhinha', label: 'Teste da Orelhinha' },
            { key: 'testeCoracaozinho', label: 'Teste do Coraçãozinho' },
            { key: 'testeLinguinha', label: 'Teste da Linguinha' }
          ].map(({ key, label }) => (
            <div key={key} className="border p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
              </label>
              <div className="flex gap-4 mb-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name={key}
                    value="normal"
                    checked={dados[key] === 'normal'}
                    onChange={(e) => handleChange(key, e.target.value)}
                    disabled={!canEdit}
                    className="mr-2"
                  />
                  Normal
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name={key}
                    value="alterado"
                    checked={dados[key] === 'alterado'}
                    onChange={(e) => handleChange(key, e.target.value)}
                    disabled={!canEdit}
                    className="mr-2"
                  />
                  Alterado
                </label>
              </div>
              <input
                type="date"
                value={dados[`${key}Data`]}
                onChange={(e) => handleChange(`${key}Data`, e.target.value)}
                disabled={!canEdit}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Intercorrências */}
      <div className="border-b pb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Intercorrências no Parto/Pós-parto</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={dados.reanimacao}
                onChange={(e) => handleChange('reanimacao', e.target.checked)}
                disabled={!canEdit}
                className="mr-2"
              />
              Reanimação
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={dados.oxigenioterapia}
                onChange={(e) => handleChange('oxigenioterapia', e.target.checked)}
                disabled={!canEdit}
                className="mr-2"
              />
              Oxigenioterapia
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={dados.fototerapia}
                onChange={(e) => handleChange('fototerapia', e.target.checked)}
                disabled={!canEdit}
                className="mr-2"
              />
              Fototerapia
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={dados.uti}
                onChange={(e) => handleChange('uti', e.target.checked)}
                disabled={!canEdit}
                className="mr-2"
              />
              UTI Neonatal
            </label>
          </div>

          {dados.uti && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dias de Internação
              </label>
              <input
                type="number"
                value={dados.diasInternacao}
                onChange={(e) => handleChange('diasInternacao', e.target.value)}
                disabled={!canEdit}
                placeholder="Número de dias"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Outras Intercorrências
            </label>
            <textarea
              value={dados.intercorrencias}
              onChange={(e) => handleChange('intercorrencias', e.target.value)}
              disabled={!canEdit}
              rows="3"
              placeholder="Descreva outras intercorrências..."
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Observações */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Observações Gerais
        </label>
        <textarea
          value={dados.observacoes}
          onChange={(e) => handleChange('observacoes', e.target.value)}
          disabled={!canEdit}
          rows="4"
          placeholder="Observações adicionais..."
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
        />
      </div>

      {/* Botão Salvar */}
      {canEdit && (
        <div className="flex justify-end pt-4 border-t">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-pediatria-600 text-white px-6 py-3 rounded-lg hover:bg-pediatria-700 transition-colors"
          >
            {saved ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Salvo!
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Salvar Dados Neonatais
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default DadosNeonatais;
