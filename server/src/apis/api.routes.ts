import express from 'express';
import AuthRoutes from './auth/auth.routes';
import MenusRoutes from './menus/menus.routes';
import { errorHandler } from '../middlewares/error';
import OrdersRoutes from './orders/orders.routes';
import { authentication } from '../middlewares/authentication';
import CategoriesRoutes from './categories/categories.routes';
import CartsRoutes from './carts/carts.routes';
import PaymentsRoutes from './payments/payments.routes';

const router = express.Router();

router.use('/api/auth', AuthRoutes);
router.use('/api/menus', authentication, MenusRoutes);
router.use('/api/orders', authentication, OrdersRoutes);
router.use('/api/categories', authentication, CategoriesRoutes);
router.use('/api/carts', authentication, CartsRoutes);
router.use('/api/payments', authentication, PaymentsRoutes);

router.use(errorHandler);

export default router;
