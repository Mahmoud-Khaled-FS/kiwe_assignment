# Kiwe Assignment

[![Watch the video](https://github.com/Mahmoud-Khaled-FS/kiew_assignment/blob/main/screenshots/graphql.png)](https://github.com/Mahmoud-Khaled-FS/kiew_assignment/blob/main/screenshots/postman-test.mp4)

## Features

- REST API - Provides a robust API for accessing weather data.
- Dependency Injection - Ensures modular and maintainable code.
- PostgreSQL - Used as the primary database for storing data.
- Docker - Containerized deployment for easy scalability.
- Nginx - Reverse proxy for handling requests efficiently.
- Grafana Monitoring - Real-time monitoring and observability.
- Load Testing - Performance testing to handle concurrent requests.
- Linting - Ensures code quality and consistency.
- GraphQL - Query-based API for flexible data retrieval.
- Postman Collection - Includes a JSON file for API testing.
- Unit Testing - Ensures application reliability and correctness.

## Architecture and Design

The application is built using a modular architecture with mvc structure, with the following components:
The source code is divided into the following directories:

- `src`: Contains the main application code.
- `src/config`: Contains configuration files for the application.
- `src/features`: Contains feature-specific code for the application.
- `src/shared`: Contains shared code for the application.
- `src/types`: Contains type definitions for the application.
- `src/__test__`: Contains test code for the application.
- `src/graphqlServer.ts`: Contains the GraphQL server code for the application.
- `src/server.ts`: Contains the main server code for the application.
- `src/main.ts`: Contains the main entry point for the application.

each feature has a directory under `src/features` named after the feature, and contains the code for the feature.

- `src/features/weather`: Contains the code for the weather feature.
- `src/features/weather/controllers`: Contains the controllers for the weather feature.
- `src/features/weather/services`: Contains the services for the weather feature.
- `src/features/weather/repositories`: Contains the repositories for the weather feature.
- `src/features/weather/adapters`: Contains the external adapters for the weather feature E.g OpenWeatherMapApi.

The application is built using TypeScript and Node.js, and uses Docker for containerization.

## Database and cache

The application uses PostgreSQL as the primary database for storing data, and Redis as the primary cache for storing data.

## Build and Run with Docker

To build and run the application using Docker, follow these steps:

```bash
docker-compose up --build -d
```

migrate and seed the database:

```bash
docker-compose exec -T app npm run db:migrate
docker-compose exec -T app npm run db:seed
```

or run the build script:

```bash
docker-compose exec -T app bash scripts/build_cb.sh
```

## Access the API

Once the server is running, you can access the weather API at:

```
https://localhost/api/v1/weather/current
```

## GraphQL Query

url: https://localhost/api/v1/graphql

```graphql
query {
  currentWeatherByCoordinate(lat: 40.7128, long: -74.0060) {
    cityId
    weather {
      temp
      humidity
      windSpeed
      condition
      city
    }
  }
}
```

## Postman Collection

You can import the Postman collection from the file `Kiwe_assignment.postman_collection.json` to test the API endpoints using Postman.

## Load Testing

You can use a run load test script with k6:

```bash
k6 run scripts/load_test.js
```

## Linting

```bash
npm run lint
```

## Unit Testing

```bash
npm run test
```

## Grafana Monitoring

You can access the Grafana dashboard at http://localhost:3003

login: admin/admin
you can choose dashboard: https://grafana.com/grafana/dashboards/14565-node-js-dashboard/

## Encryption

to encrypt all responses you can set the environment variable

```
ENCRYPT=true
```

when encrypt is true the responses will be encrypted and add another layer response will be encrypted json string in data field
the response before send to the client will be encrypted json string with different algorithm
encryption class implemented in `src/shared/utils/encryption/encryption.ts`
for now there are 2 week encryption algorithm implemented in `src/shared/utils/encryption/decEncryption.ts` and `src/shared/utils/encryption/base64Encryption.ts`

Note the decEncryption is deprecated and will be removed in the future

## Test Coverage Report

![Coverage Report](https://github.com/Mahmoud-Khaled-FS/kiew_assignment/blob/main/screenshots/test-coverage-report.png)
