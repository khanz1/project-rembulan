import { v4 as uuidV4 } from 'uuid';
import { core, snap } from './payments.helper';
import { serialize } from 'superjson';
import { TransactionStatus } from '../../types/midtrans';
import User from '../../db/models/user.model';
import Payment, { TrxStatus } from '../../db/models/payment.model';

type SerializedTrx = Payment & { amount: string };

export const findUserOnPendingTrx = async (user: User) => {
  const trx = await Payment.findOne({
    where: {
      payerId: user.id,
      status: TransactionStatus.PENDING,
    },
  });

  if (!trx) return null;

  const { json } = serialize(trx);

  return json as unknown as SerializedTrx;
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

  const { json } = serialize(trx);

  return json as unknown as SerializedTrx;
};

export const updateUserTransaction = async (id: string) => {
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

export const checkTransactionStatus = (trxId: string) => {
  return core.transaction.status(trxId);
};
