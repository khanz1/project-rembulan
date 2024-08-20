import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { z } from 'zod';
import Order from './order.model';
import Cart from './cart.model';
import User from './user.model';

export enum TrxStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  FAILED_NEW_TRX = 'failed_new_trx',
}

export const PaymentValidationSchema = z.object({
  orderId: z.string(),
  trxToken: z.string().optional(),
  cartId: z.number(),
  payerId: z.number(),
  amount: z.number().positive(),
  status: z.enum([
    TrxStatus.PENDING,
    TrxStatus.PAID,
    TrxStatus.FAILED,
    TrxStatus.FAILED_NEW_TRX,
  ]),
  paidAt: z.date().optional(),
});

interface PaymentWithoutId extends z.infer<typeof PaymentValidationSchema> {}

interface PaymentAttributes extends PaymentWithoutId {
  id: number;
}

interface PaymentCreationAttributes extends PaymentWithoutId {}

@Table({
  timestamps: true,
  tableName: 'payments',
  underscored: true,
})
export default class Payment extends Model<
  PaymentAttributes,
  PaymentCreationAttributes
> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Order)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  orderId!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  trxToken!: string;

  @ForeignKey(() => Cart)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  cartId!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  payerId!: number;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  amount!: number;

  @Column({
    type: DataType.ENUM(
      TrxStatus.PENDING,
      TrxStatus.PAID,
      TrxStatus.FAILED,
      TrxStatus.FAILED_NEW_TRX,
    ),
    allowNull: false,
  })
  status!: TrxStatus;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  paidAt!: Date;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => User)
  payer!: User;

  @BelongsTo(() => Cart)
  cart!: Cart;
}
