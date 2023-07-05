import express from 'express';
import * as cb from './user.controller';
import * as md from './user.middleware';

const router = express.Router();

router.get('/', cb.listUsers);
router.get('/:id', cb.viewUser);
router.post('/', md.validateUserCreate, cb.createUser);
router.post('/change-password', md.validateChangePass, cb.changePassword);
router.post('/reset-password', cb.resetPassword);

export default router;
