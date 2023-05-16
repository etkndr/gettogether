'use strict';

const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {
        firstName: "John",
        lastName: "Doe",
        email: 'demo@user.io',
        username: 'Demo-lition',
        password: bcrypt.hashSync('password')
      },
      {
        firstName: "Jane",
        lastName: "Smith",
        email: 'user1@user.io',
        username: 'FakeUser1',
        password: bcrypt.hashSync('password2')
      },
      {
        firstName: "Ben",
        lastName: "Dover",
        email: 'user2@user.io',
        username: 'FakeUser2',
        password: bcrypt.hashSync('password3')
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
