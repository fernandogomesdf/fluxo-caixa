import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LancamentoFormComponent } from './components/lancamento-form/lancamento-form.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    LancamentoFormComponent,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule
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
      <app-lancamento-form></app-lancamento-form>
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

    @media (max-width: 768px) {
      .app-container {
        padding: 16px;
      }
    }
  `]
})
export class AppComponent {
  title = 'Fluxo de Caixa';
}
