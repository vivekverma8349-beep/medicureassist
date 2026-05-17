// models/MedicalReport.js

import mongoose from "mongoose";

const medicalReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    patientName: String,

    doctorName: String,

    hospitalName: String,

    department: String,

    visitDate: String,

    nextVisitDate: String,

    reportParagraph: String,

    shortSummary: String,

    extractedText: String,

    reportFileUrl: String,

    reportFileName: String,

    diseases: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Disease",
      },
    ],

    medicines: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medicine",
      },
    ],

    tests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test",
      },
    ],

    reportsIncluded: [String],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("MedicalReport", medicalReportSchema);