import Redis from 'ioredis';
import dotenv from './dotenv';
import logger from './logger';

dotenv.config();

const config = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  db: parseInt(process.env.REDIS_DB || '0')
};

export const userCacheClient = new Redis({ ...config, password: process.env.REDIS_PWD, });

logger.info('Redis Cfg.', config);
