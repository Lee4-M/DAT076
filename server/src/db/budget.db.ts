import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, ForeignKey } from 'sequelize';
import { sequelize } from './conn';
import { ExpenseModel } from './expense.db';


export class BudgetModel extends Model {
    declare category: string;
    declare cost: number;
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
