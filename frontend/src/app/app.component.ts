import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LancamentoFormComponent } from './components/lancamento-form/lancamento-form.component';
import { ConsolidacaoComponent } from './components/consolidacao/consolidacao.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    LancamentoFormComponent,
    ConsolidacaoComponent,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule
  ],
  template: `
    <mat-toolbar color="primary" class="app-toolbar">
      <mat-icon class="toolbar-icon">account_balance</mat-icon>
      <span class="toolbar-title">Fluxo de Caixa</span>
      <span class="toolbar-spacer"></span>
      <button mat-icon-button>
        <mat-icon>settings</mat-icon>
      </button>
    </mat-toolbar>

    <div class="app-container">
      <mat-tab-group class="tab-group" animationDuration="300ms">
        <mat-tab label="Lançamentos" icon="receipt">
          <div class="tab-content">
            <app-lancamento-form></app-lancamento-form>
          </div>
        </mat-tab>
        
        <mat-tab label="Consolidação" icon="analytics">
          <div class="tab-content">
            <app-consolidacao></app-consolidacao>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .app-toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .toolbar-icon {
      margin-right: 12px;
    }

    .toolbar-title {
      font-size: 20px;
      font-weight: 500;
    }

    .toolbar-spacer {
      flex: 1 1 auto;
    }

    .app-container {
      margin-top: 64px;
      padding: 24px;
      min-height: calc(100vh - 64px);
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }

    .tab-group {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .tab-content {
      padding: 24px;
      min-height: 500px;
    }

    ::ng-deep .mat-mdc-tab-group {
      .mat-mdc-tab-header {
        background: #f8f9fa;
        border-bottom: 1px solid #e9ecef;
      }
      
      .mat-mdc-tab-labels {
        justify-content: center;
      }
      
      .mat-mdc-tab .mdc-tab__text-label {
        font-weight: 500;
      }
      
      .mat-mdc-tab-body-wrapper {
        background: white;
      }
    }

    @media (max-width: 768px) {
      .app-container {
        padding: 16px;
      }
      
      .tab-content {
        padding: 16px;
      }
    }
  `]
})
export class AppComponent {
  title = 'Fluxo de Caixa';
}
