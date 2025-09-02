import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lancamento, LancamentoDTO, SimulacaoLancamentosDTO, TipoLancamento } from '../models/lancamento.model';

@Injectable({
  providedIn: 'root'
})
export class LancamentoService {
  private apiUrl = '/api/lancamentos';

  constructor(private http: HttpClient) {}

  criarLancamento(lancamento: LancamentoDTO): Observable<any> {
    return this.http.post<any>(this.apiUrl, lancamento);
  }

  simularLancamentos(simulacao: SimulacaoLancamentosDTO): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/simular`, simulacao);
  }

  listarLancamentos(): Observable<Lancamento[]> {
    return this.http.get<Lancamento[]>(this.apiUrl);
  }

  listarPorTipo(tipo: TipoLancamento): Observable<Lancamento[]> {
    return this.http.get<Lancamento[]>(`${this.apiUrl}?tipo=${tipo}`);
  }

  excluirLancamento(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  listarTipos(): Observable<TipoLancamento[]> {
    return this.http.get<TipoLancamento[]>(`${this.apiUrl}/tipos`);
  }
}
