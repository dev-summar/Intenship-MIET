const sendSuccess = (res, message = '', data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const sendError = (res, message = 'Internal Server Error', statusCode = 500, data = null) => {
  const response = {
    success: false,
    message,
  };
  if (data !== null) {
    response.data = data;
  }
  return res.status(statusCode).json(response);
};

module.exports = {
  sendSuccess,
  sendError,
};
