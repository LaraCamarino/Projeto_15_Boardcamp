import joi from "joi";
import dayjs from "dayjs";
import connection from "../dbStrategy/postgres.js";

export default async function validateCustomer(req, res, next) {
    const newCustomer = req.body;
    const today = dayjs();
    const maxDate = new Date(today - 1000 * 60 * 60 * 24 * 365 * 18);

    const newCustomerSchema = joi.object({
        name: joi.string().required(),
        phone: joi.string().min(10).max(11).required(),
        cpf: joi.string().length(11).required(),
        birthday: joi.date().max(maxDate).required()
    });

    const validation = newCustomerSchema.validate(newCustomer, { abortEarly: false });
    if (validation.error) {
        res.status(400).send(validation.error.details);
        return;
    }

    const { rows: existingCustomers } = await connection.query("SELECT (cpf) FROM customers");
    if(existingCustomers.some((customer) => customer.cpf === newCustomer.cpf)) {
        res.status(409).send("This CPF is alrealdy being used.");
        return;
    }

    next();
}
