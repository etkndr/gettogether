'use strict';

const bcrypt = require("bcryptjs");
const {User} = require("../models")

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const john = await User.findAll({
      where: {
        firstName: "John"
      }
    })
    options.tableName = 'Groups';
    return queryInterface.bulkInsert(options, [
      {
        organizerId: 4,
        name: 'Group 1',
        about: "test group",
        type: "In person",
        private: true,
        city: "New York",
        state: "NY"
     },
     {
      organizerId: john[0].id,
      name: 'Group 2',
      about: "test group John Doe",
      type: "In person",
      private: true,
      city: "New York",
      state: "NY"
   },
   {
    organizerId: john[0].id,
    name: 'Group 3',
    about: "test group John Doe 2",
    type: "In person",
    private: true,
    city: "New York",
    state: "NY"
 },
  ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Group 1', "Group 2", "Group 3"] }
    }, {});
  }
};
