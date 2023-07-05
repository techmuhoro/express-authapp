import express from 'express';
import * as cb from './actionCategory.controller';
import {
    validateViewPayload,
    validateCreatePayload,
    validatePatch,
} from './middleware';

const router = express.Router();

router.get('/', cb.listActionCategories);
router.get('/:id', validateViewPayload, cb.viewActionCategory);
router.post('/', validateCreatePayload, cb.createActionCategory);
router.patch('/:id', validatePatch, cb.updateActionCategory);
router.delete('/:id', cb.deleteActionCategory);

export default router;
