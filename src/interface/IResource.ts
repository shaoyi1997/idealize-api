import * as express from 'express';
import { ModelType } from 'sequelize-typescript';

interface IResource<TModel = unknown> {
  getModel: () => ModelType<TModel>;

  getRouter: () => express.Router;
}

export default IResource;
