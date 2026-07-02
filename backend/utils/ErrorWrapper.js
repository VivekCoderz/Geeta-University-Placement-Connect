function ErrorWrapper(fn) {
  return function async(req, res, next) {
    try {
      fn(req, res, next);
    } catch (err) {
      throw new ErrorHandler(err.statusCode || 500, err.message || "Internal Server Error");
    }
  };
}

module.exports = ErrorWrapper;