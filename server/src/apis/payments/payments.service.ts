import { v4 as uuidV4 } from 'uuid';
import { core, snap } from './payments.helper';
// import { serialize } from 'superjson';
import { TransactionStatus } from '../../types/midtrans';
import User from '../../db/models/user.model';
import Payment, { TrxStatus } from '../../db/models/payment.model';
import Cart from '../../db/models/cart.model';
import Order, { OrderStatus } from '../../db/models/order.model';
import Menu from '../../db/models/menu.model';
import Voucher from '../../db/models/voucer.model';
import { NotFoundError } from '../../helpers/http.error';

// type SerializedTrx = Payment & { amount: string };

export const getTransactionHistory = async (id: number) => {
  return Payment.findByPk(id, {
    attributes: ['id', 'amount', 'status', 'createdAt'],
    include: [
      {
        model: User,
      },
      {
        model: Cart,
        attributes: ['id', 'taxPer'],
        include: [
          {
            model: Voucher,
          },
          {
            model: Order,
            attributes: ['id', 'quantity', 'createdAt'],
            where: {
              status: OrderStatus.COMPLETED,
            },
            include: [
              {
                model: Menu,
              },
            ],
          },
        ],
      },
    ],
  });
};

export const getTransactionsHistory = async (user: User) => {
  return Payment.findAll({
    where: {
      payerId: user.id,
      status: TrxStatus.PAID,
    },
    attributes: ['id', 'amount', 'status', 'createdAt'],
    include: [
      {
        model: User,
      },
      {
        model: Cart,
        attributes: ['id', 'taxPer'],
        include: [
          {
            model: Voucher,
          },
          {
            model: Order,
            attributes: ['id', 'quantity', 'createdAt'],
            include: [
              {
                model: Menu,
              },
            ],
          },
        ],
      },
    ],
  });
};

export const deactivateRecentTry = async (trx: Payment) => {
  await trx.update({
    status: TrxStatus.FAILED_NEW_TRX,
  });
};

export const checkIsUserMakeNewTrx = async (
  user: User,
  cartId: number,
  amount: number,
) => {
  const trx = await Payment.findOne({
    where: {
      payerId: user.id,
      cartId,
      amount,
    },
  });

  return {
    status: !trx,
    recentTrx: trx,
  };
};

export const findUserOnPendingTrx = async (user: User) => {
  const trx = await Payment.findOne({
    where: {
      payerId: user.id,
      status: TransactionStatus.PENDING,
    },
  });

  if (!trx) return null;

  // const { json } = serialize(trx);
  //
  // return json as unknown as SerializedTrx;

  return trx;
};

export const createTransaction = async (
  user: User,
  amount: number,
  cartId: number,
) => {
  const orderId = `TRX-${uuidV4()}`;

  // I. 2. Create Transaction to midtrans
  const transaction = await snap.createTransaction({
    transaction_details: {
      order_id: orderId,
      gross_amount: amount,
    },
    credit_card: {
      secure: true,
    },
    customer_details: {
      first_name: user.name,
      email: user.email,
    },
    item_details: [
      {
        id: '1',
        price: amount,
        quantity: 1,
        name: 'Premium Membership - 1 Month',
      },
    ],
  });

  const trx = await Payment.create({
    orderId: orderId,
    trxToken: transaction.token,
    amount,
    status: TrxStatus.PENDING,
    payerId: user.id,
    cartId,
  });

  // const { json } = serialize(trx);
  //
  // return json as unknown as SerializedTrx;

  return trx;
};

export const updateUserTransaction = async (id: number) => {
  return Payment.update(
    {
      status: TrxStatus.PAID,
      paidAt: new Date(),
    },
    {
      where: {
        id,
      },
    },
  );
};

export const updateOrderStatus = async (cartId: number) => {
  const cart = await Cart.findByPk(cartId, {
    include: [
      {
        model: Order,
      },
    ],
  });
  if (!cart) {
    throw new NotFoundError('Cart not found');
  }
  await cart.update({ status: OrderStatus.COMPLETED });

  for (const order of cart.orders) {
    await order.update({
      status: OrderStatus.COMPLETED,
    });
  }

  return true;
};

export const checkTransactionStatus = (trxId: string) => {
  return core.transaction.status(trxId);
};
