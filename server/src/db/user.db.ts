import { sequelize } from './conn';
import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, ForeignKey } from 'sequelize';


export class UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
    declare username: string;
    declare password: string;
  }
  
  UserModel.init(
    {
      username: {
        type: DataTypes.STRING,
        autoIncrement: true,
        primaryKey: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
//TODO Add budget[] and expense[] to the User model