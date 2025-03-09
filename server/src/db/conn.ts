import { readFileSync } from 'fs';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const DB_NAME = process.env.DB_NAME as string;
const DB_USER = process.env.DB_USER as string;
const DB_PASSWORD = process.env.DB_PASSWORD as string;
const DB_HOST = process.env.DB_HOST as string;
const DB_SSL_CA_PATH = process.env.DB_SSL_CA as string;
const DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432; 

const cCa = readFileSync(DB_SSL_CA_PATH, 'utf-8');

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
        host: DB_HOST,
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: true,
                ca: cCa
            }
        },
        port: DB_PORT
    }
);

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

