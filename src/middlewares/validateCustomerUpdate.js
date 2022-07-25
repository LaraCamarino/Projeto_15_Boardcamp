import joi from "joi";
import connection from "../dbStrategy/postgres.js";

export default async function validateCustomerUpdate(req, res, next) {
    const id = req.params.id;
    const updateInfo = req.body;

    const updateInfoSchema = joi.object({
        name: joi.string().required(),
        phone: joi.string().min(10).max(11).required(),
        cpf: joi.string().length(11).required(),
        birthday: joi.date().required()
    });

    const validation = updateInfoSchema.validate(updateInfo, { abortEarly: false });
    if (validation.error) {
        res.status(400).send(validation.error.details);
        return;
    }

    const customerCPF = await connection.query("SELECT * FROM customers WHERE cpf = $1 AND id != $2", [updateInfo.cpf, id]);
    if (customerCPF.rowCount > 0) {
        res.status(409).send("This CPF is alrealdy being used.");
        return;
    }

    next();
}
