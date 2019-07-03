module.exports = (app) => {
  // Open routes
  app.post('/signup', app.controllers.user.create);
  app.post('/signin', app.controllers.auth.signin);

  // Protect the API!
  // All routes below this point won't allow access without login
  app.use(app.controllers.auth.validateToken);

  // USER
  app.route('/users')
    .post(app.controllers.user.create)
    .get(app.controllers.user.list);
  app.route('/users/:userid')
    .put(app.controllers.user.create)
    .get(app.controllers.user.listOne)
    .delete(app.controllers.user.remove);

  // FAVORITES
  app.route('/favorites')
    .post(app.controllers.favorite.create)
    .get(app.controllers.favorite.list);
  app.route('/favorites/:favid')
    .delete(app.controllers.favorite.remove);
};
