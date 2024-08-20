export interface Order {
  id: number;
  userId: number;
  menuId: number;
  cartId: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  imgUrl: string;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
  orders: Order[];
}

export interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  menus: MenuItem[];
}
