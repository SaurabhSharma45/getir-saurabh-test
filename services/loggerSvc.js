const winston = require("winston");
const expressWinston = require("express-winston");
const DailyRotateFile = require("winston-daily-rotate-file");

const transports = [
    new DailyRotateFile({
        filename: `request-files-%DATE%`,
        datePattern: "YYYY-MM-DD-HH",
        maxSize: "20m",
        maxFiles: "14d",
        dirname: "./logs",
        extension: ".log",
      })
];

const loggerFormat = winston.format.combine(
    winston.format.label({ label: 'info' }),
    winston.format.timestamp(),
    winston.format.json()
  );

const consoleTransport = new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.prettyPrint(),
      winston.format.splat(),
      winston.format.printf(
        (info) =>
          `${info.timestamp} [${info.label}] [${info.level}]: ${info.message}`
      )
    ),
  });


class LoggerService{
    loggers = {};
    constructor(){
        transports.push(consoleTransport)
        this.createLoggers();
    }
    createLoggers(){
        this.loggers =  winston.createLogger({
            transports: transports,
            format: loggerFormat,
            silent: false,
          });
    }

    info(prefix, message, level){
        this.loggers.log({
            prefix: prefix,
            message: message,
            level
        })
    }

    info(msg, prefix) {
        this.logEntry('info', msg, prefix);
      }
      error(msg, prefix) {
        this.logEntry('error', msg, prefix);
      }
      warn(msg, prefix) {
        this.logEntry('warn', msg, prefix);
      }
      debug(msg, prefix) {
        this.logEntry('debug', msg, prefix);
      }
      verbose(msg, prefix) {
        this.logEntry('verbose', msg, prefix);
      }
    
    logEntry(level, message, prefix) {
        this.loggers.log({
            prefix,
            message: message,
            level
        })
      }
}

module.exports = {LoggerService}