// Handle MongoDB duplicate key error
const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' already exists. Please use another ${field}.`;
  return { statusCode: 400, status: 'fail', message };
};

// Handle MongoDB validation error
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return { statusCode: 400, status: 'fail', message };
};

// Handle MongoDB cast error
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return { statusCode: 400, status: 'fail', message };
};

const globalErrorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;
  error.status = err.status || "error";

  // Handle MongoDB duplicate key error (E11000)
  if (err.code === 11000) {
    const duplicateError = handleDuplicateFieldsDB(err);
    error.statusCode = duplicateError.statusCode;
    error.status = duplicateError.status;
    error.message = duplicateError.message;
  }

  // Handle MongoDB validation error
  if (err.name === 'ValidationError') {
    const validationError = handleValidationErrorDB(err);
    error.statusCode = validationError.statusCode;
    error.status = validationError.status;
    error.message = validationError.message;
  }

  // Handle MongoDB cast error
  if (err.name === 'CastError') {
    const castError = handleCastErrorDB(err);
    error.statusCode = castError.statusCode;
    error.status = castError.status;
    error.message = castError.message;
  }

  // Send response
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && {
      error: err,
      stack: err.stack,
    }),
  });
};

export default globalErrorHandler;
