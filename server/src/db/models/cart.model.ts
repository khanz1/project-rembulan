import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { z } from 'zod';
import Payment from './payment.model';
import Order, { OrderStatus } from './order.model';
import User from './user.model';
import { NotFoundError } from '../../helpers/http.error';
import Voucher from './voucer.model';

export const CartValidationSchema = z.object({
  voucherCode: z.string().optional(),
  discountPer: z.number().optional(),
  taxPer: z.number().optional(),
  tax: z.number().optional(),
  total: z.number().positive().optional(),
});

interface CartWithoutId extends z.infer<typeof CartValidationSchema> {
  userId: number;
  voucherId?: number;
  status?: OrderStatus;
}

interface CartAttributes extends CartWithoutId {
  id: number;
}

interface CartCreationAttributes extends CartWithoutId {}

@Table({
  timestamps: true,
  tableName: 'carts',
  underscored: true,
})
export default class Cart extends Model<
  CartAttributes,
  CartCreationAttributes
> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.FLOAT)
  taxPer!: number;

  @Column(DataType.INTEGER)
  tax!: number;

  @Default(0)
  @Column(DataType.BIGINT)
  total!: number;

  @Default(OrderStatus.PENDING)
  @Column({
    type: DataType.ENUM(OrderStatus.PENDING, OrderStatus.COMPLETED),
  })
  status!: OrderStatus;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId!: number;

  @ForeignKey(() => Voucher)
  @Column(DataType.INTEGER)
  voucherId!: number;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Voucher)
  voucher!: Voucher;

  @HasMany(() => Order)
  orders!: Order[];

  @HasOne(() => Payment)
  payment!: Payment;

  public static async totalWithTax(cartId: number) {
    let total = 0;
    const cart = await Cart.findByPk(cartId, {
      include: [
        {
          model: Order,
        },
        Voucher,
      ],
    });
    if (!cart) {
      throw new NotFoundError('Cart not found');
    }
    for (const order of cart.orders) {
      total += order.quantity * order.menu.price;
    }

    if (cart.voucher.discount) {
      total = total - (total * cart.voucher.discount) / 100;
    }
    if (cart.taxPer) {
      total = total - (total * cart.taxPer) / 100;
    }
    await cart.update({
      total,
    });
    return total;
  }
}
