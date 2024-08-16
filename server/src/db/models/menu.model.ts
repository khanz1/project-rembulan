import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { z } from 'zod';
import Category from './category.model';
import Order from './order.model';

export const MenuValidationSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  price: z.number().positive(),
  imgUrl: z.string().optional(),
  categoryId: z.number(),
});

interface MenuWithoutId extends z.infer<typeof MenuValidationSchema> {}

interface MenuAttributes extends MenuWithoutId {
  id: number;
}

interface MenuCreationAttributes extends MenuAttributes {}

@Table({
  timestamps: true,
  tableName: 'menus',
  underscored: true,
})
export default class Menu extends Model<
  MenuAttributes,
  MenuCreationAttributes
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
    type: DataType.TEXT,
    allowNull: true,
  })
  description!: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  price!: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  imgUrl!: string;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  categoryId!: number;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => Category)
  category!: Category;

  @HasMany(() => Order)
  orders!: Order[];
}
