const jwt = require('jsonwebtoken');
const config = require('../../configs/config');
// const cookieParser = require('cookie-parser');

// ********* Get Token ********* //
function checkToken(req, res, next) {
  // Check if auth headers exist
  if (!req.headers['authorization']) {
    return res.status(403).send({ auth: false, message: 'No token provided.' });
  } else {
    // Set token in response
    const bearerHeader = req.headers['authorization'];
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    // Verify token, decode, add to set data, send in response
    jwt.verify(req.token, config.web.secret, function(err, decoded) {
      if (err) return res.status(401).send({
        auth: false,
        message: 'Failed to authenticate token.',
        error: err
      });
      req.auth = true;
      req.firstName = decoded.firstName;
      req.lastName =decoded.lastName;
      req.userId = decoded.id;
      req.isAdmin = decoded.isAdmin;
      next();
    });
  }
}

module.exports = checkToken;
