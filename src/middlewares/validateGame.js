import joi from "joi";
import connection from "../dbStrategy/postgres.js";

export default async function validateGame(req, res, next) {
    const newGame = req.body;

    const { rows: existingCategories } = await connection.query("SELECT (id) FROM categories");
    const existingCategoriesIds = existingCategories.map((category) => category.id);

    const newGameSchema = joi.object({
        name: joi.string().required(),
        image: joi.string().required(),
        stockTotal: joi.number().min(0).required(),
        categoryId: joi.number().valid(...existingCategoriesIds).required(), 
        pricePerDay: joi.number().min(0).required()
    });

    const validation = newGameSchema.validate(newGame, { abortEarly: false });
    if (validation.error) {
        res.status(400).send(validation.error.details);
        return;
    }

    const { rows: existingGames } = await connection.query("SELECT (name) FROM games");
    if (existingGames.some((game) => game.name.toLowerCase() === newGame.name.toLowerCase())) {
        res.status(409).send("This game already exists.");
        return;
    }

    next();
}