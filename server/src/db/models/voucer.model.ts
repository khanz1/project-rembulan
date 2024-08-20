import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { z } from 'zod';
import Cart from './cart.model';

export const VoucherValidationSchema = z.object({
  name: z.string().optional(),
  code: z
    .string({
      required_error: 'Code is required',
    })
    .min(5, 'Name must be at least 5 characters')
    .max(255, 'Name must be at most 255 characters'),
  discount: z.number(),
});

interface VoucherWithoutId extends z.infer<typeof VoucherValidationSchema> {}

interface VoucherAttributes extends VoucherWithoutId {
  id: number;
}

interface VoucherCreationAttributes extends VoucherWithoutId {}

@Table({
  timestamps: true,
  tableName: 'vouchers',
  underscored: true,
})
export default class Voucher
  extends Model<VoucherAttributes, VoucherCreationAttributes>
  implements VoucherAttributes
{
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  code!: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  discount!: number;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @HasMany(() => Cart)
  carts!: Cart[];
}
