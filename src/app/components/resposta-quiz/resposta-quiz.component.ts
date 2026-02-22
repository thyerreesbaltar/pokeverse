import { NgClass } from '@angular/common';
import { Component, inject, input, OnInit, output, signal} from '@angular/core';
import { PokemonService } from '../../core/services/pokemon.service';

@Component({
  selector: 'app-resposta-quiz',
  standalone: true,
  imports: [NgClass],
  templateUrl: './resposta-quiz.component.html',
  styleUrl: './resposta-quiz.component.scss'
})
export class RespostaQuizComponent implements OnInit {
  private pokemonService = inject(PokemonService)
  url = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/"
  png = ".png"
  imagemPokemon = signal<string>("")
  revisao = signal<boolean>(false)
  idPergunta = input.required<number>()
  resposta = input.required<number>()

  resultadoQuiz = input.required<{ id: number, acertou_errou: boolean, resposta_selecionada: number, resposta_correta: number }[]>()

  respostaSelecionada = output<number>()


  apresentarResultado = signal<boolean>(false)

  apresentarRespostaCorreta = signal<boolean>(false)
  apresentarRespostaErrada = signal<boolean>(false)



  ngOnInit(): void {
    this.getImage(this.resposta())
    this.verificarNecessidadeApresentarResultado()
  }

  escolherResposta(resposta: number) {
    this.respostaSelecionada.emit(resposta)
  }

  verificarNecessidadeApresentarResultado() {
    this.mostrarResultado()
    this.acertou()
    this.errou()
  }

  //Valida se deverá mostrar o resultado do quiz
  mostrarResultado() {
    if (this.resultadoQuiz().length > 0) {
      this.apresentarResultado.set(true)

    } else {
      this.apresentarResultado.set(false)

    }
  }

  //Valida se o a resposta apresentada no momento é a correta, sempre é apresentado a reposta correta mesmo se o usuário tenha errado
  acertou() {
    const respostaCorreta = this.resultadoQuiz().filter(value => (this.idPergunta() === value.id && this.resposta() === value.resposta_correta))
    if (respostaCorreta.length > 0) {
      this.apresentarRespostaCorreta.set(true)
    } else {
      this.apresentarRespostaCorreta.set(false)

    }
  }

  //Valida se a resposta está errada
  errou() {
    const respostaErrada = this.resultadoQuiz().filter(value => this.idPergunta() === value.id && !value.acertou_errou && this.resposta() === value.resposta_selecionada)
    if (respostaErrada.length > 0) {
      this.apresentarRespostaErrada.set(true)
    } else {
      this.apresentarRespostaErrada.set(false)

    }
  }

  getImage(id: number) {
    this.imagemPokemon.set(this.pokemonService.getImagePokemon(id))
  }

}
