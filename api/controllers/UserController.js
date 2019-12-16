/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  login: function (req, res) {
    if (!req.param('email') || !req.param('password')) {
      return res.serverError('No field should be empty.');
    }

    User.findOne({
      email: req.param('email')
    }).exec(function callback(err, user) {
      if (err) { return res.serverError(err); }
      if (!user) { return res.serverError('User not found, please sign up.'); }

      // check password
      bcrypt.compare(req.param('password'), user.password, (error, matched) => {
        if (error) {
          return res.serverError(error);
        }

        if (!matched) {
          return res.serverError('Invalid password.');
        }

        user.token = jwt.sign(user.toJSON(), 'votre clé secrète ici', {
          expiresIn: '7d'
        });

        res.ok(user);
      });

    });
  },

  token: function (req, res) {
    User.findOne(req.user.id).exec(function callback(error, user) {
      if (error) { return res.serverError(error); }
      if (!user) { return res.serverError('User not found'); }

      user.token = jwt.sign(user.toJSON(), 'votre clé secrète ici', {
        expiresIn: '7d'
      });
      res.ok(user);
    });
  },
};
