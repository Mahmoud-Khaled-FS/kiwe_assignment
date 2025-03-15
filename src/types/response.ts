import { HttpStatus } from '../shared/utils/statusCode';

export interface Responseable {
  toJson(): SuccessResponse | ErrorResponse;
  statusCode(): number;
}

export type SuccessResponse = {
  success: boolean;
  code: HttpStatus;
  data: unknown;
  metadata?: unknown;
};

export type ErrorResponse = {
  code: number;
  message: string;
  success: false;
  dev?: unknown; // TODO (MAHMOUD) - Only will shown in response when server not production
};
