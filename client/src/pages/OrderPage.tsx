import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../helpers/formatter.ts';
import { IconBasket, IconMinus, IconPlus } from '@tabler/icons-react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store';
import { addToCart, updateOrderQuantity } from '../store/cart/cartSlice.ts';
import {
  fetchMenuCategories,
  UpdateQuantity,
} from '../store/menu/menuSlice.ts';

export default function OrderPage() {
  const dispatch = useAppDispatch();
  const { menuCategories, totalAmount, totalItems } = useSelector(
    (state: RootState) => state.menu,
  );

  console.log(menuCategories, '<c');

  const handleAddToCart = async (menuId: number) => {
    await dispatch(addToCart(menuId));
    await dispatch(fetchMenuCategories());
  };

  const handleUpdateQuantity = async (id: number, type: UpdateQuantity) => {
    await dispatch(updateOrderQuantity({ id, type }));
    await dispatch(fetchMenuCategories());
  };

  useEffect(() => {
    dispatch(fetchMenuCategories());
  }, []);

  return (
    <div className="relative container-xl px-3 py-5 m-auto bg-amber-100 min-h-screen">
      <h1 className="text-3xl text-center py-5 font-bold">Menu List</h1>
      <div>
        {menuCategories.map(menuCategory => (
          <div key={menuCategory.id} className="py-5">
            <h2 className="text-xl font-bold py-5">{menuCategory.name}</h2>
            <div className="flex flex-wrap gap-3">
              {menuCategory.menus.map(menu => (
                <div
                  key={menu.id}
                  className="flex gap-5 px-2 py-5 rounded-lg w-full min-h-48"
                >
                  <div className="flex flex-col gap-2 w-7/12">
                    <h4 className="text-sm font-bold text-stone-700">
                      {menu.name}
                    </h4>
                    <p className="text-xs text-stone-700">{menu.description}</p>

                    <h5 className="text-sm font-bold text-stone-700">
                      {formatPrice(Number(menu.price))}
                    </h5>
                  </div>
                  <div className="relative overflow-hidden w-5/12">
                    <img
                      src={menu.imgUrl}
                      alt={menu.name}
                      className="h-32 w-full rounded-lg object-cover"
                    />
                    <div className="drop-shadow-md absolute top-3/4 left-1/2 -translate-x-1/2 -translate-y-1.5">
                      {Boolean(menu.orders.length) ? (
                        <div className="bg-stone-100 rounded-full flex items-center gap-3 p-1">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                menu.orders[0].id,
                                UpdateQuantity.DECREMENT,
                              )
                            }
                            className="rounded-full border border-amber-300 bg-stone-100"
                          >
                            <IconMinus className="text-amber-600" />
                          </button>
                          <div className="text-lg text-stone-700">
                            {menu.orders[0].quantity}
                          </div>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                menu.orders[0].id,
                                UpdateQuantity.INCREMENT,
                              )
                            }
                            className="rounded-full border border-amber-300 bg-stone-100"
                          >
                            <IconPlus className="text-amber-600" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(menu.id)}
                          className="drop-shadow-md rounded-full bg-stone-100 text-amber-700 py-1.5 px-8"
                        >
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Link
        className="w-full fixed bottom-0 left-0 h-16 p-2 bg-amber-300 flex justify-center items-center"
        to="/order/checkout"
      >
        <button className="text-stone-700 w-full h-full rounded-full bg-amber-100 flex justify-between items-center py-2 px-5">
          <div>
            <h5>{totalItems} Items</h5>
          </div>
          <div className="flex gap-3 items-center">
            <h5 className="font-bold">{formatPrice(totalAmount)}</h5>
            <IconBasket />
          </div>
        </button>
      </Link>
    </div>
  );
}
