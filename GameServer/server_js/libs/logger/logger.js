var winston = require('winston');

function getLogger(module){
    var path = module.filename.split('\\').slice(-2).join('\\');

    const { combine, timestamp, label, printf } = winston.format;
    const myFormat = printf(info => {
        return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
    });

    return new winston.createLogger({
        format: combine(
            label({ label: path }),
            timestamp(),
            myFormat
        ),
        transports: [
            new winston.transports.Console({ colorize: true, level: 'debug'}),
        ]
    });
}

module.exports = getLogger;