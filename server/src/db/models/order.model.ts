import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { z } from 'zod';
import User from './user.model';
import Menu from './menu.model';
import Cart from './cart.model';

export enum OrderStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
}

export const OrderQuantityValidationSchema = z.object({
  quantity: z.number().positive().negative().optional(),
  id: z
    .string({
      required_error: 'Menu ID is required',
    })
    .transform(val => parseInt(val)),
  type: z.enum(['increment', 'decrement']),
});

export const OrderValidationSchema = z.object({
  menuId: z.number({
    required_error: 'Menu ID is required',
  }),
  cartId: z.number().optional(),
});

interface OrderWithoutId extends z.infer<typeof OrderValidationSchema> {
  userId: number;
  quantity?: number;
  status?: OrderStatus;
}

interface OrderAttributes extends OrderWithoutId {
  id: number;
}

interface OrderCreationAttributes extends OrderWithoutId {}

@Table({
  timestamps: true,
  tableName: 'orders',
  underscored: true,
})
export default class Order extends Model<
  OrderAttributes,
  OrderCreationAttributes
> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId!: number;

  @ForeignKey(() => Menu)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  menuId!: number;

  @ForeignKey(() => Cart)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  cartId!: number;

  @Default(1)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity!: number;

  @Default(OrderStatus.PENDING)
  @Column({
    type: DataType.ENUM(OrderStatus.PENDING, OrderStatus.COMPLETED),
  })
  status!: OrderStatus;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Menu)
  menu!: Menu;

  @BelongsTo(() => Cart)
  cart!: Cart;
}
