import { Router } from "express";
import { getAllCustomers, getCustomerById, insertNewCustomer, updateCustomer } from "../controllers/customersController.js";
import validateCustomer from "../middlewares/validateCustomer.js";
import validateCustomerUpdate from "../middlewares/validateCustomerUpdate.js";

const router = Router();

router.get("/customers", getAllCustomers);
router.get("/customers/:id", getCustomerById);
router.post("/customers", validateCustomer, insertNewCustomer);
router.put("/customers/:id", validateCustomerUpdate, updateCustomer);

export default router;