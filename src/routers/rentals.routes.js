import { Router } from "express";
import { createRentals, getRentals, finalizeRentals, deleteRentals } from "../controllers/rentals.controllers.js";
import { validShemaRentals } from "../middlewares/Rentals.middlewares.js";


const router = Router();

router.post("/rentals", validShemaRentals, createRentals);
router.get("/rentals", getRentals);
router.post("/rentals/:id/return", finalizeRentals);
router.delete("/rentals/:id", deleteRentals);

export default router;