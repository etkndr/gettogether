'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Group.belongsTo(models.User, {foreignKey: "organizerId"})
    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER,
      // allowNull: false,
      references: {model: "Users"},
      onDelete: "CACADE"
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    about: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "In person"
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2,2],
        isUppercase: true
      }
    },
  }, {
    sequelize,
    modelName: 'Group',
    defaultScope: {
      attributes: {
      // exclude: ["createdAt", "updatedAt"]
      }
    }
  });
  return Group;
};