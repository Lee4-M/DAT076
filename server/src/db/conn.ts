import { Sequelize } from 'sequelize';
export const sequelize = new Sequelize('postgres://postgres@localhost:5432/postgres');

export async function initDB() {
    await sequelize.sync({ alter: true, force: false });
}
