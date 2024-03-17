import { Pokemon } from "./models";
import { PokemonRepository } from "./repository";

export interface PokemonService {
  getPokemon: (id: number) => Promise<Pokemon>;
}

export class PokemonServiceImpl implements PokemonService {
  constructor(private pokemonRepository: PokemonRepository) {}

  getPokemon = async (id: number): Promise<Pokemon> => {
    return this.pokemonRepository.getPokemon(id);
  };
}
