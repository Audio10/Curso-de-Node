const config = {
    // Variable de entorno o tu variable hardcodeada.
    dbUrl: process.env.DB_URL || 'mongodb+srv://claudio:america2010@telegrom-elgu0.mongodb.net/telegrom?retryWrites=true&w=majority',
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'http://localhost',
    publicRoute: process.env.PUBLIC_ROUTE || '/app',
}

module.exports = config