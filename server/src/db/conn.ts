import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('postgres://postgres@localhost:5432/postgres');

export async function initDB() {
    try {
        await import('./associations');
        await sequelize.sync({ alter: true, force: false });
        console.log('Database synced successfully');
    } catch (error) {
        console.error('Failed to initialize the database:', error);
        throw error; 
    }
}

