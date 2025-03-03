import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, ForeignKey, Association } from 'sequelize';
import { sequelize } from './conn';
import { BudgetModel } from './budget.db';
import { UserModel } from './user.db';

export class ExpenseModel extends Model<InferAttributes<ExpenseModel>, InferCreationAttributes<ExpenseModel>> {
  declare id: CreationOptional<number>;
  declare category: ForeignKey<BudgetModel['category']> | null;
  declare cost: number;
  declare description: string;
  declare userId: ForeignKey<UserModel['id']>;
  declare static associations: {
    budget: Association<ExpenseModel, BudgetModel>;
  }
}

ExpenseModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    category: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    cost: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'expenses'
  }
);

ExpenseModel.hasOne(BudgetModel, {
  sourceKey: 'category'
});
