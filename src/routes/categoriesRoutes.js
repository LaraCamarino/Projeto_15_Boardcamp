import { Router } from "express";
import { getAllCategories, insertNewCategory } from "../controllers/categoriesController.js";
import validateCategory from "../middlewares/validateCategory.js";

const router = Router();

router.get("/categories", getAllCategories);
router.post("/categories", validateCategory, insertNewCategory);

export default router;