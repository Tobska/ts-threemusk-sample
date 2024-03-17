import { Request, Response } from "express";
import { logger } from "../../logger";
import { PokemonService } from "./service";

export class PokemonController {
  constructor(private pokemonService: PokemonService) {}

  getPokemon = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const pokemon = await this.pokemonService.getPokemon(Number(id));

    res.json(pokemon);
  };
}
