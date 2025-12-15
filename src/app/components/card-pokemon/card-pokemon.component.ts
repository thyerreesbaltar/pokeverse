import { Component, inject, input, Input, OnInit } from '@angular/core';
import { TipoPokemonComponent } from "../tipo-pokemon/tipo-pokemon.component";
import { PokemonsInterface } from '../../core/types/pokemon.interface';
import { PokemonService } from '../../core/services/pokemon.service';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-card-pokemon',
  standalone: true,
  imports: [TipoPokemonComponent, TitleCasePipe],
  templateUrl: './card-pokemon.component.html',
  styleUrl: './card-pokemon.component.scss'
})
export class CardPokemonComponent implements OnInit{
  pokemon = input.required<PokemonsInterface>()
  pokeImage:string = ``
  private pokemonService = inject(PokemonService)
  ngOnInit(): void {
    this.pokeImage = this.pokemonService.getImagePokemon(this.pokemon().id)

  }
}
