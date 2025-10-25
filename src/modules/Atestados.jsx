import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Download, FileBadge, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { PERMISSIONS, CONSULTORIO_INFO } from '../config/roles';
import { jsPDF } from 'jspdf';

const Atestados = ({ pacienteId, pacienteNome, pacienteIdade, responsavelNome, onSave }) => {
  const { checkPermission } = useAuth();
  const canEdit = checkPermission(PERMISSIONS.ATESTADO_WRITE);

  const [atestados, setAtestados] = useState([]);
  const [novoAtestado, setNovoAtestado] = useState({
    data: new Date().toISOString().split('T')[0],
    tipo: 'atestado', // atestado, declaracao
    texto: '',
    cid: '',
    dias: '',
    dataInicio: new Date().toISOString().split('T')[0],
    dataFim: '',
    observacoes: ''
  });
  const [saved, setSaved] = useState(false);

  const tiposAtestado = [
    { value: 'atestado', label: 'Atestado Médico' },
    { value: 'declaracao', label: 'Declaração de Comparecimento' }
  ];

  // Templates
  const templates = {
    comparecimento: `Atesto para os devidos fins que o(a) paciente ${pacienteNome || '[NOME]'}, ${pacienteIdade ? `com ${pacienteIdade},` : ''} esteve em consulta médica nesta data.`,
    repouso: `Atesto para os devidos fins que o(a) paciente ${pacienteNome || '[NOME]'}, ${pacienteIdade ? `com ${pacienteIdade},` : ''} necessita de afastamento de suas atividades escolares/habituais pelo período de [DIAS] dias, a partir de [DATA_INICIO].`,
    acompanhamento: `Atesto que o(a) menor ${pacienteNome || '[NOME]'}, ${pacienteIdade ? `com ${pacienteIdade},` : ''} esteve sob meus cuidados médicos nesta data, sendo necessária a presença do(a) responsável ${responsavelNome || '[RESPONSÁVEL]'} para acompanhamento.`
  };

  // Carregar atestados salvos
  useEffect(() => {
    if (pacienteId) {
      const savedAtestados = localStorage.getItem(`atestados-${pacienteId}`);
      if (savedAtestados) {
        setAtestados(JSON.parse(savedAtestados));
      }
    }
  }, [pacienteId]);

  const handleSaveAtestado = () => {
    if (!canEdit) {
      alert('Você não tem permissão para criar atestados');
      return;
    }

    if (!novoAtestado.texto) {
      alert('Preencha o texto do atestado');
      return;
    }

    const atestadoCompleto = {
      ...novoAtestado,
      id: Date.now()
    };

    const novosAtestados = [atestadoCompleto, ...atestados];
    setAtestados(novosAtestados);
    localStorage.setItem(`atestados-${pacienteId}`, JSON.stringify(novosAtestados));

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);

    // Resetar
    setNovoAtestado({
      data: new Date().toISOString().split('T')[0],
      tipo: 'atestado',
      texto: '',
      cid: '',
      dias: '',
      dataInicio: new Date().toISOString().split('T')[0],
      dataFim: '',
      observacoes: ''
    });
  };

  const handleRemoveAtestado = (id) => {
    if (!canEdit) return;
    if (window.confirm('Deseja remover este atestado?')) {
      const novosAtestados = atestados.filter(a => a.id !== id);
      setAtestados(novosAtestados);
      localStorage.setItem(`atestados-${pacienteId}`, JSON.stringify(novosAtestados));
    }
  };

  const gerarPDF = (atestado) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 25;
    let yPos = margin;

    // Cabeçalho
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(CONSULTORIO_INFO.medica, pageWidth / 2, yPos, { align: 'center' });
    yPos += 6;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(CONSULTORIO_INFO.especialidade, pageWidth / 2, yPos, { align: 'center' });
    yPos += 5;

    doc.setFontSize(10);
    doc.text(`CRM: ${CONSULTORIO_INFO.crm}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 5;

    if (CONSULTORIO_INFO.endereco) {
      doc.text(CONSULTORIO_INFO.endereco, pageWidth / 2, yPos, { align: 'center' });
      yPos += 5;
    }

    doc.text(`${CONSULTORIO_INFO.cidade} - ${CONSULTORIO_INFO.estado}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 5;

    doc.text(`WhatsApp: ${CONSULTORIO_INFO.whatsappFormatado}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 12;

    // Linha separadora
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 15;

    // Título
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    const titulo = atestado.tipo === 'declaracao' ? 'DECLARAÇÃO' : 'ATESTADO MÉDICO';
    doc.text(titulo, pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;

    // Corpo do texto
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');

    const textoCompleto = atestado.texto
      .replace('[NOME]', pacienteNome)
      .replace('[IDADE]', pacienteIdade || '')
      .replace('[RESPONSÁVEL]', responsavelNome || '')
      .replace('[DIAS]', atestado.dias || '')
      .replace('[DATA_INICIO]', atestado.dataInicio ? new Date(atestado.dataInicio).toLocaleDateString('pt-BR') : '');

    const linhas = doc.splitTextToSize(textoCompleto, pageWidth - 2 * margin);
    doc.text(linhas, margin, yPos);
    yPos += linhas.length * 7 + 10;

    // CID (se informado)
    if (atestado.cid) {
      const cidTexto = `CID: ${atestado.cid}`;
      doc.setFontSize(11);
      doc.text(cidTexto, margin, yPos);
      yPos += 10;
    }

    // Período de afastamento (se informado)
    if (atestado.dataInicio && atestado.dataFim) {
      const periodo = `Período: ${new Date(atestado.dataInicio).toLocaleDateString('pt-BR')} a ${new Date(atestado.dataFim).toLocaleDateString('pt-BR')}`;
      doc.setFontSize(11);
      doc.text(periodo, margin, yPos);
      yPos += 10;
    }

    // Observações
    if (atestado.observacoes) {
      yPos += 5;
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10);
      const obsLinhas = doc.splitTextToSize(atestado.observacoes, pageWidth - 2 * margin);
      doc.text(obsLinhas, margin, yPos);
      yPos += obsLinhas.length * 6 + 10;
    }

    // Data e local
    yPos += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    const dataExtenso = new Date(atestado.data).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    doc.text(`${CONSULTORIO_INFO.cidade}, ${dataExtenso}.`, pageWidth / 2, yPos, { align: 'center' });

    // Assinatura
    const assinaturaY = pageHeight - 50;

    // Linha para assinatura
    doc.setLineWidth(0.3);
    doc.line(pageWidth / 2 - 40, assinaturaY, pageWidth / 2 + 40, assinaturaY);

    // Nome e CRM
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(CONSULTORIO_INFO.medica, pageWidth / 2, assinaturaY + 6, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`${CONSULTORIO_INFO.especialidade}`, pageWidth / 2, assinaturaY + 11, { align: 'center' });
    doc.text(`CRM: ${CONSULTORIO_INFO.crm}`, pageWidth / 2, assinaturaY + 16, { align: 'center' });

    // Rodapé
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
      'Este documento possui validade conforme legislação vigente',
      pageWidth / 2,
      pageHeight - 15,
      { align: 'center' }
    );

    doc.text(
      `Emitido em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );

    // Download
    const tipoDoc = atestado.tipo === 'declaracao' ? 'Declaracao' : 'Atestado';
    doc.save(`${tipoDoc}_${pacienteNome.replace(/\s/g, '_')}_${new Date(atestado.data).toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`);
  };

  const aplicarTemplate = (templateKey) => {
    setNovoAtestado({
      ...novoAtestado,
      texto: templates[templateKey]
    });
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-pediatria-700 flex items-center gap-2">
          <FileBadge className="w-7 h-7" />
          Atestados e Declarações
        </h2>
        {!canEdit && (
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1 rounded">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">Apenas visualização</span>
          </div>
        )}
      </div>

      {/* Novo Atestado */}
      {canEdit && (
        <div className="border-2 border-pediatria-200 rounded-lg p-6 bg-pediatria-50">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Novo Atestado/Declaração</h3>

          <div className="space-y-4">
            {/* Tipo e Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo *
                </label>
                <select
                  value={novoAtestado.tipo}
                  onChange={(e) => setNovoAtestado({ ...novoAtestado, tipo: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500"
                >
                  {tiposAtestado.map(tipo => (
                    <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data *
                </label>
                <input
                  type="date"
                  value={novoAtestado.data}
                  onChange={(e) => setNovoAtestado({ ...novoAtestado, data: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500"
                />
              </div>
            </div>

            {/* Templates */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Templates Rápidos
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => aplicarTemplate('comparecimento')}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm"
                >
                  Comparecimento
                </button>
                <button
                  onClick={() => aplicarTemplate('repouso')}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm"
                >
                  Atestado de Repouso
                </button>
                <button
                  onClick={() => aplicarTemplate('acompanhamento')}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm"
                >
                  Acompanhamento
                </button>
              </div>
            </div>

            {/* Texto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Texto do Atestado *
              </label>
              <textarea
                value={novoAtestado.texto}
                onChange={(e) => setNovoAtestado({ ...novoAtestado, texto: e.target.value })}
                rows="6"
                placeholder="Digite o texto do atestado ou use um dos templates acima..."
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Você pode usar: [NOME], [IDADE], [RESPONSÁVEL], [DIAS], [DATA_INICIO]
              </p>
            </div>

            {/* Informações Adicionais */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CID (opcional)
                </label>
                <input
                  type="text"
                  value={novoAtestado.cid}
                  onChange={(e) => setNovoAtestado({ ...novoAtestado, cid: e.target.value })}
                  placeholder="Ex: J06.9"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dias de Afastamento
                </label>
                <input
                  type="number"
                  value={novoAtestado.dias}
                  onChange={(e) => setNovoAtestado({ ...novoAtestado, dias: e.target.value })}
                  placeholder="Ex: 3"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500"
                />
              </div>
            </div>

            {/* Período */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data Início
                </label>
                <input
                  type="date"
                  value={novoAtestado.dataInicio}
                  onChange={(e) => setNovoAtestado({ ...novoAtestado, dataInicio: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data Fim
                </label>
                <input
                  type="date"
                  value={novoAtestado.dataFim}
                  onChange={(e) => setNovoAtestado({ ...novoAtestado, dataFim: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500"
                />
              </div>
            </div>

            {/* Observações */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações
              </label>
              <textarea
                value={novoAtestado.observacoes}
                onChange={(e) => setNovoAtestado({ ...novoAtestado, observacoes: e.target.value })}
                rows="2"
                placeholder="Observações adicionais..."
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pediatria-500"
              />
            </div>

            {/* Botão Salvar */}
            <div className="flex justify-end pt-4 border-t">
              <button
                onClick={handleSaveAtestado}
                className="flex items-center gap-2 bg-pediatria-600 text-white px-6 py-3 rounded-lg hover:bg-pediatria-700 transition-colors"
              >
                <Save className="w-5 h-5" />
                Salvar Atestado
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Atestados */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Atestados Anteriores</h3>
        {atestados.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
            <FileBadge className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>Nenhum atestado registrado ainda</p>
          </div>
        ) : (
          <div className="space-y-4">
            {atestados.map((atestado) => (
              <div key={atestado.id} className="border rounded-lg p-6 bg-gray-50 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {atestado.tipo === 'declaracao' ? 'Declaração' : 'Atestado Médico'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(atestado.data).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => gerarPDF(atestado)}
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <Download className="w-4 h-4" />
                      PDF
                    </button>
                    {canEdit && (
                      <button
                        onClick={() => handleRemoveAtestado(atestado.id)}
                        className="text-red-600 hover:text-red-800 p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-white p-4 rounded border-l-4 border-pediatria-500">
                  <p className="text-sm text-gray-700 whitespace-pre-line">{atestado.texto}</p>

                  {atestado.cid && (
                    <p className="text-sm text-gray-600 mt-2">CID: {atestado.cid}</p>
                  )}

                  {atestado.dataInicio && atestado.dataFim && (
                    <p className="text-sm text-gray-600 mt-2">
                      Período: {new Date(atestado.dataInicio).toLocaleDateString('pt-BR')} a {new Date(atestado.dataFim).toLocaleDateString('pt-BR')}
                    </p>
                  )}

                  {atestado.observacoes && (
                    <p className="text-sm text-gray-600 italic mt-2">Obs: {atestado.observacoes}</p>
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
          <span>Atestado salvo com sucesso!</span>
        </div>
      )}
    </div>
  );
};

export default Atestados;
