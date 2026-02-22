import { Component, inject, signal } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { finalize } from 'rxjs';
import {
  NgClass,
  TitleCasePipe,
} from '../../../../node_modules/@angular/common';

import { PokemonService } from '../../core/services/pokemon.service';

import {
  getPeso,
  getAltura,
  getGeracao,
  embaralharString,
  sortearNúmeroEntre,
} from '../../core/utils';
import { TypePokemon } from '../../core/types/type-pokemon';


import { LoadingComponent } from '../../components/loading/loading.component';
import { ContainerComponent } from '../../components/container/container.component';

@Component({
  selector: 'app-qual-pokemon',
  standalone: true,
  imports: [
    ContainerComponent,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    TitleCasePipe,
    LoadingComponent,
  ],
  templateUrl: './qual-pokemon.component.html',
  styleUrl: './qual-pokemon.component.scss',
})
export class QualPokemonComponent {
  private _fb = inject(FormBuilder);
  private pokemonService = inject(PokemonService);
  loading = signal<boolean>(false);

  quantidadePokemons = 1010;
  idPokemonSorteado = sortearNúmeroEntre(0, this.quantidadePokemons);

  formPokemon!: FormGroup;

  pokemon: any = {};
  pokemonImage = signal<string>('');
  pokemonDesconhecido = signal<boolean>(true);

  tentativas = signal<string[]>([]);
  dicas = signal<any[]>([]);

  ngOnInit(): void {
    this.loading.set(true);

    this.iniciarForm();
    this.pegarDadosPokemon();
  }

  iniciarForm() {
    this.formPokemon = this._fb.group({
      pokemon: ['', Validators.required],
    });
  }

  pegarDadosPokemon() {
    this.pokemonImage.set(
      this.pokemonService.getImagePokemon(this.idPokemonSorteado)
    );
    this.pokemonService
      .getPokemon(this.idPokemonSorteado)
      .pipe(
        finalize(() => {
          setTimeout(() => {
            this.loading.set(false);
          }, 800);
        })
      )
      .subscribe((value: any) => {
        this.pokemon = {
          nome: value.pokemon.name,
          tipos: value.pokemon.types,
          altura: value.pokemon.height,
          peso: value.pokemon.weight,
          geracao: value.pokemonSpecie.generation,
        };
      });
  }

  prepararDica(numeroDica: number) {
    switch (numeroDica) {
      case 0:
        const altura = getAltura(this.pokemon.altura);
        return `${altura} m`;
      case 1:
        const peso = getPeso(this.pokemon.peso);
        return `${peso} KG`;
      case 2:
        let tipos = '';
        this.pokemon.tipos.forEach((tipo: TypePokemon) => {
          if (tipos.length > 0) {
            tipos = `${tipos}, `;
          }
          tipos = `${tipos}${tipo.type.name}`;
        });
        return tipos;
      case 3:
        const geracao = getGeracao(this.pokemon.geracao.name);
        return geracao;

      case 4:
        const nomePokemon = this.pokemon.nome;
        const nome = embaralharString(nomePokemon);
        return nome;
      default:
        return;
    }
  }

  ativarDica() {
    const quantidadeDicasSolicitadas = this.dicas().length;

    this.dicas.update((valueDica) => {
      const dica = this.prepararDica(quantidadeDicasSolicitadas);
      return [dica, ...valueDica];
    });
  }

  async alertAcertouPokemon() {
    const resultado = await Swal.fire({
      title: `${this.pokemon.nome}`,

      text: 'Parabéns, você acertou qual era o pokemon :)',
      imageUrl: `${this.pokemonImage()}`,
      imageWidth: 400,
      imageHeight: 300,
      confirmButtonText: 'Jogar novamente',
      cancelButtonText: 'Por hoje é só',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: '#368ABF',
      customClass: {
        title: 'alert-title',
      },
    });

    if (resultado.isConfirmed) {
      this.resetComponent();
    }
  }

  resetComponent() {
    this.idPokemonSorteado = sortearNúmeroEntre(0, this.quantidadePokemons);
    this.formPokemon.reset();
    this.tentativas.set([]);
    this.dicas.set([]);
    this.pegarDadosPokemon();
    this.pokemonDesconhecido.set(true);
  }

  submitPokemon() {
    const nomePokemon: string = this.formPokemon.get('pokemon')?.value;
    if (
      this.pokemon.nome.toLocaleLowerCase() == nomePokemon.toLocaleLowerCase()
    ) {
      this.alertAcertouPokemon();
      this.pokemonDesconhecido.set(false);
    } else {
      this.tentativas.update(() => {
        return [this.formPokemon.get('pokemon')?.value, ...this.tentativas()];
      });
    }
  }
}
