// imports
const express = require('express');
const router = express.Router();

// multer
const multer = require('multer');
const upload = multer();

// @route -- POST /api/file/save-files
// @desc -- get files from multi-part form request
// @access -- public

router.post('/', upload.array('files', 10), (req, res) => {
  // fieldname -- form field name (argument for upload.single())
  // originalname -- file name
  // buffer -- data (bytes)
  const { files } = req;
  const fileNames = [];
  files.forEach((file) => {
    fileNames.push(file.originalname);
  });
  // ***
  // use "for ... in ..." loop if doing async stuff (fs, s3, etc)
  // promises/async not supported in forEach, map, etc
  // ***
  try {
    return res.json({ data: fileNames, error: null });
  } catch (err) {
    return res.status(500).json({ data: null, error: err.message });
  }
});
module.exports = router;
