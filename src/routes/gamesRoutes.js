import { Router } from "express";
import { getAllGames, insertNewGame } from "../controllers/gamesController.js";
import validateGame from "../middlewares/validateGame.js";

const router = Router();

router.get("/games", getAllGames);
router.post("/games", validateGame, insertNewGame);

export default router;