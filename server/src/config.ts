import logger from './helpers/logger';

class Config {
  public readonly PORT: number = 3000;
  public readonly NODE_ENV: string = 'development';
  public readonly JWT_SECRET: string = '';
  public readonly GOOGLE_CLIENT_ID: string = '';

  constructor() {
    const NODE_ENV = process.env.NODE_ENV;
    if (!NODE_ENV) {
      logger.info('NODE_ENV not set, using default value "development"');
      process.exit(1);
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      logger.error('JWT_SECRET not set, exiting...');
      process.exit(1);
    }

    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    if (!GOOGLE_CLIENT_ID) {
      logger.error('GOOGLE_CLIENT_ID not set, exiting...');
      process.exit(1);
    }

    this.PORT = Number(process.env.PORT || 3000);
    this.GOOGLE_CLIENT_ID = GOOGLE_CLIENT_ID;
    this.JWT_SECRET = JWT_SECRET;
    this.NODE_ENV = NODE_ENV;
  }
}

export default new Config();
