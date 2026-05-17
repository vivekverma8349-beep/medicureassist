import extractText from "../utils/extractText.js";
import gemini from "../config/gemini.js";

import User from "../models/User.js";
import Disease from "../models/Disease.js";
import Medicine from "../models/Medicine.js";
import Test from "../models/Test.js";
import MedicalReport from "../models/Report.js";

import upload from "../services/imagekit.js"
// CLEAN ARRAY FUNCTI

const cleanArray = (arr = []) => {

  return arr
    .filter(item => typeof item === "string")
    .map(item => item.trim())
    .filter(item => item !== "")
    .filter((item, index, self) =>
      self.indexOf(item) === index
    );
}
// ANALYZE MEDICAL REPO

const analyzeMedicalReport = async (req, res) => {

  try {

    // CHECK USER

    if (!req.user) {

      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = req.user;

    // CHECK FILE

    const file = req.file;

    if (!file) {

      return res.status(400).json({
        success: false,
        message: "No report uploaded",
      });
    }

    // UPLOAD FILE

    const uploadedFile = await upload(file);

    // EXTRACT TEXT

    const extractedText = await extractText(file);

    // GEMINI PROMPT

    const prompt = `
You are a medical report analyzer AI.

Return ONLY valid raw JSON.

Do NOT write:
- markdown
- explanation
- notes
- \`\`\`json
- extra text

Return strictly this structure:

{
  "personalDetails": {
    "patientName": "",
    "age": "",
    "gender": "",
    "doctorName": "",
    "hospitalName": "",
    "department": "",
    "dateOfVisit": "",
    "nextVisitDate": ""
  },

  "reportParagraph": "",

  "diseasesMentioned": [],

  "medicinesPrescribed": [],

  "testsMentioned": [],

  "reportsIncluded": [],

  "shortSummary": ""
}

Medical Report:
${extractedText}
`;

    // GEMINI RESPONSE

    const result = await gemini.generateContent(prompt);

    const response = result.response.text();

    // CLEAN RESPONSE

    const cleanedResponse = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    console.log("CLEANED RESPONSE:");
    console.log(cleanedResponse);

    // PARSE JSON SAFELY

    let analysis;

    try {

      analysis = JSON.parse(cleanedResponse);

    } catch (err) {

      console.log("Invalid Gemini JSON");

      return res.status(500).json({
        success: false,
        message: "AI returned invalid JSON",
      });
    }

    // CLEAN ARRAYS

    analysis.diseasesMentioned = cleanArray(
      analysis.diseasesMentioned
    );

    analysis.medicinesPrescribed = cleanArray(
      analysis.medicinesPrescribed
    );

    analysis.testsMentioned = cleanArray(
      analysis.testsMentioned
    );

    // UPDATE USER

    if (!user.name && analysis.personalDetails.patientName) {
      user.name = analysis.personalDetails.patientName;
    }

    if (!user.age && analysis.personalDetails.age) {
      user.age = analysis.personalDetails.age;
    }

    if (!user.gender && analysis.personalDetails.gender) {
      user.gender = analysis.personalDetails.gender;
    }

    if (
      !user.hospitalName &&
      analysis.personalDetails.hospitalName
    ) {
      user.hospitalName =
        analysis.personalDetails.hospitalName;
    }

    await user.save();

    // CREATE DISEASES

    const diseaseIds = [];

    for (const diseaseName of analysis.diseasesMentioned || []) {

      if (
        !diseaseName ||
        typeof diseaseName !== "string" ||
        diseaseName.trim() === ""
      ) continue;

      let disease = await Disease.findOne({
        user: user._id,
        name: diseaseName.trim(),
      });

      if (!disease) {

        disease = await Disease.create({
          user: user._id,
          name: diseaseName.trim(),
        });
      }

      diseaseIds.push(disease._id);
    }

    // CREATE MEDICINES

    const medicineIds = [];

    for (const medicineName of analysis.medicinesPrescribed || []) {

      if (
        !medicineName ||
        typeof medicineName !== "string" ||
        medicineName.trim() === ""
      ) continue;

      let medicine = await Medicine.findOne({
        user: user._id,
        name: medicineName.trim(),
      });

      if (!medicine) {

        medicine = await Medicine.create({
          user: user._id,
          name: medicineName.trim(),
        });
      }

      medicineIds.push(medicine._id);
    }

    // CREATE TESTS

    const testIds = [];

    for (const testName of analysis.testsMentioned || []) {

      if (
        !testName ||
        typeof testName !== "string" ||
        testName.trim() === ""
      ) continue;

      let test = await Test.findOne({
        user: user._id,
        name: testName.trim(),
      });

      if (!test) {

        test = await Test.create({
          user: user._id,
          name: testName.trim(),
        });
      }

      testIds.push(test._id);
    }

    // CREATE MEDICAL REPORT

    const medicalReport = await MedicalReport.create({

      user: user._id,

      patientName:
        analysis.personalDetails.patientName,

      doctorName:
        analysis.personalDetails.doctorName,

      hospitalName:
        analysis.personalDetails.hospitalName,

      department:
        analysis.personalDetails.department,

      visitDate:
        analysis.personalDetails.dateOfVisit,

      nextVisitDate:
        analysis.personalDetails.nextVisitDate,

      reportParagraph:
        analysis.reportParagraph,

      shortSummary:
        analysis.shortSummary,

      extractedText,

      reportFileUrl: uploadedFile.url,

      reportFileName: uploadedFile.name,

      diseases: diseaseIds,

      medicines: medicineIds,

      tests: testIds,

      reportsIncluded:
        analysis.reportsIncluded,
    });

    // LINK REPORTS

    await Disease.updateMany(
      {
        _id: { $in: diseaseIds },
      },
      {
        $addToSet: {
          reports: medicalReport._id,
        },
      }
    );

    await Medicine.updateMany(
      {
        _id: { $in: medicineIds },
      },
      {
        $addToSet: {
          reports: medicalReport._id,
        },
      }
    );

    await Test.updateMany(
      {
        _id: { $in: testIds },
      },
      {
        $addToSet: {
          reports: medicalReport._id,
        },
      }
    );

    // RESPONSE

    res.status(200).json({

      success: true,

      sections: [

        {
          type: "summary",
          title: "Summary",
          content: analysis.shortSummary,
        },

        {
          type: "patient",
          title: "Patient Details",

          content: [

            {
              label: "Patient Name",
              value:
                analysis.personalDetails.patientName,
            },

            {
              label: "Doctor Name",
              value:
                analysis.personalDetails.doctorName,
            },

            {
              label: "Hospital",
              value:
                analysis.personalDetails.hospitalName,
            },

            {
              label: "Department",
              value:
                analysis.personalDetails.department,
            },

            {
              label: "Visit Date",
              value:
                analysis.personalDetails.dateOfVisit,
            },
          ],
        },

        {
          type: "analysis",
          title: "Detailed Analysis",
          content: analysis.reportParagraph,
        },

        {
          type: "diseases",
          title: "Diseases Detected",
          content: analysis.diseasesMentioned,
        },

        {
          type: "medicines",
          title: "Medicines Prescribed",
          content: analysis.medicinesPrescribed,
        },

        {
          type: "tests",
          title: "Tests Mentioned",
          content: analysis.testsMentioned,
        },
      ],
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default analyzeMedicalReport;