import { sequelize } from "./src/db/conn";

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterEach(async () => {
  await sequelize.truncate({ cascade: true }); 
});

afterAll(async () => {
  await sequelize.close(); 
});