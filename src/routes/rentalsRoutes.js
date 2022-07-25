import { Router } from "express";
import { getAllRentals, insertNewRental, returnRental, deleteRental } from "../controllers/rentalsController.js";
import validateRental from "../middlewares/validateRental.js";

const router = Router();

router.get("/rentals", getAllRentals);
router.post("/rentals", validateRental, insertNewRental);
router.post("/rentals/:id/return", returnRental);
router.delete("/rentals/:id", deleteRental);

export default router;