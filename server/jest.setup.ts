import { db, sequelize } from "./src/db/conn";

let backup: ReturnType<typeof db.backup>;

// Setup and teardown database between test cases
beforeAll(async () => {
  await sequelize.sync({ force: true });
  backup = db.backup();
});

beforeEach(async () => {
  backup.restore()
});

afterAll(async () => {
  await sequelize.close();
});
