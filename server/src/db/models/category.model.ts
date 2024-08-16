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
import Menu from './menu.model';

export const CategoryValidationSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
    })
    .min(5, 'Name must be at least 5 characters')
    .max(255, 'Name must be at most 255 characters'),
});

interface CategoryWithoutId extends z.infer<typeof CategoryValidationSchema> {}

interface CategoryAttributes extends CategoryWithoutId {
  id: number;
}

interface CategoryCreationAttributes extends CategoryWithoutId {}

@Table({
  timestamps: true,
  tableName: 'categories',
  underscored: true,
})
export default class Category extends Model<
  CategoryAttributes,
  CategoryCreationAttributes
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

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @HasMany(() => Menu)
  menus!: Menu[];
}
