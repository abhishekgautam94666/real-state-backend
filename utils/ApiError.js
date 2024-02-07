class ApiError extends Error {
  constructor(statusCode, message = "something went wrong", error = []) {
    super(message);
    this.statusCode = statusCode;
    this.error = error;
    (this.data = null), (this.message = message);
    this.success = false;
  }
}

export { ApiError };
