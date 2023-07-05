import express from 'express';
import * as cb from './action.controller';
import * as md from './middleware';

const router = express.Router();

router.get('/', cb.listActions);
router.get('/:id', [md.validateViewParams], cb.viewAction);
router.post('/', [md.validatePost], cb.createAction);
router.patch('/:id', [md.requireIdParam], cb.updateAction);
router.delete('/:id', [md.requireIdParam], cb.deleteAction);

export default router;
