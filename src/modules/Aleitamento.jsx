import { useState, useEffect } from 'react';
import { Save, Heart, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { PERMISSIONS } from '../config/roles';

const Aleitamento = ({ pacienteId, onSave }) => {
  const { checkPermission } = useAuth();
  const canEdit = checkPermission(PERMISSIONS.ALEITAMENTO_WRITE);

  const [dados, setDados] = useState({
    // Tipo de aleitamento
    tipoAtual: '', // exclusivo, predominante, complementado, artificial
    inicioAmamentacao: '',
    duracaoExclusivo: '', // em meses

    // Mama
    mamaDireita: 'normal', // normal, ingurgitada, fissura, mastite
    mamaEsquerda: 'normal',
    mamiloDireito: 'normal', // normal, invertido, plano, fissurado
    mamiloEsquerdo: 'normal',

    // Pega
    pegaCorreta: true,
    posicionamentoAdequado: true,
    duracaoMamadas: '', // minutos
    intervaloMamadas: '', // horas
    mamadaNoturna: true,

    // Complementação
    usaFormula: false,
    tipoFormula: '',
    quantidadeFormula: '', // ml por mamada
    frequenciaFormula: '', // vezes por dia

    // Introdução alimentar
    inicioAlimentacaoComplementar: '',
    alimentosJaIntroduzidos: '',

    // Dificuldades
    dificuldades: [],
    orientacoesRealizadas: '',
    observacoes: ''
  });

  const [saved, setSaved] = useState(false);

  const dificuldadesPossiveis = [
    'Pega incorreta',
    'Fissuras mamilares',
    'Ingurgitamento mamário',
    'Baixa produção de leite',
    'Hipogalactia',
    'Recusa do bebê',
    'Dor ao amamentar',
    'Candidíase (sapinho)',
    'Dificuldade de ordenha',
    'Retorno ao trabalho'
  ];

  // Carregar dados salvos
  useEffect(() => {
    if (pacienteId) {
      const savedData = localStorage.getItem(`aleitamento-${pacienteId}`);
      if (savedData) {
        setDados(JSON.parse(savedData));
      }
    }
  }, [pacienteId]);

  const handleChange = (field, value) => {
    setDados(prev => ({ ...prev, [field]: value }));
  };

  const handleDificuldadeToggle = (dificuldade) => {
    const novasDificuldades = dados.dificuldades.includes(dificuldade)
      ? dados.dificuldades.filter(d => d !== dificuldade)
      : [...dados.dificuldades, dificuldade];

    setDados(prev => ({ ...prev, dificuldades: novasDificuldades }));
  };

  const handleSave = () => {
    if (!canEdit) {
      alert('Você não tem permissão para editar estes dados');
      return;
    }

    localStorage.setItem(`aleitamento-${pacienteId}`, JSON.stringify(dados));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);

    if (onSave) {
      onSave(dados);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-pediatria-700 flex items-center gap-2">
          <Heart className="w-7 h-7" />
          Aleitamento Materno
        </h2>
        {!canEdit && (
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1 rounded">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">Apenas visualização</span>
          </div>
        )}
      </div>

      {/* Tipo de Aleitamento */}
      <div className="border-b pb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Tipo de Aleitamento Atual</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo Atual *
            </label>
            <select
              value={dados.tipoAtual}
              onChange={(e) => handleChange('tipoAtual', e.target.value)}
              disabled={!canEdit}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
            >
              <option value="">Selecione...</option>
              <option value="exclusivo">Aleitamento Materno Exclusivo</option>
              <option value="predominante">Aleitamento Materno Predominante</option>
              <option value="complementado">Aleitamento Materno Complementado</option>
              <option value="artificial">Aleitamento Artificial</option>
              <option value="desmamado">Desmamado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Início da Amamentação
            </label>
            <input
              type="date"
              value={dados.inicioAmamentacao}
              onChange={(e) => handleChange('inicioAmamentacao', e.target.value)}
              disabled={!canEdit}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duração do Aleitamento Exclusivo (meses)
            </label>
            <input
              type="number"
              value={dados.duracaoExclusivo}
              onChange={(e) => handleChange('duracaoExclusivo', e.target.value)}
              disabled={!canEdit}
              placeholder="Ex: 6"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Avaliação das Mamas */}
      <div className="border-b pb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Avaliação das Mamas e Mamilos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4 bg-pink-50">
            <h4 className="font-medium text-gray-700 mb-3">Mama Direita</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado da Mama
                </label>
                <select
                  value={dados.mamaDireita}
                  onChange={(e) => handleChange('mamaDireita', e.target.value)}
                  disabled={!canEdit}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
                >
                  <option value="normal">Normal</option>
                  <option value="ingurgitada">Ingurgitada</option>
                  <option value="fissura">Fissura</option>
                  <option value="mastite">Mastite</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado do Mamilo
                </label>
                <select
                  value={dados.mamiloDireito}
                  onChange={(e) => handleChange('mamiloDireito', e.target.value)}
                  disabled={!canEdit}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
                >
                  <option value="normal">Normal</option>
                  <option value="invertido">Invertido</option>
                  <option value="plano">Plano</option>
                  <option value="fissurado">Fissurado</option>
                </select>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-pink-50">
            <h4 className="font-medium text-gray-700 mb-3">Mama Esquerda</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado da Mama
                </label>
                <select
                  value={dados.mamaEsquerda}
                  onChange={(e) => handleChange('mamaEsquerda', e.target.value)}
                  disabled={!canEdit}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
                >
                  <option value="normal">Normal</option>
                  <option value="ingurgitada">Ingurgitada</option>
                  <option value="fissura">Fissura</option>
                  <option value="mastite">Mastite</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado do Mamilo
                </label>
                <select
                  value={dados.mamiloEsquerdo}
                  onChange={(e) => handleChange('mamiloEsquerdo', e.target.value)}
                  disabled={!canEdit}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
                >
                  <option value="normal">Normal</option>
                  <option value="invertido">Invertido</option>
                  <option value="plano">Plano</option>
                  <option value="fissurado">Fissurado</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pega e Posicionamento */}
      <div className="border-b pb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Pega e Posicionamento</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={dados.pegaCorreta}
              onChange={(e) => handleChange('pegaCorreta', e.target.checked)}
              disabled={!canEdit}
              className="w-5 h-5 rounded text-pediatria-600 focus:ring-pediatria-500"
            />
            <span>Pega Correta</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={dados.posicionamentoAdequado}
              onChange={(e) => handleChange('posicionamentoAdequado', e.target.checked)}
              disabled={!canEdit}
              className="w-5 h-5 rounded text-pediatria-600 focus:ring-pediatria-500"
            />
            <span>Posicionamento Adequado</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={dados.mamadaNoturna}
              onChange={(e) => handleChange('mamadaNoturna', e.target.checked)}
              disabled={!canEdit}
              className="w-5 h-5 rounded text-pediatria-600 focus:ring-pediatria-500"
            />
            <span>Mamada Noturna</span>
          </label>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duração das Mamadas (min)
            </label>
            <input
              type="number"
              value={dados.duracaoMamadas}
              onChange={(e) => handleChange('duracaoMamadas', e.target.value)}
              disabled={!canEdit}
              placeholder="Ex: 20"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Intervalo entre Mamadas (horas)
            </label>
            <input
              type="number"
              step="0.5"
              value={dados.intervaloMamadas}
              onChange={(e) => handleChange('intervaloMamadas', e.target.value)}
              disabled={!canEdit}
              placeholder="Ex: 3"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Complementação com Fórmula */}
      <div className="border-b pb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Complementação com Fórmula</h3>
        <div className="space-y-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={dados.usaFormula}
              onChange={(e) => handleChange('usaFormula', e.target.checked)}
              disabled={!canEdit}
              className="w-5 h-5 rounded text-pediatria-600 focus:ring-pediatria-500"
            />
            <span className="font-medium">Usa Fórmula Infantil</span>
          </label>

          {dados.usaFormula && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-7">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Fórmula
                </label>
                <input
                  type="text"
                  value={dados.tipoFormula}
                  onChange={(e) => handleChange('tipoFormula', e.target.value)}
                  disabled={!canEdit}
                  placeholder="Ex: NAN Pro 1"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade (ml/mamada)
                </label>
                <input
                  type="number"
                  value={dados.quantidadeFormula}
                  onChange={(e) => handleChange('quantidadeFormula', e.target.value)}
                  disabled={!canEdit}
                  placeholder="Ex: 120"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequência (vezes/dia)
                </label>
                <input
                  type="number"
                  value={dados.frequenciaFormula}
                  onChange={(e) => handleChange('frequenciaFormula', e.target.value)}
                  disabled={!canEdit}
                  placeholder="Ex: 4"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Introdução Alimentar */}
      <div className="border-b pb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Introdução Alimentar</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Início da Alimentação Complementar
            </label>
            <input
              type="date"
              value={dados.inicioAlimentacaoComplementar}
              onChange={(e) => handleChange('inicioAlimentacaoComplementar', e.target.value)}
              disabled={!canEdit}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">Recomendado aos 6 meses</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alimentos Já Introduzidos
            </label>
            <textarea
              value={dados.alimentosJaIntroduzidos}
              onChange={(e) => handleChange('alimentosJaIntroduzidos', e.target.value)}
              disabled={!canEdit}
              rows="3"
              placeholder="Ex: banana, maçã, batata..."
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Dificuldades */}
      <div className="border-b pb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Dificuldades Relatadas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {dificuldadesPossiveis.map((dificuldade) => (
            <label key={dificuldade} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={dados.dificuldades.includes(dificuldade)}
                onChange={() => handleDificuldadeToggle(dificuldade)}
                disabled={!canEdit}
                className="rounded text-pediatria-600 focus:ring-pediatria-500"
              />
              <span className="text-sm">{dificuldade}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Orientações e Observações */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Orientações Realizadas
          </label>
          <textarea
            value={dados.orientacoesRealizadas}
            onChange={(e) => handleChange('orientacoesRealizadas', e.target.value)}
            disabled={!canEdit}
            rows="4"
            placeholder="Descreva as orientações fornecidas..."
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Observações Gerais
          </label>
          <textarea
            value={dados.observacoes}
            onChange={(e) => handleChange('observacoes', e.target.value)}
            disabled={!canEdit}
            rows="3"
            placeholder="Observações adicionais..."
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
          />
        </div>
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
                Salvar Dados de Aleitamento
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default Aleitamento;
