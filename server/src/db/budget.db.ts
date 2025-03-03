import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, ForeignKey } from 'sequelize';
import { sequelize } from './conn';
import { UserModel } from './user.db'; // Adjust the path as necessary


export class BudgetModel extends Model<InferAttributes<BudgetModel>, InferCreationAttributes<BudgetModel>> {
    declare category: string;
    declare cost: number;
    declare userId: ForeignKey<UserModel['username']>;
  }
  
  BudgetModel.init(
    {
      category: {
          type: DataTypes.STRING,
          primaryKey: true
      },
      cost: {
          type: DataTypes.BIGINT,
          allowNull: false
      },
  },
    {
          sequelize,
    }
  );
