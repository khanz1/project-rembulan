import express from 'express';
import * as Controller from './menus.controller';

const router = express.Router();

router.get('/', Controller.getMenus);
router.get('/:id', Controller.getMenuById);

export default router;
