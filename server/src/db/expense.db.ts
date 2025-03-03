import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, ForeignKey } from 'sequelize';
import { sequelize } from './conn';
import { BudgetModel } from './budget.db'; 
import { UserModel } from './user.db';

export class ExpenseModel extends Model<InferAttributes<ExpenseModel>, InferCreationAttributes<ExpenseModel>> {
  declare id: string;
  declare category: ForeignKey<BudgetModel['category']>;
  declare cost: number;
  declare description: string;
  declare userId: ForeignKey<UserModel['userId']>;
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
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
          model: UserModel,
          key: 'userId'
        }
  },
},
  {
        sequelize,
  }
);

BudgetModel.hasMany(ExpenseModel, { foreignKey: 'category' });
ExpenseModel.belongsTo(BudgetModel, { foreignKey: 'category' });