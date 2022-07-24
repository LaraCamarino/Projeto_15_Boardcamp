import joi from "joi";
import connection from "../dbStrategy/postgres.js";

export default async function validateCategory(req, res, next) {
    const newCategory = req.body;

    const newCategorySchema = joi.object({
        name: joi.string().required()
    });

    const validation = newCategorySchema.validate(newCategory);
    if (validation.error) {
        res.status(400).send(validation.error.details);
        return;
    }

    const { rows: existingCategories } = await connection.query("SELECT (name) FROM categories");
    if (existingCategories.some((category) => category.name === newCategory.name)) {
        res.status(409).send("This category already exists.");
        return;
    }

    next();
}