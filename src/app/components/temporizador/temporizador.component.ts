import { Component, input, model, OnDestroy, output, signal } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-temporizador',
  standalone: true,
  imports: [],
  templateUrl: './temporizador.component.html',
  styleUrl: './temporizador.component.scss'
})
export class TemporizadorComponent implements OnDestroy {
  iniciadoJogo = output<boolean>()
  tempoFinalizado = output<boolean>()

  iniciar = model.required<boolean>()
  terminouJogo = input.required<boolean>()
  tempoRestante = model.required<number>();

  private subscription: Subscription | undefined;

  iniciarTimer() {

    this.iniciar.set(true)

    this.iniciadoJogo.emit(this.iniciar())
    // Cria um evento a cada 1000ms (1 segundo)
    const timer$ = interval(1000);

    // Se inscreve no evento
    this.subscription = timer$.subscribe(() => {
      if (this.tempoRestante() > 0) {
        this.tempoRestante.update(value => value - 1);
      } else {
        this.pararTimer(); // Opcional: ação ao acabar
        this.tempoFinalizado.emit(true)
      }
      if (this.terminouJogo()) {
        this.pararTimer(); // Opcional: ação ao acabar
      }
    });
  }

  pararTimer() {
    this.subscription?.unsubscribe();
  }

  // IMPORTANTE: Limpa o timer se o usuário mudar de página
  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
