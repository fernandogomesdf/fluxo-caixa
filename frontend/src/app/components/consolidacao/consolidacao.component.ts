import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
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
    MatChipsModule
  ],
  template: `
    <div class="consolidacao-container">
      <mat-card class="consolidacao-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon class="card-icon">analytics</mat-icon>
            Consolidação Diária
          </mat-card-title>
          <mat-card-subtitle>Processe e consolide os lançamentos do dia</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <!-- Seção de Ação -->
          <div class="action-section">
            <div class="consolidacao-info">
              <p>A consolidação irá processar todos os lançamentos e calcular o saldo total do dia.</p>
              <mat-chip-set>
                <mat-chip>
                  <mat-icon>refresh</mat-icon>
                  Consolidação completa (não incremental)
                </mat-chip>
                <mat-chip>
                  <mat-icon>schedule</mat-icon>
                  Processamento via Kafka
                </mat-chip>
              </mat-chip-set>
            </div>

            <div class="consolidacao-actions">
              <button 
                mat-raised-button 
                color="primary" 
                (click)="iniciarConsolidacao()"
                [disabled]="processando"
                class="consolidacao-button">
                <mat-icon *ngIf="!processando">play_arrow</mat-icon>
                <mat-spinner *ngIf="processando" diameter="20"></mat-spinner>
                {{ processando ? 'Processando...' : 'Iniciar Consolidação' }}
              </button>

              <button 
                mat-stroked-button 
                color="primary"
                (click)="carregarUltimaConsolidacao()"
                [disabled]="processando"
                class="refresh-button">
                <mat-icon>refresh</mat-icon>
                Atualizar
              </button>
            </div>
          </div>

          <mat-divider></mat-divider>

          <!-- Última Consolidação -->
          <div class="ultima-consolidacao-section" *ngIf="ultimaConsolidacao">
            <h3>
              <mat-icon>history</mat-icon>
              Última Consolidação
            </h3>
            
            <div class="consolidacao-details">
              <div class="detail-item">
                <mat-icon class="detail-icon">event</mat-icon>
                <div class="detail-content">
                  <span class="detail-label">Data e Hora:</span>
                  <span class="detail-value">{{ formatarData(ultimaConsolidacao.dataConsolidacao) }}</span>
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

          <!-- Processamento Atual -->
          <div class="processamento-atual" *ngIf="consolidacaoAtual">
            <h3>
              <mat-icon>trending_up</mat-icon>
              Consolidação Concluída
            </h3>
            
            <div class="consolidacao-details success">
              <div class="detail-item">
                <mat-icon class="detail-icon">schedule</mat-icon>
                <div class="detail-content">
                  <span class="detail-label">Início:</span>
                  <span class="detail-value">{{ formatarData(consolidacaoAtual.inicioProcessamento) }}</span>
                </div>
              </div>

              <div class="detail-item">
                <mat-icon class="detail-icon">done</mat-icon>
                <div class="detail-content">
                  <span class="detail-label">Término:</span>
                  <span class="detail-value">{{ formatarData(consolidacaoAtual.fimProcessamento) }}</span>
                </div>
              </div>

              <div class="detail-item">
                <mat-icon class="detail-icon">account_balance_wallet</mat-icon>
                <div class="detail-content">
                  <span class="detail-label">Novo Saldo Total:</span>
                  <span class="detail-value saldo-total">{{ formatarValor(consolidacaoAtual.saldoTotal) }}</span>
                </div>
              </div>

              <div class="detail-item">
                <mat-icon class="detail-icon">timer</mat-icon>
                <div class="detail-content">
                  <span class="detail-label">Tempo Total:</span>
                  <span class="detail-value">{{ formatarTempo(consolidacaoAtual.tempoProcessamento) }}</span>
                </div>
              </div>

              <div class="detail-item">
                <mat-icon class="detail-icon">format_list_numbered</mat-icon>
                <div class="detail-content">
                  <span class="detail-label">Lançamentos:</span>
                  <span class="detail-value">{{ consolidacaoAtual.quantidadeLancamentos }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Estado Vazio -->
          <div class="no-consolidacao" *ngIf="!ultimaConsolidacao && !consolidacaoAtual && !processando">
            <mat-icon>info</mat-icon>
            <p>Nenhuma consolidação foi realizada ainda</p>
            <p class="no-consolidacao-subtitle">Clique em "Iniciar Consolidação" para processar os lançamentos</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .consolidacao-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .consolidacao-card {
      margin-bottom: 20px;
    }

    .card-icon {
      margin-right: 8px;
      color: #1976d2;
      vertical-align: middle;
    }

    .action-section {
      margin-bottom: 24px;
    }

    .consolidacao-info {
      margin-bottom: 16px;
    }

    .consolidacao-info p {
      margin-bottom: 12px;
      color: #666;
    }

    .consolidacao-info mat-chip {
      margin: 4px;
    }

    .consolidacao-info mat-chip mat-icon {
      margin-right: 8px;
      vertical-align: middle;
    }

    .consolidacao-actions {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .consolidacao-button {
      min-width: 200px;
      height: 48px;
      font-size: 16px;
    }

    .refresh-button {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-width: 140px;
      height: 48px;
      font-size: 16px;
    }

    .ultima-consolidacao-section,
    .processamento-atual {
      margin-top: 24px;
    }

    .ultima-consolidacao-section h3,
    .processamento-atual h3 {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      color: #333;
    }

    .ultima-consolidacao-section h3 mat-icon,
    .processamento-atual h3 mat-icon {
      margin-right: 8px;
      color: #1976d2;
    }

    .consolidacao-details {
      background: #f5f5f5;
      border-radius: 8px;
      padding: 16px;
    }

    .consolidacao-details.success {
      background: #e8f5e8;
      border-left: 4px solid #4caf50;
    }

    .detail-item {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      padding: 8px 0;
    }

    .detail-item:last-child {
      margin-bottom: 0;
    }

    .detail-icon {
      margin-right: 12px;
      color: #666;
      min-width: 24px;
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
      color: #333;
    }

    .detail-value {
      font-weight: 600;
      color: #666;
    }

    .saldo-total {
      color: #1976d2 !important;
      font-size: 18px;
    }

    .no-consolidacao {
      text-align: center;
      padding: 48px 24px;
      color: #666;
    }

    .no-consolidacao mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #ccc;
      margin-bottom: 16px;
    }

    .no-consolidacao p {
      margin: 8px 0;
    }

    .no-consolidacao-subtitle {
      font-size: 14px;
      color: #999;
    }

    @media (max-width: 768px) {
      .consolidacao-container {
        padding: 10px;
      }

      .consolidacao-actions {
        flex-direction: column;
        align-items: stretch;
      }

      .consolidacao-button {
        min-width: 100%;
      }

      .detail-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
      }
    }
  `]
})
export class ConsolidacaoComponent implements OnInit {
  processando = false;
  ultimaConsolidacao?: UltimaConsolidacao;
  consolidacaoAtual?: ConsolidacaoResponse;

