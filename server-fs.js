const express = require('express');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Configure upload directory (create it if it doesn't exist)
const uploadDir = 'uploads';
fs.mkdirSync(uploadDir, { recursive: true });

// Route for uploading a file
app.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ message: 'No file uploaded!' });
  }

  const uploadedFile = req.files.file;
  const filename = uploadedFile.name;
  const filePath = `${uploadDir}/${filename}`;

  // Use fs.rename to move the uploaded file with original filename
  uploadedFile.mv(filePath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error uploading file!' });
    }
    res.json({ message: 'File uploaded successfully!', filename });
  });
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
