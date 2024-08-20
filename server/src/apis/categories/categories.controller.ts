import { RequestHandler } from 'express';
import Menu from '../../db/models/menu.model';
import Category from '../../db/models/category.model';
import { NotFoundError, UnauthorizedError } from '../../helpers/http.error';
import Order, { OrderStatus } from '../../db/models/order.model';

export const getCategories: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(new UnauthorizedError('Unauthorized'));
    }
    const menus = await Category.findAll({
      include: [
        {
          model: Menu,
          order: [['id', 'desc']],
          include: [
            {
              model: Order,
              required: false,
              where: {
                status: OrderStatus.PENDING,
              },
            },
          ],
        },
      ],
    });
    res.json(menus);
  } catch (err) {
    next(err);
  }
};

export const getCategoryById: RequestHandler = async (req, res, next) => {
  try {
    const menu = await Category.findByPk(req.params.id, {
      include: [
        {
          model: Menu,
          include: [
            {
              model: Order,
              where: {
                status: OrderStatus.PENDING,
              },
            },
          ],
        },
      ],
    });
    if (!menu) {
      return next(new NotFoundError('Category not found'));
    }

    res.json(menu);
  } catch (err) {
    next(err);
  }
};
