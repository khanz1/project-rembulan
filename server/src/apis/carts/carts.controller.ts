import { RequestHandler } from 'express';
import Cart from '../../db/models/cart.model';
import {
  BadRequestError,
  ErrorMessage,
  UnauthorizedError,
} from '../../helpers/http.error';
import Order from '../../db/models/order.model';

export const getCarts: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(new UnauthorizedError(ErrorMessage.InvalidToken));
    }
    const carts = await Cart.findAll({
      where: {
        userId: req.user.id,
      },
    });
    res.json(carts);
  } catch (err) {
    next(err);
  }
};

export const getCartById: RequestHandler = async (req, res, next) => {
  try {
    const cart = await Cart.findByPk(req.params.id, {
      include: {
        model: Order,
      },
    });
    if (!cart) {
      return next(new BadRequestError('Cart not found'));
    }

    res.json(cart);
  } catch (err) {
    next(err);
  }
};

export const applyVoucher: RequestHandler = async (req, res, next) => {
  try {
    const cart = await Cart.findByPk(req.params.id);
    if (!cart) {
      return next(new BadRequestError('Cart not found'));
    }

    if (cart.voucherCode) {
      return next(new BadRequestError('Voucher already applied'));
    }

    await cart.update({
      voucherCode: req.body.voucherCode,
    });

    res.json(cart);
  } catch (err) {
    next(err);
  }
};
