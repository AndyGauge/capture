const Sequelize = require('sequelize');
const sequelize = new Sequelize('capture', 'capture_api', process.env.CAPTURETOKEN, {
  dialect: 'mssql',
  host:    process.env.SERVERNAME,
  operatorsAliases: Sequelize.Op,
})

const Entry = sequelize.define('entry', {
  tech: { type: Sequelize.STRING, validate: { is: /^[1-9][a-z]{2,3}$/i } },
  workorder: { type: Sequelize.STRING, validate: { is: /^[1-9]{6}[A-Z]?$/i } },
  timestamp: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  description: Sequelize.TEXT,
  status: { type: Sequelize.ENUM, values: ['Complete', 'Loaner', 'On Way', 'Parts', 'Returning', 'To Shop'] }
})

//Entry.sync()

exports.Entry = Entry
exports.sequelize = sequelize
