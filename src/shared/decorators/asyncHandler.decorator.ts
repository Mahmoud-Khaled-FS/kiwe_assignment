import { NextFunction } from 'express';
import AppError from '../utils/appError';

export function asyncMethod(_: unknown, __: string, descriptor: PropertyDescriptor) {
  const fn = descriptor.value;
  descriptor.value = async function (...args: unknown[]) {
    try {
      await fn.apply(this, args);
    } catch (error: unknown) {
      let err = error as Error;
      if (!(err instanceof AppError)) {
        err = AppError._500(err as Error);
      }
      const next = args[2] as NextFunction;
      if (!next) {
        throw err;
      }
      next(err);
    }
  };
  return descriptor;
}

export function AsyncClass() {
  return function (target: new (...params: unknown[]) => unknown) {
    for (const key of Object.getOwnPropertyNames(target.prototype)) {
      let descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);
      if (descriptor) {
        descriptor = asyncMethod(null, key, descriptor);
        Object.defineProperty(target.prototype, key, descriptor);
      }
    }
  };
}
