import { Router, Request, Response } from 'express';
import IdeaController from './IdeaController';

const router = Router();

router.route('/').get(async (req: Request, res: Response) => {
  await IdeaController.findAll()
    .then(ideas => {
      if (ideas) {
        res.status(200).json({ ideas });
      } else {
        res.status(400).json({ error: 'No ideas found.' });
      }
    })
    .catch(error => res.status(400).json(error));
});

router.route('/id/:ideaId').get(async (req: Request, res: Response) => {
  const ideaId = req.params.ideaId;
  if (!ideaId) {
    res.status(400).json('Invalid request: ideaId is not provided');
    return;
  }

  await IdeaController.findOne({ ideaId })
    .then(idea => {
      if (idea) {
        res.status(200).json({ idea });
      } else {
        res.status(400).json({ error: 'No idea found.' });
      }
    })
    .catch(error => res.status(400).json(error));
});

router.route('/create').post(async (req: Request, res: Response) => {
  const reqBody = req.body;

  await IdeaController.create(reqBody)
    .then(idea => {
      if (idea) {
        res.status(200).json({ message: 'Idea successfully created.', idea });
      } else {
        res.status(400).json({ error: 'Failed to create idea.' });
      }
    })
    .catch((err: Error) => {
      res.status(400).json({ error: err.message });
    });
});

router.route('/id/:ideaId').delete(async (req: Request, res: Response) => {
  const ideaId = req.params.ideaId;

  await IdeaController.delete(ideaId)
    .then(numOfDestroyed => {
      if (numOfDestroyed > 0) {
        res.status(200).json({ message: 'Idea successfully deleted.' });
      } else {
        res.status(400).json({ error: 'An invalid ideaId is provided.' });
      }
    })
    .catch((err: Error) => {
      res.status(400).json({ error: err.message });
    });
});

router.route('/id/:ideaId').put(async (req: Request, res: Response) => {
  const ideaId = req.params.ideaId;
  const params = req.body;

  await IdeaController.update(params, ideaId)
    .then(idea => {
      if (idea) {
        res.status(200).json({ message: 'Idea successfully updated.', idea });
      } else {
        res.status(400).json({ error: 'Failed to update idea.' });
      }
    })
    .catch((err: Error) => {
      res.status(400).json({ error: err.message });
    });
});

export default router;
