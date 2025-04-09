module.exports = {
  "development": {
    "connection_url": process.env.DB_DEV_URL,
    "useNewUrlParser": true,
    "useUnifiedTopology": true
  },
  "test": {
    "connection_url": process.env.DB_TEST_URL,
    "useNewUrlParser": true,
    "useUnifiedTopology": true
  },
  "uat": {
      "connection_url": process.env.DB_UAT_URL,
      "useNewUrlParser": true,
      "useUnifiedTopology": true
    },
  "production": {
    "connection_url": process.env.DB_PROD_URL,
    "useNewUrlParser": true,
    "useUnifiedTopology": true
  }
}
