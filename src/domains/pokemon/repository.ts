import { knex } from "../../database/knex";
import { Pokemon } from "./models";

export interface PokemonRepository {
  getPokemon: (id: number) => Promise<Pokemon>;
}

export class PokemonRepositoryImpl implements PokemonRepository {
  getPokemon = async (id: number): Promise<Pokemon> => {
    const [pokemon] = await knex<Pokemon>("pokemon").select("*").where({ id });

    return pokemon;
  };
}
