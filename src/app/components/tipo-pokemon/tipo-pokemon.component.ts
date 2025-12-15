import { Component, Input } from '@angular/core';
import { TypePokemon } from '../../core/types/type-pokemon';

@Component({
  selector: 'app-tipo-pokemon',
  standalone: true,
  imports: [],
  templateUrl: './tipo-pokemon.component.html',
  styleUrl: './tipo-pokemon.component.scss'
})
export class TipoPokemonComponent {
  @Input() tipos: TypePokemon[] = []
}
