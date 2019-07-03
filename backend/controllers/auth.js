const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../database/models').user;

/**
 * Module responsible to login and auth check features
 */
module.exports = (app) => {
  const { validateField } = app.utils.validation;
  /**
   * Login an user. Give the user a signed JWT on success.
   * @param {express request object} req
   * @param {express response object} res
   */
  const signin = async (req, res) => {
    const { password, email } = req.body;
    try {
      validateField('email', email, 'string');
      validateField('password', password, 'string');
    } catch (error) {
      return res.status(400).send(error);
    }

    const user = await User.scope('loginScope').findOne(
      {
        where: { email },
      },
    );

    if (!user) {
      return res.status(401).send('Invalid email');
    }
    // validate the password
    const saltAndPepper = user.salt + app.conf.passwordPepper;
    const hashedPwd = crypto.pbkdf2Sync(password, saltAndPepper, 2048, 32, 'sha512')
      .toString('hex');

    if (user.passwd === hashedPwd) {
      const payload = {
        userid: user.id,
        email: user.email,
      };
      const token = jwt.sign(payload, app.conf.authSecret);
      return res.json({ token });
    }
    return res.status(401).send('Invalid email or password');
  };

  /**
   * Auth middleware. Check that the user have a JWT and it's valid
   * proccess for the next request if it has
   * return 403 and stop processing otherwise
   * @param {express request} req
   * @param {express response} res
   */
  const validateToken = async (req, res) => {
    let token = req.get('authorization');
    if (!token) {
      // console.log('no token');
      res.sendStatus(403);
    } else {
      token = token.substring(7);
      try {
        const decoded = await jwt.verify(token, app.conf.authSecret);
        if (decoded) {
          req.jwt = decoded;
          Object.freeze(req.jwt);
          req.next(); // continue processing the request
        } else {
          res.sendStatus(403);
        }
      } catch (error) {
        // console.log(`Erro parsing token: ${error}`);
        res.send(false);
      }
    }
  };

  return { signin, validateToken };
};
