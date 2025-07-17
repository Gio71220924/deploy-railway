const express = require("express");
const multer = require("multer");
const Tesseract = require("tesseract.js");
const app = express();
const upload = multer({ storage: multer.memoryStorage() });

module.exports = app.post("/api/ocr", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No image uploaded" });

  try {
    const { data: { text } } = await Tesseract.recognize(
      req.file.buffer,
      "eng+ind", // Ganti sesuai kebutuhan
      { logger: m => console.log(m) }
    );

    res.json({ text });
  } catch (err) {
    res.status(500).json({ error: "OCR failed", detail: err.message });
  }
});
