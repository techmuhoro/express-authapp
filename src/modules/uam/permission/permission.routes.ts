import express from 'express';
import * as cb from './permission.controller';
import * as md from './permission.middleware';

const router = express.Router();

router.get('/', cb.listPermission);
router.post('/', md.validatePostPayload, cb.createPermission);

export default router;
