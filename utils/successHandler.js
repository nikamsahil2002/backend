function handleSuccess(message, data = {}) {
    const response = {
      success: true,
      message: message,
      data,
    };
    return response;
  }
  
  module.exports = handleSuccess;
  