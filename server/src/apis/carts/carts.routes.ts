import express from 'express';
import * as Controller from './carts.controller';

const router = express.Router();

router.get('/', Controller.getCarts);
router.get('/active', Controller.getActiveCartByUserId);
router.get('/:id', Controller.getCartById);
router.patch('/:id/vouchers', Controller.applyVoucher);

export default router;
