import express from 'express';
import { matchResume, generateCover } from '../controllers/aiController.js';

const router = express.Router();

router.post('/match', matchResume);
router.post('/cover-letter', generateCover);

export default router;
