import { BudgetModel } from './budget.db';
import { sequelize } from './conn';
import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, ForeignKey, Association } from 'sequelize';


export class UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
    declare userId: CreationOptional<number>;
    declare username: string;
    declare password: string;
    declare static associations: {
      tasks: Association<UserModel, BudgetModel>;
    };
  
  }
  
  UserModel.init(
    {
      userId: {
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
    foreignKey: 'userId',
    as: 'tasks'
  });
  