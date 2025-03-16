import { ErrorResponse, Responseable } from '../../types/response';
import { HttpStatus } from './statusCode';

/**
 * Custom wrapper for Error that authenticates the error type
 * any error thrown should be an instance of this class
 * other errors will be wrapped with 500 error and the error message will not be exposed
 */
class AppError extends Error implements Responseable {
  constructor(
    message: string | Error,
    public readonly httpCode: HttpStatus = HttpStatus.BadRequest,
    public readonly originalError?: Error,
  ) {
    super(typeof message === 'string' ? message : message.message);
    if (message instanceof Error) {
      this.originalError = message;
      message = message.message;
    }
  }
  static _500(error: Error) {
    return new AppError(
      'We encountered an unexpected error while processing your request.',
      HttpStatus.InternalServerError,
      error,
    );
  }

  public toJson(): ErrorResponse {
    const errResponse: ErrorResponse = {
      code: this.httpCode,
      message: this.message,
      success: false,
    };
    if (process.env.NODE_ENV !== 'production' && this.originalError) {
      errResponse.dev = {
        message: this.originalError.message,
        stack: this.originalError.stack?.split('\n').map((m) => m.trim()),
        name: this.originalError.name,
      };
    }
    return errResponse;
  }

  statusCode(): number {
    return this.httpCode;
  }
}

export default AppError;
