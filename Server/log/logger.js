const { createLogger, transports, format } = require('winston');

const userLogger = createLogger({
    transports: [
        new transports.File({
            level: 'info',
            filename: 'user.log',
            format: format.combine(format.timestamp(), format.json())
        }),
    ]
})

module.exports = { userLogger }