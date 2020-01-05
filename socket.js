// 3. Crear la instancia de socket y setearla directamente desde connect.
const socketIO = require('socket.io')
const socket = {}

function connect(server) {
    socket.io = socketIO(server)
}

module.exports = {
    connect,
    socket,
}
