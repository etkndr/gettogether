'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Venues';
    return queryInterface.bulkInsert(options, [
      {
        groupId: 1,
        address: "123 main",
        city: "new york",
        state: "NY",
        lat: 4.30923,
        lng: 1.09723
      },

    ])},

    async down (queryInterface, Sequelize) {
      options.tableName = 'Venues';
      const Op = Sequelize.Op;
      return queryInterface.bulkDelete(options, {});
    }
};
