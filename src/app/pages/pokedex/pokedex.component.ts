import { Component, inject, OnInit, signal } from '@angular/core';
import { ContainerComponent } from "../../components/container/container.component";
import { CardPokemonComponent } from "../../components/card-pokemon/card-pokemon.component";
import { ModalPokemonComponent } from '../../components/modal-pokemon/modal-pokemon.component';
import { PokemonsInterface } from '../../core/types/pokemon.interface';
import { NgFor } from '@angular/common';
import { PokemonService } from '../../core/services/pokemon.service';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { off } from 'process';
import { LoadingComponent } from '../../components/loading/loading.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-pokedex',
  standalone: true,
  imports: [ContainerComponent, CardPokemonComponent, ModalPokemonComponent, NgFor, ScrollingModule, LoadingComponent],
  templateUrl: './pokedex.component.html',
  styleUrl: './pokedex.component.scss'
})
export class PokedexComponent implements OnInit{
  //Att futura:
  // Guardar dados em cache
  // Carregamento por Scrolling
  // Internacionalização com i18n
  pokemonService = inject(PokemonService)
  openModalPokemon: boolean = false;
  pokemonSelectedOpenModal: number | null = null;
  fullListaPokemon: {}[] = []
  listPokemon: any[] = []
  offSet = 0
  loading = signal<boolean>(false)
  ngOnInit(): void {
    this.loading.set(true)


    this.getListaPokemon(this.offSet)
  }

  getListaPokemon(offSet: number) {
    this.pokemonService.getListarPokemon(offSet).pipe(
      finalize(() =>{
        setTimeout(() => {
          this.loading.set(false)

        }, 500);
      })
    ).subscribe({
      next: (value: any) => {
      this.fullListaPokemon = value
      this.simplificarDadosDePokemonsNaLista()
    },
  })
  }

  simplificarDadosDePokemonsNaLista() {
    this.fullListaPokemon.forEach((value: any) => {
      this.listPokemon.push({
                id: value.id,
                name: value.name,
                types: value.types,
      })
    })
  }
  openModalpokemon (idPokemon: number){
    this.openModalPokemon = !this.openModalPokemon
    this.pokemonSelectedOpenModal = idPokemon
  }

  carregarMaisPokemons(){
    this.loading.set(true)
    this.offSet += 30
    this.getListaPokemon(this.offSet)

  }

}
