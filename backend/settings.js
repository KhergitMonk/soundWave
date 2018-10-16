module.exports = {
  MongoDBConnectionString: process.env.DATABASE_URL || 'mongodb://localhost/sound_wave',
  ServerPort: process.env.PORT || 3000,
  JWTSecret: process.env.JWT_SECRET || 'SOME_LONG_SECRET_STRING'
}