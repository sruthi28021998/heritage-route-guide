exports.notFound = (req, res) =>
  res.status(404).json({ message: `Not found: ${req.originalUrl}` });

exports.errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || 'Server error';

  if (err.name === 'CastError' || err.name === 'BSONError') { status = 400; message = 'Invalid id'; }
  else if (err.name === 'ValidationError') status = 400;
  else if (err.code === 11000) { status = 400; message = 'Duplicate value'; }

  if (status === 500) console.error(err);
  res.status(status).json({ message });
};