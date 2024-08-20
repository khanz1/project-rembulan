import { NextFunction, Request, RequestHandler, Response } from 'express';
import { UnauthorizedError } from '../../helpers/http.error';
import * as Service from './payments.service';
import {
  MIDTRANS_MAX_TRX_AMOUNT,
  TransactionStatus,
} from '../../types/midtrans';
import midtrans from 'midtrans-client';
import { deactivateRecentTry } from './payments.service';

export const getTransactionHistory: RequestHandler = async (req, res, next) => {
  if (!req.user) {
    return next(new UnauthorizedError('Unauthorized'));
  }
  const id = Number(req.params.id);

  try {
    const transactions = await Service.getTransactionHistory(id);

    res.json({
      message: 'Transactions history',
      data: transactions,
    });
  } catch (err) {
    next(err);
  }
};

export const getTransactionsHistory: RequestHandler = async (
  req,
  res,
  next,
) => {
  if (!req.user) {
    return next(new UnauthorizedError('Unauthorized'));
  }

  try {
    const transactions = await Service.getTransactionsHistory(req.user);

    res.json({
      message: 'Transactions history',
      data: transactions,
    });
  } catch (err) {
    next(err);
  }
};

export const createTransactionToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return next(new UnauthorizedError('Unauthorized'));
  }

  const { cartId, amount } = req.body;
  // const cartId = req.body.cartId;
  // const amount = Number(req.body.amount);

  if (amount > MIDTRANS_MAX_TRX_AMOUNT) {
    return next(
      new Error('Transaction amount exceeds the limit. please call the cs'),
    );
  }

  try {
    const pendingTrx = await Service.findUserOnPendingTrx(req.user);
    if (pendingTrx) {
      const pendingTrxAmount = Number(pendingTrx.amount);

      if (pendingTrx.cartId === cartId && pendingTrxAmount === amount) {
        try {
          const midtransTrx = await Service.checkTransactionStatus(
            pendingTrx.orderId,
          );
          if (midtransTrx.transaction_status === TransactionStatus.CAPTURE) {
            return res.json({
              message: 'You have a been completed transaction',
              data: pendingTrx,
            });
          }

          return res.status(200).json({
            message: 'You have pending Transaction',
            data: pendingTrx,
          });
        } catch (err) {
          if (err instanceof midtrans.MidtransError) {
            if (err.ApiResponse.status_code === '404') {
              return res.json({
                message: 'You have a pending transaction',
                data: pendingTrx,
              });
            }
          }
        }
      }

      await Service.deactivateRecentTry(pendingTrx);
      const trx = await Service.createTransaction(req.user, amount, cartId);

      return res.status(201).json({
        message: 'Transaction created',
        data: trx,
      });
    }

    const trx = await Service.createTransaction(req.user, amount, cartId);

    res.status(201).json({
      message: 'Transaction created',
      data: trx,
    });
  } catch (err) {
    next(err);
  }
};

export const transactionSuccess: RequestHandler = async (req, res, next) => {
  if (!req.user) {
    return next(new UnauthorizedError('Unauthorized'));
  }

  try {
    const pendingTrx = await Service.findUserOnPendingTrx(req.user);
    if (!pendingTrx) {
      return res.json({
        message: 'No pending transaction',
      });
    }

    // don't trust the client, always check the transaction status
    // directly to midtrans
    const midtransTrx = await Service.checkTransactionStatus(
      pendingTrx.orderId,
    );
    if (midtransTrx.transaction_status === TransactionStatus.CAPTURE) {
      await Service.updateUserTransaction(pendingTrx.id);
      await Service.updateOrderStatus(pendingTrx.cartId);
      return res.json({
        message: 'Transaction success',
      });
    }

    res.json({
      message: 'Transaction failed',
      data: midtransTrx,
    });
  } catch (err) {
    next(err);
  }
};
