import { Router } from "express";
import { createCustomer, retrieveCustomers, getCustomerById, putUpdateCustomer } from "../controllers/customer.controllers.js";
import { validShemaCustomers } from "../middlewares/Customers.middlewares.js";
import { validShemaCustomersUpdate } from "../middlewares/update.middlewares.js";


const router = Router();

router.post("/customers", validShemaCustomers, createCustomer);
router.get("/customers", retrieveCustomers);
router.get("/customers/:id", getCustomerById);
router.put("/customers/:id", validShemaCustomersUpdate, putUpdateCustomer);

export default router;