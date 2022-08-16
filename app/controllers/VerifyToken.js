var jwt = require('jsonwebtoken');
var config = require('../../config');
const logProvider = require('../logger/LogProvider');

const logger = logProvider.getInstance();

function verifyToken(req, res, next) {
  var authorizationHeader = req.headers['authorization'];
  if (!authorizationHeader){
    const noTokenErrorMsg = 'No token provided.';
    logger.error(noTokenErrorMsg);
    res.status(403).send({ auth: false, message: noTokenErrorMsg });
    return 
  }
  var token = authorizationHeader.split(' ')[1]
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err){
      const authFailedErrorMsg = 'Failed to authenticate token.';
      logger.error(authFailedErrorMsg);
      res.status(500).send({ auth: false, message: authFailedErrorMsg });
      return
    }
      
    // if everything good, save to request for use in other routes
    req.userId = decoded.user;
    logger.debug('Verified token. User id: ' + req.userId );
    next();
  });
}

module.exports = verifyToken;