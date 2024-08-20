import { RequestHandler } from 'express';
import Cart from '../../db/models/cart.model';
import {
  BadRequestError,
  ErrorMessage,
  UnauthorizedError,
} from '../../helpers/http.error';
import Order, { OrderStatus } from '../../db/models/order.model';
import Menu from '../../db/models/menu.model';
import User from '../../db/models/user.model';

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

    if (cart.voucher.code) {
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

export const getActiveCartByUserId: RequestHandler = async (req, res, next) => {
  if (!req.user) {
    return next(new UnauthorizedError(ErrorMessage.InvalidToken));
  }

  try {
    const cart = await Cart.findOne({
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email', 'balance'],
        },
        {
          model: Order,
          required: false,
          attributes: {
            exclude: ['menuId', 'userId', 'cartId'],
          },
          // where: {
          //   status: OrderStatus.PENDING,
          // },
          include: [
            {
              model: Menu,
            },
          ],
        },
      ],
      where: {
        userId: req.user.id,
        status: OrderStatus.PENDING,
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
