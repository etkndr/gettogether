'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Events';
    return queryInterface.bulkInsert(options, [
      {
        groupId: 1,
        venueId: 1,
        name: "Demo event",
        type: "In person",
        capacity: 100,
        startDate: "2021-11-19 20:00:00",
        endDate: "2021-11-20 20:00:00",
        description: "Demo event for testing",
        price: 18.50
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
