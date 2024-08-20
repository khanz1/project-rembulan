interface Menu {
  id: number;
  name: string;
  description: string;
  price: string;
  imgUrl: string;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
}

interface Order {
  id: number;
  quantity: number;
  createdAt: string;
  menu: Menu;
}

interface Cart {
  id: number;
  taxPer: number;
  voucher: string | null;
  orders: Order[];
}

interface Payer {
  id: number;
  name: string;
  email: string;
  balance: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: number;
  amount: string;
  status: string;
  createdAt: string;
  payer: Payer;
  cart: Cart;
}

export interface TransactionHistory {
  message: string;
  data: Transaction[];
}
