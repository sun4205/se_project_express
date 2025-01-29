const errorHandler = (err, req, res) => {
    console.error(err);
    // if an error has no status, set it to 500
    const { statusCode = 500, message } = err;
    res
      .status(statusCode)
      .send({
        // check the status and display a message based on it
        message: statusCode === 500
          ? 'An error occurred on the server'
          : message
      });
  };

  module.exports = errorHandler;