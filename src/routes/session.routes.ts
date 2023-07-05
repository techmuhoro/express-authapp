import express, { Request, Response } from 'express';
import {
    getSession,
    createSession,
    deleteSession,
} from '../controllers/session.controller';
import { requireUser } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', requireUser, getSession);
router.post('/', createSession);
router.delete('/', deleteSession);

export default router;
