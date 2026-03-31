'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  return queryInterface.sequelize.transaction(t => {
    return Promise.all([
      queryInterface.addColumn('Users', 'optedout', {
        type: Sequelize.DataTypes.BOOLEAN,
      }, { transaction: t })
    ]);
  });
}
export async function down(queryInterface, Sequelize) {
  return queryInterface.sequelize.transaction(t => {
    return Promise.all([
      queryInterface.removeColumn('Users', 'optedout', { transaction: t })
    ]);
  });
}
