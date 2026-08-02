import express from 'express';
import multer from 'multer';
import { matchResume, generateCover, matchResumePdf } from '../controllers/aiController.js';
import { validateMatchBody, validateCoverBody } from '../middleware/validators.js';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF resumes are supported.'));
    }
    cb(null, true);
  }
});

router.post('/match', validateMatchBody, matchResume);
router.post('/match-pdf', upload.single('resume'), matchResumePdf);
router.post('/cover-letter', validateCoverBody, generateCover);

export default router;
