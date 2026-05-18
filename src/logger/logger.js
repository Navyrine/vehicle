import winston from "winston";

const {combine, timestamp, errors, json, printf, colorize} = winston.format;
const isProduction = process.env.NODE_ENV === "production";
const devFormat = combine(
    colorize(),
    timestamp(),
    errors({stack: true}),
    printf(({level, message, timestamp, stack}) => {
        return `${timestamp} [${level}]: ${message} ${stack ? "\n" + stack : ""}`;
    }),
);
const prodFormat = combine(timestamp(), errors({stack: true}), json());

export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL,
    format: isProduction ? prodFormat : devFormat,
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: "logs/error.log",
            level: "error"
        }),
        new winston.transports.File({
            filename: "logs/combine.log"
        }),
    ],
    exitOnError: false,
});