import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { z } from 'zod';
import Order from './order.model';
import Payment from './payment.model';
import { signToken } from '../../helpers/crypto';

export const UserValidationSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
    })
    .min(5, 'Name must be at least 5 characters')
    .max(255, 'Name must be at most 255 characters'),
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email')
    .min(5, 'Name must be at least 5 characters')
    .max(255, 'Name must be at most 255 characters'),
  balance: z.number().optional(),
});

interface UserWithoutId extends z.infer<typeof UserValidationSchema> {}

interface UserAttributes extends UserWithoutId {
  id: number;
}

interface UserCreationAttributes extends UserWithoutId {}

@Table({
  timestamps: true,
  tableName: 'users',
  underscored: true,
})
export default class User extends Model<
  UserAttributes,
  UserCreationAttributes
> {
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
    unique: true,
  })
  email!: string;

  @Default(0)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  balance!: number;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @HasMany(() => Order)
  orders!: Order[];

  @HasMany(() => Payment)
  payments!: Payment[];

  get token(): string {
    return signToken({ userId: this.id });
  }

  // Static method to check if email exists
  public static async isEmailExists(email: string): Promise<boolean> {
    const user = await User.findOne({ where: { email } });
    return user !== null;
  }
}
