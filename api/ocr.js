const multer = require('multer');
const Tesseract = require('tesseract.js');

const upload = multer({ storage: multer.memoryStorage() });

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Use POST');

  const busboy = require('busboy');
  const bb = busboy({ headers: req.headers });
  let buffer = Buffer.alloc(0);

  bb.on('file', (_name, file) => {
    file.on('data', data => (buffer = Buffer.concat([buffer, data])));
  });

  bb.on('finish', async () => {
    try {
      const {
        data: { text },
      } = await Tesseract.recognize(buffer, 'eng+ind');
      res.json({ text });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  req.pipe(bb);
};
