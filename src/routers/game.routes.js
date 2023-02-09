import { Router } from "express";
import { createGames, retrieveGames } from "../controllers/game.controllers.js";
import { validShemaGames } from "../middlewares/Game.middlewares.js";


const router = Router();

router.post("/games", validShemaGames, createGames);
router.get("/games", retrieveGames);

export default router;