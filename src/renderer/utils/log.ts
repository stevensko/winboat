const winston: typeof import('winston') = require('winston');

export const logFormat = winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} | ${level.toUpperCase()} | ${typeof message === 'object' ? JSON.stringify(message, null, 2) : message}`;
});

export function createLogger(filePath: string) {
    return winston.createLogger({
        level: 'info',
        format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            logFormat
        ),
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({ filename: filePath })
        ]
    });
}