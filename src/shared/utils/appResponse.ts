import { HttpStatus } from './statusCode';
import { Responseable, SuccessResponse } from '../../types/response';

class AppResponse implements Responseable {
  public constructor(
    public readonly data: unknown,
    public readonly code: HttpStatus = HttpStatus.Ok,
    public readonly metadata?: unknown | undefined,
  ) {}

  public static ok(data: unknown, metadata?: unknown) {
    return new AppResponse(data, HttpStatus.Ok, metadata);
  }

  public toJson(): SuccessResponse {
    return {
      success: true,
      code: this.code,
      data: this.data,
      metadata: this.metadata,
    };
  }

  statusCode(): number {
    return this.code;
  }
}

export default AppResponse;
