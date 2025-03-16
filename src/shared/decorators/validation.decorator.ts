import { Schema } from 'zod';
import { fromError } from 'zod-validation-error';
import AppError from '../utils/appError';
import { HttpStatus } from '../utils/statusCode';

/**
 * validates request body with zod schema
 * replace request body with validated body
 */
export const Validate = (validation: Schema) => {
  return (_: any, __: string, descriptor: PropertyDescriptor) => {
    const fn = descriptor.value;
    descriptor.value = function (...args: any) {
      const [req] = args;
      const validatedBody = validation.safeParse(req.body);
      if (!validatedBody.success) {
        const message = fromError(validatedBody.error).toString();
        throw new AppError(message, HttpStatus.UnprocessableContent);
      }
      req.body = validatedBody.data;
      return fn.apply(this, args);
    };
    return descriptor;
  };
};
