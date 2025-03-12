import { db, sequelize } from "./src/db/conn";

let backup: ReturnType<typeof db.backup>;

beforeAll(async () => {
  await import('./src/db/associations');
  await sequelize.sync({ force: true });
  backup = db.backup();
});

beforeEach(async () => {
  backup.restore()
});

afterAll(async () => {
  await sequelize.close();
});
