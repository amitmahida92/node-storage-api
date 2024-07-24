const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");

const app = express();

// Configure upload directory (create it if it doesn't exist)
const uploadDir = "uploads";
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage }); // Configure upload directory

app.use(cors()); // Enable CORS

// Route for uploading a file
app.post("/upload", upload.array("files"), (req, res) => {
  const uploadedFiles = req.files;
  if (uploadedFiles?.length) {
    res.json({ message: "File uploaded successfully!", files: uploadedFiles });
  } else {
    res.status(400).json({ message: "Error uploading file!" });
  }
});

// Route for downloading a file
app.get("/download/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = `${__dirname}/uploads/${filename}`;
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).json({ message: "File not found!" });
    } else {
      console.log("File downloaded successfully!");
    }
  });
});

const port = process.env.PORT || 3000; // Use environment variable or default port 3000
app.listen(port, () => console.log(`Server listening on port ${port}`));
