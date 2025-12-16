import { TypePokemon } from "./type-pokemon"

export interface PokemonsInterface {
  id: number
  name: string
  types: TypePokemon[]
}
