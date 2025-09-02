import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LancamentoService } from '../../services/lancamento.service';
import { Lancamento, LancamentoDTO, SimulacaoLancamentosDTO, TipoLancamento } from '../../models/lancamento.model';
import { ConsolidacaoComponent } from '../consolidacao/consolidacao.component';

@Component({
  selector: 'app-lancamento-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTableModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    ConsolidacaoComponent
  ],
  template: `
    <div class="container">
      <mat-tab-group>
        
        <!-- Aba de Lançamento Manual -->
        <mat-tab label="Novo Lançamento">
          <div class="tab-content">
            <mat-card class="form-card">
              <mat-card-header>
                <mat-card-title>
                  <mat-icon class="card-icon">add_circle</mat-icon>
                  Novo Lançamento
                </mat-card-title>
                <mat-card-subtitle>Registre um novo débito ou crédito</mat-card-subtitle>
              </mat-card-header>
              
              <mat-card-content>
                <form [formGroup]="lancamentoForm" (ngSubmit)="onSubmitLancamento()" class="form-container">
                  <div class="form-row">
                    <mat-form-field appearance="fill" class="form-field">
                      <mat-label>Descrição</mat-label>
                      <input matInput formControlName="descricao" placeholder="Ex: Venda de produto">
                      <mat-icon matSuffix>description</mat-icon>
                      <mat-error *ngIf="lancamentoForm.get('descricao')?.hasError('required')">
                        Descrição é obrigatória
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="fill" class="form-field-half">
                      <mat-label>Valor (R$)</mat-label>
                      <input matInput type="number" step="0.01" formControlName="valor" placeholder="0,00">
                      <mat-icon matSuffix>attach_money</mat-icon>
                      <mat-error *ngIf="lancamentoForm.get('valor')?.hasError('required')">
                        Valor é obrigatório
                      </mat-error>
                      <mat-error *ngIf="lancamentoForm.get('valor')?.hasError('min')">
                        Valor deve ser maior que zero
                      </mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="fill" class="form-field-half">
                      <mat-label>Tipo</mat-label>
                      <mat-select formControlName="tipo">
                        <mat-option value="CREDITO">
                          <mat-icon class="option-icon credit">trending_up</mat-icon>
                          Crédito
                        </mat-option>
                        <mat-option value="DEBITO">
                          <mat-icon class="option-icon debit">trending_down</mat-icon>
                          Débito
                        </mat-option>
                      </mat-select>
                      <mat-error *ngIf="lancamentoForm.get('tipo')?.hasError('required')">
                        Tipo é obrigatório
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-actions">
                    <button mat-raised-button color="primary" type="submit" 
                            [disabled]="lancamentoForm.invalid || loading" class="submit-button">
                      <mat-icon *ngIf="!loading">save</mat-icon>
                      <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
                      {{ loading ? 'Processando...' : 'Adicionar Lançamento' }}
                    </button>
                  </div>
                </form>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- Aba de Simulação -->
        <mat-tab label="Simular Lançamentos">
          <div class="tab-content">
            <mat-card class="form-card">
              <mat-card-header>
                <mat-card-title>
                  <mat-icon class="card-icon">psychology</mat-icon>
                  Simulação de Lançamentos
                </mat-card-title>
                <mat-card-subtitle>Gere múltiplos lançamentos automaticamente</mat-card-subtitle>
              </mat-card-header>
              
              <mat-card-content>
                <form [formGroup]="simulacaoForm" (ngSubmit)="onSubmitSimulacao()" class="form-container">
                  <div class="form-row">
                    <mat-form-field appearance="fill" class="form-field-half">
                      <mat-label>Quantidade</mat-label>
                      <input matInput type="number" formControlName="quantidade" placeholder="10">
                      <mat-icon matSuffix>format_list_numbered</mat-icon>
                      <mat-error *ngIf="simulacaoForm.get('quantidade')?.hasError('required')">
                        Quantidade é obrigatória
                      </mat-error>
                      <mat-error *ngIf="simulacaoForm.get('quantidade')?.hasError('min')">
                        Quantidade deve ser maior que zero
                      </mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="fill" class="form-field-half">
                      <mat-label>Tipo</mat-label>
                      <mat-select formControlName="tipo">
                        <mat-option value="CREDITO">
                          <mat-icon class="option-icon credit">trending_up</mat-icon>
                          Crédito
                        </mat-option>
                        <mat-option value="DEBITO">
                          <mat-icon class="option-icon debit">trending_down</mat-icon>
                          Débito
                        </mat-option>
                      </mat-select>
                      <mat-error *ngIf="simulacaoForm.get('tipo')?.hasError('required')">
                        Tipo é obrigatório
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="fill" class="form-field-half">
                      <mat-label>Valor Mínimo (R$)</mat-label>
                      <input matInput type="number" step="0.01" formControlName="valorMinimo" placeholder="10,00">
                      <mat-icon matSuffix>remove</mat-icon>
                      <mat-error *ngIf="simulacaoForm.get('valorMinimo')?.hasError('required')">
                        Valor mínimo é obrigatório
                      </mat-error>
                      <mat-error *ngIf="simulacaoForm.get('valorMinimo')?.hasError('min')">
                        Valor deve ser maior que zero
                      </mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="fill" class="form-field-half">
                      <mat-label>Valor Máximo (R$)</mat-label>
                      <input matInput type="number" step="0.01" formControlName="valorMaximo" placeholder="1000,00">
                      <mat-icon matSuffix>add</mat-icon>
                      <mat-error *ngIf="simulacaoForm.get('valorMaximo')?.hasError('required')">
                        Valor máximo é obrigatório
                      </mat-error>
                      <mat-error *ngIf="simulacaoForm.get('valorMaximo')?.hasError('min')">
                        Valor deve ser maior que zero
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="simulation-info">
                    <mat-chip-set>
                      <mat-chip>
                        <mat-icon>info</mat-icon>
                        Datas aleatórias no mês atual
                      </mat-chip>
                      <mat-chip>
                        <mat-icon>shuffle</mat-icon>
                        Valores entre min e max
                      </mat-chip>
                    </mat-chip-set>
                  </div>

                  <div class="form-actions">
                    <button mat-raised-button color="accent" type="submit" 
                            [disabled]="simulacaoForm.invalid || loading" class="submit-button">
                      <mat-icon *ngIf="!loading">play_arrow</mat-icon>
                      <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
                      {{ loading ? 'Processando...' : 'Iniciar Simulação' }}
                    </button>
                  </div>
                </form>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- Aba de Visualização -->
        <mat-tab label="Lançamentos">
          <div class="tab-content">
            <mat-card class="list-card">
              <mat-card-header>
                <mat-card-title>
                  <mat-icon class="card-icon">list</mat-icon>
                  Lançamentos Recentes
                </mat-card-title>
                <mat-card-subtitle>Últimos lançamentos processados</mat-card-subtitle>
              </mat-card-header>
              
              <mat-card-content>
                <div class="table-actions">
                  <button mat-stroked-button color="primary" (click)="carregarLancamentos()">
                    <mat-icon>refresh</mat-icon>
                    Atualizar
                  </button>
                </div>

                <div class="table-container" *ngIf="lancamentos.length > 0; else noData">
                  <table mat-table [dataSource]="lancamentos" class="lancamentos-table">
                    <ng-container matColumnDef="descricao">
                      <th mat-header-cell *matHeaderCellDef>Descrição</th>
                      <td mat-cell *matCellDef="let lancamento">{{ lancamento.descricao }}</td>
                    </ng-container>

                    <ng-container matColumnDef="valor">
                      <th mat-header-cell *matHeaderCellDef>Valor</th>
                      <td mat-cell *matCellDef="let lancamento">
                        <span [class]="'valor-' + lancamento.tipo.toLowerCase()">
                          {{ formatarValor(lancamento.valor, lancamento.tipo) }}
                        </span>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="tipo">
                      <th mat-header-cell *matHeaderCellDef>Tipo</th>
                      <td mat-cell *matCellDef="let lancamento">
                        <mat-chip [class]="'chip-' + lancamento.tipo.toLowerCase()">
                          <mat-icon>{{ lancamento.tipo === 'CREDITO' ? 'trending_up' : 'trending_down' }}</mat-icon>
                          {{ lancamento.tipo === 'CREDITO' ? 'Crédito' : 'Débito' }}
                        </mat-chip>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="dataLancamento">
                      <th mat-header-cell *matHeaderCellDef>Data</th>
                      <td mat-cell *matCellDef="let lancamento">
                        {{ formatarData(lancamento.dataLancamento) }}
                      </td>
                    </ng-container>

                    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
                  </table>
                </div>

                <ng-template #noData>
                  <div class="no-data">
                    <mat-icon>inbox</mat-icon>
                    <p>Nenhum lançamento encontrado</p>
                    <p class="no-data-subtitle">Adicione novos lançamentos usando as abas acima</p>
                  </div>
                </ng-template>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- Aba de Consolidação -->
        <mat-tab label="Consolidação">
          <div class="tab-content">
            <app-consolidacao></app-consolidacao>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .tab-content {
      padding: 20px 0;
    }

    .form-card, .list-card {
      margin-bottom: 20px;
    }

    .card-icon {
      margin-right: 8px;
      color: #1976d2;
      vertical-align: middle;
    }

    .form-container {
      margin-top: 16px;
    }

    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }

    .form-field {
      flex: 1;
      min-width: 300px;
    }

    .form-field-half {
      flex: 1;
      min-width: 200px;
    }

    .form-actions {
      margin-top: 24px;
      text-align: center;
    }

    .submit-button {
      min-width: 200px;
      height: 48px;
      font-size: 16px;
    }

    .option-icon {
      margin-right: 8px;
      vertical-align: middle;
    }

    .option-icon.credit {
      color: #4caf50;
    }

    .option-icon.debit {
      color: #f44336;
    }

    .simulation-info {
      margin: 16px 0;
      text-align: center;
    }

    .simulation-info mat-chip {
      margin: 4px;
    }

    .simulation-info mat-chip mat-icon {
      margin-right: 8px;
      vertical-align: middle;
    }

    .table-actions {
      margin-bottom: 16px;
      text-align: right;
    }

    .table-actions button {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-width: 140px;
      height: 48px;
      font-size: 16px;
    }

    .lancamentos-table {
      width: 100%;
    }

    .valor-credito {
      color: #4caf50;
      font-weight: 600;
    }

    .valor-debito {
      color: #f44336;
      font-weight: 600;
    }

    .chip-credito {
      background-color: #e8f5e8;
      color: #2e7d32;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 4px 8px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
      min-height: 24px;
    }

    .chip-debito {
      background-color: #ffebee;
      color: #c62828;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 4px 8px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
      min-height: 24px;
    }

    .chip-credito mat-icon,
    .chip-debito mat-icon {
      margin-right: 4px;
      font-size: 14px;
      width: 14px;
      height: 14px;
      line-height: 1;
      vertical-align: middle;
    }

    .no-data {
      text-align: center;
      padding: 48px 24px;
      color: #666;
    }

    .no-data mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #ccc;
      margin-bottom: 16px;
    }

    .no-data p {
      margin: 8px 0;
    }

    .no-data-subtitle {
      font-size: 14px;
      color: #999;
    }

    @media (max-width: 768px) {
      .form-row {
        flex-direction: column;
      }
      
      .container {
        padding: 10px;
      }

      .submit-button {
        min-width: 100%;
      }
    }
  `]
})
export class LancamentoFormComponent implements OnInit {
  lancamentoForm: FormGroup;
  simulacaoForm: FormGroup;
  loading = false;
  lancamentos: Lancamento[] = [];
  displayedColumns: string[] = ['descricao', 'valor', 'tipo', 'dataLancamento'];

