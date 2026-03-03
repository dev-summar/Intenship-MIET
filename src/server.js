require('dotenv').config();

const config = require('./config');
const connectDB = require('./config/db');
const app = require('./app');
const logger = require('./utils/logger');

connectDB()
  .then(() => {
    const server = app.listen(config.port, () => {
      logger.info(`Server running in ${process.env.NODE_ENV || 'development'} on port ${config.port}`);
    });

    const shutdown = (signal) => {
      logger.info(`${signal} received. Shutting down gracefully.`);
      server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  })
  .catch((err) => {
    logger.error('Failed to start server:', err);
    process.exit(1);
  });
