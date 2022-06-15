'use strict';
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
router.post('/', upload.array('files', 10), (req, res) => {
  const files = req.files;
  const fileNames = [];
  files.forEach((file) => {
    fileNames.push(file.originalname);
  });
  try {
    return res.status(200).json({ fileNames });
  } catch (err) {
    return res.status(500).json({ message: 'Error while uploading files.' });
  }
});
module.exports = router;
//# sourceMappingURL=save-files.js.map
