import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { ConsolidacaoService } from '../../services/consolidacao.service';
import { ConsolidacaoResponse, UltimaConsolidacao } from '../../models/consolidacao.model';

@Component({
  selector: 'app-consolidacao',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatChipsModule,
    MatTableModule
  ],
  template: `
    <div class="consolidacao-container">
      <mat-card class="consolidacao-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon class="card-icon">analytics</mat-icon>
            Consolidação Diária
          </mat-card-title>
          <mat-card-subtitle>Visualize e gerencie as consolidações realizadas</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <!-- Ações de Consolidação -->
          <div class="actions-section">
            <div class="section-header">
              <h3>
                <mat-icon>play_circle_filled</mat-icon>
                Ações
              </h3>
            </div>
            
            <div class="action-buttons">
              <button 
                mat-raised-button 
                color="primary"
                (click)="iniciarConsolidacao()"
                [disabled]="processando"
                class="action-button">
                <mat-icon>analytics</mat-icon>
                <span *ngIf="!processando">Iniciar Consolidação</span>
                <span *ngIf="processando">Processando...</span>
                <mat-spinner *ngIf="processando" diameter="20" class="button-spinner"></mat-spinner>
              </button>
              
              <button 
                mat-stroked-button 
                color="accent"
                (click)="carregarDados()"
                [disabled]="processando"
                class="action-button">
                <mat-icon>refresh</mat-icon>
                Atualizar Dados
              </button>
            </div>
          </div>

          <mat-divider></mat-divider>

          <!-- Última Consolidação -->
          <div class="ultima-consolidacao-section" *ngIf="ultimaConsolidacao">
            <div class="section-header">
              <h3>
                <mat-icon>history</mat-icon>
                Última Consolidação
              </h3>
            </div>
            
            <div class="consolidacao-details">
              <div class="detail-item">
                <mat-icon class="detail-icon">event</mat-icon>
                <div class="detail-content">
                  <span class="detail-label">Data e Hora:</span>
                  <span class="detail-value">{{ formatarDataComHora(ultimaConsolidacao.dataConsolidacao) }}</span>
                </div>
              </div>

              <div class="detail-item">
                <mat-icon class="detail-icon saldo-positive">account_balance_wallet</mat-icon>
                <div class="detail-content">
                  <span class="detail-label">Saldo Total:</span>
                  <span class="detail-value saldo-total">{{ formatarValor(ultimaConsolidacao.saldoTotal) }}</span>
                </div>
              </div>

              <div class="detail-item">
                <mat-icon class="detail-icon">timer</mat-icon>
                <div class="detail-content">
                  <span class="detail-label">Tempo de Processamento:</span>
                  <span class="detail-value">{{ formatarTempo(ultimaConsolidacao.tempoProcessamento) }}</span>
                </div>
              </div>

              <div class="detail-item">
                <mat-icon class="detail-icon">format_list_numbered</mat-icon>
                <div class="detail-content">
                  <span class="detail-label">Lançamentos Processados:</span>
                  <span class="detail-value">{{ ultimaConsolidacao.quantidadeLancamentos }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Mensagem quando não há consolidação -->
          <div class="no-consolidacao-section" *ngIf="!ultimaConsolidacao">
            <div class="section-header">
              <h3>
                <mat-icon>history</mat-icon>
                Última Consolidação
              </h3>
            </div>
            
            <div class="no-data">
              <mat-icon>info</mat-icon>
              <p>Nenhuma consolidação realizada ainda</p>
              <p class="no-data-subtitle">Execute sua primeira consolidação para visualizar os dados</p>
            </div>
          </div>

          <mat-divider *ngIf="ultimaConsolidacao"></mat-divider>

          <!-- Listagem de Consolidações -->
          <div class="consolidacoes-list-section">
            <h3>
              <mat-icon>list</mat-icon>
              Histórico de Saldo
            </h3>

            <div class="table-container" *ngIf="consolidacoes.length > 0; else noConsolidacoes">
              <table mat-table [dataSource]="consolidacoes" class="consolidacoes-table">
                <ng-container matColumnDef="data">
                  <th mat-header-cell *matHeaderCellDef>Data</th>
                  <td mat-cell *matCellDef="let consolidacao">
                    {{ formatarDataSimples(consolidacao.dataConsolidacao) }}
                  </td>
                </ng-container>

                <ng-container matColumnDef="saldo">
                  <th mat-header-cell *matHeaderCellDef>Saldo do Dia</th>
                  <td mat-cell *matCellDef="let consolidacao">
                    <span [class]="consolidacao.saldoTotal >= 0 ? 'saldo-positive' : 'saldo-negative'">
                      {{ formatarValor(consolidacao.saldoTotal) }}
                    </span>
                  </td>
                </ng-container>

                <ng-container matColumnDef="lancamentos">
                  <th mat-header-cell *matHeaderCellDef>Lançamentos</th>
                  <td mat-cell *matCellDef="let consolidacao">
                    {{ consolidacao.quantidadeLancamentos }}
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                    [class.row-highlight]="row.id === ultimaConsolidacao?.id"></tr>
              </table>
            </div>

            <ng-template #noConsolidacoes>
              <div class="no-data">
                <mat-icon>inbox</mat-icon>
                <p>Nenhuma consolidação encontrada</p>
                <p class="no-data-subtitle">Execute consolidações para visualizar o histórico</p>
              </div>
            </ng-template>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .consolidacao-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 24px;
    }

    .consolidacao-card {
      margin-bottom: 24px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .card-icon {
      margin-right: 12px;
      color: #1976d2;
      vertical-align: middle;
    }

    /* Seção de Ações */
    .actions-section {
      margin-bottom: 32px;
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .section-header h3 {
      display: flex;
      align-items: center;
      margin: 0;
      color: #333;
      font-size: 18px;
      font-weight: 600;
    }

    .section-header h3 mat-icon {
      margin-right: 12px;
      color: #1976d2;
    }

    .action-buttons {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .action-button {
      min-width: 180px;
      height: 48px;
      font-size: 14px;
      font-weight: 500;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .button-spinner {
      margin-left: 8px;
    }

    /* Seção Última Consolidação */
    .ultima-consolidacao-section,
    .no-consolidacao-section {
      margin-bottom: 32px;
    }

    .consolidacao-details {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border-radius: 12px;
      padding: 24px;
      border-left: 4px solid #1976d2;
    }

    .detail-item {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      padding: 12px 0;
      border-bottom: 1px solid rgba(0,0,0,0.05);
    }

    .detail-item:last-child {
      margin-bottom: 0;
      border-bottom: none;
    }

    .detail-icon {
      margin-right: 16px;
      color: #666;
      min-width: 24px;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .detail-icon.saldo-positive {
      color: #4caf50;
    }

    .detail-content {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .detail-label {
      font-weight: 500;
      color: #555;
      font-size: 14px;
    }

    .detail-value {
      font-weight: 600;
      color: #333;
      font-size: 14px;
    }

    .saldo-total {
      color: #1976d2 !important;
      font-size: 18px;
      font-weight: 700;
    }

    /* Seção de Histórico */
    .consolidacoes-list-section {
      margin-top: 32px;
    }

    .consolidacoes-list-section h3 {
      display: flex;
      align-items: center;
      margin: 0 0 20px 0;
      color: #333;
      font-size: 18px;
      font-weight: 600;
    }

    .consolidacoes-list-section h3 mat-icon {
      margin-right: 12px;
      color: #1976d2;
    }

    .table-container {
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .consolidacoes-table {
      width: 100%;
      background: white;
    }

    .consolidacoes-table th {
      background: #f5f5f5;
      font-weight: 600;
      color: #333;
      padding: 16px;
      border-bottom: 2px solid #e0e0e0;
    }

    .consolidacoes-table td {
      padding: 16px;
      border-bottom: 1px solid #f0f0f0;
    }

    .consolidacoes-table tr:hover {
      background: #f8f9fa;
    }

    .row-highlight {
      background: rgba(25, 118, 210, 0.08) !important;
    }

    .saldo-positive {
      color: #4caf50;
      font-weight: 600;
    }

    .saldo-negative {
      color: #f44336;
      font-weight: 600;
    }

    .chip-info {
      background: rgba(25, 118, 210, 0.1);
      color: #1976d2;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .chip-info mat-icon {
      color: #1976d2;
      font-size: 18px;
      width: 18px;
      height: 18px;
      line-height: 18px;
    }

    /* Estados vazios */
    .no-data {
      text-align: center;
      padding: 48px 24px;
      color: #666;
    }

    .no-data mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #ccc;
      margin-bottom: 16px;
    }

    .no-data p {
      margin: 8px 0;
      font-size: 16px;
    }

    .no-data-subtitle {
      font-size: 14px;
      color: #999;
    }

    /* Responsividade */
    @media (max-width: 768px) {
      .consolidacao-container {
        padding: 16px;
      }

      .action-buttons {
        flex-direction: column;
        align-items: stretch;
      }

      .action-button {
        min-width: 100%;
      }

      .detail-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
      }

      .consolidacoes-table th,
      .consolidacoes-table td {
        padding: 12px 8px;
        font-size: 12px;
      }
    }
  `]
})
export class ConsolidacaoComponent implements OnInit {
  processando = false;
  ultimaConsolidacao?: UltimaConsolidacao;
  consolidacoes: UltimaConsolidacao[] = [];
  displayedColumns = ['data', 'saldo', 'lancamentos']; // Removida coluna 'tempo'

