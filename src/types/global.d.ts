import { Responseable } from '../shared/utils/appResponse';
import { Id } from './database';

declare global {
  namespace Express {
    export interface Request {
      userId: Id;
    }
    export interface Response {
      appRes(response: Responseable): void;
    }
  }
}

export {};
