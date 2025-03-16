import axios from 'axios';
import axiosRetry from 'axios-retry';

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
