import ExcelJS from 'exceljs';
import { ProcessoData } from '../types';

export const generateExcel = async (data: ProcessoData) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Mapeamento SEI', { views: [{ showGridLines: false }] });

  // Column widths
  sheet.columns = [
    { key: 'A', width: 35 },
    { key: 'B', width: 25 },
    { key: 'C', width: 25 },
    { key: 'D', width: 25 },
    { key: 'E', width: 20 },
    { key: 'F', width: 28 },
    { key: 'G', width: 15 },
    { key: 'H', width: 17 },
    { key: 'I', width: 25 },
  ];

  // Helper for borders
  const borderAll: Partial<ExcelJS.Borders> = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' }
  };

  // Header 1
  sheet.mergeCells('A1:I1');
  const h1 = sheet.getCell('A1');
  h1.value = 'BASE DE CONHECIMENTO - SEI';
  h1.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF002060' } };
  h1.font = { color: { argb: 'FFFFFFFF' }, bold: true, name: 'Arial', size: 10 };
  h1.alignment = { horizontal: 'center', vertical: 'middle' };
  h1.border = borderAll;
  
  sheet.mergeCells('F2:I2');
  const hRight = sheet.getCell('F2');
  hRight.value = 'Nome do Tipo Processual padronizado pela Gestão Documental';
  hRight.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } };
  hRight.font = { bold: true, name: 'Arial', size: 9 };
  hRight.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  hRight.border = borderAll;

  sheet.mergeCells('F3:I8');
  const rightBox = sheet.getCell('F3');
  rightBox.border = borderAll;

  // Fill Left Side (A2:E8)
  const leftHeaders = [
    "1. Nome do processo:",
    "2. Finalidade do processo:",
    "3. Qual(ais) Unidades(s) inicia o processo?",
    "4. O processo possui fluxo mapeado?",
    "5. O processo deve ter qual nível de acesso:",
    "6. Qual base legal que justifica restrição ou sigilo ao processo?",
    "6. Base legal do processo:"
  ];
  
  const leftValues = [
    data.nome,
    data.finalidade,
    data.unidadesIniciadoras.join(", "),
    data.possuiFluxoMapeado,
    `Público (${data.nivelAcesso === 'Público' ? 'X' : '  '})        Restrito (${data.nivelAcesso === 'Restrito' ? 'X' : '  '})        Sigiloso (${data.nivelAcesso === 'Sigiloso' ? 'X' : '  '})`,
    data.hipoteseLegal || "",
    data.baseLegal
  ];

  for (let i = 0; i < 7; i++) {
    const rowNum = i + 2;
    sheet.mergeCells(`B${rowNum}:E${rowNum}`);
    
    const cellA = sheet.getCell(`A${rowNum}`);
    cellA.value = leftHeaders[i];
    cellA.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFECECEC' } }; 
    cellA.font = { bold: true, size: 9, name: 'Arial' };
    cellA.alignment = { vertical: 'middle', wrapText: true, indent: 1 };
    cellA.border = borderAll;

    const cellVal = sheet.getCell(`B${rowNum}`);
    cellVal.value = leftValues[i];
    cellVal.font = { size: 9, name: 'Arial' };
    cellVal.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true, indent: 1 };
    cellVal.border = borderAll;
    sheet.getRow(rowNum).height = 32; 
  }

  // Row 9 is an empty visual separator (small height)
  sheet.getRow(9).height = 8;
  
  // Section separator "0" row 10
  sheet.mergeCells('A10:I10');
  const h0 = sheet.getCell('A10');
  h0.value = '0';
  h0.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF002060' } };
  h0.font = { color: { argb: 'FFFFFFFF' }, bold: true, size: 10, name: 'Arial' };
  h0.alignment = { horizontal: 'center', vertical: 'middle' };
  h0.border = borderAll;

  // Table Headers row 11
  const tableHeaders = [
    "Unidades por onde o processo tramita\n(apresentar por ordem)",
    "Ação realizada pela unidade no processo",
    "Qual documento é inserido ao processo na execução da ação realizada pela unidade",
    "O documento inserido necessita ser assinado por algum servidor da unidade?",
    "O documento será interno do SEI ou externo?",
    "Nomenclatura padronizada do documento no SEI",
    "O documento já existe no SEI?",
    "O documento será criado baseado em um modelo?",
    "Observação"
  ];
  
  sheet.getRow(11).height = 55;
  tableHeaders.forEach((th, idx) => {
    const col = String.fromCharCode(65 + idx);
    const cell = sheet.getCell(`${col}11`);
    cell.value = th;
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } };
    cell.font = { bold: true, size: 8, name: 'Arial' };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = borderAll;
  });

  // Table Data
  let currentRow = 12;
  
  if (data.tramitacoes.length === 0) {
     // Create a few empty rows for padding if blank
     for(let i=0; i<3; i++) {
        tableHeaders.forEach((_, cIdx) => {
           const cell = sheet.getCell(`${String.fromCharCode(65 + cIdx)}${currentRow}`);
           cell.border = borderAll;
        });
        sheet.getRow(currentRow).height = 25;
        currentRow++;
     }
  } else {
    data.tramitacoes.forEach(t => {
      if (t.documentos.length === 0) {
        const rowValues = [t.unidadeSigla, "", "", "", "", "", "", "", ""];
        rowValues.forEach((val, idx) => {
          const col = String.fromCharCode(65 + idx);
          const cell = sheet.getCell(`${col}${currentRow}`);
          cell.value = val;
          cell.font = { size: 9, name: 'Arial' };
          cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
          cell.border = borderAll;
          if(idx === 0) { 
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F5F5' } }; 
            cell.font = { bold: true, size: 9, name: 'Arial' };
          }
        });
        sheet.getRow(currentRow).height = 30;
        currentRow++;
      } else {
        t.documentos.forEach((doc, idx) => {
          const rowValues = [
            idx === 0 ? t.unidadeSigla : "",
            "", 
            doc.nome,
            doc.precisaAssinatura,
            doc.internoExterno,
            "", 
            doc.jaExisteNoSEI,
            doc.criadoBaseadoEmModelo,
            doc.observacao
          ];
          rowValues.forEach((val, cIdx) => {
            const col = String.fromCharCode(65 + cIdx);
            const cell = sheet.getCell(`${col}${currentRow}`);
            cell.value = val;
            cell.font = { size: 9, name: 'Arial' };
            cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
            cell.border = borderAll;
            if (cIdx === 0 && val !== "") {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F5F5' } };
                cell.font = { bold: true, size: 9, name: 'Arial' };
            }
          });
          sheet.getRow(currentRow).height = 30;
          currentRow++;
        });
      }
    });
  }

  // Footer Row
  sheet.addRow([]);
  currentRow++;
  sheet.mergeCells(`A${currentRow}:I${currentRow}`);
  const footer = sheet.getCell(`A${currentRow}`);
  footer.value = "Informações/condições são necessárias?";
  footer.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF002060' } };
  footer.font = { color: { argb: 'FFFFFFFF' }, bold: true, size: 9, name: 'Arial' };
  footer.alignment = { horizontal: 'center', vertical: 'middle' };
  footer.border = borderAll;
  
  sheet.mergeCells(`A${currentRow+1}:I${currentRow+3}`);
  const footerBox = sheet.getCell(`A${currentRow+1}`);
  footerBox.border = borderAll;

  // Download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Mapeamento_${data.nome ? data.nome.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'Processo'}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
