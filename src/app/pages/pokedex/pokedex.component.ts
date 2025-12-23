import { PokemonsInterface } from './../../core/types/pokemon.interface';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ContainerComponent } from '../../components/container/container.component';
import { CardPokemonComponent } from '../../components/card-pokemon/card-pokemon.component';
import { ModalPokemonComponent } from '../../components/modal-pokemon/modal-pokemon.component';
// import { PokemonsInterface } from '../../core/types/pokemon.interface';
import { NgFor, NgClass } from '@angular/common';
import { PokemonService } from '../../core/services/pokemon.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { off } from 'process';
import { LoadingComponent } from '../../components/loading/loading.component';
import { finalize } from 'rxjs';
import { InfiniteScrollDirective } from '../../core/directives/infinite-scroll.directive';
import { ordernarCrescenteArrayPokemon } from '../../core/utils';

@Component({
  selector: 'app-pokedex',
  standalone: true,
  imports: [
    ContainerComponent,
    CardPokemonComponent,
    ModalPokemonComponent,
    NgFor,
    ScrollingModule,
    LoadingComponent,
    ScrollingModule,
    InfiniteScrollDirective,
    NgClass,
  ],
  templateUrl: './pokedex.component.html',
  styleUrl: './pokedex.component.scss',
})
export class PokedexComponent implements OnInit {
  //Att futura:
  // Guardar dados em cache
  // Carregamento por Scrolling
  // Internacionalização com i18n
  pokemonService = inject(PokemonService);
  openModalPokemon: boolean = false;
  pokemonSelectedOpenModal: number | null = null;
  fullListaPokemon: {}[] = [];
  listPokemon = signal<PokemonsInterface[]>([]);
  offSet: number = 30;
  limit: number = 30;
  loading = signal<boolean>(false);

  ngOnInit(): void {
    this.loading.set(true);

    this.getListaPokemon();
  }

  getListaPokemon(offSet: number = 0, limit: number = 60) {
    this.pokemonService
      .getListarPokemon(offSet, limit)
      .pipe(
        finalize(() => {
          setTimeout(() => {
            this.loading.set(false);
          }, 500);
        })
      )
      .subscribe({
        next: (value: any) => {
          this.fullListaPokemon = value;
          this.simplificarDadosDePokemonsNaLista();
          this.listPokemon.set(    ordernarCrescenteArrayPokemon(this.listPokemon()))

        },
        error: (err) => {
          console.error('Erro ao carregar', err);
          this.loading.set(false);
        },
      });
  }

  simplificarDadosDePokemonsNaLista() {
    this.fullListaPokemon.forEach((value: any) => {
      this.listPokemon.update((pokemons: PokemonsInterface[]) => [
        ...pokemons,
        {
          id: value.id,
          name: value.name,
          types: value.types,
        },
      ]);
    });
  }

  removerDadosDuplicados() {}
  openModalpokemon(idPokemon: number) {
    this.openModalPokemon = !this.openModalPokemon;
    this.pokemonSelectedOpenModal = idPokemon;
  }

  onScroll() {
    this.carregarPokemons();
  }

  carregarPokemons() {
    if (this.loading()) return;

    this.loading.set(true);

    this.offSet += this.limit;
    console.log(this.offSet);
    this.getListaPokemon(this.offSet, this.limit);
  }
}