  constructor(
    private consolidacaoService: ConsolidacaoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    this.carregarUltimaConsolidacao();
    this.carregarHistoricoConsolidacoes();
  }

  carregarHistoricoConsolidacoes() {
    this.consolidacaoService.listarConsolidacoesPorData().subscribe({
      next: (consolidacoes) => {
        this.consolidacoes = consolidacoes.map(item => ({
          id: 0, // Não há ID específico para agrupamento por data
          dataConsolidacao: item.dataLancamento,
          saldoTotal: item.saldoTotal,
          quantidadeLancamentos: item.quantidadeLancamentos,
          tempoProcessamento: item.tempoProcessamento
        })).sort((a, b) => {
          // Ordenar por data decrescente (mais recente primeiro)
          const dataA = new Date(a.dataConsolidacao);
          const dataB = new Date(b.dataConsolidacao);
          return dataB.getTime() - dataA.getTime();
        });
      },
      error: (error) => {
        console.error('Erro ao carregar histórico de consolidações por data:', error);
        this.consolidacoes = [];
      }
    });
  }

  iniciarConsolidacao() {
    this.processando = true;

    const request = {
      dataConsolidacao: new Date().toISOString()
    };

    this.consolidacaoService.iniciarConsolidacao(request).subscribe({
      next: (response) => {
        this.showSuccessMessage(response.message || 'Consolidação realizada com sucesso!');
        this.processando = false;
        // Recarregar dados após consolidação
        this.carregarDados();
      },
      error: (error) => {
        this.showErrorMessage(error.error?.error || 'Erro ao processar consolidação');
        this.processando = false;
      }
    });
  }

