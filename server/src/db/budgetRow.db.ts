import { Model, InferAttributes, InferCreationAttributes, DataTypes, ForeignKey, CreationOptional, Association } from 'sequelize';
import { sequelize } from './conn';
import { UserModel } from './user.db';
import { ExpenseModel } from './expense.db';

export class BudgetRowModel extends Model<InferAttributes<BudgetRowModel>, InferCreationAttributes<BudgetRowModel>> {
  declare id: CreationOptional<number>;
  declare category: string;
  declare amount: number;
  declare userId: ForeignKey<UserModel['id']>;
  declare static associations: {
    expenses: Association<BudgetRowModel, ExpenseModel>;
  }
}

/*
 * The BudgetRowModel class represents the budgetRows table in the database.
 * It has a one-to-many relationship with the ExpenseModel class.
 * The budgetRows table has the following columns:
 * - id: an auto-incrementing integer that serves as the primary key
 * - category: a string that cannot be empty
 * - amount: an integer that cannot be empty
 * The table name is 'budgetRows'.
 * The table has a composite unique constraint on the userId and category columns.
 */
BudgetRowModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'budgetRows',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'category']
      }
    ]
  }
);

BudgetRowModel.hasMany(ExpenseModel, {
  foreignKey: "budgetRowId",
  as: "expenses",
  onDelete: "CASCADE",
});