  constructor(
    private fb: FormBuilder,
    private lancamentoService: LancamentoService,
    private snackBar: MatSnackBar
  ) {
    this.lancamentoForm = this.fb.group({
      descricao: ['', [Validators.required]],
      valor: ['', [Validators.required, Validators.min(0.01)]],
      tipo: ['', [Validators.required]]
    });

    this.simulacaoForm = this.fb.group({
      quantidade: ['', [Validators.required, Validators.min(1)]],
      valorMinimo: ['', [Validators.required, Validators.min(0.01)]],
      valorMaximo: ['', [Validators.required, Validators.min(0.01)]],
      tipo: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.carregarLancamentos();
  }

  onSubmitLancamento() {
    if (this.lancamentoForm.valid) {
      this.loading = true;
      const lancamento: LancamentoDTO = this.lancamentoForm.value;
      
      this.lancamentoService.criarLancamento(lancamento).subscribe({
        next: (response) => {
          this.showSuccessMessage(response.message);
          this.resetLancamentoForm();
          this.carregarLancamentos();
          this.loading = false;
        },
        error: (error) => {
          this.showErrorMessage(error.error?.error || 'Erro ao criar lançamento');
          this.loading = false;
        }
      });
    }
  }

  onSubmitSimulacao() {
    if (this.simulacaoForm.valid) {
      const simulacao: SimulacaoLancamentosDTO = this.simulacaoForm.value;
      
      // Validar se valor mínimo não é maior que o máximo
      if (simulacao.valorMinimo > simulacao.valorMaximo) {
        this.showErrorMessage('Valor mínimo não pode ser maior que o valor máximo');
        return;
      }

      this.loading = true;
      
      this.lancamentoService.simularLancamentos(simulacao).subscribe({
        next: (response) => {
          this.showSuccessMessage(response.message);
          this.resetSimulacaoForm();
          this.loading = false;
          // Aguardar um pouco antes de recarregar para dar tempo do processamento
          setTimeout(() => this.carregarLancamentos(), 2000);
        },
        error: (error) => {
          this.showErrorMessage(error.error?.error || 'Erro ao processar simulação');
          this.loading = false;
        }
      });
    }
  }

  carregarLancamentos() {
    this.lancamentoService.listarLancamentos().subscribe({
      next: (lancamentos) => {
        this.lancamentos = lancamentos.sort((a, b) => {
          // Converter array de data para timestamp
          const dateA = this.arrayToTimestamp(a.dataLancamento);
          const dateB = this.arrayToTimestamp(b.dataLancamento);
          return dateB - dateA; // Ordem decrescente (mais recente primeiro)
        });
      },
      error: (error) => {
        this.showErrorMessage('Erro ao carregar lançamentos');
      }
    });
  }

  private resetLancamentoForm() {
    // Reset completo do formulário
    this.lancamentoForm.reset();
    
    // Resetar com valores específicos para evitar undefined
    this.lancamentoForm.patchValue({
      descricao: '',
      valor: '',
      tipo: ''
    });
    
    // Limpar todos os estados de erro e validação
    Object.keys(this.lancamentoForm.controls).forEach(key => {
      const control = this.lancamentoForm.get(key);
      if (control) {
        control.setErrors(null);
        control.markAsUntouched();
        control.markAsPristine();
        control.updateValueAndValidity({ emitEvent: false });
      }
    });
    
    // Marcar formulário como pristine e untouched
    this.lancamentoForm.markAsUntouched();
    this.lancamentoForm.markAsPristine();
    
    // Forçar atualização da interface após um pequeno delay
    setTimeout(() => {
      this.lancamentoForm.updateValueAndValidity({ emitEvent: false });
      
      // Segundo reset para garantir que Material Design limpe completamente
      Object.keys(this.lancamentoForm.controls).forEach(key => {
        const control = this.lancamentoForm.get(key);
        if (control) {
          control.markAsUntouched();
          control.markAsPristine();
        }
      });
    }, 150);
  }

  private resetSimulacaoForm() {
    // Reset completo do formulário
    this.simulacaoForm.reset();
    
    // Resetar com valores específicos para evitar undefined
    this.simulacaoForm.patchValue({
      quantidade: '',
      valorMinimo: '',
      valorMaximo: '',
      tipo: ''
    });
    
    // Limpar todos os estados de erro e validação
    Object.keys(this.simulacaoForm.controls).forEach(key => {
      const control = this.simulacaoForm.get(key);
      if (control) {
        control.setErrors(null);
        control.markAsUntouched();
        control.markAsPristine();
        control.updateValueAndValidity({ emitEvent: false });
      }
    });
    
    // Marcar formulário como pristine e untouched
    this.simulacaoForm.markAsUntouched();
    this.simulacaoForm.markAsPristine();
    
    // Forçar atualização da interface após um pequeno delay
    setTimeout(() => {
      this.simulacaoForm.updateValueAndValidity({ emitEvent: false });
      
      // Segundo reset para garantir que Material Design limpe completamente
      Object.keys(this.simulacaoForm.controls).forEach(key => {
        const control = this.simulacaoForm.get(key);
        if (control) {
          control.markAsUntouched();
          control.markAsPristine();
        }
      });
    }, 150);
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

  formatarData(dataArray: any): string {
    // Proteção robusta contra valores inválidos
    if (!dataArray) {
      return '-';
    }
    
    // Se for string, tentar converter
    if (typeof dataArray === 'string') {
      try {
        const date = new Date(dataArray);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('pt-BR') + ' ' + 
                 date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        }
      } catch {
        return '-';
      }
    }
    
    // Se for array do Java LocalDateTime
    if (Array.isArray(dataArray) && dataArray.length >= 6) {
      try {
        const [year, month, day, hour = 0, minute = 0, second = 0] = dataArray;
        
        // Validar componentes básicos
        if (!year || !month || !day) {
          return '-';
        }
        
        const date = new Date(year, month - 1, day, hour, minute, second);
        
        // Verificar se a data é válida
        if (isNaN(date.getTime())) {
          return '-';
        }
        
        // Formatar com proteção adicional
        try {
          const dataFormatada = date.toLocaleDateString('pt-BR');
          const horaFormatada = date.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          });
          
          return `${dataFormatada} ${horaFormatada}`;
        } catch {
          return date.toISOString().split('T')[0]; // Fallback para YYYY-MM-DD
        }
      } catch (error) {
        console.warn('Erro ao formatar data array:', error, dataArray);
        return '-';
      }
    }
    
    return '-';
  }

  private arrayToTimestamp(dataArray: any): number {
    if (!dataArray) {
      return 0;
    }
    
    // Se for string, converter
    if (typeof dataArray === 'string') {
      try {
        return new Date(dataArray).getTime() || 0;
      } catch {
        return 0;
      }
    }
    
    // Se for array
    if (Array.isArray(dataArray) && dataArray.length >= 3) {
      try {
        const [year, month, day, hour = 0, minute = 0, second = 0] = dataArray;
        const date = new Date(year, month - 1, day, hour, minute, second);
        return date.getTime() || 0;
      } catch {
        return 0;
      }
    }
    
    return 0;
  }

  formatarValor(valor: number, tipo: string): string {
    if (valor === null || valor === undefined) return '';
    const sinal = tipo === 'DEBITO' ? '-' : '';
    // Formatação manual para evitar dependência de CurrencyPipe e erros de injeção
    return `${sinal}R$ ${valor.toFixed(2).replace('.', ',')}`;
  }
}
