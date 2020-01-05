const db = require('mongoose')

db.Promise = global.Promise;

async function connect(url) {

    const options = {
        keepAlive: 1,
        useUnifiedTopology: true,
        useNewUrlParser: true,
    };

    await db.connect(url, options)
        .then(() => {
            console.log('DB connected')
        })
        .catch((err) => {
            console.log(err);
        });
}

module.exports = connect