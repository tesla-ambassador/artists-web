const { Sequelize } = require('sequelize');
const config = require('../config/config.js');
const sequelize = new Sequelize(config.development.url);

const db = {
  sequelize,
  Sequelize,
  User: require('./User.js')(sequelize),
  File: require('./File')(sequelize),
  Event: require('./Event')(sequelize),
};

Object.values(db).forEach((model) => {
  if (model.associate) model.associate(db);
});

module.exports = db;