  carregarUltimaConsolidacao() {
    this.consolidacaoService.obterUltimaConsolidacao().subscribe({
      next: (consolidacao) => {
        this.ultimaConsolidacao = consolidacao;
      },
      error: (error) => {
        if (error.status === 404) {
          // Não há consolidação ainda - isso é normal no início
          this.ultimaConsolidacao = undefined;
          console.info('Nenhuma consolidação encontrada - sistema novo ou sem consolidações');
        } else {
          console.error('Erro ao carregar última consolidação:', error);
          this.showErrorMessage('Erro ao carregar última consolidação');
        }
      }
    });
  }

  parseData(dataArray: any): Date {
    if (!dataArray) {
      return new Date();
    }
    
    if (typeof dataArray === 'string') {
      return new Date(dataArray);
    }
    
    if (Array.isArray(dataArray) && dataArray.length >= 3) {
      const [year, month, day, hour = 0, minute = 0, second = 0] = dataArray;
      return new Date(year, month - 1, day, hour, minute, second);
    }
    
    return new Date();
  }

  formatarDataSimples(dataArray: any): string {
    // Se já é uma string de data (formato YYYY-MM-DD), formatar diretamente
    if (typeof dataArray === 'string') {
      try {
        const date = new Date(dataArray);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('pt-BR');
        }
      } catch {
        return dataArray; // Retorna a string original se não conseguir converter
      }
    }
    
    // Caso contrário, usar o método parseData existente
    const date = this.parseData(dataArray);
    return date.toLocaleDateString('pt-BR');
  }

  formatarDataComHora(dataArray: any): string {
    // Se já é uma string de data, formatar com hora
    if (typeof dataArray === 'string') {
      try {
        const date = new Date(dataArray);
        if (!isNaN(date.getTime())) {
          const dataFormatada = date.toLocaleDateString('pt-BR');
          const horaFormatada = date.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
          });
          return `${dataFormatada} ${horaFormatada}`;
        }
      } catch {
        return dataArray;
      }
    }
    
    // Caso contrário, usar o método parseData existente
    const date = this.parseData(dataArray);
    const dataFormatada = date.toLocaleDateString('pt-BR');
    const horaFormatada = date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
    return `${dataFormatada} ${horaFormatada}`;
  }

  formatarValor(valor: number): string {
    if (valor === null || valor === undefined) return 'R$ 0,00';
    const sinal = valor < 0 ? '-' : '';
    const valorAbs = Math.abs(valor);
    return `${sinal}R$ ${valorAbs.toFixed(2).replace('.', ',')}`;
  }

  formatarTempo(tempoMs: number): string {
    if (!tempoMs || tempoMs < 0) return '-';
    
    const segundos = Math.floor(tempoMs / 1000);
    const ms = tempoMs % 1000;
    
    if (segundos === 0) {
      return `${ms}ms`;
    } else if (segundos < 60) {
      return `${segundos}s ${ms}ms`;
    } else {
      const minutos = Math.floor(segundos / 60);
      const segundosRestantes = segundos % 60;
      return `${minutos}m ${segundosRestantes}s`;
    }
  }

  private showSuccessMessage(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      panelClass: ['success-snackbar']
    });
  }

  private showErrorMessage(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}
