import express from 'express';
import * as cb from './permission.controller';
import * as md from './permission.middleware';

const router = express.Router();

router.get('/', cb.listPermission);
router.get('/:id', md.requireIdParam, cb.viewPermission);
router.post('/', md.validatePostPayload, cb.createPermission);
router.delete('/:id', md.requireIdParam, cb.deletePermission);

export default router;
