import { AnyWhereOptions } from 'sequelize';
import Idea from './IdeaModel';

interface IdeaGetOptions extends AnyWhereOptions {
  ideaId: string;
}

interface IdeaCreationParams {
  title: string;
  description: string;
}

class IdeaController {
  /**
   * Creates a new idea
   */
  async create(params: IdeaCreationParams) {
    const idea = Idea.build(params);
    await idea.save();

    return idea;
  }

  /**
   * Returns an ideas the given ideaId
   * @param where object containing ideaId of idea to search
   */
  async findOne(where: IdeaGetOptions) {
    if (!where.ideaId) {
      throw new Error('No ideaId provided.');
    }

    return await Idea.findOne({
      where,
    });
  }

  async findAll() {
    return await Idea.findAll();
  }

  async delete(ideaId: string) {
    if (!ideaId) {
      throw new Error('No ideaId provided.');
    }

    return await Idea.destroy({
      where: {
        ideaId,
      },
    });
  }

  async update(params: IdeaCreationParams, ideaId: string) {
    if (!ideaId) {
      throw new Error('No ideaId provided.');
    } else if (!params) {
      throw new Error('No update information provided.');
    }

    return await Idea.update(params, {
      where: { ideaId },
      returning: true,
    }).then(value => value[1][0]);
  }
}

const ideaController = new IdeaController();

export default ideaController;
