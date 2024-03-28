const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Idea = sequelize.define('Idea', {
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tag: {
    type: DataTypes.STRING,
  },
  username: {
    type: DataTypes.STRING,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Idea;
