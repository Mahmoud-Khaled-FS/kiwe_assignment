describe('Config Module', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.resetModules();
  });

  test('should load valid config values', async () => {
    process.env = {
      PORT: '4000',
      TOKEN_PUBLIC: 'public-key',
      TOKEN_PRIVATE: 'private-key',
      DB_NAME: 'test-db',
      DB_HOST: '127.0.0.1',
      DB_USER: 'admin',
      DB_PORT: '5433',
      DB_PASSWORD: 'secret',
      NODE_ENV: 'production',
      REDIS_HOST: '127.0.0.1',
      REDIS_PORT: '6380',
      ENCRYPT: 'true',
    };

    jest.resetModules();

    const { getConfig } = await import('../../config/env');
    const Config = getConfig();

    expect(Config).toEqual({
      PORT: 4000,
      TOKEN_PUBLIC: 'public-key',
      TOKEN_PRIVATE: 'private-key',
      OPEN_WEATHER_API_KEY: undefined,
      DB_NAME: 'test-db',
      DB_HOST: '127.0.0.1',
      DB_USER: 'admin',
      DB_PORT: 5433,
      DB_PASSWORD: 'secret',
      NODE_ENV: 'production',
      REDIS_HOST: '127.0.0.1',
      REDIS_PORT: 6380,
      ENCRYPT: 'true',
    });
  });

  test('should use default values when env variables are missing', async () => {
    process.env = {
      TOKEN_PUBLIC: 'public-key',
      TOKEN_PRIVATE: 'private-key',
      DB_NAME: 'test-db',
      DB_USER: 'admin',
      DB_PASSWORD: 'secret',
    };

    jest.resetModules();
    const { Config } = await import('../../config/env');

    expect(Config).toEqual({
      PORT: 3000, // Default
      TOKEN_PUBLIC: 'public-key',
      TOKEN_PRIVATE: 'private-key',
      OPEN_WEATHER_API_KEY: undefined, // Optional
      DB_NAME: 'test-db',
      DB_HOST: 'localhost', // Default
      DB_USER: 'admin',
      DB_PORT: 5432, // Default
      DB_PASSWORD: 'secret',
      NODE_ENV: 'development', // Default
      REDIS_HOST: 'localhost', // Default
      REDIS_PORT: 6379, // Default
      ENCRYPT: 'false', // Default
    });
  });

  test('should exit process if required env variables are missing', async () => {
    process.env = {
      PORT: '4000',
    };

    // Mock process.exit and console.error
    const mockExit = jest.spyOn(process, 'exit').mockImplementation((_code) => {
      return undefined as never; // Prevent actual exit
    });

    // Expect the import to fail due to process.exit
    await expect(import('../../config/env')).resolves.toHaveProperty('Config', undefined);
    expect(mockExit).toHaveBeenCalledWith(1);
    mockExit.mockRestore();
  });
});
