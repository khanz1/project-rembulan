import { RequestHandler } from 'express';
import Menu from '../../db/models/menu.model';
import Category from '../../db/models/category.model';
import { BadRequestError } from '../../helpers/http.error';
import Order from '../../db/models/order.model';

export const getMenus: RequestHandler = async (req, res, next) => {
  try {
    const menus = await Menu.findAll({
      include: [Category, Order],
    });
    res.json(menus);
  } catch (err) {
    next(err);
  }
};

export const getMenuById: RequestHandler = async (req, res, next) => {
  try {
    const menu = await Menu.findByPk(req.params.id);
    if (!menu) {
      return next(new BadRequestError('Menu not found'));
    }

    res.json(menu);
  } catch (err) {
    next(err);
  }
};
