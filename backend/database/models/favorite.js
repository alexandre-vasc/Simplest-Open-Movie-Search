'use strict';
module.exports = (sequelize, DataTypes) => {
  const favorite = sequelize.define('favorite', {
    user_id: DataTypes.INTEGER,
    imdbId: DataTypes.STRING
  }, {});
  favorite.associate = function(models) {
    favorite.belongsTo(models.user, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
    });
  };
  return favorite;
};