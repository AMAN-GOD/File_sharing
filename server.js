const express = require('express');
const multer = require('multer');
const { bucket } = require('./firebase');
const { encryptFile, decryptFile } = require('./encryption');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Upload endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    const encrypted = encryptFile(fileBuffer);

    const file = bucket.file(req.file.originalname);
    await file.save(encrypted.encryptedData, { metadata: { iv: encrypted.iv } });

    res.status(200).send('File uploaded and encrypted!');
  } catch (error) {
    res.status(500).send('Error uploading file: ' + error.message);
  }
});

// Download endpoint
app.get('/download/:filename', async (req, res) => {
  try {
    const file = bucket.file(req.params.filename);
    const [metadata] = await file.getMetadata();
    const [data] = await file.download();

    const decrypted = decryptFile({
      iv: metadata.metadata.iv,
      encryptedData: data.toString('hex')
    });

    res.setHeader('Content-Disposition', `attachment; filename=${req.params.filename}`);
    res.send(decrypted);
  } catch (error) {
    res.status(500).send('Error downloading file: ' + error.message);
  }
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});