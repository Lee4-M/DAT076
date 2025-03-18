import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, ForeignKey, Association } from 'sequelize';
import { sequelize } from './conn';
import { BudgetRowModel } from './budgetRow.db';

export class ExpenseModel extends Model<InferAttributes<ExpenseModel>, InferCreationAttributes<ExpenseModel>> {
  declare id: CreationOptional<number>;
  declare budgetRowId: ForeignKey<BudgetRowModel['id']>;
  declare cost: number;
  declare description: string;
  declare static associations: {
    budgetRow: Association<ExpenseModel, BudgetRowModel>;
  }
}

ExpenseModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    cost: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'expenses',
    timestamps: false
  }
);
