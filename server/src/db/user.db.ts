import { BudgetRowModel } from './budgetRow.db';
import { sequelize } from './conn';
import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, Association } from 'sequelize';

export class UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
  declare id: CreationOptional<number>;
  declare username: string;
  declare password: string;
  declare static associations: {
    budgetRows: Association<UserModel, BudgetRowModel>;
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
    timestamps: false
  }
);

UserModel.hasMany(BudgetRowModel, {
  sourceKey: 'id',
  foreignKey: 'userId',
  as: 'budgetRows',
  onDelete: 'CASCADE'
});
