// models/Medicine.js

import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      
    },

    purpose: String,

    dosage: String,

    timing: String,

    duration: String,

    reports: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MedicalReport",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Medicine", medicineSchema);