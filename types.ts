export interface ProcessoData {
  id?: string;
  nome: string;
  finalidade: string;
  baseLegal: string;
  unidadesIniciadoras: string[];
  possuiFluxoMapeado: 'Sim' | 'Não' | '';
  nivelAcesso: 'Público' | 'Restrito' | 'Sigiloso' | '';
  hipoteseLegal: string;
  tramitacoes: TramitacaoData[];
}

export interface TramitacaoData {
  id: string;
  secretariaNome: string;
  unidadeSigla: string;
  unidadeDescricao: string;
  documentos: DocumentoData[];
}

export interface DocumentoData {
  id: string;
  nome: string;
  internoExterno: 'Interno' | 'Externo' | '';
  precisaAssinatura: 'Sim' | 'Não' | '';
  formato: string;
  jaExisteNoSEI: 'Sim' | 'Não' | '';
  criadoBaseadoEmModelo: 'Sim' | 'Não' | '';
  observacao: string;
}
