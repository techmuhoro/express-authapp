import express from 'express';
import * as cb from './session.controller';
import * as md from './session.middleware';

const router = express.Router();

router.get('/', md.requireUser, cb.getSession);
router.post('/', cb.createSession);
router.delete('/', md.requireUser, cb.deleteSession);

export default router;
