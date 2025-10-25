import { useState, useEffect } from 'react';
import { Save, Shield, CheckCircle, AlertCircle, Calendar, Download } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { PERMISSIONS } from '../config/roles';
import { CALENDARIO_VACINAL } from '../config/modules';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const Vacinacao = ({ pacienteId, pacienteNome, dataNascimento, onSave }) => {
  const { checkPermission } = useAuth();
  const canEdit = checkPermission(PERMISSIONS.VACINACAO_WRITE);

  const [vacinas, setVacinas] = useState([]);
  const [saved, setSaved] = useState(false);

  // Carregar dados salvos
  useEffect(() => {
    if (pacienteId) {
      const savedVacinas = localStorage.getItem(`vacinas-${pacienteId}`);
      if (savedVacinas) {
        setVacinas(JSON.parse(savedVacinas));
      } else {
        // Inicializar com calendario nacional
        const vacinasIniciais = CALENDARIO_VACINAL.map((v, idx) => ({
          id: idx,
          ...v,
          aplicada: false,
          dataAplicacao: '',
          lote: '',
          local: '',
          profissional: '',
          reacoes: '',
          observacoes: ''
        }));
        setVacinas(vacinasIniciais);
      }
    }
  }, [pacienteId]);

  const handleVacinaChange = (id, field, value) => {
    if (!canEdit && field !== 'dataAplicacao') {
      alert('Você não tem permissão para editar vacinas');
      return;
    }

    const novasVacinas = vacinas.map(v =>
      v.id === id ? { ...v, [field]: value } : v
    );
    setVacinas(novasVacinas);
    localStorage.setItem(`vacinas-${pacienteId}`, JSON.stringify(novasVacinas));

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleToggleVacina = (id) => {
    if (!canEdit) {
      alert('Você não tem permissão para marcar vacinas');
      return;
    }

    const vacina = vacinas.find(v => v.id === id);
    const novasVacinas = vacinas.map(v =>
      v.id === id
        ? {
            ...v,
            aplicada: !v.aplicada,
            dataAplicacao: !v.aplicada ? new Date().toISOString().split('T')[0] : ''
          }
        : v
    );

    setVacinas(novasVacinas);
    localStorage.setItem(`vacinas-${pacienteId}`, JSON.stringify(novasVacinas));
  };

  const calcularCobertura = () => {
    const total = vacinas.length;
    const aplicadas = vacinas.filter(v => v.aplicada).length;
    return total > 0 ? ((aplicadas / total) * 100).toFixed(1) : 0;
  };

  const getVacinasPendentes = () => {
    return vacinas.filter(v => !v.aplicada);
  };

  const exportarCartaoVacinal = () => {
    const doc = new jsPDF();

    // Cabeçalho
    doc.setFontSize(18);
    doc.setTextColor(59, 130, 246); // pediatria-600
    doc.text('CARTÃO DE VACINAÇÃO', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Paciente: ${pacienteNome}`, 20, 35);
    doc.text(`Data de Nascimento: ${new Date(dataNascimento).toLocaleDateString('pt-BR')}`, 20, 42);
    doc.text(`Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}`, 20, 49);

    // Cobertura vacinal
    doc.setFontSize(10);
    doc.setTextColor(16, 185, 129); // green
    doc.text(`Cobertura Vacinal: ${calcularCobertura()}%`, 20, 58);

    // Tabela de vacinas
    const tableData = vacinas.map(v => [
      v.nome,
      v.idade,
      v.aplicada ? '✓' : '✗',
      v.dataAplicacao ? new Date(v.dataAplicacao).toLocaleDateString('pt-BR') : '-',
      v.lote || '-',
      v.local || '-'
    ]);

    doc.autoTable({
      startY: 65,
      head: [['Vacina', 'Idade', 'Aplicada', 'Data', 'Lote', 'Local']],
      body: tableData,
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontSize: 9,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 8
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250]
      },
      columnStyles: {
        0: { cellWidth: 55 },
        1: { cellWidth: 25 },
        2: { cellWidth: 20, halign: 'center' },
        3: { cellWidth: 25 },
        4: { cellWidth: 25 },
        5: { cellWidth: 30 }
      }
    });

    // Rodapé
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Sistema de Gestão Pediátrica - Dra. Thais', 105, finalY, { align: 'center' });

    // Download
    doc.save(`Cartao_Vacinal_${pacienteNome.replace(/\s/g, '_')}.pdf`);
  };

  const cobertura = calcularCobertura();
  const pendentes = getVacinasPendentes();

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-pediatria-700 flex items-center gap-2">
          <Shield className="w-7 h-7" />
          Cartão de Vacinação
        </h2>
        {!canEdit && (
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1 rounded">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">Apenas visualização</span>
          </div>
        )}
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Cobertura Vacinal</span>
          </div>
          <p className="text-3xl font-bold text-green-600">{cobertura}%</p>
          <p className="text-xs text-gray-600 mt-1">
            {vacinas.filter(v => v.aplicada).length} de {vacinas.length} vacinas
          </p>
        </div>

        <div className="border-2 border-amber-200 rounded-lg p-4 bg-amber-50">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-medium text-gray-700">Vacinas Pendentes</span>
          </div>
          <p className="text-3xl font-bold text-amber-600">{pendentes.length}</p>
          <p className="text-xs text-gray-600 mt-1">
            Próxima: {pendentes.length > 0 ? pendentes[0].nome : 'Nenhuma'}
          </p>
        </div>

        <div className="border-2 border-pediatria-200 rounded-lg p-4 bg-pediatria-50">
          <div className="flex items-center gap-2 mb-2">
            <Download className="w-5 h-5 text-pediatria-600" />
            <span className="text-sm font-medium text-gray-700">Exportar</span>
          </div>
          <button
            onClick={exportarCartaoVacinal}
            className="w-full mt-2 bg-pediatria-600 text-white px-4 py-2 rounded-lg hover:bg-pediatria-700 transition-colors text-sm"
          >
            Baixar Cartão PDF
          </button>
        </div>
      </div>

      {/* Tabela de Vacinas */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-pediatria-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Vacina</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Idade</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Dose</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Proteção</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Data Aplicação</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Lote</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Local</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vacinas.map((vacina) => (
                <tr
                  key={vacina.id}
                  className={`hover:bg-gray-50 ${vacina.aplicada ? 'bg-green-50' : ''}`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={vacina.aplicada}
                      onChange={() => handleToggleVacina(vacina.id)}
                      disabled={!canEdit}
                      className="w-5 h-5 rounded text-green-600 focus:ring-green-500 cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {vacina.nome}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{vacina.idade}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{vacina.doses}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{vacina.protege}</td>
                  <td className="px-4 py-3">
                    <input
                      type="date"
                      value={vacina.dataAplicacao}
                      onChange={(e) => handleVacinaChange(vacina.id, 'dataAplicacao', e.target.value)}
                      disabled={!canEdit}
                      className="px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={vacina.lote}
                      onChange={(e) => handleVacinaChange(vacina.id, 'lote', e.target.value)}
                      disabled={!canEdit}
                      placeholder="Lote"
                      className="w-24 px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={vacina.local}
                      onChange={(e) => handleVacinaChange(vacina.id, 'local', e.target.value)}
                      disabled={!canEdit}
                      placeholder="Local"
                      className="w-32 px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-pediatria-500 disabled:bg-gray-100"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vacinas Pendentes em Destaque */}
      {pendentes.length > 0 && (
        <div className="border-2 border-amber-300 rounded-lg p-6 bg-amber-50">
          <h3 className="text-lg font-semibold text-amber-800 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Vacinas Pendentes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {pendentes.slice(0, 6).map((vacina) => (
              <div
                key={vacina.id}
                className="bg-white border border-amber-200 rounded p-3"
              >
                <p className="font-medium text-gray-900 text-sm">{vacina.nome}</p>
                <p className="text-xs text-gray-600 mt-1">Idade: {vacina.idade}</p>
                <p className="text-xs text-gray-500 mt-1">Dose: {vacina.doses}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {saved && (
        <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
          <CheckCircle className="w-5 h-5" />
          <span>Dados salvos automaticamente!</span>
        </div>
      )}
    </div>
  );
};

export default Vacinacao;
