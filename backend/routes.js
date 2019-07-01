module.exports = app => {
    // USER
    app.route('/users')
        .post(app.controllers.user.create)
        .get(app.controllers.user.list)
    app.route('/users/:userid')
        .put(app.controllers.user.create)
        .get(app.controllers.user.listOne)
        .delete(app.controllers.user.remove)
}