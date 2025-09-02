import { Component, signal } from '@angular/core';
import { LancamentoFormComponent } from './components/lancamento-form/lancamento-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LancamentoFormComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('fluxo-caixa');
}
