'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class assets extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  assets.init(
    {
      address: DataTypes.STRING,
      tokenId: DataTypes.NUMBER,
      dateBanned: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'assets',
    }
  )
  return assets
}
