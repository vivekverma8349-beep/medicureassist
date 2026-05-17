// controllers/medicineController.js

import Medicine from "../models/Medicine.js";

// GET ALL MEDICINES

export const getAllMedicines = async (req, res) => {
  try {

    const medicines = await Medicine.find()
      .populate({
        path: "reports",
        populate: {
          path: "user",
        },
      });

    res.status(200).json({
      success: true,
      count: medicines.length,
      medicines,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// GET SINGLE MEDICINE

export const getSingleMedicine = async (req, res) => {
  try {

    const medicine = await Medicine.findById(req.params.id)
      .populate({
        path: "reports",
        populate: {
          path: "user",
        },
      });

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    res.status(200).json({
      success: true,
      medicine,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// GET ALL REPORTS OF MEDICINE

export const getMedicineReports = async (req, res) => {
  try {

    const medicine = await Medicine.findById(req.params.id)
      .populate({
        path: "reports",
        populate: [
          {
            path: "user",
          },
          {
            path: "diseases",
          },
          {
            path: "tests",
          },
        ],
      });

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    res.status(200).json({
      success: true,
      medicineName: medicine.name,
      totalReports: medicine.reports.length,
      reports: medicine.reports,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};