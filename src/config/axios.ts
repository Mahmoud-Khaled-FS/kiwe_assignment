import axios from 'axios';
import axiosRetry from 'axios-retry';

/**
 * Set up axios retry interceptor each request will be retried 3 times
 */
export function setupAxiosRetryInterceptor() {
  axiosRetry(axios, {
    retries: 3, // number of retries
    retryDelay: (retryCount) => {
      console.log(`retry attempt: ${retryCount}`);
      return retryCount * 1000; // time interval between retries
    },
    retryCondition: (error: any) => {
      return error.response.status === 503;
    },
  });
}
