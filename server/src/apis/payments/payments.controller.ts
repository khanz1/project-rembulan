import { NextFunction, Request, RequestHandler, Response } from 'express';
import { UnauthorizedError } from '../../helpers/http.error';
import * as Service from './payments.service';
import {
  MIDTRANS_MAX_TRX_AMOUNT,
  TransactionStatus,
} from '../../types/midtrans';
import midtrans from 'midtrans-client';

export const createTransactionToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return next(new UnauthorizedError('Unauthorized'));
  }

  const { cartId, amount } = req.body;

  if (amount > MIDTRANS_MAX_TRX_AMOUNT) {
    return next(
      new Error('Transaction amount exceeds the limit. please call the cs'),
    );
  }

  try {
    const pendingTrx = await Service.findUserOnPendingTrx(req.user);
    if (pendingTrx) {
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
      await Service.updateUserTransaction(pendingTrx.orderId);
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
