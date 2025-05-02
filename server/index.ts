import express, { type Request, Response, NextFunction } from 'express';
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { config } from "./config";
import { sequelize, testConnection } from "./config/database";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Test database connection
(async () => {
  const dbConnected = await testConnection();
  if (!dbConnected) {
    log('WARNING: Running without database functionality. Some features will not work.');
    log('The frontend will still function for demonstration purposes.');
  }
})();

app.use((req, res, next): void => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, unknown> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + '…';
      }

      log(logLine);
    }
  });

  next();
});

(async (): Promise<void> => {
  // Sync database models
  try {
    // Only attempt to sync if the connection is successful
    const dbConnected = await testConnection();
    if (dbConnected) {
      await sequelize.sync({ alter: true });
      log('Database synchronized successfully');
    } else {
      log('Skipping database synchronization due to connection failure');
    }
  } catch (error) {
    log('Error synchronizing database:', error);
    // Continue with application startup even if database sync fails
    log('Continuing application startup without database synchronization');
  }

  const server = await registerRoutes(app); 

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";

    // Log the error but don't throw it to prevent the server from crashing
    log('Error:', err);

    // Only send response if headers haven't been sent yet
    if (!res.headersSent) {
      res.status(status).json({ message });
    }
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes 
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Serve the app on the configured port
  // this serves both the API and the client.

  const port = Number(process.argv.find((arg) => arg.startsWith('--port='))?.split('=')[1]) || config.server.port

  server.listen(port, (): void => {
    log(`serving on port ${port} in ${config.server.env} mode`);
  });
})();
