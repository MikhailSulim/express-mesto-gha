const {
  PORT = 3000,
  JWT_SECRET = 'vb28135ebcfc17578f96d4df5b6c78d1f2c803be4180cts5061d5cddb621c514',
  DB_URL = 'mongodb://127.0.0.1:27017/mestodb',
} = process.env;

module.exports = { PORT, JWT_SECRET, DB_URL };
