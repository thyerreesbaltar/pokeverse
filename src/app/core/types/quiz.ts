export interface Quiz {
    id: number;
    pergunta: string;
    respostas: number[];
    respostaCorreta: number
    acertou_errou?:boolean,
    resposta_selecionada?: number
}
