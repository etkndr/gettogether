'use strict';

const {Membership} = require("../models")

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
      Group.belongsTo(models.User, {foreignKey: "organizerId", as: "organizer"})
      Group.hasMany(models.Membership, {foreignKey: "groupId"})
      Group.hasMany(models.Event, {foreignKey: "eventId"})
      Group.hasMany(models.GroupImage, {foreignKey: "groupId"}),
      Group.hasMany(models.Venue, {foreignKey: "groupId"})
    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {model: "Users"},
      onDelete: "CASCADE"
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 60],
          msg: "Name must be 60 characters or less"
        }
      }
    },
    about: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [50, 100000],
          msg: "About must be 50 characters or more"
        }
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        type(val) {
          if (val !== "Online" && val !== "In person") {
            throw new Error ("Type must be 'Online' or 'In person'")
          }
        }
      }
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "City is required"
        }
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2,2],
        isUppercase: true,
        notNull: {
          msg: "State is required"
        }
      }
    },
  }, {
    sequelize,
    modelName: 'Group',
    defaultScope: {

    },
    scopes: {
      organizer(userId) {
        const {User} = require("../models")
        return {
          where: {
            id: userId
          },
          include: [
            {model: User, as: "organizer"}
          ]
        }
      },
      grpImg(imgId) {
        const {GroupImage} = require("../models")
        return {
          where: {
            id: imgId
          },
          include: [
            {model: GroupImage}
          ]
        }
      }
    }
  });
  return Group;
};