import { Sequelize } from 'sequelize';
export const sequelize = new Sequelize('postgres://postgres@localhost:5432/postgres');