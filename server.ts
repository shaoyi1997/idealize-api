import * as config from 'config';
import { createServer } from 'http';
import * as https from 'https';
import * as fs from 'fs';

import initialize from './app';

initialize().then(async app => {
  const logger = app.get('logger');
  // Expose server over HTTP
  if (
    config.has('express.http.enabled') &&
    config.get('express.http.enabled')
  ) {
    const port = config.get('express.http.port');

    const server = createServer(app);

    server.listen(port, () => {
      logger.info(`Server is listening on port ${port}`);
    });
  }

  // Expose server over HTTPS
  if (
    config.has('express.https.enabled') &&
    config.get('express.https.enabled')
  ) {
    const port = config.get('express.https.port');
    const options = {
      key: fs.readFileSync('./common/key.pem'),
      cert: fs.readFileSync('./common/cert.pem'),
    };

    https
      .createServer(options, (_req, res) => {
        res.writeHead(200);
        res.end('Hello World\n');
      })
      .listen(port, () => {
        logger.info(`Server is listening on port ${port}`);
      });
  }
});
