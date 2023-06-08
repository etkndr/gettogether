'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'GroupImages';
    return queryInterface.bulkInsert(options, [
      {
        groupId: 1,
        url: "https://i.imgur.com/wV727LR.jpg",
        preview: true
      },
      {
        groupId: 2,
        url: "https://i.imgur.com/hces8eJ.jpg",
        preview: true
      }
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
      options.tableName = 'GroupImages';
      const Op = Sequelize.Op;
      return queryInterface.bulkDelete(options, {});
    }
};
