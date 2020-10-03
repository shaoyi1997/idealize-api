import IdeaModel from './IdeaModel';
import IdeaRoutes from './IdeaRoutes';
import IResource from '../interface/IResource';

class Idea implements IResource<IdeaModel> {
  /**
   * Returns the IdeaModel.
   * Refer to services/sequelize for usage.
   */
  getModel() {
    return IdeaModel;
  }

  getRouter() {
    return IdeaRoutes;
  }
}

export default Idea;
