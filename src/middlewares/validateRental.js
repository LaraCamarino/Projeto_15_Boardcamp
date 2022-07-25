import joi from "joi";

export default async function validateRental(req, res, next) {
    const newRental = req.body;

    const newRentalSchema = joi.object({
        customerId: joi.number().required(),
        gameId: joi.number().required(),
        daysRented: joi.number().min(1).required()
    });

    const validation = newRentalSchema.validate(newRental);
    if (validation.error) {
        res.status(400).send(validation.error.details);
        return;
    }

    next();
}