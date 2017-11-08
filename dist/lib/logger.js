"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
function createTransports(loggerName) {
    const transports = [
        new winston.transports.Console({
            label: loggerName,
        }),
    ];
    // TODO: Sentry
    return transports;
}
function createLogger(name) {
    if (winston.loggers.has(name)) {
        return winston.loggers.get(name);
    }
    return winston.loggers.add(name, {
        transports: createTransports(name),
    });
}
exports.default = createLogger;
