// imports
const express = require('express');
const router = express.Router();

// multer
const multer = require('multer');
const upload = multer();

// @route -- POST /api/file/save-file
// @desc -- get file from multi-part form request
// @access -- public

router.post('/', upload.single('file'), (req, res) => {
  const { file } = req;
  // fieldname -- form field name (argument for upload.single())
  // originalname -- file name
  // buffer -- data (bytes)
  console.log(file);
  try {
    return res.json({ data: file.originalname, error: null });
  } catch (err) {
    return res.status(500).json({ data: null, error: err.message });
  }
});
module.exports = router;
