import MedicalReport from '../models/MedicalReport.js'
import Disease from '../models/Disease.js'
import Medicine from '../models/Medicine.js'
import Test from '../models/Test.js'

const getDashboardSummary = async (req, res) => {

  try {

    const userId = req.user._id

    // Counts

    const totalReports = await MedicalReport.countDocuments({
      user: userId
    })

    const totalDiseases = await Disease.countDocuments({
      user: userId
    })

    const totalMedicines = await Medicine.countDocuments({
      user: userId
    })

    const totalTests = await Test.countDocuments({
      user: userId
    })

    // Recent reports

    const recentReports = await MedicalReport.find({
      user: userId
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select(
        'patientName hospitalName shortSummary reportFileName createdAt'
      )

    res.status(200).json({
      success: true,

      dashboard: {

        cards: {
          totalReports,
          totalDiseases,
          totalMedicines,
          totalTests
        },

        recentReports

      }

    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      success: false,
      message: error.message
    })

  }

}

const getUserProfile = async (req, res) => {

  try {

    const user = req.user

    res.status(200).json({
      success: true,

      profile: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        phone: user.phone,
        bloodGroup: user.bloodGroup,
        city: user.city,
        profileImage: user.profileImage
      }

    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      success: false,
      message: error.message
    })

  }

}
export {
  getDashboardSummary,
  getUserProfile
}