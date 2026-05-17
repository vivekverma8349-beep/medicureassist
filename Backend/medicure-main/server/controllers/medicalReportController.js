// controllers/medicalReportController.js

import MedicalReport from "../models/Report.js";


// GET ALL REPORTS OF A USER


export const getUserReports = async (req, res) => {
  try {

    const { userId } = req.params;

    const reports = await MedicalReport.find({
      user: userId,
    })
      .populate("user")
      .populate("diseases")
      .populate("medicines")
      .populate("tests")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalReports: reports.length,
      reports,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// GET SINGLE REPORT


export const getSingleReport = async (req, res) => {
  try {

    const { reportId } = req.params;

    const report = await MedicalReport.findById(reportId)
      .populate("user")
      .populate("diseases")
      .populate("medicines")
      .populate("tests");

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    res.status(200).json({
      success: true,
      report,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};