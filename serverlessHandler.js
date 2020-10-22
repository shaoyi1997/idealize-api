/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import initialize from './app';
import serverless from 'serverless-http';
import _seq from './services/sequelize';
import _logger from './common/winston';

// Cache
let handler;

// Handler
const _handler = async (event, context) => {
  if (!handler) {
    const app = await initialize();
    handler = serverless(app, {
      request: request => {
        request.serverless = { event, context };
      },
    });
  }

  const res = await handler(event, context);

  return res;
};
export { _handler as handler };
