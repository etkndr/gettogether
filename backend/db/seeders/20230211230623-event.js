"use strict";
const bcrypt = require("bcryptjs");
const { User, EventImage, Group, Venue, Attendance } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Events";
    return queryInterface.bulkInsert(options, [
      {
        groupId: 1,
        venueId: 1,
        name: "Modular in the park",
        type: "In person",
        capacity: 100,
        startDate: "2024-11-19 20:00:00",
        endDate: "2024-11-19 22:00:00",
        description:
          "fusce id velit ut tortor pretium viverra suspendisse potenti nullam",
        price: 0.0,
      },
      {
        groupId: 2,
        venueId: 1,
        name: "Coffee tasting",
        type: "In person",
        capacity: 100,
        startDate: "2024-11-19 20:00:00",
        endDate: "2024-11-19 22:00:00",
        description:
          "ut enim blandit volutpat maecenas volutpat blandit aliquam etiam erat",
        price: 10.0,
      },
      {
        groupId: 3,
        venueId: 1,
        name: "JS Q&A",
        type: "In person",
        capacity: 100,
        startDate: "2024-10-19 20:00:00",
        endDate: "2024-10-19 22:00:00",
        description:
          "Justo nec ultrices dui sapien. A erat nam at lectus urna duis.",
        price: 0.0,
      },
      {
        groupId: 4,
        venueId: 1,
        name: "Food and sleep",
        type: "In person",
        capacity: 100,
        startDate: "2024-02-19 20:00:00",
        endDate: "2024-02-19 22:00:00",
        description:
          "Dolor sit amet consectetur adipiscing elit. Massa vitae tortor.",
        price: 10.0,
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
    ]);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Events";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {});
  },
};
