const jwt = require('jsonwebtoken');
const settings = require('./settings');

module.exports = (req, res, next) => {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      jwt.verify(token, settings.JWTSecret, function(err, user) {
        if (!err) {
          req.userData = {email: user.email};
        }
        next();
      });
    } else {
      next();
    }
  }
