import { BudgetModel } from './budget.db';
import { sequelize } from './conn';
import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, ForeignKey, Association } from 'sequelize';
import { ExpenseModel } from './expense.db';


export class UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
  declare id: CreationOptional<number>;
  declare username: string;
  declare password: string;
  declare static associations: {
    budgets: Association<UserModel, BudgetModel>;
    expenses: Association<UserModel, ExpenseModel>;
  };
}

UserModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    }
  },
  {
    sequelize,
    tableName: 'users',
  }
);

UserModel.hasMany(BudgetModel, {
  sourceKey: 'id',
  foreignKey: 'od',
  as: 'budgets'
});

UserModel.hasMany(ExpenseModel, {
  sourceKey: 'id',
  foreignKey: 'userId',
  as: 'expenses'
}); 
