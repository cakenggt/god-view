module.exports = function(sequelize, DataTypes) {
  var Trip = sequelize.define('Trip', {
    time: DataTypes.DATE,
    pickup: DataTypes.GEOGRAPHY,
    dropoff: DataTypes.GEOGRAPHY,
    base: DataTypes.STRING
  });
  return {
    sequelize: sequelize,
    Trip: Trip
  };
};
