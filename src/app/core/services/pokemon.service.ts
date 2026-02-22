import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private urlPokeAPI = environment.urlPokeApi
  constructor(private httpClient: HttpClient) { }

  getListarPokemon(offSet: number, limit: number): Observable<any>{
    return this.httpClient.get(`${this.urlPokeAPI}/pokemon?limit=${limit}&offset=${offSet}`).pipe(
      switchMap((value: any) => {
        const next = value.next
        // 3. Cria um array de Observables, um para cada requisição de detalhe do pokémon
        const detailRequests: Observable<any>[] = value.results.map((element: { url: string }) => {
          return this.httpClient.get<any>(element.url);
        });

        // 4. forkJoin: Executa todos os Observables do array em paralelo e emite um único valor
        // (um array com os resultados) quando TODOS eles estiverem completos.
        return forkJoin(detailRequests);
      }),
      // 5. Opcional: map para transformar os dados se necessário (aqui não é preciso, mas é útil saber)
      map((pokemons: any[]) => {
        // Podemos ordenar ou modificar os dados aqui antes de entregá-los ao component
        return pokemons.sort((a, b) => a.order - b.order);
      })
    )
  }

  getPokemon(idPokemon: number){
    const pokemon$ = this.httpClient.get(`${this.urlPokeAPI}/pokemon/${idPokemon}`)
    const pokemonSpecies$ = this.httpClient.get(`${this.urlPokeAPI}/pokemon-species/${idPokemon}`)

    return forkJoin({
      pokemon: pokemon$,
      pokemonSpecie: pokemonSpecies$
    })
  }

  getImagePokemon(idPokemon: number): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${idPokemon}.png`
  }
}
