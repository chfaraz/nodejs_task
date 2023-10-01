import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Side } from '../../../config/enum/side.enum';

@Table
export class Order extends Model<Order> {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
  })
  id: number;

  @Column({
    allowNull: false,
    type: DataType.ENUM(...Object.values(Side)),
  })
  side: Side;

  @Column
  price: string;
}
