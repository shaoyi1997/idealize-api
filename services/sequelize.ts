import { Application } from 'express';
import { Sequelize, ISequelizeConfig, DataType } from 'sequelize-typescript';
import * as config from 'config';

import { Service } from '../app';
import IResource from '../src/interface/IResource';

function getQuotedTableName(tableNameFromModel: string | object) {
  if (typeof tableNameFromModel === 'object') {
    const { tableName, schema, delimiter } = tableNameFromModel as any;
    return `"${schema}"${delimiter}"${tableName}"`;
  }
  return `"${tableNameFromModel}"`;
}

const SequelizeService: Service<Sequelize> = {
  start: async (app: Application) => {
    const logger = app.get('logger');
    logger.info('Initializing sequelize');
    const sequelizeOptions: ISequelizeConfig = config.get('sequelize.options');
    const sequelize = new Sequelize({
      database: config.get('sequelize.database'),
      username: config.get('sequelize.username'),
      password: config.get('sequelize.password'),
      dialectOptions: config.get('sequelize.dialectOptions'),
      ...sequelizeOptions,
      host: process.env.DATABASE_URL ? 'postgres' : 'localhost',
      define: {
        freezeTableName: false,
        timestamps: true,
      },
      logging: (msg: string) => logger.debug(msg),
    });

    try {
      await sequelize.authenticate();
      logger.info('Connection has been established successfully.');
    } catch (error) {
      logger.error('Unable to connect to the database:', error);
    }

    await sequelize.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');

    const resources = app.get('resources');
    const models = Object.values(resources).map(
      (resource: IResource) => resource.getModel() as any,
    );
    sequelize.addModels(models);

    // Set the default value on the database side if column has default value of DataTypes.UUIDV4.
    models.forEach(model => {
      const uuidAttributes = Object.values(model.attributes as any).filter(
        (attribute: any) =>
          attribute.defaultValue &&
          attribute.defaultValue.constructor === DataType.UUIDV4,
      );
      model.addHook('afterSync', () =>
        Promise.all(
          uuidAttributes.map((attribute: any) =>
            sequelize.query(
              `ALTER TABLE ${getQuotedTableName(
                model.getTableName(),
              )} ALTER COLUMN "${
                attribute.fieldName
              }" SET DEFAULT gen_random_uuid()`,
            ),
          ),
        ),
      );
      model.sync();
    });
    return sequelize;
  },
  stop: async (app: Application) => {
    const logger = app.get('logger');
    logger.info('Stopping sequelize');
    const sequelize = app.get('services').sequelize;
    sequelize.close();
  },
};

export default SequelizeService;
