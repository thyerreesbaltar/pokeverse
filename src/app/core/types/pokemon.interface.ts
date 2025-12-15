import { TypePokemon } from "./type-pokemon"

export interface PokemonsInterface {
  id: number
  name: string
  types: TypePokemon[]
  // order:  number
  // name: string
  // flavor_text: string
  // types: { name: string}[]
  // stats: {
  //     base_stat: number,
  //     effort: number,
  //     stat: {
  //       name: string,
  //       }
  // }[]
  // weight: number
  // height: number
}
