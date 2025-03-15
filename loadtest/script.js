import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  // stages: [
  //   // { duration: '1m', target: 1000 }, // Hold at 100k users for 5 minutes
  //   { duration: '30s', target: 10000 }, // Ramp down to 0 users over 1 minute
  //   // { duration: '30s', target: 0 }, // Ramp down to 0 users over 1 minute
  // ],

  vus: 1000,
  duration: '3s',

  thresholds: {
    http_req_failed: ['rate<0.01'], // Error rate should be less than 1%
    http_req_duration: ['p(95)<500'], // 95% of requests should complete under 500ms
  },
  insecureSkipTLSVerify: true,
};

export default function () {
  const res = http.get('http://localhost:3000/api/v1/weather/city?city=cairo', { insecureSkipTLSVerify: true });

  if (res.status !== 200) {
    console.log(`Request failed with status: ${res.status}`);
  }

  // Simulate user think time (e.g., 0.5-2 seconds)
  sleep(Math.random() * 1.5 + 0.5);
}
