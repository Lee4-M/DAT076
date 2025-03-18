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

/*
 * The UserModel class represents the user table in the database.
 * It has a one-to-many relationship with the BudgetRowModel class.
 * The user table has the following columns:
 * - id: an auto-incrementing integer that serves as the primary key
 * - username: a string that must be unique and cannot be empty
 * - password: a string that cannot be empty
 * The table name is 'users'.
 */
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
