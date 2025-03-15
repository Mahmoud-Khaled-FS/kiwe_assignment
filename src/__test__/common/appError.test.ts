import AppError from '../../shared/utils/appError';
import { HttpStatus } from '../../shared/utils/statusCode';

describe('AppError', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  describe('constructor', () => {
    it('should create an error with string message and default HTTP code', () => {
      const error = new AppError('Bad request');
      expect(error.message).toBe('Bad request');
      expect(error.httpCode).toBe(HttpStatus.BadRequest);
      expect(error.originalError).toBeUndefined();
      expect(error.statusCode()).toBe(HttpStatus.BadRequest); // Test statusCode
    });

    it('should create an error with Error object message', () => {
      const inputError = new Error('Test error');
      const error = new AppError(inputError, HttpStatus.Unauthorized);

      expect(error.message).toBe('Test error');
      expect(error.httpCode).toBe(HttpStatus.Unauthorized);
    });

    it('should set custom HTTP code and original error', () => {
      const original = new Error('Original error');
      const error = new AppError('Custom message', HttpStatus.Forbidden, original);
      expect(error.message).toBe('Custom message');
      expect(error.httpCode).toBe(HttpStatus.Forbidden);
      expect(error.originalError).toBe(original);
    });
  });

  describe('static _500', () => {
    it('should create a 500 error with original error', () => {
      const original = new Error('Database failure');
      const error = AppError._500(original);
      expect(error.message).toBe('We encountered an unexpected error while processing your request.');
      expect(error.httpCode).toBe(HttpStatus.InternalServerError);
      expect(error.originalError).toBe(original);
      expect(error.statusCode()).toBe(HttpStatus.InternalServerError); // Test statusCode
    });
  });

  describe('toJson', () => {
    it('should return basic error response in production', () => {
      process.env.NODE_ENV = 'production';
      const original = new Error('Original');
      const error = new AppError('Not found', HttpStatus.NotFound, original);
      const json = error.toJson();
      expect(json).toEqual({
        code: HttpStatus.NotFound,
        message: 'Not found',
        success: false,
      });
      expect(json.dev).toBeUndefined();
    });

    it('should include dev details in development with originalError', () => {
      process.env.NODE_ENV = 'development';
      const original = new Error('Database error');
      original.stack = 'Error: Database error\n    at test (file.js:10:5)';
      const error = new AppError('Server error', HttpStatus.InternalServerError, original);
      const json = error.toJson();
      expect(json).toEqual({
        code: HttpStatus.InternalServerError,
        message: 'Server error',
        success: false,
        dev: {
          message: 'Database error',
          stack: ['Error: Database error', 'at test (file.js:10:5)'],
          name: 'Error',
        },
      });
    });

    it('should exclude dev in development without originalError', () => {
      process.env.NODE_ENV = 'development';
      const error = new AppError('Bad request', HttpStatus.BadRequest);
      const json = error.toJson();
      expect(json).toEqual({
        code: HttpStatus.BadRequest,
        message: 'Bad request',
        success: false,
      });
      expect(json.dev).toBeUndefined();
    });

    it('should handle undefined stack in dev mode', () => {
      process.env.NODE_ENV = 'development';
      const original = new Error('No stack');
      delete original.stack; // Simulate no stack
      const error = new AppError('Error', HttpStatus.Conflict, original);
      const json = error.toJson();
      expect(json).toEqual({
        code: HttpStatus.Conflict,
        message: 'Error',
        success: false,
        dev: {
          message: 'No stack',
          stack: undefined,
          name: 'Error',
        },
      });
    });
  });

  describe('statusCode', () => {
    it('should return the HTTP status code', () => {
      const error = new AppError('Forbidden', HttpStatus.Forbidden);
      expect(error.statusCode()).toBe(HttpStatus.Forbidden);
    });
  });
});
