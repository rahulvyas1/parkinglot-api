'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ParkingSlot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ParkingSlot.belongsTo(models.User, {
        foreignKey: 'bookedBy',
        as: 'user',
      });
    }
  }
  ParkingSlot.init(
    {
      bookedBy: DataTypes.INTEGER,
      bookedOn: DataTypes.DATE,
      floor: DataTypes.INTEGER,
      underMaintenance: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isBooked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      parkingLotId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'ParkingSlot',
    }
  );
  return ParkingSlot;
};
