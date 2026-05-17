import pdfParse from "pdf-parse";
import Tesseract from "tesseract.js";

const extractText = async (file) => {
  try {
    // Check file
    if (!file) {
      throw new Error("No file uploaded");
    }

    let extractedText = "";

    // PDF TEXT EXTRACTION
    if (file.mimetype === "application/pdf") {

      const data = await pdfParse(file.buffer);

      extractedText = data.text;
    }

    // IMAGE OCR
    else if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg"
    ) {

      const result = await Tesseract.recognize(
        file.buffer,
        "eng"
      );

      extractedText = result.data.text;
    }

    // UNSUPPORTED FILE
    else {
      throw new Error("Unsupported file type");
    }

    // Empty text check
    if (!extractedText || extractedText.trim() === "") {
      throw new Error("No text found in file");
    }

    // Return extracted text
    return extractedText;

  } catch (error) {

    console.error("Error extracting text:", error.message);

    throw error;
  }
};

export default extractText;