import path from 'path';
import dotenv from 'dotenv';

dotenv.config({
  // path to the .env.local file, do before the required to the env file
  path: path.resolve(__dirname, `../.env.${process.env.NODE_ENV}`),
});

import logger from './helpers/logger';
import { sequelize } from './db/sequelize';
import app from './app';

async function bootstrap() {
  try {
    const NODE_ENV = process.env.NODE_ENV;
    const PORT = Number(process.env.SERVER_PORT || 3000);
    const SERVER_HOST = process.env.SERVER_HOST || 'http://localhost';
    const PROJECT_NAME = process.env['npm_package_name'];
    const PROJECT_VERSION = process.env['npm_package_version'];

    await sequelize.authenticate();
    await sequelize.sync({ force: true });

    app.listen(PORT, () => {
      const isProduction = NODE_ENV === 'production';
      const serverHost = SERVER_HOST + (isProduction ? '' : `:${PORT}`);

      logger.info('');
      logger.info(`--------- ⭐ Project ${PROJECT_NAME} ⭐ -------------`);
      logger.info(`🚀 App running on         : ${serverHost}`);
      logger.info(`👨 Contact dev            : assistance.xavier@gmail.com 🚀`);
      logger.info(`⚓️ Environment            : ${NODE_ENV}`);
      logger.info(`📦 Version                : ${PROJECT_VERSION}`);
      logger.info(`----------------------------------------------------`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

void bootstrap();
