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
