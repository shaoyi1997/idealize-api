import express from 'express';
import cors from 'cors';
import config from 'config';
import * as path from 'path';

import Resources from './src';
import logger from './common/winston';

export interface Service<T> {
  start: (app?: express.Application) => Promise<T>;
  stop?: (app?: express.Application) => Promise<void>;
}

export interface ServiceList {
  [name: string]: Service<any>;
}

const initApp = async () => {
  // Initialize express app
  const app = express();

  // Initialize cors
  app.use(cors());
  app.options('*', cors({ credentials: true, origin: true }));
  const allowCrossDomain = async (
    _req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin,X-Requested-With,Content-Type,Accept,Authorization',
    );
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  };
  app.use(allowCrossDomain);

  app.use(express.json()); // bodyparser-like library in express

  // Initialize winston logger
  app.set('logger', logger);

  return app;
};

/**
 * Route initialization routine
 *
 */
const initRoute = async (app: express.Application) => {
  // mount root path
  app.get(
    '/api',
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      logger.info('Root path mounted');
      res.status(200).json({
        message: 'Idealize API',
      });
      next();
    },
  );

  app.use('/api/idea', Resources.idea.getRouter());

  return app;
};

/**
 * Resource initialization routine
 */
const initResources = async (app: express.Application) => {
  logger.info('Initializing resources...');
  app.set('resources', Resources);
  return app;
};

/**
 * Service initialization routine
 */
const initServices = async (app: express.Application) => {
  const listOfServices = config.get<string[]>('services');
  const services: ServiceList = {};

  logger.info('Reading services...');
  for (const service of listOfServices) {
    const servicePath = path.join(__dirname, 'services', service);
    logger.info(`Reading service at ${servicePath}`);

    let moduleInstance = await import(servicePath);
    if (moduleInstance.default) {
      moduleInstance = moduleInstance.default;
    }
    services[service] = moduleInstance;
  }

  const concreteServices: Record<string, unknown> = {};

  logger.info('Starting services...');
  for (const service of listOfServices) {
    logger.info(`Starting service: ${service}`);
    try {
      (concreteServices[service] as any) = await Promise.resolve(
        services[service].start(app),
      );
    } catch (err) {
      logger.error(`Failed to start service ${service}`, err);
      throw err;
    }
    logger.info(`Started service ${service}`);
  }
  app.set('services', concreteServices);

  async function stopServices() {
    logger.info('Stopping services...');
    for (const service of listOfServices) {
      logger.info(`Stopping service: ${service}`);
      try {
        if (services[service].stop) {
          await Promise.resolve(services[service].stop(app));
        }
      } catch (err) {
        logger.error(`Failed to stop service ${service}`, err);
        throw err;
      }
      logger.info(`Stopped service ${service}`);
    }
  }

  app.set('stop', stopServices);

  return app;
};

// Entry point for initialization
const initialize = async () => {
  const app = await initApp()
    .then(initResources)
    .then(initServices)
    .then(initRoute);
  return app;
};

export default initialize;
