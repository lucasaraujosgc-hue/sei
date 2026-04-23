export interface UnidadeDetail {
  sigla: string;
  descricao: string;
}

export interface Secretaria {
  nome: string;
  unidades: UnidadeDetail[];
}

export const ORGAOS: Secretaria[] = [
  {
    nome: "Prefeitura Municipal",
    unidades: [
      { sigla: "PREF/GAB", descricao: "Gabinete do(a) Prefeito(a)" },
      { sigla: "PREF/GAB/NSE", descricao: "Núcleo de Serviços Especiais" },
      { sigla: "PREF/GAB/ASS", descricao: "Assessorias" },
      { sigla: "PREF/GAB/VICE", descricao: "Gabinete do(a) Vice Prefeito(a)" },
      { sigla: "PREF/GAB/PGM", descricao: "Gabinete do(a) Procurador(a)" },
      { sigla: "PREF/GAB/CGM", descricao: "Gabinete do(a) Controlador" },
      { sigla: "PREF/GAB/OUV", descricao: "Ouvidoria Geral do Município" }
    ]
  },
  {
    nome: "Secretaria Municipal de Planejamento",
    unidades: [
      { sigla: "SEPLAN/GAB", descricao: "Gabinete do(a) Secretário Municipal" },
      { sigla: "SEPLAN/GAB/ASS", descricao: "Assessoria Técnica" },
      { sigla: "SEPLAN/GAB/DEPLAN", descricao: "Departamento de Planejamento" },
      { sigla: "SEPLAN/GAB/DEPLAN/DOAA", descricao: "Divisão de Orçamento e acompanhamento das ações" },
      { sigla: "SEPLAN/GAB/ADMG", descricao: "Departamento de Administração Geral" },
      { sigla: "SEPLAN/GAB/ADMG/DPL", descricao: "Divisão de Patrimônio e Logística" },
      { sigla: "SEPLAN/GAB/ADMG/DPL/ALMOX", descricao: "Setor de Almoxarifado" },
      { sigla: "SEPLAN/GAB/ADMG/DPL/PATR", descricao: "Setor de Patrimônio" },
      { sigla: "SEPLAN/GAB/ADMG/SG", descricao: "Divisão de Serviços Gerais" },
      { sigla: "SEPLAN/GAB/ADMG/COMP", descricao: "Divisão de Compras" },
      { sigla: "SEPLAN/GAB/ADMG/CONT", descricao: "Divisão de Contratos" },
      { sigla: "SEPLAN/GAB/ADMG/RH", descricao: "Divisão de Recursos Humanos" },
      { sigla: "SEPLAN/GAB/ADMG/RH/RECRT", descricao: "Setor de recrutamento e Seleção" },
      { sigla: "SEPLAN/GAB/ADMG/RH/DP", descricao: "Setor de Capacitação e Desenvolvimento Pessoal" },
      { sigla: "SEPLAN/GAB/ADMG/NSE", descricao: "Núcleo de Serviços Especiais" }
    ]
  },
  {
    nome: "Secretaria Municipal de Gestão, Inovação e Comunicação",
    unidades: [
      { sigla: "SEMGICOM/GAB", descricao: "Gabinete do(a) Secretário(a) Municipal" },
      { sigla: "SEMGICOM/GAB/ASS", descricao: "Assessoria Técnica" },
      { sigla: "SEMGICOM/GAB/INOVA", descricao: "Departamento de Inovação" },
      { sigla: "SEMGICOM/GAB/INOVA/MANUT", descricao: "Divisão de Manutenção de Equipamentos de Informática" },
      { sigla: "SEMGICOM/GAB/DEPCOM", descricao: "Departamento de Comunicação" },
      { sigla: "SEMGICOM/GAB/DEPCOM/INFOR", descricao: "Divisão de Informação ao Público" }
    ]
  },
  {
    nome: "Secretaria Municipal de Finanças",
    unidades: [
      { sigla: "SEFIN/GAB", descricao: "Gabinete do(a) Secretário(a) Municipal" },
      { sigla: "SEFIN/GAB/DEPCONT", descricao: "Departamento de Contabilidade" },
      { sigla: "SEFIN/GAB/FINANC", descricao: "Departamento Financeiro" },
      { sigla: "SEFIN/GAB/FINANC/SE", descricao: "Divisão de Sala do Empreendedor" },
      { sigla: "SEFIN/GAB/TRIB", descricao: "Departamento de Tributos" }
    ]
  },
  {
    nome: "Secretaria Municipal de Educação",
    unidades: [
      { sigla: "SME/GAB", descricao: "Secretário(a) Municipal" },
      { sigla: "SME/GAB/GCS/CME", descricao: "Conselho Municipal de Educação" },
      { sigla: "SME/GAB/GCS/CMAE", descricao: "Conselho Municipal de Alimentação Escolar" },
      { sigla: "SME/GAB/DPE/DPPAA", descricao: "Divisão de Programas, Projetos e Acompanhamento das Ações" },
      { sigla: "SME/GAB/DPE/DGEA", descricao: "Divisão de Gestão Escolar e Avaliação" },
      { sigla: "SME/GAB/DAIE", descricao: "Departamento de Administração e Infraestrutura Escolar" },
      { sigla: "SME/GAB/DAIE/ALMOX/PATRI", descricao: "Setor de Patrimônio e Almoxarifado" },
      { sigla: "SME/GAB/DAIE/DAE/MEREND", descricao: "Setor de Merenda Escolar" },
      { sigla: "SME/GAB/DDP", descricao: "Departamento de Desenvolvimento Pedagógico" },
      { sigla: "SME/GAB/DDP/SUPEDU", descricao: "Superintendência de Educação" },
      { sigla: "SME/GAB/DDP/EDUINF", descricao: "Divisão de Educação Infantil" },
      { sigla: "SME/GAB/DDP/ENSFUNDI", descricao: "Divisão de Ensino Fundamental I" },
      { sigla: "SME/GAB/DDP/ENSFUNDII", descricao: "Divisão de Ensino Fundamental II" },
      { sigla: "SME/GAB/DDP/EDUINCLUS", descricao: "Divisão de Educação Inclusiva" }
    ]
  },
  {
    nome: "Secretaria Municipal da Saúde",
    unidades: [
      { sigla: "SMS/GAB", descricao: "Gabinete do(a) Secretário(a) Municipal" },
      { sigla: "SMS/GAB/ASS", descricao: "Assessoria Técnica" },
      { sigla: "SMS/GAB/DPT", descricao: "Departamento Técnico" },
      { sigla: "SMS/GAB/DPT/DEPPAA", descricao: "Divisão de Elaboração de Programas, Projetos e Acompanhamentos das Ações" },
      { sigla: "SMS/GAB/DPT/DRE", descricao: "Divisão de Regulação" },
      { sigla: "SMS/GAB/DPT/TFD", descricao: "Divisão de Transporte Fora do Domicílio (TFD)" },
      { sigla: "SMS/GAB/DPA", descricao: "Departamento de Administração e Finanças" },
      { sigla: "SMS/GAB/DPA/DAA", descricao: "Divisão de Apoio Administrativo" },
      { sigla: "SMS/GAB/DPA/DAA/SAL", descricao: "Setor de Almoxarifado" },
      { sigla: "SMS/GAB/DPA/DAA/SSU", descricao: "Setor de Suprimentos" },
      { sigla: "SMS/GAB/DPA/DAA/STP", descricao: "Setor de Transporte" },
      { sigla: "SMS/GAB/DPA/DEOF", descricao: "Divisão de Execução Orçamentária e Financeira - FMS" },
      { sigla: "SMS/GAB/DAPS", descricao: "Departamento de Atenção Primária à Saúde" },
      { sigla: "SMS/GAB/DAPS/DSB", descricao: "Divisão de Saúde Bucal" },
      { sigla: "SMS/GAB/DAPS/DAID", descricao: "Divisão de Apoio Institucional Diretores" },
      { sigla: "SMS/GAB/DAPS/GUSF", descricao: "Gerência de USF" },
      { sigla: "SMS/GAB/DAPS/GPO", descricao: "Gerência de Policlínica" },
      { sigla: "SMS/GAB/DVS", descricao: "Departamento de Vigilância em Saúde" },
      { sigla: "SMS/GAB/DVS/DVE", descricao: "Divisão de Vigilância Epidemiológica" },
      { sigla: "SMS/GAB/DVS/DVE/SIM", descricao: "Setor de Imunização" },
      { sigla: "SMS/GAB/DVS/DVE/SST", descricao: "Setor de Saúde do Trabalhador" },
      { sigla: "SMS/GAB/DVS/VISA", descricao: "Divisão de Vigilância Sanitária" },
      { sigla: "SMS/GAB/DCAS", descricao: "Departamento de Controle e Avaliação de Saúde" },
      { sigla: "SMS/GAB/DCAS/DCA", descricao: "Divisão de Controle e Avaliação" },
      { sigla: "SMS/GAB/DCAS/DGSI", descricao: "Divisão de Gestão dos Sistemas de Informação" },
      { sigla: "SMS/GAB/CAPS", descricao: "Coordenação do Centro de Atenção Psicossocial (CAPS)" },
      { sigla: "SMS/GAB/DGHM", descricao: "Diretoria Geral do Hospital Municipal" },
      { sigla: "SMS/GAB/DGHM/DMED", descricao: "Diretoria Médica" },
      { sigla: "SMS/GAB/DGHM/SAMU", descricao: "Gerência do SAMU" },
      { sigla: "SMS/GAB/DGHM/DENF", descricao: "Gerência em Enfermagem" },
      { sigla: "SMS/GAB/DGHM/DENF/CCIH", descricao: "Coordenação de CCIH" },
      { sigla: "SMS/GAB/DGHM/DAA", descricao: "Divisão de Apoio Administrativo" },
      { sigla: "SMS/GAB/DGHM/DAA/SADT", descricao: "Setor de Apoio Diagnóstico e Terapia" },
      { sigla: "SMS/GAB/DGHM/DPA", descricao: "Divisão de Patrimônio e Almoxarifado" },
      { sigla: "SMS/GAB/DGHM/DADT", descricao: "Divisão de Apoio Diagnóstico e Terapia" },
      { sigla: "SMS/ORGCOL/CMS", descricao: "Conselho Municipal de Saúde" },
      { sigla: "SMS/ORGSIS/FMS", descricao: "Fundo Municipal da Saúde" }
    ]
  },
  {
    nome: "Secretaria Municipal de Desenvolvimento Econômico e Social",
    unidades: [
      { sigla: "SEMDES/GAB", descricao: "Gabinete do(a) Secretário(a) Municipal" },
      { sigla: "SEMDES/ASSTI", descricao: "Conselho Municipal de Assistência Social" },
      { sigla: "SEMDES/CTM", descricao: "Conselho Tutelar Municipal" },
      { sigla: "SEMDES/GAB/OSE/FMAS", descricao: "Fundo Municipal de Assistência Social" },
      { sigla: "SEMDES/GAB/OSE/FMDCA", descricao: "Fundo Municipal dos Direitos da Criança e do Adolescente" },
      { sigla: "SEMDES/GAB/ASS", descricao: "Assessoria Técnica" },
      { sigla: "SEMDES/GAB/DCE/DPPDS", descricao: "Divisão de Programas, Projetos e Desenvolvimento Social" },
      { sigla: "SEMDES/GAB/DPSB/CCRAS", descricao: "Coordenadoria do Centro de Referência de Assistência Social" },
      { sigla: "SEMDES/GAB/DPSB/CCREAS", descricao: "Coordenadoria do Centro de Referência Especializado de Assistência Social" },
      { sigla: "SEMDES/GAB/DPSB/CADUNIC", descricao: "Coordenadoria do Cadastro Único" }
    ]
  },
  {
    nome: "Secretaria Municipal de Cultura, Esporte e Lazer",
    unidades: [
      { sigla: "SEMCEL/GAB", descricao: "Gabinete do(a) Secretário(a) Municipal" },
      { sigla: "SEMCEL/ORGCOL/CMC", descricao: "Conselho Municipal de Cultura" },
      { sigla: "SEMCEL/GAB/ASS", descricao: "Assessoria Técnica" },
      { sigla: "SEMCEL/GAB/DEPCUL", descricao: "Departamento de Cultura" },
      { sigla: "SEMCEL/GAB/DEPCUL/DDC", descricao: "Divisão de Desenvolvimento Cultural" },
      { sigla: "SEMCEL/GAB/DEPCUL/DBP", descricao: "Divisão de Biblioteca Pública" },
      { sigla: "SEMCEL/GAB/DEL", descricao: "Departamento de Esporte e Lazer" },
      { sigla: "SEMCEL/GAB/DEL/DDE", descricao: "Divisão de Desenvolvimento Esportivo" },
      { sigla: "SEMCEL/GAB/DEL/DPLIE", descricao: "Divisão de Programas de Lazer e Inclusão Esportiva" },
      { sigla: "SEMCEL/GAB/DEL/DPIE", descricao: "Divisão de Planejamento e Inovação Esportiva" }
    ]
  },
  {
    nome: "Secretaria Municipal de Infraestrutura e Urbanismo",
    unidades: [
      { sigla: "SEINFRA/GAB", descricao: "Gabinete do(a) Secretário(a) Municipal" },
      { sigla: "SEINFRA/CMSP", descricao: "Conselho Municipal de Segurança Pública" },
      { sigla: "SEINFRA/JARI", descricao: "Junta de Apuração dos Recursos Infracionais de Trânsito - JARI" },
      { sigla: "SEINFRA/FMSP", descricao: "Fundo Municipal de Segurança Pública" },
      { sigla: "SEINFRA/GAB/ASS", descricao: "Assessoria Técnica" },
      { sigla: "SEINFRA/GAB/DPGT", descricao: "Departamento de Planejamento e Gestão Técnica" },
      { sigla: "SEINFRA/GAB/DPGT/PROGPROJ", descricao: "Divisão de Elaboração de Programas e Projetos" },
      { sigla: "SEINFRA/GAB/DPGT/DAAG", descricao: "Divisão de Acompanhamento das Ações Governamentais" },
      { sigla: "SEINFRA/GAB/DOU", descricao: "Departamento de Obras e Urbanismo" },
      { sigla: "SEINFRA/GAB/DOU/DFCUS", descricao: "Divisão de Fiscalização, Controle e Uso do Solo" },
      { sigla: "SEINFRA/GAB/DOU/DOSH", descricao: "Divisão de Obras, Saneamento e Habitação" },
      { sigla: "SEINFRA/GAB/DOU/DIVURB", descricao: "Divisão de Urbanismo" },
      { sigla: "SEINFRA/GAB/DSP", descricao: "Departamento de Serviços Públicos" },
      { sigla: "SEINFRA/GAB/DSP/DCP", descricao: "Divisão de Conservação Pública" },
      { sigla: "SEINFRA/GAB/DSP/DCP/SPPJ", descricao: "Setor de Praças, Parques e Jardins" },
      { sigla: "SEINFRA/GAB/DSP/DCP/SIP", descricao: "Setor de Iluminação Pública" },
      { sigla: "SEINFRA/GAB/DSP/DCP/SEV", descricao: "Setor de Estradas Vicinais" },
      { sigla: "SEINFRA/GAB/DSP/DLP", descricao: "Divisão de Limpeza Pública" },
      { sigla: "SEINFRA/GAB/DSP/DAC", descricao: "Divisão de Administração dos Cemitérios" },
      { sigla: "SEINFRA/GAB/DSP/DACA", descricao: "Divisão de Administração do Centro de Abastecimento" },
      { sigla: "SEINFRA/GAB/DSP/DADS", descricao: "Divisão de Administração do Distrito de Sergi" },
      { sigla: "SEINFRA/GAB/DSP/DADA", descricao: "Divisão de Administração do Distrito de Afligidos" },
      { sigla: "SEINFRA/GAB/DSP/DAPM", descricao: "Divisão de Administração do Povoado Magalhães" },
      { sigla: "SEINFRA/GAB/DMT", descricao: "Departamento de Mobilidade e Transportes" },
      { sigla: "SEINFRA/GAB/DMT/DIVTRANS", descricao: "Divisão de Transportes" },
      { sigla: "SEINFRA/GAB/DMT/DIVTRANS/SMFM", descricao: "Setor de Manutenção da Frota Municipal" },
      { sigla: "SEINFRA/GAB/DMT/DIVTRANS/SGTPM", descricao: "Setor de Gestão do Transporte Público e Máquinas" },
      { sigla: "SEINFRA/GAB/DMT/DIVTRANS/STP", descricao: "Setor de Transporte Privado" },
      { sigla: "SEINFRA/GAB/DMT/DFOT", descricao: "Divisão de Fiscalização e Operação de Tráfego" },
      { sigla: "SEINFRA/GAB/DMT/DET", descricao: "Divisão de Educação de Trânsito" }
    ]
  },
  {
    nome: "Secretaria Municipal de Agricultura e Meio Ambiente",
    unidades: [
      { sigla: "SEAMA/GAB", descricao: "Gabinete do(a) Secretário(a) Municipal" },
      { sigla: "SEAMA/ORGCOL/CMMA", descricao: "Conselho Municipal do Meio Ambiente" },
      { sigla: "SEAMA/ORGCOL/CMDRS", descricao: "Conselho Municipal de Desenvolvimento Rural Sustentável" },
      { sigla: "SEAMA/ORGSIS/FMMA", descricao: "Fundo Municipal do Meio Ambiente" },
      { sigla: "SEAMA/ORGSIS/FMDRS", descricao: "Fundo Municipal de Desenvolvimento Rural Sustentável" },
      { sigla: "SEAMA/GAB/OAD/ASS", descricao: "Assessoria Técnica" },
      { sigla: "SEAMA/GAB/OAD/DPT", descricao: "Departamento Técnico" },
      { sigla: "SEAMA/GAB/OAD/DPT/DPPAA", descricao: "Divisão de Programas, Projetos e Acompanhamento das Ações" },
      { sigla: "SEAMA/GAB/OAD/DEAGRO", descricao: "Departamento de Agropecuária - DEAGRO" },
      { sigla: "SEAMA/GAB/OAD/DEAGRO/DIAP", descricao: "Divisão de apoio à Pecuária - DIAP" },
      { sigla: "SEAMA/GAB/OAD/DEAGRO/DIAGRI", descricao: "Divisão de Apoio à Agricultura - DIAGRI" },
      { sigla: "SEAMA/GAB/OAD/DEAGRO/DIAPMP", descricao: "Divisão de Apoio ao Pequeno e Médio Produtor - DIAPMP" },
      { sigla: "SEAMA/GAB/OAD/DEAGRO/DIAPA", descricao: "Divisão de Apoio à Produção Animal - DIAPA" },
      { sigla: "SEAMA/GAB/OAD/DRHDR", descricao: "Departamento de Recursos Hídricos e Desenvolvimento Rural - DRHDR" },
      { sigla: "SEAMA/GAB/OAD/DRHDR/DRH", descricao: "Divisão de Recursos Hídricos - DRH" },
      { sigla: "SEAMA/GAB/OAD/DRHDR/DIDESC", descricao: "Divisão de Desenvolvimento Comunitário - DIDESC" },
      { sigla: "SEAMA/GAB/OAD/DIMAM", descricao: "Departamento do Meio Ambiente - DIMAM" },
      { sigla: "SEAMA/GAB/OAD/DIMAM/DLFA", descricao: "Divisão de Licenciamento e Fiscalização Ambiental - DLFA" },
      { sigla: "SEAMA/GAB/OAD/DIMAM/DIEAM", descricao: "Divisão de Educação Ambiental - DIEAM" },
      { sigla: "SEAMA/GAB/OAD/DIMAM/DVRFF", descricao: "Divisão de Recomposição da Fauna e da Flora" }
    ]
  }
];
