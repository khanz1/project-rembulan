export interface User {
  id: number;
  name: string;
  email: string;
  balance: string;
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
}

export interface Order {
  id: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  menu: MenuItem;
}

export interface Cart {
  id: number;
  taxPer: number;
  tax: string | null;
  total: string;
  userId: number;
  voucherId: number | null;
  createdAt: string;
  updatedAt: string;
  user: User;
  orders: Order[];
}
