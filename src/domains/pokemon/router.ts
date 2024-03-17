import { Router } from "express";
import asyncHandler from "express-async-handler";
import { pokemonController } from "../../base/init";

export const pokemonRouter = Router();

// pokemonRouter.use(asyncHandler())

pokemonRouter.get("/:id", asyncHandler(pokemonController.getPokemon));
