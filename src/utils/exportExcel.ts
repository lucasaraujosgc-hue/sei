import * as XLSX from 'xlsx';
import { ProcessoData } from '../types';

export const generateExcel = (data: ProcessoData) => {
  // We need to match the specific Excel format from the PDF.
  // We will build an array of arrays representing the rows and columns.
  const wsData: any[][] = [];

  // Sheet Headers
  wsData.push(["BASE DE CONHECIMENTO - SEI", ""]);
  wsData.push([]);
  
  wsData.push(["1. Nome do processo:", data.nome, "", "Nome do Tipo Processual padronizado pela Gestão Documental"]);
  wsData.push(["2. Finalidade do processo:", data.finalidade]);
  wsData.push(["3. Qual(ais) Unidades(s) inicia o processo?", data.unidadesIniciadoras.join(", ")]);
  wsData.push(["4. O processo possui fluxo mapeado?", data.possuiFluxoMapeado]);
  wsData.push(["5. O processo deve ter qual nível de acesso:", 
               `Público (${data.nivelAcesso === 'Público' ? 'X' : ' '})   Restrito (${data.nivelAcesso === 'Restrito' ? 'X' : ' '})   Sigiloso (${data.nivelAcesso === 'Sigiloso' ? 'X' : ' '})`]);
  wsData.push(["6. Qual base legal que justifica restrição ou sigilo ao processo?", data.hipoteseLegal || "N/A"]);
  wsData.push(["6. Base legal do processo:", data.baseLegal]);
  
  wsData.push([]); // Empty row
  wsData.push(["0"]); // Empty section separator
  
  // Table Header for "Árvore dos Documentos"
  wsData.push([
    "Unidades por onde o processo tramita (apresentar por ordem)",
    "Ação realizada pela unidade no processo",
    "Qual documento é inserido ao processo na execução da ação realizada pela unidade",
    "O documento inserido necessita ser assinado por algum servidor da unidade?",
    "O documento será interno do SEI ou externo?",
    "Nomenclatura padronizada do documento no SEI",
    "O documento já existe no SEI?",
    "O documento será criado baseado em um modelo?",
    "Observação"
  ]);

  // Table Body
  data.tramitacoes.forEach(t => {
    if (t.documentos.length === 0) {
      // Unidade sem documento cadastrado
      wsData.push([
        t.unidadeDescricao,
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-"
      ]);
    } else {
      t.documentos.forEach((doc, idx) => {
        wsData.push([
          idx === 0 ? t.unidadeDescricao : "", // Only show Unidade on the first row for that unit
          "", // Ação realizada (maybe could be added later, user didn't ask for form field)
          doc.nome,
          doc.precisaAssinatura,
          doc.internoExterno,
          "", // Nomenclatura padronizada (left empty for gestao documental)
          doc.jaExisteNoSEI,
          doc.criadoBaseadoEmModelo,
          doc.observacao
        ]);
      });
    }
  });

  wsData.push([]); // Empty row
  wsData.push(["Informações/condições são necessárias?", ""]);

  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Mapeamento SEI");

  // Save string
  XLSX.writeFile(wb, `Mapeamento_${data.nome || 'Processo'}.xlsx`);
};
