const datastores = require('./datastores');

module.exports.migrations = {
  connection: datastores.datastores.default,
  table: 'sails_migrations',
  migrationsDir: 'sails_migrations',
  coffeeFile: false
};
