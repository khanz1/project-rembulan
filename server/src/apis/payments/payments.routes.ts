import { Router } from 'express';
import * as Controller from './payments.controller';

const router = Router();

router.post('/history', Controller.getTransactionsHistory);
router.post('/history/:id', Controller.getTransactionHistory);
router.post('/token', Controller.createTransactionToken);
router.put('/success', Controller.transactionSuccess);

export default router;
