import { Request, Response } from "express";
import { logger } from "../../logger";

export class PokemonController {
    constructor () {}

    getPokemon = async (req: Request, res: Response): Promise<void> => {
        logger.info("POKEMON");

        res.json({ pokemon: 1 })
    };
}