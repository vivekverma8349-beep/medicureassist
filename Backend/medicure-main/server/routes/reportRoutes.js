
import express from "express";
import protect from "../middleware/authMiddleware.js";

import {
  getUserReports,
  getSingleReport,
} from "../controllers/medicalReportController.js";

const router = express.Router();

// GET LOGGED IN USER REPORTS

router.get(
  "/",
  protect,
  async (req, res, next) => {
    req.params.userId = req.user._id;
    next();
  },
  getUserReports
);

// GET REPORTS BY USER ID

router.get(
  "/user/:userId",
  protect,
  getUserReports
);

// GET SINGLE REPORT

router.get(
  "/:reportId",
  protect,
  getSingleReport
);

export default router;