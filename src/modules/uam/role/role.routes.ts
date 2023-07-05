import express from 'express';
import * as cb from './role.controller';
// import * as md from './role.middleware';

const router = express.Router();

router.get('/', cb.listRoles);
router.get('/:id', cb.viewRole);
router.post('/', cb.createRole);
router.patch('/:id', cb.updateRole);
router.delete('/:id', cb.deleteRole);

export default router;
