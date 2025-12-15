import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ContainerModalComponent } from "../container-modal/container-modal.component";
import { TipoPokemonComponent } from "../tipo-pokemon/tipo-pokemon.component";
import { BarraPreenchimentoComponent } from "../barra-preenchimento/barra-preenchimento.component";
import { PokemonService } from '../../core/services/pokemon.service';

@Component({
  selector: 'app-modal-pokemon',
  standalone: true,
  imports: [ContainerModalComponent, TipoPokemonComponent],
  templateUrl: './modal-pokemon.component.html',
  styleUrl: './modal-pokemon.component.scss'
})
export class ModalPokemonComponent implements OnInit{
  @Output() fecharModal = new EventEmitter<boolean>()
  @Input() idPokemon: number | null = null;
  pokemonService = inject(PokemonService)
  pokemonImage = ''
  pokemon: any = {}
  modalPage: 'Descrição' | 'Estatisticas' = 'Descrição'

  ngOnInit(): void {
    if(this.idPokemon){
      this.pokemonService.getPokemon(this.idPokemon).subscribe(
        (value) => {
          const pokemonDetails = value
          this.filterDetailsPokemonToView(pokemonDetails)
        }
      )
      this.pokemonImage = this.pokemonService.getImagePokemon(this.idPokemon)
    }
  }

  filterDetailsPokemonToView(pokemonDetails: any){
    let descricao: string = pokemonDetails.pokemonSpecie.flavor_text_entries[0].flavor_text
    descricao = descricao.replace(/[\n\f]/g, ' ')
    this.pokemon = {
      id: pokemonDetails.pokemon.id,
      nome: pokemonDetails.pokemon.name,
      altura: pokemonDetails.pokemon.height/10,
      peso: pokemonDetails.pokemon.weight/10,
      descricao: descricao,
      tipos: pokemonDetails.pokemon.types,
      estatisticas: pokemonDetails.pokemon.stats
    }
    console.log(this.pokemon)
  }



  paginationModal() {
    if(this.modalPage === "Descrição"){
      this.modalPage = "Estatisticas"
    }else {
      this.modalPage = "Descrição"
    }
  }

  onFecharModal() {
    this.fecharModal.emit(false)
  }

}
