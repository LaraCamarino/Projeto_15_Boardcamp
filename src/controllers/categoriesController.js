import connection from "../dbStrategy/postgres.js";

export async function getAllCategories(req, res) {
    try {
        const { rows: categories } = await connection.query("SELECT * FROM categories");
        res.status(200).send(categories);
    }
    catch (error) {
        res.status(500).send(error);
    }
}

export async function insertNewCategory(req, res) {
    const newCategory = req.body;

    try {
        await connection.query("INSERT INTO categories (name) VALUES ($1)", [newCategory.name]);
        res.status(201).send("Category created successfully.");
    }
    catch (error) {
        res.status(500).send(error);
    }
}
