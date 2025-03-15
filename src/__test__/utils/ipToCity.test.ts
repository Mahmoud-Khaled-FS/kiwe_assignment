import axios from 'axios';
import logger from '../../shared/utils/logger';
import { cityFromIp } from '../../shared/utils/ip';

// Mock axios and logger
jest.mock('axios');
jest.mock('../../shared/utils/logger');

describe('cityFromIp', () => {
  // Cast mocks to their types
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  const mockedLogger = logger as jest.Mocked<typeof logger>;

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks between tests
  });

  test('should return city name for a valid IP', async () => {
    // Mock successful axios response
    mockedAxios.get.mockResolvedValue({
      data: { city: 'New York' },
    });

    const result = await cityFromIp('8.8.8.8');
    expect(result).toBe('New York');
    expect(mockedAxios.get).toHaveBeenCalledWith('http://ip-api.com/json/8.8.8.8?fields=city');
    expect(mockedLogger.error).not.toHaveBeenCalled();
  });

  test('should return null and log error when axios request fails', async () => {
    // Mock axios error
    const error = new Error('Network error');
    mockedAxios.get.mockRejectedValue(error);

    const result = await cityFromIp('8.8.8.8');
    expect(result).toBe(null);
    expect(mockedAxios.get).toHaveBeenCalledWith('http://ip-api.com/json/8.8.8.8?fields=city');
    expect(mockedLogger.error).toHaveBeenCalledWith(error);
  });

  test('should handle invalid IP gracefully', async () => {
    // Mock response for an invalid IP (assuming API returns empty city)
    mockedAxios.get.mockResolvedValue({
      data: { city: undefined },
    });

    const result = await cityFromIp('invalid-ip');
    expect(result).toBe(undefined);
    expect(mockedAxios.get).toHaveBeenCalledWith('http://ip-api.com/json/invalid-ip?fields=city');
    expect(mockedLogger.error).not.toHaveBeenCalled();
  });
});
