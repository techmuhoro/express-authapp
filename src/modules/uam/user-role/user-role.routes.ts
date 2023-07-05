import express from 'express';

import * as cb from './user-role.controller';
import * as md from './user-role.middleware';

const router = express.Router();

router.get('/', cb.listUserRoles);
router.get('/:id', cb.viewUserRole);
router.post('/', md.validatePayload, cb.createUserRoles);

export default router;
