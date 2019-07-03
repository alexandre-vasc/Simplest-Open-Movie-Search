'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    passwd: DataTypes.STRING,
    salt: DataTypes.STRING
  }, {
    defaultScope: {
      attributes: { exclude: ['passwd', 'salt'] },
    },
    scopes: {
      loginScope: {
      }
    }
  });
  user.associate = function(models) {
    user.hasMany(models.favorite, {
      foreignKey: 'user_id',
    });
  };
  return user;
};