
  export function getPeso(peso: number){
    return peso/10
  }

  export function getAltura(altura: number){
    return altura/10
  }

  export function getGeracao(geracao: string){
    switch (geracao) {
      case "generation-i":
        return "Primeira geração"
      case "generation-ii":
        return "Segunda geração"
      case "generation-iii":
        return "Terceira geração"
      case "generation-iv":
        return "Quarta geração"
      case "generation-v":
        return "Quinta geração"
      case "generation-vi":
        return "Sexta geração"
      case "generation-vii":
        return "Setima geração"
      case "generation-viii":
        return "Oitava geração"
      case "generation-ix":
        return "Nona geração"

      default:
        throw new Error("Geração desconhecida")
    }
  }

  export function embaralharString(str: string) {
  // 1. Divide a string em um array de caracteres
  const arrayDeCaracteres = str.split('');

  // 2. Embaralha o array usando sort com uma função aleatória
  const arrayEmbaralhado = arrayDeCaracteres.sort(() => Math.random() - 0.5);

  // 3. Junta os caracteres de volta em uma string
  const stringEmbaralhada = arrayEmbaralhado.join('');

  return stringEmbaralhada;
}

export function sortearNúmeroEntre(min: number, max: number): number{
   return Math.floor(Math.random() * (max - min) + min)
}

export function embaralharArray(meuArray: any[]): any[]{
  // Percorre o array de trás para frente
  for (let i = meuArray.length - 1; i > 0; i--) {

    // Escolhe um índice aleatório entre 0 e i
    const j = Math.floor(Math.random() * (i + 1));

    // Troca os elementos de lugar usando "Destructuring" do ES6
    [meuArray[i], meuArray[j]] = [meuArray[j], meuArray[i]];
  }

  return meuArray;
}
