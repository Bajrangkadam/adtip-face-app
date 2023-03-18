const { createLogger, format, transports } = require('winston');
const fs = require('fs');

const tsFormat = () => new Date().toISOString();
const logDir = process.env.LOGGING_DIR || 'logs';
const logLevel = process.env.LOGGING_LEVEL || 'info';

// Create log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

module.exports = createLogger({
transports:
    new transports.File({
    filename: `${logDir}/${new Date().toISOString().split('T')[0]}.log`,
    format:format.combine(
        format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
        format.align(),
        format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
    )}),
});