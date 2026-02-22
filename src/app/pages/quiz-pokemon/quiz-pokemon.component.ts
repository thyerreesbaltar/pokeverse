import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule, FormArray } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import Swal from 'sweetalert2';

import { QuizService } from '../../core/services/quiz.service';
import { Quiz } from '../../core/types/quiz';

import { ContainerComponent } from "../../components/container/container.component";
import { RespostaQuizComponent } from "../../components/resposta-quiz/resposta-quiz.component";

import { embaralharArray } from '../../core/utils';
import { finalize } from 'rxjs';
import { LoadingComponent } from "../../components/loading/loading.component";


@Component({
  selector: 'app-quiz-pokemon',
  standalone: true,
  imports: [ContainerComponent, MatTooltipModule, ɵInternalFormsSharedModule, ReactiveFormsModule, RespostaQuizComponent, LoadingComponent],
  templateUrl: './quiz-pokemon.component.html',
  styleUrl: './quiz-pokemon.component.scss'
})
export class QuizPokemonComponent implements OnInit {
  loading = signal<boolean>(false);

  score = signal<number>(0)
  quiz = signal<Quiz[]>([])
  quizForm!: FormGroup;
  perguntaAtual = signal<number>(0)
  resultadosQuiz = signal<{ id: number, acertou_errou: boolean, resposta_selecionada: number, resposta_correta: number }[]>([])
  quantidadeRespostasCorretas = 0
  revisao = signal<boolean>(false)

  viewQuiz = signal<{ id: number, pegunta: string, respostas: number[] } | null>(null)
  constructor(private quizService: QuizService, private _fb: FormBuilder) { }

  ngOnInit(): void {
    this.loading.set(true);

    this.getDadosQuiz()
    this.quizForm = this._fb.group({
      questions: this._fb.array(this.quiz().map(q => this._fb.group({
        resposta: ['', Validators.required]
      })))
    });
  }

  proximaPergunta() {
    if (this.perguntaAtual() < this.quiz().length - 1) {

      this.perguntaAtual.update(value => value + 1)
    }
  }

  perguntaAnterior() {
    this.perguntaAtual.update(value => {
      if (value > 0) {
        return value - 1
      }
      return 0
    })

  }
  getDadosQuiz() {

    this.quizService.getQuiz().pipe(
      finalize(() => {
        setTimeout(() => {
          this.loading.set(false);
        }, 2000);
      })
    ).subscribe(
      res => {
        const todasQuestoes = res.questoes
        const questoesEmbaralhadas = embaralharArray(todasQuestoes)
        const questoes = questoesEmbaralhadas.slice(0, 10)
        this.quiz.set(questoes)
      }
    )
  }

  inserirRespostaNoForm(resposta: number, index: number, idPergunta: number) {

    const perguntas = this.quizForm.get('questions') as FormArray;

    const grupoAtual = perguntas.at(index) as FormGroup;

    grupoAtual.get("resposta")?.setValue(`${idPergunta} - ${resposta}`)

    //Valida se existe mais perguntas, o valor tem que ser menor que o total de perguntas que serão realizadas
    if (this.perguntaAtual() < (this.quiz().length - 1)) {
      this.proximaPergunta()
      this.loading.set(true);

      setTimeout(() => {
        this.loading.set(false);
      }, 1500);
      
    } else {
      this.finalizarQuiz()
    }
  }

  //Irá chamar os metodos para validar resposta, verificar resultados e outros que devem ser executados ao finalizar o quiz
  finalizarQuiz() {
    this.validarRespostas()
    this.contabilizarResultadoquiz()
    this.alertResultado()
  }

  validarRespostas() {
    //Adquirindo resposta
    const respostasDoForm = this.quizForm.value

    const respostas: { id: number, resposta: number }[] = respostasDoForm.questions.map((value: { resposta: string }) => {

      const id = Number(value.resposta.split(" ")[0])
      const resposta = Number(value.resposta.split(" ")[2])

      return { id, resposta }
    }

    )

    const gabarito = this.quiz().map((value: Quiz) => {

      const resposta = respostas.filter(resposta => resposta.id === value.id);
      const acertou_errou = resposta[0].resposta === value.respostaCorreta;
      return {
        id: value.id,
        acertou_errou,
        resposta_selecionada: resposta[0].resposta,
        resposta_correta: value.respostaCorreta
      }
    })

    this.revisao.set(true)
    this.resultadosQuiz.set(gabarito)
  }

  contabilizarResultadoquiz() {
    if (this.resultadosQuiz().length > 0) {
      const respostasCorretasArray = this.resultadosQuiz().filter(value => value.acertou_errou)

      this.quantidadeRespostasCorretas = respostasCorretasArray.length
    }
  }

  async alertResultado() {
    const resultado = await Swal.fire({
      title: `Quiz finalizado`,

      text: `Parabéns, você acertou ${this.quantidadeRespostasCorretas} de ${this.quiz().length} perguntas. :)`,

      imageWidth: 400,
      imageHeight: 300,
      confirmButtonText: 'Jogar novamente',
      cancelButtonText: 'Ver Resultado',
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

    if (resultado.dismiss) {
      this.preprararResultados()
    }
  }

  preprararResultados() {
    this.perguntaAtual.set(0)
  }

  resetComponent() {
    this.quizForm.reset()
    this.getDadosQuiz()
    this.perguntaAtual.set(0)
    this.quantidadeRespostasCorretas = 0
    this.resultadosQuiz.set([])
  }

}