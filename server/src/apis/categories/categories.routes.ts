import express from 'express';
import * as Controller from './categories.controller';

const router = express.Router();

router.get('/', Controller.getCategories);
router.get('/:id', Controller.getCategoryById);

export default router;
