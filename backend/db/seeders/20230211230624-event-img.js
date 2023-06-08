'use strict';
const bcrypt = require("bcryptjs");
const {Event} = require("../models")

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'EventImages';
    return queryInterface.bulkInsert(options, [
      {
        eventId: 1,
        url: "https://i.imgur.com/grfMQkx.jpg",
        preview: true
      },
      {
        eventId: 2,
        url: "https://i.imgur.com/2xRDfHF.jpg",
        preview: true
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
      options.tableName = 'EventImages';
      const Op = Sequelize.Op;
      return queryInterface.bulkDelete(options, {});
    }
};
