import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../helpers/formatter.ts';
import { IconArrowLeft } from '@tabler/icons-react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store';
import { fetchTransactions } from '../store/payment/trxSlice.ts';

export default function HistoryPage() {
  const navigate = useNavigate();
  const { transactions } = useSelector(
    (state: RootState) => state.transactions,
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTransactions());
  }, []);

  return (
    <div className="bg-amber-100">
      <div className="p-5 min-h-screen">
        <button className="flex items-center gap-2 pb-2">
          <IconArrowLeft />
          <h5 className="text-xl" onClick={() => navigate(-1)}>
            Back
          </h5>
        </button>
        <div className="flex flex-col gap-5">
          {transactions.map(trx => {
            return (
              <div
                key={trx.id}
                onClick={() => navigate(`/history/${trx.id}`)}
                className="bg-amber-200 shadow rounded overflow-hidden hover:bg-stone-200 p-5"
              >
                <div className="flex justify-between">
                  <div className="w-4/6">
                    <h2>
                      {new Date(trx.createdAt).toLocaleString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </h2>
                    <h2 className="font-bold">
                      {formatPrice(Number(trx.amount))}
                    </h2>
                  </div>
                  <div className="w-2/6 flex flex-wrap rounded-lg overflow-hidden">
                    {trx.cart.orders
                      .filter((_, i) => i < 4)
                      .map(order => (
                        <img
                          key={order.menu.id}
                          className={`w-1/2 m-auto`}
                          src={order.menu.imgUrl}
                          alt={order.menu.name}
                        />
                      ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
