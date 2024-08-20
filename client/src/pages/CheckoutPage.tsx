import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { formatPrice } from '../helpers/formatter.ts';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store';
import { fetchCart, updateOrderQuantity } from '../store/cart/cartSlice.ts';
import { SnapWindow } from '../types/midtrans.ts';
import {
  IconArrowLeft,
  IconMinus,
  IconMoneybag,
  IconPlus,
} from '@tabler/icons-react';
import { UpdateQuantity } from '../store/menu/menuSlice.ts';
import {
  getTransactionToken,
  updatePaymentStatus,
} from '../store/payment/trxSlice.ts';
import { errorAlert } from '../helpers/alert.ts';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { data, subTotal, tax, total } = useSelector(
    (state: RootState) => state.cart,
  );
  const dispatch = useAppDispatch();
  const [, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchCart());
  }, []);

  const handleUpdateQuantity = async (id: number, type: UpdateQuantity) => {
    await dispatch(updateOrderQuantity({ id, type }));
    await dispatch(fetchCart());
  };

  const handlePay = async () => {
    if (!data) {
      errorAlert('No item can be processed');
      return;
    }
    const response = await dispatch(getTransactionToken(total, data?.id));

    setLoading(false);
    (window as SnapWindow).snap.pay(response.data.trxToken, {
      onSuccess: async function () {
        await dispatch(updatePaymentStatus());

        navigate('/order/completed');
      },
    });
  };

  if (!data) {
    return null;
  }

  return (
    <div className="container px-5 py-2">
      <div className="flex gap-3 items-center py-2">
        <IconArrowLeft className="font-bold" />
        <h1 className="text-xl">Checkout</h1>
      </div>
      <div className="py-5">
        {data.orders.map(order => (
          <div key={order.id} className="flex justify-between gap-5">
            <div className="w-4/6">
              <h3 className="font-bold">{order.menu.name}</h3>
              <h5>{formatPrice(order.quantity * Number(order.menu.price))}</h5>
            </div>
            <div className="w-2/6">
              <div>
                <img
                  src={order.menu.imgUrl}
                  className="w-full h-24 rounded object-cover"
                  alt={order.menu.name}
                />
              </div>
              <div className="py-5 rounded-full flex justify-around items-center p-1">
                <button
                  onClick={() =>
                    handleUpdateQuantity(order.id, UpdateQuantity.DECREMENT)
                  }
                  className="rounded-full border border-amber-300"
                >
                  <IconMinus className="text-amber-600" />
                </button>
                <div className="text-lg text-stone-700">{order.quantity}</div>
                <button
                  onClick={() =>
                    handleUpdateQuantity(order.id, UpdateQuantity.INCREMENT)
                  }
                  className="rounded-full border border-amber-300"
                >
                  <IconPlus className="text-amber-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between border-t border-b py-5 my-5">
        <div>
          <h3 className="font-bold text-lg">Need anything else?</h3>
          <p>Add other dishes, if you want.</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="rounded-full hover:bg-amber-400 px-3 border border-amber-400"
        >
          Add more
        </button>
      </div>
      <div className="p-3 border rounded-xl border-amber-300">
        <div className="border-b flex flex-col gap-3 py-2">
          <div className="flex justify-between">
            <h5>Price</h5>
            <h5>{formatPrice(subTotal, 'IDR', 'id-ID', true)}</h5>
          </div>
          <div className="flex justify-between">
            <h5>Tax (11%)</h5>
            <h5>{formatPrice(tax, 'IDR', 'id-ID', true)}</h5>
          </div>
        </div>
        <div className="flex justify-between pt-5 pb-2">
          <h5 className="font-bold">Total payment</h5>
          <h5>{formatPrice(total, 'IDR', 'id-ID', true)}</h5>
        </div>
      </div>
      <div className="mb-32" />
      <div className="w-full fixed bottom-0 left-0 h-28 p-2 bg-amber-300 flex flex-col justify-center">
        <div className="flex gap-3 py-2">
          <IconMoneybag />{' '}
          <h5 className="font-bold">
            {formatPrice(total, 'IDR', 'id-ID', true)}
          </h5>
        </div>
        <div className="text-stone-700 w-full h-full rounded-full bg-amber-100 flex justify-between items-center py-2 px-5">
          <button onClick={handlePay} className="font-bold m-auto text-xl">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
