/**
 * is-logged-in
 *
 * A simple policy that allows any request from an authenticated user.
 *
 * For more about how to use policies, see:
 *   https://sailsjs.com/config/policies
 *   https://sailsjs.com/docs/concepts/policies
 *   https://sailsjs.com/docs/concepts/policies/access-control-and-permissions
 */

var jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  var bearerToken;
  var bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    var bearer = bearerHeader.split(' ');
    bearerToken = bearer[1];

    if (bearer[0] !== 'Bearer') {
      return res.forbidden('bearer not understood');
    }

    // on vérifie si le token est bon
    jwt.verify(bearerToken, 'votre clé secrète ici', (err, decoded) => {
      if (err) {
        sails.log('verification error', err);
        if (err.name === 'TokenExpiredError') {
          return res.forbidden('Session timed out, please login again');
        }
        else {
          return res.forbidden('Error authenticating, please login again');
        }
      }

      User.findOne(decoded.id).exec(function callback(error, user) {
        if (error) { return res.serverError(err); }
        if (!user) { return res.serverError('User not found'); }

        req.user = user;
        next();
      });

    });

  } else {
    return res.forbidden('No token provided');
  }
};
