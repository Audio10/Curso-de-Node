const express = require('express')
const app = express()
const server = require('http').Server(app)
const config = require('./config')
const cors = require('cors')
const bodyParser = require('body-parser')

const socket = require('./socket')

const db = require('./db')

const router = require('./network/routes')

db(config.dbUrl)

app.use(cors)

app.use(bodyParser.json())

socket.connect(server)

router(app)

app.use(config.publicRoute , express.static('public'))

server.listen(config.port, () => {
    console.log('La aplicacion esta escuchando en ' + config.host + ':' + config.port)
})
