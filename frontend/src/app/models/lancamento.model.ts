export enum TipoLancamento {
  CREDITO = 'CREDITO',
  DEBITO = 'DEBITO'
}

export interface Lancamento {
  id?: number;
  descricao: string;
  valor: number;
  tipo: TipoLancamento;
  // Backend pode retornar string ISO ou array [yyyy,MM,dd,HH,mm,ss,nano]
  dataLancamento: any;
  dataCriacao?: any;
}

export interface LancamentoDTO {
  descricao: string;
  valor: number;
  tipo: TipoLancamento;
  dataLancamento?: any;
}

export interface SimulacaoLancamentosDTO {
  quantidade: number;
  valorMinimo: number;
  valorMaximo: number;
  tipo: TipoLancamento;
}
