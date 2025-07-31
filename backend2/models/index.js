import { readdirSync } from 'fs';
import { basename as _basename, join, dirname } from 'path';
import { fileURLToPath } from 'url';
import Sequelize from 'sequelize';
import sequelize from '../connection/connection.js';
import { setupAssociations } from './associations.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const basename = _basename(__filename);

const db = {};

async function loadModels() {
  const files = readdirSync(__dirname).filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file !== 'associations.js' && // ✅ important
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  });


  for (const file of files) {
    const modelModule = await import(join(__dirname, file));
    const model = modelModule.default;
    if (!model) {
      console.error(`Model not found in file: ${file}`);
      continue; // Skip to next file
    }

    if (!model.name) {
      console.error(`Model in file ${file} has no name`);
      continue;
    }

    db[model.name] = model;
  }

  // After importing all models
  setupAssociations(sequelize);

  // Set up associations if they exist
  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
  // Sync models to DB - create table if they don't exist
  // await sequelize.sync({ force: true });  // { alter: true }

  console.log('Database synchronized (models synced).');

}

// Execute the model loading
await loadModels();

export default db;