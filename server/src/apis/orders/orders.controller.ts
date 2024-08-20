import Order, {
  OrderQuantityValidationSchema,
  OrderStatus,
  OrderValidationSchema,
} from '../../db/models/order.model';
import { RequestHandler } from 'express';
import {
  BadRequestError,
  ErrorMessage,
  UnauthorizedError,
} from '../../helpers/http.error';
import Cart from '../../db/models/cart.model';

export const handleGetOrders: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(new UnauthorizedError(ErrorMessage.InvalidToken));
    }
    const orders = await Order.findAll({
      where: {
        userId: req.user.id,
      },
    });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

export const handleGetOrderById: RequestHandler = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return next(new BadRequestError('Order not found'));
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
};

export const handleCreateOrder: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(new UnauthorizedError(ErrorMessage.InvalidToken));
    }
    const result = await OrderValidationSchema.parseAsync(req.body);

    const [cart] = await Cart.findOrCreate({
      where: {
        userId: req.user.id,
        status: OrderStatus.PENDING,
      },
      defaults: {
        userId: req.user.id,
        taxPer: 11,
      },
    });

    const [order, created] = await Order.findOrCreate({
      where: {
        menuId: result.menuId,
        cartId: cart.id,
        userId: req.user.id,
      },
      defaults: {
        menuId: result.menuId,
        cartId: cart.id,
        userId: req.user.id,
      },
    });

    if (!created) {
      await order.increment('quantity');
    }

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

export const handleUpdateQuantity: RequestHandler = async (req, res, next) => {
  try {
    const result = await OrderQuantityValidationSchema.parseAsync({
      id: req.params.id,
      quantity: req.body.quantity,
      type: req.body.type,
    });

    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return next(new BadRequestError('Order not found'));
    }

    if (result.type === 'increment') {
      await order.increment('quantity');
    } else if (result.type === 'decrement') {
      if (order.quantity === 1) {
        await order.destroy();
        return res.json({ message: 'Order deleted' });
      }

      await order.decrement('quantity');
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
};
