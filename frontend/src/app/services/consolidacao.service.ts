import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConsolidacaoRequest, ConsolidacaoResponse, UltimaConsolidacao } from '../models/consolidacao.model';

@Injectable({
  providedIn: 'root'
})
export class ConsolidacaoService {
  private readonly API_URL = 'http://localhost:8082/api/consolidacao';

  constructor(private http: HttpClient) { }

  /**
   * Inicia processo de consolidação
   */
  iniciarConsolidacao(request: ConsolidacaoRequest): Observable<ConsolidacaoResponse> {
    return this.http.post<ConsolidacaoResponse>(`${this.API_URL}/processar`, request);
  }

  /**
   * Busca a última consolidação realizada
   */
  obterUltimaConsolidacao(): Observable<UltimaConsolidacao> {
    return this.http.get<UltimaConsolidacao>(`${this.API_URL}/ultima`);
  }

  /**
   * Lista todas as consolidações (opcional para histórico)
   */
  listarConsolidacoes(): Observable<UltimaConsolidacao[]> {
    return this.http.get<UltimaConsolidacao[]>(`${this.API_URL}/historico`);
  }
}
