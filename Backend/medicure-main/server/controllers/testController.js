// controllers/testController.js

import Test from "../models/Test.js"
// GET ALL TEST

export const getAllTests = async (req, res) => {
  try {

    const tests = await Test.find()
      .populate({
        path: "reports",
        populate: {
          path: "user",
        },
      });

    res.status(200).json({
      success: true,
      count: tests.length,
      tests,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// GET SINGLE TEST

export const getSingleTest = async (req, res) => {
  try {

    const test = await Test.findById(req.params.id)
      .populate({
        path: "reports",
        populate: {
          path: "user",
        },
      });

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    res.status(200).json({
      success: true,
      test,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// GET ALL REPORTS OF TEST

export const getTestReports = async (req, res) => {
  try {

    const test = await Test.findById(req.params.id)
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
            path: "medicines",
          },
        ],
      });

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    res.status(200).json({
      success: true,
      testName: test.name,
      totalReports: test.reports.length,
      reports: test.reports,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};