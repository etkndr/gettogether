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
        organizerId: john[0].id,
        name: 'Synth enthusiasts',
        about: "eu feugiat pretium nibh ipsum consequat nisl vel pretium lectus",
        type: "In person",
        private: false,
        city: "New York",
        state: "NY"
     },
     {
      organizerId: john[0].id,
      name: 'Coffee addicts :)',
      about: "faucibus et molestie ac feugiat sed lectus vestibulum mattis ullamcorper",
      type: "Online",
      private: false,
      city: "Los Angeles",
      state: "CA"
   }
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
