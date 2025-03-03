import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import { sequelize } from './conn';
import { Expense } from '../model/expense.interface';
import { BudgetModel } from './budget.db'; 

export class ExpenseModel extends Model<InferAttributes<ExpenseModel>, InferCreationAttributes<ExpenseModel>> {
  declare id: string;
  declare category: string;
  declare cost: number;
  declare description: string;
}

ExpenseModel.init(
  {
    id: {
        type: DataTypes.STRING,
        autoIncrement: false,
        primaryKey: true
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: BudgetModel,
            key: 'category'
          }
    },
    cost: { 
        type: DataTypes.BIGINT,
        allowNull: false
  },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
},
  {
        sequelize,
  }
);

BudgetModel.hasMany(ExpenseModel, { foreignKey: 'category' });
ExpenseModel.belongsTo(BudgetModel, { foreignKey: 'category' });