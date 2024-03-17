import { PokemonController } from "../domains/pokemon/controller";
import { PokemonRepositoryImpl } from "../domains/pokemon/repository";
import { PokemonServiceImpl } from "../domains/pokemon/service";

const pokemonRepository = new PokemonRepositoryImpl();

const pokemonService = new PokemonServiceImpl(pokemonRepository);

export const pokemonController = new PokemonController(pokemonService);
