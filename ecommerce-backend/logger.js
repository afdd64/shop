const winston = require('winston');

// 配置日志记录器
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} ${level}: ${message}`;
        })
    ),
    transports: [
        // 将日志输出到文件
        new winston.transports.File({ filename: 'server.log' }),
        // 同时将日志输出到控制台
        new winston.transports.Console()
    ]
});

module.exports = logger;