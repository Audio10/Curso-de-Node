const express = require('express')
const app = express()
//1.- SETEAMOS EL SERVER MODULO NATIVO DE JS
const server = require('http').Server(app)
const bodyParser = require('body-parser')

// 4.- importar socket
const socket = require('./socket')

const db = require('./db')

const router = require('./network/routes')

db('mongodb+srv://claudio:america2010@telegrom-elgu0.mongodb.net/telegrom?retryWrites=true&w=majority')

app.use(bodyParser.json())

// 4.- asignar el server al socket mediante connect
socket.connect(server)

router(app)

app.use('/app', express.static('public'))

// 2.- agregar el listen al server
server.listen(3000, () => {
    console.log('La aplicacion esta escuchando en http://localhost:3000')
})
