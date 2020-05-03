'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
   return queryInterface.bulkInsert('Users', [{
    firstName: 'Jack',
    lastName: 'Chi',
    password: 'pass',
    email: 'jack@jackchi.org',
    createdAt: new Date(),
    updatedAt: new Date(),
    token: '$2b$10$8.sJC/ULjUwqscEwifq85OtKdayRkLY0hbCcLD8kle54nNjl2CWTS',
  }]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
