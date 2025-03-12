import { readFileSync } from 'fs';
import { Sequelize } from 'sequelize';
import { newDb } from 'pg-mem';
import dotenv from 'dotenv';

dotenv.config();

let sequelize: Sequelize;

let db: any;
if (process.env.NODE_ENV === "test" || process.env.NODE_ENV === "development") {
  db = newDb();
  const pool = db.adapters.createPg();

  sequelize = new Sequelize({
    dialect: "postgres",
    dialectModule: pool,
    logging: true,
  });

  console.log("Using in-memory database for testing/development");
} else {

  const DB_NAME: string = process.env.DB_NAME!;
  const DB_USER: string = process.env.DB_USER!;
  const DB_PASSWORD: string = process.env.DB_PASSWORD!;
  const DB_HOST: string = process.env.DB_HOST!;
  const DB_SSL_CA_PATH: string = process.env.DB_SSL_CA!;
  const DB_PORT: number = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432;

  const cCa = readFileSync(DB_SSL_CA_PATH, "utf-8");

  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: true,
        ca: cCa,
      },
    },
    port: DB_PORT,
  });

  console.log("Using PostgreSQL database for development/production");
}
export { sequelize, db };

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

