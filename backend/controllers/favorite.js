/* eslint-disable no-console */
const Favorite = require('../database/models').favorite;

module.exports = (app) => {
  const { validateField, validateFieldNotRequired } = app.utils.validation;

  /**
   * Create a favorite. Consider that all fields on favData are valid
   * @param {object} favData
   * @param {express res} res
   */
  const createFav = async (favData, res) => {
    console.log('creating new fav');
    try {
      await Favorite.create(favData);
      res.status(201).send('Success!');
    } catch (error) {
      console.log(`Error creating favorite: ${error}`);
      res.status(500).send('Could not create the favorite');
    }
  };

  /**
   * Fill the fields that are not provided by the user
   * do complex validation on the fields. if everything is ok, create/update
   * the favorite
   * @param {object} favData
   * @param {express res} res
   */
  const createSanitized = async (favData, res, req) => {
    // TODO: check that the imdB exist!

    // eslint-disable-next-line camelcase
    const user_id = req.jwt.userid;
    const filledFavData = { ...favData, user_id };

    // we are updating a favorite
    if (favData.id) {
      // In fact we don't need the update feature right now
      res.status(500).send('Not supported');
      // updateFav(favData, res)
    } else {
      // we are creating a favorite
      createFav(filledFavData, res);
    }
  };

  /**
   * This method is the entry point to update/create a favorite
   * Sanitize user input, if no errors where found, pass to the method
   * in chage to create/update the favorite
   * @param {express request} req
   * @param {express response} res
   */
  const create = async (req, res) => {
    try {
      const id = req.params.favid;
      validateFieldNotRequired('favid', id, 'number');

      const { imdbId } = req.body;
      validateField('imdbId', imdbId, 'string');

      const favData = { id, imdbId };
      createSanitized(favData, res, req);
    } catch (error) {
      res.status(400).send(error);
    }
  };

  /**
   * list user's favorites
   * @param {express request} req
   * @param {express response} res
   */
  const list = async (req, res) => {
    // eslint-disable-next-line camelcase
    const user_id = req.jwt.userid;
    // eslint-disable-next-line camelcase
    console.log(`listing favorites for user ${user_id}`);
    try {
      validateField('user id', user_id, 'number');
    } catch (error) {
      return res.status(400).send(error);
    }

    try {
      const fav = await Favorite.findAll({ where: { user_id } });
      return res.status(200).send(fav);
    } catch (error) {
      console.log(`Error listing favorite: ${error}`);
      return res.status(500).send('Error listing favorite');
    }
  };

  /**
   * remove specified favorite from DB
   *  @param {express request} req
   *  @param {express response} res
   */
  const remove = async (req, res) => {
    const favId = req.params.favid;
    console.log('removing');
    try {
      validateField('fav id', favId, 'number');
    } catch (error) {
      return res.status(400).send(error);
    }

    try {
      await Favorite.destroy({ where: { id: favId, user_id: req.jwt.userid } });
      console.log(`removed favorite: ${favId}`);
      return res.status(200).send(`removed favorite ${favId}`);
    } catch (error) {
      console.log(`Error rmeoving favorite: ${error}`);
      return res.status(500).send('Error rmeoving favorite');
    }
  };
  return { create, list, remove };
};
