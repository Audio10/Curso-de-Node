const db = require('mongoose')
const Model = require('./model')

// Extiende  la clase Primise y se la aplica al mongoose
db.Promise = global.Promise;

const options = {
    keepAlive: 1,
    useUnifiedTopology: true,
    useNewUrlParser: true,
};

// conecta la base de datos
db.connect('mongodb+srv://claudio:america2010@telegrom-elgu0.mongodb.net/telegrom?retryWrites=true&w=majority', options)
    .then(() => { 
        console.log('DB connected') 
    })
    .catch((err) => {
        console.log(err);
    });


function addMessage(message) {
    // crea un nuevo modelo 
    const myMessage = new Model(message)
    myMessage.save()
}

async function getMessages() {
    const messages = await Model.find()
    return messages
}

async function updateText(id, message) {
    const foundMessage = await Model.findOne({
        _id: id
    })

    foundMessage.message = message

    const newMessage = await foundMessage.save()
    return newMessage
}

module.exports = {
    add: addMessage,
    list: getMessages,
    updateText: updateText,
}
