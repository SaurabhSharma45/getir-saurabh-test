exports.errorHandler = (err, req, res, next) => {
  try {
    const message = err.message;
    const stack = err.stack;
    const logger = req.app.parent.logger;
    logger.error(
      message,
      {
        meta: {
          status: err.status ? err.status : 500,
          stack
        }
      });
    if (!res.headersSent) {
      res.status(err.status ? err.status : 500);
      res.send({ message, status: err.status, stack });
    }
  } catch (e) {
    console.error(`Error handling log propagation of error state: ${e.message}`);
    console.error('Original Error:');
    console.error(err);
    console.error('---');
    console.error('Logging Error:');
    console.error(e);
  }
};
