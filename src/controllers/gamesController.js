import connection from "../dbStrategy/postgres.js";

export async function getAllGames(req, res) {
    const { name: nameQuery } = req.query;
    
    try {
        if (nameQuery) {
            const { rows: games } = await connection.query(`SELECT games.*, categories.name as "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id WHERE LOWER(games.name) LIKE $1`, [nameQuery.toLowerCase() + "%"]);
            res.status(200).send(games);
            return;
        }
        else {
            const { rows: games } = await connection.query(`SELECT games.*, categories.name as "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id`);
            res.status(200).send(games);
            return;
        }
    }
    catch (error) {
        res.status(500).send(error);
    }
}

export async function insertNewGame(req, res) {
    const newGame = req.body;

    try {
        await connection.query(`INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)`, [newGame.name, newGame.image, newGame.stockTotal, newGame.categoryId, newGame.pricePerDay]);
        res.status(201).send("Game added successfully.");
    }
    catch (error) {
        res.status(500).send(error);
    }
}