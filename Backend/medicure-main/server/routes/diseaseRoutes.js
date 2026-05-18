import express from 'express'
import Disease from '../models/Disease.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()

// GET ALL DISEASES
router.get('/', protect, async (req, res) => {

  try {

    const diseases = await Disease.find({
      user: req.user._id
    }).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      diseases
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      success: false,
      message: error.message
    })

  }

})

export default router