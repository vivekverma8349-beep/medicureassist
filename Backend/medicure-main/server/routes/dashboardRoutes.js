import express from 'express'

import protect from '../middleware/authMiddleware.js'

import {
  getDashboardSummary,
  getUserProfile,
  getBMI
} from '../controllers/dashboardController.js'

const router = express.Router()

router.get(
  '/summary',
  protect,
  getDashboardSummary
)

router.get(
  '/profile',
  protect,
  getUserProfile
)

router.post(
  '/bmi',
  protect,
  getBMI
)

export default router