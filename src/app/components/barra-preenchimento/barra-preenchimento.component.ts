import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-barra-preenchimento',
  standalone: true,
  imports: [],
  templateUrl: './barra-preenchimento.component.html',
  styleUrl: './barra-preenchimento.component.scss'
})
export class BarraPreenchimentoComponent {
  @Input() larguraDaBarra: number = 0
  @Input() backgroundColor: string = ""

}
