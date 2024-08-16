import express from 'express';
import AuthRoutes from './auth/auth.routes';
import MenusRoutes from './menus/menus.routes';
import { errorHandler } from '../middlewares/error';
import OrdersRoutes from './orders/orders.routes';
import { authentication } from '../middlewares/authentication';

const router = express.Router();

router.use('/auth', AuthRoutes);
router.use('/menus', authentication, MenusRoutes);
router.use('/orders', authentication, OrdersRoutes);

router.use(errorHandler);

export default router;
