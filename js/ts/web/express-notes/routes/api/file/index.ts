// imports
import express from 'express';
const router = express.Router();
import auth from '../../../middleware/auth';
// multer
import multer from 'multer';
const upload = multer();

// @route -- POST /api/file/single
// @desc -- get file from multi-part form request
// @access -- protected

interface RequestWithMulterSingle extends express.Request {
  file: Express.Multer.File;
}

router.post(
  '/single',
  auth,
  upload.single('file'),
  (req: RequestWithMulterSingle, res: express.Response) => {
    try {
      const { file } = req;
      const filename: string = file.originalname;
      return res.status(200).json({ filename });
    } catch (err) {
      return res.status(500).json({ message: 'Error uploading file.' });
    }
  },
);

// @route -- POST /api/file/array
// @desc -- get files from multi-part form request
// @access -- protected

// for (const file of files) {
//   fileNames.push(file.originalname);
// }

interface RequestWithMulterArray extends express.Request {
  files: Array<Express.Multer.File>;
}

router.post(
  '/array',
  auth,
  upload.array('files', 10),
  (req: RequestWithMulterArray, res: express.Response) => {
    const files: Array<Express.Multer.File> = req.files;
    const filenames: Array<String> = [];
    files.forEach((file: Express.Multer.File) => {
      filenames.push(file.originalname);
    });

    try {
      return res.status(200).json({ filenames });
    } catch (err) {
      return res.status(500).json({ message: 'Error while uploading files.' });
    }
  },
);

export default router;

// fieldname -- form field name (argument for upload.single())
// originalname -- file name
// buffer -- data (bytes)

// ***
// use "for ... in ..." loop if doing async stuff (fs, s3, etc)
// promises/async not supported in forEach, map, etc
// ***
