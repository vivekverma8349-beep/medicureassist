// routes/medicineRoutes.js

import express from "express";

import {
  getAllMedicines,
  getSingleMedicine,
  getMedicineReports,
} from "../controllers/medicineController.js";

const router = express.Router();

// ROUTES

router.get("/", getAllMedicines);

router.get("/:id", getSingleMedicine);

router.get("/:id/reports", getMedicineReports);

export default router;