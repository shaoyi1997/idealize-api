import { IdeaAPIShape } from 'app';
import express from 'express';
import { Server } from 'http';
import supertest from 'supertest';
import initialize from '../../app';

let app: express.Application;
let server: Server;
let agent: supertest.SuperTest<supertest.Test>;

beforeAll(async done => {
  app = await initialize();
  server = app.listen(8080, err => {
    if (err) {
      return done(err);
    }
    agent = supertest.agent(app);
    done();
  });
});

describe('GET /idea', () => {
  it('should respond with status 200 and an empty array of ideas', async () => {
    const response = await agent.get('/api/idea');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      ideas: [],
    });
  });
});

let createdIdea: IdeaAPIShape;

describe('POST /idea/create', () => {
  it('should respond with status 200 and the idea created', async () => {
    const testIdea = {
      title: 'Test Idea Title A',
      description: 'Test Idea Description A',
    };
    const response = await agent.post('/api/idea/create').send(testIdea);
    expect(response.status).toEqual(200);
    expect(response.body.message).toEqual('Idea successfully created.');
    expect(response.body?.idea?.title).toEqual(testIdea.title);
    expect(response.body?.idea?.description).toEqual(testIdea.description);
    createdIdea = response.body?.idea;
  });
});

describe('GET /idea/id', () => {
  it('should respond with status 200 and the idea created', async () => {
    const response = await agent.get(`/api/idea/id/${createdIdea?.ideaId}`);
    expect(response.status).toEqual(200);
    expect(response.body?.idea).toEqual(createdIdea);
  });
});

let updatedIdea: IdeaAPIShape;

describe('PUT /idea/id', () => {
  it('should respond with status 200 and the updated idea', async () => {
    const editedIdea = {
      title: 'Edited Idea Title B',
      description: 'Edited Idea Description B',
    };
    const response = await agent
      .put(`/api/idea/id/${createdIdea?.ideaId}`)
      .send(editedIdea);
    expect(response.status).toEqual(200);
    expect(response.body.message).toEqual('Idea successfully updated.');
    expect(response.body?.idea?.title).toEqual(editedIdea.title);
    expect(response.body?.idea?.description).toEqual(editedIdea.description);
    expect(response.body?.idea?.ideaId).toEqual(createdIdea.ideaId);
    updatedIdea = response.body?.idea;
  });
});

describe('DELETE /idea/id', () => {
  it('should respond with status 200 and the deleted idea', async () => {
    const response = await agent.delete(`/api/idea/id/${updatedIdea?.ideaId}`);
    expect(response.status).toEqual(200);
    expect(response.body.message).toEqual('Idea successfully deleted.');
  });

  it('GET after DELETE should respond with status 404 and the deleted idea', async () => {
    const response = await agent.get(`/api/idea/id/${updatedIdea?.ideaId}`);
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ error: 'No idea found.' });
  });
});

afterAll(async () => {
  await app.get('stop')();
  await server.close();
  await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
});
