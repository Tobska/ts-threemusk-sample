import http from "http";

import express from "express";
import { errorHandler } from "./middleware/error-handler";
import { logger } from "./logger";

const main = async (): Promise<void> => {
  const app = express();

  const httpServer = http.createServer(app);

  app.use(errorHandler);

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  
  logger.info("Server ready http://localhost:4000");
};

void main();
