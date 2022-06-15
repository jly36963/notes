'use strict';
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
router.post('/', upload.single('file'), (req, res) => {
  const { file } = req;
  const fn = file.originalname;
  console.log(fn);
  try {
    return res.status(200).json({ fn });
  } catch (err) {
    return res.status(500).json({ message: 'Error uploading file.' });
  }
});
module.exports = router;
//# sourceMappingURL=save-file.js.map
