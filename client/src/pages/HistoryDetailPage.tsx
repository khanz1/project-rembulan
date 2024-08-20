import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { formatPrice } from '../helpers/formatter.ts';
import { IconArrowLeft } from '@tabler/icons-react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store';
import { fetchTransactionById } from '../store/payment/trxSlice.ts';

export default function HistoryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data, subTotal, tax, total } = useSelector(
    (state: RootState) => state.transactions.detail,
  );

  useEffect(() => {
    dispatch(fetchTransactionById(Number(id)));
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }
  return (
    <div className="p-5 min-h-screen bg-amber-100">
      <button className="flex items-center gap-2 pb-2">
        <IconArrowLeft />
        <h5 className="text-xl" onClick={() => navigate(-1)}>
          Back
        </h5>
      </button>
      <div className="">
        <div className="flex flex-col gap-1">
          {data.cart.orders.map(order => (
            <div className="flex justify-between">
              <div className="w-4/6 flex flex-col gap-2 justify-center">
                <h2 className="font-bold">
                  {order.quantity}x {order.menu.name}
                </h2>
                <h2 className="font-bold">
                  {formatPrice(order.quantity * Number(order.menu.price))}
                </h2>
              </div>
              <div className="w-2/6 flex justify-end">
                <img
                  className="w-3/4 rounded-xl"
                  src={order.menu.imgUrl}
                  alt={order.menu.name}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="border-t my-5 py-3">
          <h2 className="font-bold text-stone-600">Payment Details</h2>
          <div className="border-b flex flex-col gap-2 py-2">
            <div className="flex justify-between">
              <h5>Price</h5>
              <h5>{formatPrice(subTotal, 'IDR', 'id-ID', true)}</h5>
            </div>
            <div className="flex justify-between">
              <h5>Tax (11%)</h5>
              <h5>{formatPrice(tax, 'IDR', 'id-ID', true)}</h5>
            </div>
          </div>
          <div className="flex justify-between py-2">
            <h5 className="font-bold">Total payment</h5>
            <h5>{formatPrice(total, 'IDR', 'id-ID', true)}</h5>
          </div>
        </div>

        <div className="mb-10" />

        <div className="w-full fixed bottom-0 left-0 h-16 p-2 bg-amber-300 flex justify-center items-center">
          <button className="text-center font-bold text-stone-700 w-full h-full rounded-full bg-amber-100 flex justify-center items-center py-2 px-5">
            Download Bill
          </button>
        </div>
      </div>
    </div>
  );
}
