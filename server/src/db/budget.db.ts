import { Model, InferAttributes, InferCreationAttributes, DataTypes, ForeignKey, CreationOptional, Association } from 'sequelize';
import { sequelize } from './conn';
import { UserModel } from './user.db';
import { ExpenseModel } from './expense.db';


export class BudgetModel extends Model<InferAttributes<BudgetModel>, InferCreationAttributes<BudgetModel>> {
  declare id: CreationOptional<number>;
  declare category: string;
  declare amount: number;
  declare userId: ForeignKey<UserModel['id']>;
  declare static associations: {
    expenses: Association<BudgetModel, ExpenseModel>;
  }
}

BudgetModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    category: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    amount: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
  },
  {
    sequelize,
    tableName: 'budgets'
  }
);

BudgetModel.hasMany(ExpenseModel, {
  foreignKey: 'category',
  as: 'expenses'
});