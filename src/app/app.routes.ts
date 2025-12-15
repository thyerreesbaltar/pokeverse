import { Routes } from '@angular/router';
import { PokedexComponent } from './pages/pokedex/pokedex.component';
import { QualPokemonComponent } from './pages/qual-pokemon/qual-pokemon.component';
import { PokemoriaComponent } from './pages/pokemoria/pokemoria.component';

export const routes: Routes = [
    {
        path: '',
        component: PokedexComponent
    },
    {
      path: 'qual-e-esse-pokemon',
      component: QualPokemonComponent
    },
    {
      path: 'pokemoria',
      component: PokemoriaComponent
    },
    {
      path: '**',
      component: PokedexComponent
    }

];
