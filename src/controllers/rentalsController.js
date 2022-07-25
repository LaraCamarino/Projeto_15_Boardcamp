import connection from "../dbStrategy/postgres.js";
import dayjs from "dayjs";

export async function getAllRentals(req, res) {
    const { customerId: customerIdQuery, gameId: gameIdQuery } = req.query;

    try {
        let condition = "";

        if (customerIdQuery && gameIdQuery) {
            condition = `WHERE rentals."customerId" = ${customerIdQuery} AND rentals."gameId" = ${gameIdQuery}`;
        }
        if (customerIdQuery) {
            condition = `WHERE rentals."customerId" = ${customerIdQuery}`;
        }
        if (gameIdQuery) {
            condition = `WHERE rentals."gameId" = ${gameIdQuery}`;
        }

        const { rows: rentals } = await connection.query(`SELECT rentals.*, 
        customers.name, customers.id as "customersId", 
        games.id as "gamesId", games.name as "gamesName", games."categoryId",
        categories.id as "categoriesId", categories.name as "categoriesName" 
        FROM rentals
        JOIN customers ON rentals."customerId" = customers.id 
        JOIN games ON rentals."gameId" = games.id
        JOIN categories ON games."categoryId" = categories.id ${condition}`);

        const finalRentals = rentals.map((rental) => {
            const formattedRental = {
                id: rental.id,
                customerId: rental.customerId,
                gameId: rental.gameId,
                rentDate: rental.rentDate,
                daysRented: rental.daysRented,
                returnDate: rental.returnDate,
                originalPrice: rental.originalPrice,
                delayFee: rental.delayFee,
                customer: {
                    id: rental.customersId,
                    name: rental.name
                },
                game: {
                    id: rental.gamesId,
                    name: rental.gamesName,
                    categoryId: rental.categoryId,
                    categoryName: rental.categoriesName
                }
            }
            return formattedRental;
        });

        res.status(200).send(finalRentals);
    }
    catch (error) {
        res.status(500).send(error);
    }
}

export async function insertNewRental(req, res) {
    const newRental = req.body;

    try {
        const { rows: existingCustomer } = await connection.query("SELECT * FROM customers WHERE id = $1", [newRental.customerId]);
        if (existingCustomer.length === 0) {
            res.status(400).send("This customer does not exist.");
            return;
        }

        const { rows: existingGame } = await connection.query("SELECT * FROM games WHERE id = $1", [newRental.gameId]);
        if (existingGame.length === 0) {
            res.status(400).send("This game does not exist.");
            return;
        }

        const { rows: availableRentals } = await connection.query(`SELECT * FROM rentals WHERE "gameId" = $1 AND "returnDate" IS null`, [newRental.gameId]);
        if (availableRentals.length > 0 && availableRentals.length === existingGame[0].stockTotal) {
            res.status(400).send("This game is out of stock.");
            return;
        }

        const rentDate = dayjs().format("YYYY-MM-DD");
        const returnDate = null;
        const originalPrice = newRental.daysRented * existingGame[0].pricePerDay;
        const delayFee = null;

        await connection.query(`INSERT INTO rentals ("customerId", "gameId", "daysRented", "rentDate", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7)`, [newRental.customerId, newRental.gameId, newRental.daysRented, rentDate, returnDate, originalPrice, delayFee]);
        res.status(201).send("Rental created successfully.");
    }
    catch (error) {
        res.status(500).send(error);
    }
}

export async function returnRental(req, res) {
    const id = req.params.id;

    try {
        const { rows: existingRental } = await connection.query(`SELECT * FROM rentals WHERE id = $1`, [id]);
        if (existingRental.length === 0) {
            res.status(404).send("This rental does not exist.");
            return;
        }
        if (existingRental[0].returnDate !== null) {
            res.status(400).send("Can't return this rental.");
            return;
        }

        const returnDate = dayjs().format('YYYY-MM-DD');
        const differenceInDays = dayjs().diff(existingRental[0].rentDate, "day");
        const delayFee = 0;
        if (differenceInDays > existingRental[0].daysRented) {
            delayFee = (differenceInDays - existingRental[0].daysRented) * existingRental[0].originalPrice;
        }

        await connection.query(`UPDATE rentals 
        SET "returnDate" = $1, "delayFee" = $2 
        WHERE id = $3`, [returnDate, delayFee, id]);

        res.status(200).send("Game returned successfully.");
        return;
    }
    catch (error) {
        res.status(500).send(error);
    }
}

export async function deleteRental(req, res) {
    const id = req.params.id;

    try {
        const { rows: existingRental } = await connection.query(`SELECT * FROM rentals WHERE id = $1`, [id]);
        if (existingRental.length === 0) {
            res.status(404).send("This rental does not exist.");
            return;
        }
        if (existingRental[0].returnDate === null) {
            res.status(400).send("Can't delete this rental.");
            return;
        }

        await connection.query(`DELETE FROM rentals WHERE id = $1`, [id]);
        res.status(200).send("Rental deleted successfully.");
    }
    catch (error) {
        res.status(500).send(error);
    }
}
