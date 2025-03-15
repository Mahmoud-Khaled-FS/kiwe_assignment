import { codeToString, HttpStatus, HttpStatusMessage } from '../../shared/utils/statusCode';

describe('HTTP Status Utilities', () => {
  describe('HttpStatus Enum', () => {
    it('should define correct status codes', () => {
      expect(HttpStatus.Ok).toBe(200);
      expect(HttpStatus.Created).toBe(201);
      expect(HttpStatus.BadRequest).toBe(400);
      expect(HttpStatus.Unauthorized).toBe(401);
      expect(HttpStatus.NotFound).toBe(404);
      expect(HttpStatus.InternalServerError).toBe(500);
      expect(HttpStatus.BadGateway).toBe(502);
      // Add more as needed, or test exhaustively below
    });

    it('should have all expected enum values', () => {
      const expectedValues = [
        200, 201, 202, 203, 204, 205, 206, 300, 301, 302, 303, 304, 305, 306, 307, 400, 401, 402, 403, 404, 405, 406,
        407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 422, 429, 500, 501, 502, 503, 504, 505,
      ];
      const enumValues = Object.values(HttpStatus).filter((v) => typeof v === 'number');
      expect(enumValues).toEqual(expectedValues);
    });
  });

  describe('HttpStatusMessage', () => {
    it('should map status codes to correct messages', () => {
      expect(HttpStatusMessage['200']).toBe('OK');
      expect(HttpStatusMessage['201']).toBe('Created');
      expect(HttpStatusMessage['400']).toBe('Bad Request');
      expect(HttpStatusMessage['401']).toBe('Unauthorized');
      expect(HttpStatusMessage['404']).toBe('Not Found');
      expect(HttpStatusMessage['500']).toBe('Internal Server Error');
      expect(HttpStatusMessage['418']).toBe("I'm a teapot");
      // Add more as needed
    });

    it('should have messages for all HttpStatus codes', () => {
      const statusCodes = Object.values(HttpStatus).filter((v) => typeof v === 'number');
      statusCodes.forEach((code) => {
        // @ts-ignore
        expect(HttpStatusMessage[code.toString()]).toBeDefined();
      });
    });
  });

  describe('codeToString', () => {
    it('should return correct message for valid status codes', () => {
      expect(codeToString(HttpStatus.Ok)).toBe('OK');
      expect(codeToString(HttpStatus.Created)).toBe('Created');
      expect(codeToString(HttpStatus.NotFound)).toBe('Not Found');
      expect(codeToString(HttpStatus.InternalServerError)).toBe('Internal Server Error');
      expect(codeToString(HttpStatus.ImATeapot)).toBe("I'm a teapot");
    });

    it('should return InternalServerError message for invalid status code', () => {
      // @ts-ignore: Testing invalid input
      expect(codeToString(999)).toBe(HttpStatusMessage['500']);
      // @ts-ignore: Testing invalid input
      expect(codeToString(-1)).toBe(HttpStatusMessage['500']);
    });

    it('should handle all HttpStatus codes correctly', () => {
      const statusCodes = Object.values(HttpStatus).filter((v) => typeof v === 'number');
      statusCodes.forEach((code) => {
        // @ts-ignore
        expect(codeToString(code)).toBe(HttpStatusMessage[code.toString()]);
      });
    });
  });
});
