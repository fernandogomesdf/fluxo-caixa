export interface ConsolidacaoRequest {
  dataConsolidacao: string; // ISO date
}

export interface ConsolidacaoResponse {
  id: number;
  dataConsolidacao: any; // LocalDateTime array from Java
  saldoTotal: number;
  inicioProcessamento: any; // LocalDateTime array from Java
  fimProcessamento: any; // LocalDateTime array from Java
  tempoProcessamento: number; // em millisegundos
  quantidadeLancamentos: number;
  message: string;
}

export interface UltimaConsolidacao {
  id: number;
  dataConsolidacao: any; // LocalDateTime array from Java
  saldoTotal: number;
  tempoProcessamento: number;
  quantidadeLancamentos: number;
}

export interface ConsolidacaoStatus {
  processando: boolean;
  ultimaConsolidacao?: UltimaConsolidacao;
}
