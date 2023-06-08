'use strict';
const bcrypt = require("bcryptjs");
const {User, EventImage, Group, Venue, Attendance} = require("../models")

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Events';
    return queryInterface.bulkInsert(options, [
      {
        groupId: 1,
        venueId: 1,
        name: "Modular in the park",
        type: "In person",
        capacity: 100,
        startDate: "2024-11-19 20:00:00",
        endDate: "2024-11-19 22:00:00",
        description: "fusce id velit ut tortor pretium viverra suspendisse potenti nullam",
        price: 0.00
      },
      {
        groupId: 2,
        venueId: 1,
        name: "Coffee tasting",
        type: "In person",
        capacity: 100,
        startDate: "2024-11-19 20:00:00",
        endDate: "2024-11-19 22:00:00",
        description: "ut enim blandit volutpat maecenas volutpat blandit aliquam etiam erat",
        price: 10.00
      },
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    ])},

    async down (queryInterface, Sequelize) {
      options.tableName = 'Events';
      const Op = Sequelize.Op;
      return queryInterface.bulkDelete(options, {});
    }
};
