'use strict';
const {EventImage, Attendance, Group, Venue} = require("../models")

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Event.belongsTo(models.Group, {foreignKey: "groupId"})
      Event.belongsTo(models.Venue, {foreignKey: "venueId"})
      Event.hasMany(models.Attendance, {foreignKey: "eventId", as: "numAttending"})
      Event.hasMany(models.EventImage, {foreignKey: "eventId"})
    }
  }
  Event.init({
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {model: "Groups"},
      onDelete: "CASCADE"
    },
    venueId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {model: "Venues"},
      onDelete: "CASCADE"
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [5,100000],
          msg: "Name must be at least 5 characters"
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
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: "Capacity must be an integer"
        }
      }
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: {
          msg: "Start date must be a valid datetime"
        },
        start(val) {
          if (val < Date.now()) {
            throw new Error("Start date must be in the future")
          }
        }
      }
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Description is required"
        }
      }

    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  },
  {
      sequelize,
      validate: {
        date() {
          if (this.startDate > this.endDate) {
            throw new Error("End date is less than start date")
          }
        }
      },
    modelName: 'Event',
  });

  Event.addScope("defaultScope", {
    attributes: {
    exclude: ["createdAt", "updatedAt"]
    }
  })
  
  return Event;
};