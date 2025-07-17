const Tesseract = require("tesseract.js");
const Busboy = require("busboy");

module.exports = (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const bb = Busboy({ headers: req.headers });
  let buffer = Buffer.alloc(0);

  bb.on("file", (_name, file) => {
    file.on("data", (data) => {
      buffer = Buffer.concat([buffer, data]);
    });
  });

  bb.on("finish", async () => {
    try {
      const {
        data: { text },
      } = await Tesseract.recognize(buffer, "eng+ind");
      res.status(200).json({ text });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  req.pipe(bb);
};
