// util/logger.js
const fs = require('fs');
const path = require('path');
const pino = require('pino');

const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

function logFilePath() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return path.join(logsDir, `${yyyy}-${mm}-${dd}.log`);
}

// 1) Always log JSON to file
const fileStream = fs.createWriteStream(logFilePath(), { flags: 'a' });
const streams = [{ stream: fileStream }];

// 2) Optionally log pretty output to console
// Enable with: set LOG_PRETTY=1
if (process.env.LOG_PRETTY === '1') {
    const prettyStream = require('pino-pretty')({
        colorize: true,
        translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
        ignore: 'pid,hostname',
    });
    streams.push({ stream: prettyStream });
}

module.exports = pino(
    {
        level: process.env.LOG_LEVEL || 'info',
        timestamp: pino.stdTimeFunctions.isoTime,
    },
    pino.multistream(streams)
);