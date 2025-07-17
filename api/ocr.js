const multer = require("multer");
const Tesseract = require("tesseract.js");

const upload = multer({ storage: multer.memoryStorage() });

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  // Parse file from form-data
  const busboy = require('busboy');
  const bb = busboy({ headers: req.headers });
  let fileBuffer = Buffer.alloc(0);

  bb.on('file', (name, file) => {
    file.on('data', (data) => {
      fileBuffer = Buffer.concat([fileBuffer, data]);
    });
  });

  bb.on('finish', async () => {
    try {
      const { data: { text } } = await Tesseract.recognize(fileBuffer, "eng+ind");
      return res.status(200).json({ text });
    } catch (err) {
      return res.status(500).json({ error: "OCR failed", detail: err.message });
    }
  });

  req.pipe(bb);
};
