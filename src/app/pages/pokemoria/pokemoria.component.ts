import { PokemonService } from './../../core/services/pokemon.service';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ContainerComponent } from '../../components/container/container.component';
import { NgClass } from '../../../../node_modules/@angular/common';
import { embaralharArray, sortearNúmeroEntre } from '../../core/utils';
import { TemporizadorComponent } from "../../components/temporizador/temporizador.component";
import Swal from 'sweetalert2';
import { LoadingComponent } from "../../components/loading/loading.component";

interface CardPokemon {
  id?: number,
  numero: number;
  imageUrl: string;
  faceParaCima: boolean;
  combinacaoEncontrada: boolean
}

@Component({
  selector: 'app-pokemoria',
  standalone: true,
  imports: [ContainerComponent, NgClass, TemporizadorComponent, LoadingComponent],
  templateUrl: './pokemoria.component.html',
  styleUrl: './pokemoria.component.scss',
})
export class PokemoriaComponent implements OnInit {
  loading = signal<boolean>(false)

  tempo = signal<number>(60)
  nivel = signal<number>(1)
  jogoIniciado = signal<boolean>(false)
  tempoJogoAcabou = signal<boolean>(false)
  jogoFinalizado = signal<boolean>(false)

  quantidadeCartas = signal<number>(8);//nivel 1 = 8 / nivel 2 = 12 / nivel 3 = 16

  pokemonService = inject(PokemonService);

  isFlipped = false;
  pokemonSorteados = signal<number[]>([]);

  baralhoCardsPokemon = signal<CardPokemon[]>([]);

  quantidadeCombinacoesFeitas = signal<number>(0)

  quantidadeCardFaceParaCima = computed<number>(() => {
    return this.baralhoCardsPokemon().filter((card) => card.faceParaCima).length
  })

  ngOnInit(): void {
    this.loading.set(true)

    this.gerarPokemonsSorteados();

    this.preencherArrayBaralhoCardPokemon();
    this.loadingActive()
  }

  loadingActive() {
    setTimeout(() => {
      this.loading.set(false)

    }, 500);
  }
  gerarPokemonsSorteados() {
    for (let i = 0; i < this.quantidadeCartas(); i++) {
      this.pokemonSorteados.update((pokemon) => [
        this.sortearPokemon(),
        ...pokemon,
      ]);
    }

  }

  sortearPokemon(): number {
    return sortearNúmeroEntre(1, 493);
  }

  preencherArrayBaralhoCardPokemon() {
    this.baralhoCardsPokemon.update((card: any): CardPokemon[] => {
      const cardCriado = this.pokemonSorteados().map((pokemonId) => {
        return this.criarCardPokemon(pokemonId);
      });

      return cardCriado;
    });

    if (this.baralhoCardsPokemon().length == this.quantidadeCartas()) {
      this.baralhoCardsPokemon.update((cards: CardPokemon[]) => {
        const baralhoCard: CardPokemon[] = cards
          .map((card) => [card, card])
          .flat();

        const cardsEmbaralhado = this.embalharCard(baralhoCard);

        return cardsEmbaralhado;
      });
    }

    if (this.baralhoCardsPokemon().length == (this.quantidadeCartas() * 2)) {

      this.baralhoCardsPokemon.update((cards: CardPokemon[]) => {
        return cards.map((card: CardPokemon, $index) => {
          return {
            id: $index,
            ...card
          }
        })
      })
    }
  }
  criarCardPokemon(pokemonId: number): CardPokemon {
    const image = this.pokemonService.getImagePokemon(pokemonId);

    const card: CardPokemon = {
      numero: pokemonId,
      imageUrl: image,
      faceParaCima: false,
      combinacaoEncontrada: false
    };

    return card;
  }

  embalharCard(baralho: CardPokemon[]) {
    return embaralharArray(baralho);
  }

