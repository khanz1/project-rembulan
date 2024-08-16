import { Sequelize } from 'sequelize-typescript';
import logger from '../helpers/logger';

const sequelize = new Sequelize(
  'postgres://postgres:postgres@localhost:5432/project-rembulan',
  {
    models: [__dirname + '/models'],
    logging: sql => logger.info(sql),
  },
);

export { sequelize };
