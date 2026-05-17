// routes/testRoutes.js

import express from "express";

import {
  getAllTests,
  getSingleTest,
  getTestReports,
} from "../controllers/testController.js";

const router = express.Router();


// ROUTES


router.get("/", getAllTests);

router.get("/:id", getSingleTest);

router.get("/:id/reports", getTestReports);

export default router;