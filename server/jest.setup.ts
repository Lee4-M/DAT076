import { sequelize } from "./src/db/conn";

beforeAll(async () => {
  await import('./src/db/associations');
  await sequelize.sync({ force: true });
});

beforeEach(async () => {
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});

afterAll(async () => {
  await sequelize.close();
});
