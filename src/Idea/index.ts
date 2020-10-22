import IdeaModel from './IdeaModel';
import IdeaRoutes from './IdeaRoutes';
import IResource from '../interface/IResource';
import { Router } from 'express';

class Idea implements IResource<IdeaModel> {
  /**
   * Returns the IdeaModel.
   * Refer to services/sequelize for usage.
   */
  getModel(): typeof IdeaModel {
    return IdeaModel;
  }

  getRouter(): Router {
    return IdeaRoutes;
  }
}

export default Idea;
