import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Download, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { PERMISSIONS, CONSULTORIO_INFO } from '../config/roles';
import { jsPDF } from 'jspdf';

const Receituario = ({ pacienteId, pacienteNome, pacienteIdade, onSave }) => {
  const { checkPermission } = useAuth();
  const canEdit = checkPermission(PERMISSIONS.RECEITUARIO_WRITE);

  const [receitas, setReceitas] = useState([]);
  const [novaReceita, setNovaReceita] = useState({
    data: new Date().toISOString().split('T')[0],
    medicamentos: [{ nome: '', dosagem: '', via: 'oral', frequencia: '', duracao: '', observacoes: '' }],
    orientacoes: '',
    retorno: ''
  });
  const [saved, setSaved] = useState(false);

  const viasAdministracao = ['Oral', 'Sublingual', 'Tópica', 'Inalatória', 'Retal', 'Intramuscular', 'Intravenosa', 'Subcutânea'];

  // Carregar receitas salvas
  useEffect(() => {
    if (pacienteId) {
      const savedReceitas = localStorage.getItem(`receitas-${pacienteId}`);
      if (savedReceitas) {
        setReceitas(JSON.parse(savedReceitas));
      }
    }
  }, [pacienteId]);

  const handleAddMedicamento = () => {
    setNovaReceita({
      ...novaReceita,
      medicamentos: [
        ...novaReceita.medicamentos,
        { nome: '', dosagem: '', via: 'oral', frequencia: '', duracao: '', observacoes: '' }
      ]
    });
  };

  const handleRemoveMedicamento = (index) => {
    setNovaReceita({
      ...novaReceita,
      medicamentos: novaReceita.medicamentos.filter((_, i) => i !== index)
    });
  };

  const handleMedicamentoChange = (index, field, value) => {
    const novosMedicamentos = [...novaReceita.medicamentos];
    novosMedicamentos[index][field] = value;
    setNovaReceita({ ...novaReceita, medicamentos: novosMedicamentos });
  };

  const handleSaveReceita = () => {
    if (!canEdit) {
      alert('Você não tem permissão para criar receitas');
      return;
    }

    if (novaReceita.medicamentos.every(m => !m.nome)) {
      alert('Adicione pelo menos um medicamento');
      return;
    }

    const receitaCompleta = {
      ...novaReceita,
      id: Date.now(),
      medicamentos: novaReceita.medicamentos.filter(m => m.nome)
    };

    const novasReceitas = [receitaCompleta, ...receitas];
    setReceitas(novasReceitas);
    localStorage.setItem(`receitas-${pacienteId}`, JSON.stringify(novasReceitas));

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);

    // Resetar
    setNovaReceita({
      data: new Date().toISOString().split('T')[0],
      medicamentos: [{ nome: '', dosagem: '', via: 'oral', frequencia: '', duracao: '', observacoes: '' }],
      orientacoes: '',
      retorno: ''
    });
  };

  const handleRemoveReceita = (id) => {
    if (!canEdit) return;
    if (window.confirm('Deseja remover esta receita?')) {
      const novasReceitas = receitas.filter(r => r.id !== id);
      setReceitas(novasReceitas);
      localStorage.setItem(`receitas-${pacienteId}`, JSON.stringify(novasReceitas));
    }
  };

  const gerarPDF = (receita) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    let yPos = margin;

    // Cabeçalho
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(CONSULTORIO_INFO.medica, pageWidth / 2, yPos, { align: 'center' });
    yPos += 7;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(CONSULTORIO_INFO.especialidade, pageWidth / 2, yPos, { align: 'center' });
    yPos += 6;

    doc.setFontSize(10);
    doc.text(`CRM: ${CONSULTORIO_INFO.crm}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 6;

    doc.text(`WhatsApp: ${CONSULTORIO_INFO.whatsappFormatado}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;

    // Linha separadora
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;

    // Dados do Paciente
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Paciente:', margin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(pacienteNome, margin + 20, yPos);
    yPos += 7;

    if (pacienteIdade) {
      doc.setFont('helvetica', 'bold');
      doc.text('Idade:', margin, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(pacienteIdade, margin + 20, yPos);
      yPos += 7;
    }

    doc.setFont('helvetica', 'bold');
    doc.text('Data:', margin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date(receita.data).toLocaleDateString('pt-BR'), margin + 20, yPos);
    yPos += 12;

    // Símbolo Rx
    doc.setFontSize(24);
    doc.setFont('times', 'bold');
    doc.text('Rx', margin, yPos);
    yPos += 10;

    // Medicamentos
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    receita.medicamentos.forEach((med, index) => {
      // Verificar espaço na página
      if (yPos > pageHeight - 60) {
        doc.addPage();
        yPos = margin;
      }

      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}. ${med.nome}`, margin, yPos);
      yPos += 6;

      doc.setFont('helvetica', 'normal');

      if (med.dosagem) {
        doc.text(`   Dosagem: ${med.dosagem}`, margin, yPos);
        yPos += 6;
      }

      if (med.via) {
        doc.text(`   Via: ${med.via}`, margin, yPos);
        yPos += 6;
      }

      if (med.frequencia) {
        doc.text(`   Frequência: ${med.frequencia}`, margin, yPos);
        yPos += 6;
      }

      if (med.duracao) {
        doc.text(`   Duração: ${med.duracao}`, margin, yPos);
        yPos += 6;
      }

      if (med.observacoes) {
        const obsLines = doc.splitTextToSize(`   Obs: ${med.observacoes}`, pageWidth - 2 * margin);
        doc.text(obsLines, margin, yPos);
        yPos += obsLines.length * 6;
      }

      yPos += 5; // Espaço entre medicamentos
    });

    // Orientações Gerais
    if (receita.orientacoes) {
      yPos += 5;
      if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = margin;
      }

      doc.setFont('helvetica', 'bold');
      doc.text('Orientações:', margin, yPos);
      yPos += 6;

      doc.setFont('helvetica', 'normal');
      const oriLines = doc.splitTextToSize(receita.orientacoes, pageWidth - 2 * margin);
      doc.text(oriLines, margin, yPos);
      yPos += oriLines.length * 6 + 10;
    }

    // Retorno
    if (receita.retorno) {
      if (yPos > pageHeight - 30) {
        doc.addPage();
        yPos = margin;
      }

      doc.setFont('helvetica', 'normal');
      doc.text(`Retorno: ${new Date(receita.retorno).toLocaleDateString('pt-BR')}`, margin, yPos);
      yPos += 10;
    }

    // Assinatura
    const assinaturaY = pageHeight - 40;
    doc.setLineWidth(0.3);
    doc.line(pageWidth / 2, assinaturaY, pageWidth - margin, assinaturaY);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(CONSULTORIO_INFO.medica, pageWidth / 2 + (pageWidth - margin - pageWidth / 2) / 2, assinaturaY + 6, { align: 'center' });
    doc.text(`CRM: ${CONSULTORIO_INFO.crm}`, pageWidth / 2 + (pageWidth - margin - pageWidth / 2) / 2, assinaturaY + 12, { align: 'center' });

    // Rodapé
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Receita gerada em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );

    // Download
    doc.save(`Receita_${pacienteNome.replace(/\s/g, '_')}_${new Date(receita.data).toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`);
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-pediatria-700 flex items-center gap-2">
          <FileText className="w-7 h-7" />
          Receituário Médico
        </h2>
        {!canEdit && (
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1 rounded">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">Apenas visualização</span>
          </div>
        )}
      </div>

      {/* Nova Receita */}
      {canEdit && (
        <div className="border-2 border-pediatria-200 rounded-lg p-6 bg-pediatria-50">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Nova Receita</h3>

          <div className="space-y-4">
            {/* Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data da Receita *
                </label>
                <input
                  type="date"
                  value={novaReceita.data}
                  onChange={(e) => setNovaReceita({ ...novaReceita, data: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500"
                />
              </div>
            </div>

            {/* Medicamentos */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700">
                  Medicamentos *
                </label>
                <button
                  onClick={handleAddMedicamento}
                  className="flex items-center gap-1 text-pediatria-600 hover:text-pediatria-700 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Medicamento
                </button>
              </div>

              {novaReceita.medicamentos.map((med, index) => (
                <div key={index} className="border rounded-lg p-4 mb-3 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-gray-700">Medicamento {index + 1}</span>
                    {novaReceita.medicamentos.length > 1 && (
                      <button
                        onClick={() => handleRemoveMedicamento(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        value={med.nome}
                        onChange={(e) => handleMedicamentoChange(index, 'nome', e.target.value)}
                        placeholder="Nome do medicamento *"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500"
                      />
                    </div>

                    <div>
                      <input
                        type="text"
                        value={med.dosagem}
                        onChange={(e) => handleMedicamentoChange(index, 'dosagem', e.target.value)}
                        placeholder="Dosagem (ex: 10mg/ml, 500mg)"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500"
                      />
                    </div>

                    <div>
                      <select
                        value={med.via}
                        onChange={(e) => handleMedicamentoChange(index, 'via', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500"
                      >
                        {viasAdministracao.map(via => (
                          <option key={via} value={via}>{via}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={med.frequencia}
                        onChange={(e) => handleMedicamentoChange(index, 'frequencia', e.target.value)}
                        placeholder="Frequência (ex: 8 em 8 horas)"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500"
                      />
                    </div>

                    <div>
                      <input
                        type="text"
                        value={med.duracao}
                        onChange={(e) => handleMedicamentoChange(index, 'duracao', e.target.value)}
                        placeholder="Duração (ex: 7 dias)"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <input
                        type="text"
                        value={med.observacoes}
                        onChange={(e) => handleMedicamentoChange(index, 'observacoes', e.target.value)}
                        placeholder="Observações"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Orientações */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Orientações Gerais
              </label>
              <textarea
                value={novaReceita.orientacoes}
                onChange={(e) => setNovaReceita({ ...novaReceita, orientacoes: e.target.value })}
                rows="3"
                placeholder="Orientações para o paciente..."
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500"
              />
            </div>

            {/* Retorno */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Retorno
              </label>
              <input
                type="date"
                value={novaReceita.retorno}
                onChange={(e) => setNovaReceita({ ...novaReceita, retorno: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500"
              />
            </div>

            {/* Botão Salvar */}
            <div className="flex justify-end pt-4 border-t">
              <button
                onClick={handleSaveReceita}
                className="flex items-center gap-2 bg-pediatria-600 text-white px-6 py-3 rounded-lg hover:bg-pediatria-700 transition-colors"
              >
                <Save className="w-5 h-5" />
                Salvar Receita
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Receitas */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Receitas Anteriores</h3>
        {receitas.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>Nenhuma receita registrada ainda</p>
          </div>
        ) : (
          <div className="space-y-4">
            {receitas.map((receita) => (
              <div key={receita.id} className="border rounded-lg p-6 bg-gray-50 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-semibold text-gray-900">
                      Receita de {new Date(receita.data).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {receita.medicamentos.length} medicamento{receita.medicamentos.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => gerarPDF(receita)}
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <Download className="w-4 h-4" />
                      PDF
                    </button>
                    {canEdit && (
                      <button
                        onClick={() => handleRemoveReceita(receita.id)}
                        className="text-red-600 hover:text-red-800 p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {receita.medicamentos.map((med, idx) => (
                    <div key={idx} className="bg-white p-3 rounded border-l-4 border-pediatria-500">
                      <p className="font-medium text-gray-900">{idx + 1}. {med.nome}</p>
                      {med.dosagem && <p className="text-sm text-gray-600">Dosagem: {med.dosagem}</p>}
                      {med.frequencia && <p className="text-sm text-gray-600">Frequência: {med.frequencia}</p>}
                      {med.duracao && <p className="text-sm text-gray-600">Duração: {med.duracao}</p>}
                      {med.observacoes && <p className="text-sm text-gray-600 italic">Obs: {med.observacoes}</p>}
                    </div>
                  ))}

                  {receita.orientacoes && (
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-sm font-medium text-blue-900">Orientações:</p>
                      <p className="text-sm text-blue-800">{receita.orientacoes}</p>
                    </div>
                  )}

                  {receita.retorno && (
                    <p className="text-sm text-gray-600">
                      Retorno: {new Date(receita.retorno).toLocaleDateString('pt-BR')}
                    </p>
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
          <span>Receita salva com sucesso!</span>
        </div>
      )}
    </div>
  );
};

export default Receituario;