  constructor(
    private consolidacaoService: ConsolidacaoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.carregarUltimaConsolidacao();
  }

  iniciarConsolidacao() {
    this.processando = true;
    this.consolidacaoAtual = undefined;

    const request = {
      dataConsolidacao: new Date().toISOString()
    };

    this.consolidacaoService.iniciarConsolidacao(request).subscribe({
      next: (response) => {
        this.consolidacaoAtual = response;
        this.ultimaConsolidacao = {
          id: response.id,
          dataConsolidacao: response.dataConsolidacao,
          saldoTotal: response.saldoTotal,
          tempoProcessamento: response.tempoProcessamento,
          quantidadeLancamentos: response.quantidadeLancamentos
        };
        this.showSuccessMessage(response.message || 'Consolidação realizada com sucesso!');
        this.processando = false;
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
        // Não mostrar erro se não houver consolidação ainda
        if (error.status !== 404) {
          this.showErrorMessage('Erro ao carregar última consolidação');
        }
      }
    });
  }

  formatarData(dataArray: any): string {
    if (!dataArray) {
      return '-';
    }
    
    if (typeof dataArray === 'string') {
      try {
        const date = new Date(dataArray);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('pt-BR') + ' ' + 
                 date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        }
      } catch {
        return '-';
      }
    }
    
    if (Array.isArray(dataArray) && dataArray.length >= 6) {
      try {
        const [year, month, day, hour = 0, minute = 0, second = 0] = dataArray;
        
        if (!year || !month || !day) {
          return '-';
        }
        
        const date = new Date(year, month - 1, day, hour, minute, second);
        
        if (isNaN(date.getTime())) {
          return '-';
        }
        
        try {
          const dataFormatada = date.toLocaleDateString('pt-BR');
          const horaFormatada = date.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
          });
          
          return `${dataFormatada} ${horaFormatada}`;
        } catch {
          return date.toISOString().split('T')[0];
        }
      } catch (error) {
        console.warn('Erro ao formatar data array:', error, dataArray);
        return '-';
      }
    }
    
    return '-';
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
