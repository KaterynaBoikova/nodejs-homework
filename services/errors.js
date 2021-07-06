class projectErrors extends Error {
  constructor(message) {
    super(message)
    this.status = 400
  }
}

class ValidationError extends projectErrors {
  constructor(message) {
    super(message)
    this.status = 400
  }
}

class EmailInUseError extends projectErrors {
  constructor(message) {
    super(message)
    this.status = 409
  }
}

class NotAuthorizedError extends projectErrors {
  constructor(message) {
    super(message)
    this.status = 401
  }
}

module.exports = {
  projectErrors,
  ValidationError,
  EmailInUseError,
  NotAuthorizedError
}
