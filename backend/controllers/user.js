/* eslint-disable no-console */
const crypto = require('crypto');
const User = require('../database/models').user;

module.exports = (app) => {
  const { validateField, validateFieldNotRequired } = app.utils.validation;

  /**
   * Create an user. Consider that all fields on userData are valid
   * @param {object} userData
   * @param {express res} res
   */
  const createUser = async (userData, res) => {
    console.log('creating new user');
    try {
      const user = await User.create(userData);
      res.status(201).send(user);
    } catch (error) {
      console.log(`Error creating user: ${error}`);
      res.status(500).send('Could not create the user');
    }
  };

  /**
   * Update an user. Consider that all fields on userData are valid,
   *  except foreight keys, that will be validated
   * @param {object} userData
   * @param {express res} res
   */
  const updateUser = async (userData, res) => {
    console.log(`Updating user ${userData.id}`);
    let user;
    try {
      user = await User.findByPk(userData.id);
    } catch (error) {
      console.log(`Error getting user for update: ${error}`);
    }

    if (user) {
      try {
        await user.update(userData);
        res.status(200).send('success');
      } catch (error) {
        console.log(`Error updating user ${error}`);
        res.status(500).send('Could not update the user');
      }
    } else {
      res.status(404).send('User does not exist');
    }
  };

  /**
   * Fill the fields that are not provided by the user
   * do complex validation on the fields. if everything is ok, create/update
   * the user
   * @param {object} userData
   * @param {express res} res
   */
  const createSanitized = async (userData, res) => {
    console.log(userData);

    // create a salt with pepper
    const salt = crypto.randomBytes(Math.ceil(5))
      .toString('hex').slice(0, 10);

    // add the salt and pepper before hashing the password (tasty!)
    const passwd = crypto.pbkdf2Sync(userData.passwd,
      salt + app.conf.passwordPepper, 2048, 32, 'sha512')
      .toString('hex');
    const filledUserData = { ...userData, salt, passwd };

    if (userData.id) {
      // we are updating a user
      updateUser(filledUserData, res);
    } else {
      // we are creating a user
      createUser(filledUserData, res);
    }
  };

  /**
   * This method is the entry point to update/create an user
   * Sanitize user input, if no errors where found, pass to the method
   * in chage to create/update the user
   * @param {express request} req
   * @param {express response} res
   */
  const create = async (req, res) => {
    try {
      const id = req.params.userid;
      const {
        // eslint-disable-next-line camelcase
        name, email, passwd, can_create_users, can_create_subjects,
      } = req.body;
      validateFieldNotRequired('userid', id, 'number');
      validateField('name', name, 'string');
      validateField('email', email, 'string', 6, 254);
      validateField('password', passwd, 'string', 6, 64);

      const userData = {
        id,
        name,
        email,
        passwd,
        can_create_subjects,
        can_create_users,
      };
      createSanitized(userData, res);
    } catch (error) {
      res.status(400).send(error);
    }
  };

  /**
   * list all users
   * @param {express request} req
   * @param {express response} res
   */
  const list = async (req, res) => {
    try {
      const users = await User.findAll();
      res.status(200).send(users);
    } catch (error) {
      console.log(`Error listing users: ${error}`);
      res.status(500).send('Error listing users');
    }
  };

  /**
   * get one user from DB
   * @param {express request} req
   * @param {express response} res
   */
  const listOne = async (req, res) => {
    const id = req.params.userid;
    console.log(`quering user ${id}`);
    try {
      validateField('user id', id, 'number');
    } catch (error) {
      return res.status(400).send(error);
    }

    try {
      const user = await User.findByPk(req.params.userid);
      if (!user) {
        return res.status(404).send({
          error: 'User Not Found',
        });
      }
      return res.status(200).send(user);
    } catch (error) {
      console.log(`Error getting a user: ${error}`);
      return res.status(500).send('Error finding user');
    }
  };

  /**
   * remove specified user from DB
   *  @param {express request} req
   *  @param {express response} res
   */
  const remove = async (req, res) => {
    // TODO: should check if the user is allowed to delete others
    // TODO: a user shouldn't delete itself!
    const id = req.params.userid;
    console.log(`removing user ${id}`);
    try {
      validateField('user id', id, 'number');
    } catch (error) {
      return res.status(400).send(error);
    }

    try {
      await User.destroy({ where: { id } });
      return res.status(200).send(`removed user ${id}`);
    } catch (error) {
      return res.status(500).send(error);
    }
  };

  return {
    create, list, listOne, remove,
  };
};
