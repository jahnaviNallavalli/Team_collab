const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from 'public' folder
app.use(express.static('public'));

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// In-memory array to track uploaded metadata
const uploadedData = [];

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Upload route
app.post('/upload', upload.array('files'), (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const uploadedFiles = req.files;

  if (!title || uploadedFiles.length === 0) {
    return res.status(400).json({ message: "Missing title or files." });
  }

  // Store file data
  uploadedFiles.forEach(file => {
    uploadedData.push({
      title,
      description,
      filename: file.filename
    });
  });

  res.json({
    message: 'Upload successful!',
    files: uploadedFiles.map(f => f.filename),
    title,
    description
  });
});

// GET endpoint to return list of uploaded files
app.get('/files', (req, res) => {
  res.json(uploadedData);
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
