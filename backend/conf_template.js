/*
 * file that contains configuration of the system
 * before starting the system, copy this template and rename it to 'conf.js'
 * set the options according
 */
// eslint-disable-next-line no-unused-vars
module.exports = (app) => {
  /*
    * Key used to cypher a user token.
    * Recomended to use a 16+ randomly generated string
    * should not be changed after definition, if changed, all current logged
    * in user will need to authenticate again
    */
  const authSecret = '';

  /*
    * a string that will be appended to the user password before
    * hashing and storing in the DB.
    * Recomended to use a 5-10 randomly generated string
    * This protected the password on a case of DB leak
    * should not be changed after definition, if changed, all users
    * would need to redefine they passwords
    */
  const passwordPepper = '';

  /*
    * The port the backend will be listing to
    */
  const port = 5000;

  return { authSecret, passwordPepper, port };
};
