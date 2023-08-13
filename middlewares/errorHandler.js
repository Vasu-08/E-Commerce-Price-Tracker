const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';
  const {message, stack} = err;

  res.status(statusCode).json({status, message, stack});
};

module.exports = errorHandler;
