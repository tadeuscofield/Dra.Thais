import { useState, useEffect } from 'react';
import { Save, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { PERMISSIONS } from '../config/roles';

const CadastroPaciente = ({ pacienteId, onSave, onDelete }) => {
  const { checkPermission } = useAuth();
  const canEdit = checkPermission(PERMISSIONS.CADASTRO_UPDATE);

  const [dados, setDados] = useState({
    nome: '',
    dataNascimento: '',
    sexo: 'M',
    nomeMae: '',
    nomePai: '',
    telefone: '',
    email: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    planoSaude: '',
    numeroCarteirinha: '',
    observacoes: ''
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (pacienteId) {
      const savedData = localStorage.getItem(`paciente-${pacienteId}`);
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
      alert('Você não tem permissão para editar o cadastro');
      return;
    }

    if (!dados.nome || !dados.dataNascimento) {
      alert('Preencha pelo menos Nome e Data de Nascimento');
      return;
    }

    localStorage.setItem(`paciente-${pacienteId}`, JSON.stringify(dados));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);

    if (onSave) {
      onSave(dados);
    }
  };

  const handleDelete = () => {
    if (!checkPermission(PERMISSIONS.CADASTRO_DELETE)) {
      alert('Você não tem permissão para excluir pacientes');
      return;
    }

    const confirmacao = window.confirm(
      `⚠️ ATENÇÃO!\n\nTem certeza que deseja EXCLUIR permanentemente o paciente:\n\n"${dados.nome || 'Sem nome'}"\n\nEsta ação NÃO pode ser desfeita!\n\nTodos os dados do paciente serão perdidos:\n- Cadastro\n- Dados Neonatais\n- Crescimento & Desenvolvimento\n- Vacinação\n- Aleitamento Materno\n- Puericultura\n- Intercorrências\n- Receituário\n- Atestados`
    );

    if (confirmacao) {
      // Remove todos os dados do paciente do localStorage
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes(pacienteId)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key));

      if (onDelete) {
        onDelete(pacienteId);
      }

      alert('✅ Paciente excluído com sucesso!');
    }
  };

  const calcularIdade = () => {
    if (!dados.dataNascimento) return '';
    const hoje = new Date();
    const nasc = new Date(dados.dataNascimento);
    const meses = (hoje.getFullYear() - nasc.getFullYear()) * 12 + (hoje.getMonth() - nasc.getMonth());
    if (meses < 24) return `${meses} meses`;
    const anos = Math.floor(meses / 12);
    return `${anos} ano${anos > 1 ? 's' : ''}`;
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-pediatria-700">Cadastro do Paciente</h2>
        {!canEdit && (
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1 rounded">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">Apenas visualização</span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Dados do Paciente */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">Dados do Paciente</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo *
              </label>
              <input
                type="text"
                value={dados.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                disabled={!canEdit}
                placeholder="Nome completo do paciente"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Nascimento *
              </label>
              <input
                type="date"
                value={dados.dataNascimento}
                onChange={(e) => handleChange('dataNascimento', e.target.value)}
                disabled={!canEdit}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
              />
              {dados.dataNascimento && (
                <p className="text-xs text-gray-600 mt-1">Idade: {calcularIdade()}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sexo *
              </label>
              <select
                value={dados.sexo}
                onChange={(e) => handleChange('sexo', e.target.value)}
                disabled={!canEdit}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
              >
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filiação */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">Filiação</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Mãe
              </label>
              <input
                type="text"
                value={dados.nomeMae}
                onChange={(e) => handleChange('nomeMae', e.target.value)}
                disabled={!canEdit}
                placeholder="Nome completo da mãe"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Pai
              </label>
              <input
                type="text"
                value={dados.nomePai}
                onChange={(e) => handleChange('nomePai', e.target.value)}
                disabled={!canEdit}
                placeholder="Nome completo do pai"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Contato */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">Contato</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone *
              </label>
              <input
                type="tel"
                value={dados.telefone}
                onChange={(e) => handleChange('telefone', e.target.value)}
                disabled={!canEdit}
                placeholder="(00) 00000-0000"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp do Responsável
              </label>
              <input
                type="tel"
                value={dados.whatsappResponsavel || ''}
                onChange={(e) => handleChange('whatsappResponsavel', e.target.value)}
                disabled={!canEdit}
                placeholder="(00) 00000-0000"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
              />
              <p className="text-xs text-gray-500 mt-1">Para envio de lembretes automáticos</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <input
                type="email"
                value={dados.email}
                onChange={(e) => handleChange('email', e.target.value)}
                disabled={!canEdit}
                placeholder="email@exemplo.com"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Endereço */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">Endereço</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Endereço Completo
              </label>
              <input
                type="text"
                value={dados.endereco}
                onChange={(e) => handleChange('endereco', e.target.value)}
                disabled={!canEdit}
                placeholder="Rua, Número, Bairro"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cidade
              </label>
              <input
                type="text"
                value={dados.cidade}
                onChange={(e) => handleChange('cidade', e.target.value)}
                disabled={!canEdit}
                placeholder="Cidade"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <input
                type="text"
                value={dados.estado}
                onChange={(e) => handleChange('estado', e.target.value)}
                disabled={!canEdit}
                placeholder="UF"
                maxLength={2}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CEP
              </label>
              <input
                type="text"
                value={dados.cep}
                onChange={(e) => handleChange('cep', e.target.value)}
                disabled={!canEdit}
                placeholder="00000-000"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Plano de Saúde */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">Plano de Saúde</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plano de Saúde
              </label>
              <input
                type="text"
                value={dados.planoSaude}
                onChange={(e) => handleChange('planoSaude', e.target.value)}
                disabled={!canEdit}
                placeholder="Nome do plano ou Particular"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número da Carteirinha
              </label>
              <input
                type="text"
                value={dados.numeroCarteirinha}
                onChange={(e) => handleChange('numeroCarteirinha', e.target.value)}
                disabled={!canEdit}
                placeholder="Número da carteirinha"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Agendamento de Retorno */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">Agendamento de Retorno</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data do Retorno
              </label>
              <input
                type="date"
                value={dados.dataRetorno || ''}
                onChange={(e) => handleChange('dataRetorno', e.target.value)}
                disabled={!canEdit}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Horário
              </label>
              <input
                type="time"
                value={dados.horarioRetorno || ''}
                onChange={(e) => handleChange('horarioRetorno', e.target.value)}
                disabled={!canEdit}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motivo do Retorno
              </label>
              <input
                type="text"
                value={dados.motivoRetorno || ''}
                onChange={(e) => handleChange('motivoRetorno', e.target.value)}
                disabled={!canEdit}
                placeholder="Ex: Consulta de rotina"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
              />
            </div>
          </div>

          {dados.dataRetorno && dados.whatsappResponsavel && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                📱 Lembrete: Será enviado automaticamente um WhatsApp para {dados.whatsappResponsavel} 48h antes da consulta ({dados.dataRetorno && new Date(dados.dataRetorno).toLocaleDateString('pt-BR')}).
              </p>
            </div>
          )}
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
            placeholder="Observações importantes sobre o paciente..."
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
          />
        </div>
      </div>

      {/* Botões Salvar e Excluir */}
      {canEdit && (
        <div className="flex justify-between pt-4 border-t">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            Excluir Paciente
          </button>

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
                Salvar Cadastro
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default CadastroPaciente;
