import express from 'express';
import * as Controller from './orders.controller';

const router = express.Router();

router.get('/', Controller.handleGetOrders);
router.get('/:id', Controller.handleGetOrderById);
router.post('/', Controller.handleCreateOrder);
router.patch('/:id/quantity', Controller.handleUpdateQuantity);
router.delete('/:id');

export default router;