  verificarCombinacaoCartas(idCard: number) {
    this.baralhoCardsPokemon.update((cards: CardPokemon[]) => {
      let combincaoEncontrada = false
      const attCards = cards.map((card) => {
        if (card.id !== idCard) {
          if (card.numero === this.baralhoCardsPokemon()[idCard].numero && card.faceParaCima) {
            card.combinacaoEncontrada = true
            combincaoEncontrada = true
          }
        }

        return card
      })
      if (combincaoEncontrada) {
        attCards[idCard].combinacaoEncontrada = true
        combincaoEncontrada = false
        this.quantidadeCombinacoesFeitas.update(value => value + 1)
      }


      return attCards
    })
  }
  iniciarJogo(iniciarJogo: boolean) {
    this.jogoIniciado.set(iniciarJogo)
  }

  tempoAcabou(tempoAcabou: boolean) {
    this.tempoJogoAcabou.set(tempoAcabou)
    this.verificarJogoCompletado()

  }

  isPossibleFlip(): boolean {
    return this.quantidadeCardFaceParaCima() < 2 && this.jogoIniciado() && !this.tempoJogoAcabou()
  }

  verificarJogoCompletado() {
    if (this.tempoJogoAcabou() || this.quantidadeCombinacoesFeitas() === this.quantidadeCartas()) {
      this.jogoFinalizado.set(true)
      this.partidaTerminou()
    }
  }

  partidaTerminou() {
    if (this.jogoFinalizado()) {
      if (this.quantidadeCombinacoesFeitas() === this.quantidadeCartas()) {


        this.alertResultadoFinalJogo(`Parabéns`, "Você revelou todas as combinações :)")

      } else if (this.tempoJogoAcabou()) {
        this.alertResultadoFinalJogo(`Tempo Acabou`, "Infelizmente você não conseguiu revelar todas as combinações :(")
      }
    }
  }

  async alertResultadoFinalJogo(title: string, text: string) {
    const resultado = await Swal.fire({
      title,

      text,

      confirmButtonText: this.nivel() < 3 && !this.tempoJogoAcabou() ? "Proximo nível" : "Jogar novamente",
      cancelButtonText: "Por hoje é só",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: "#368ABF",
      customClass: {
        title: 'alert-title'
      }
    });



    if (resultado.isConfirmed) {
      if (this.nivel() < 3 && !this.tempoJogoAcabou()) {
        this.nivel.update(value => value + 1)
        this.quantidadeCartas.update(value => value + 4)
        this.tempo.update(value => value + 15)
      } else {
        this.tempo.set(60)

        this.nivel.set(1)
        this.quantidadeCartas.set(8)
      }

      this.resetComponent()
    }
  }
  toggleFlip(idCard: number | undefined) {
    if (idCard !== undefined && !this.jogoFinalizado()) {

      if (this.isPossibleFlip()) {
        this.baralhoCardsPokemon.update((cards: CardPokemon[]) => {
          return cards.map(card => {
            if (card.id === idCard) {
              card.faceParaCima = !card.faceParaCima
            }
            return card
          })
        })

        if (this.quantidadeCardFaceParaCima() === 2) {
          this.verificarCombinacaoCartas(idCard)
          this.verificarJogoCompletado()
          setTimeout(() => this.virarTodasCartasParaBaixo(), 1000)
        }
      }
    }
  }

  virarTodasCartasParaBaixo() {
    this.baralhoCardsPokemon.update((cards: CardPokemon[]) => {
      return cards.map(card => {
        card.faceParaCima = false
        return card
      })
    })
  }

  resetComponent() {

    this.loading.set(true)
    this.jogoIniciado.set(false)
    this.tempoJogoAcabou.set(false)
    this.jogoFinalizado.set(false)
    this.pokemonSorteados.set([])
    this.baralhoCardsPokemon.set([])
    this.quantidadeCombinacoesFeitas.set(0)

    this.gerarPokemonsSorteados()
    this.preencherArrayBaralhoCardPokemon()
    this.loadingActive()
  }
}
