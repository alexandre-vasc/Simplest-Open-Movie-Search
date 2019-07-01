'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    passwd: DataTypes.STRING,
    salt: DataTypes.STRING
  }, {});
  user.associate = function(models) {
    user.hasMany(models.favorites, {
      foreignKey: 'user_id',
    });
  };
  return user;
};