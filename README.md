# Curso de node.js

### INSTALAR EXPRES

```
npm install express --save --save-exact
```

### INICIANDO SERVIDOR (CONFIGURACION BASICA)

```javascript
// NODE COMOJS
const express = require('express')
//EMMASCRIPT6
//import express from 'express';

var app = express()

app.use('/', (req, res) => {
    res.send('Hola')
})

app.listen(3000)
console.log('La aplicacion esta escuchando en http://localhost:3000')
```

### MANEJO DE ROUTER

```
const router = express.Router()

```

### INSTALAR NODEMON

```
npm install nodemon --save-dev --save-exact
```

### BODYPARSE

Nos permite convertir el body, el query, header en objetos para uso de la aplicación y estos se obtienen del request.

```javascript
// NODE COMOJS
const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
//EMMASCRIPT6
//import express from 'express';

var app = express()
app.use(bodyParser.json())
app.use(router)

router.get('/message', function (req, res) {
    console.log(req.headers)
    res.header({
        "custom-header": "Nuestro valor personalizado",
    })
    res.send('Lista de mensajes')
})

router.post('/message', function (req, res) {
    console.log(req.query)
    console.log(req.body)
    res.send('Mensaje añadido')
})

// app.use('/', (req, res) => {
//     res.send('Hola')
// })

app.listen(3000)
console.log('La aplicacion esta escuchando en http://localhost:3000')
```

#### BODY

```javascript
console.log(req.body)
```

#### QUERY

```javascript
  console.log(req.query)
```

#### HEADER

```javascript
// Consulta
 console.log(req.headers)

//ENVIO
res.header({
	"custom-header": "Nuestro valor personalizado",
})
```

### RESPUESTA

Se pueden responder status, así como header y objetos JSON.

```javascript
router.post('/message', function (req, res) {
    console.log(req.query)
    console.log(req.body)
    res.status(201).send({ error: '', body: "Creado correctamente"})
})
```

### SERVIR ARCHIVOS STATICOS.

Para servir archivos HTML y CSS, se agrega la carpeta public.

```javas
app.use('/app', express.static('public'))
```

## ARQUITECTURA DE PROYECTO NODE.

Se crea una carpeta **components** que va a tener cada uno de nuestros componentes con sus respectivas carpetas de **network** para el enrutamiento, **controller** para la logica.



### NETWORK

```javascript
// server.js
const express = require('express')
const bodyParser = require('body-parser')
// 1.-  router es una funcion de routes.js //
const router = require('./network/routes')

var app = express()
app.use(bodyParser.json())

//1.- SE envia el servidor app al router para que se encargue de crear todas las rutas necesarias este esta en (routes.js).
router(app)

app.use('/app', express.static('public'))

app.listen(3000)
console.log('La aplicacion esta escuchando en http://localhost:3000')

```



```javascript
//2.- routes.js

const express = require('express')
// message es el componente de network del componente //
const message = require('../components/message/network')

const routes = (server) => {
    server.use('/message', message)
}

module.exports = routes
```



```javascript
//3.- network de componente

const express = require('express')
const router = express.Router()
const response = require('../../network/response')

router.get('/', function (req, res) {
    console.log(req.headers)
    res.header({
        "custom-header": 'Nuestro valor personalizado',
    })
    response.success(req,res, 'Lista de mensajes')
})

router.post('/', function (req, res) {
    console.log(req.query)
    console.log(req.body)
    if ( req.query.error === 'ok'){
        response.error(req, res, 'Error inesperado', 500, 'Es solo una simulacion de los errores.')
    }else {
        response.success(req, res, 'Creado correctamente', 201)
    }
})

module.exports = router
```

### CONTROLLER

```javascript
const express = require('express')
const router = express.Router()
const controller = require('./controller')
const response = require('../../network/response')

//1.- EJEMPLO se llama a la funcion addMessage proveniente de controller, la cual retorna una promesa. Se obtienen los parametros del body y segun lo que envie la promesa se hace el response.

router.post('/', function (req, res) {

    controller.addMessage(req.body.user, req.body.message)
        .then( (  fullMessage) => {
            response.success(req, res, fullMessage, 201)
        })
        .catch( e => {
            response.error(req, res, 'Informacion invalida', 400, 'Error en el controller.')
        })
})

module.exports = router
```



```javascript
// 2.- Se crean las funciones correspondientes y se exportan en un objeto.
3.- Se creo una funcion que retorna una promesa, la cual aplica los parametros resolve y reject para cuando se resuelve y cuando se resuelve de forma negativa.
4.- La promesa hace reject cuando no hay datos en el body.
5.- Resuelve el fulMessage cuando si se obtienen los datos.

function addMessage(user, message) {
    return new Promise( (resolve, reject) => {

        if ( !user || !message) {
            console.error('[messageController] No hay usuario o mensaje')
            reject('Los datos son incorrectos')
            return false
        }

        const fullMessage = {
            user : user,
            message : message,
            date : new Date(),
        }  

        console.log(fullMessage)
        resolve(fullMessage)
    })
    
}

module.exports = {
    addMessage,
}
```

### STORE CON MOC.

```javascript
// 1.- Se crean las funciones y se importan en este caso se ocupa una lista como ejemplo.

const list = []

function addMessage(message) {
    list.push(message)
}

function getMessages() {
    return list;
}

// 2.- De esta forma se pueden renombrar las funciones.
module.exports = {
    add: addMessage,
    list: getMessages,
}
```

```javascript
// 3.- Desde el controller se llama la funcion del store.js

function getMessages() {
    return new Promise( (resolve, reject) => {
        resolve(store.list())
    })
}
```

```javascript
// 4.- En el network invoca la funcion del controller.

router.get('/', function (req, res) {
    controller.getMessages()
        .then( (messageList) => {
            response.success(req, res, messageList, 200)
        })
        .catch( e => {
            response.error(req, res, 'Unexpected Error', 500, e)
        })
})
```



### MONGODB

### ALMACENAR Y LEER DATOS.



```javascript
// MODEL

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const mySchema = new Schema({
    user: String,
    message: {
        type: String,
        required: true
    },
    date: Date,
})

// se especifica el nombre de la coleccion en la base de datos y el esquema.
const model = mongoose.model('Message', mySchema)
module.exports = model
```



```javascript
// STORE

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

module.exports = {
    add: addMessage,
    list: getMessages,
}
```



### UPDATE 

```javascript
// NETWORK

router.patch('/:id', function (req, res) {
    controller.updateMessage(req.params.id, req.body.message)
        .then( (data) => {
            response.success(req, res, data, 200)
        })
        .catch(e => {
            response.error(req, res, 'Error interno', 500, e)
        })
})
```

```javascript
// CONTROLLER

function updateMessage(id, message) {
    return new Promise( async (resolve, reject) => {
        if (!id || !message){
            reject('Invalid data')
            return false
        }

        const result = await store.updateText(id, message)
        
        resolve(result)
    })
}
```

```javascript
// STORE

async function updateText(id, message) {
    const foundMessage = await Model.findOne({
        _id: id
    })

    foundMessage.message = message

    const newMessage = await foundMessage.save()
    return newMessage
}
```

### CONSULTAR DATOS

En este caso se hace la consulta a los mensajes de un usuario, se puede usar la función find que busca todos o un usuario en especifico si es que se manda por parámetro.

```javascript
async function getMessages(filterUser) {
    let filter = {}
    if (filterUser) {
        filter = { user: filterUser }
    }
    const messages = await Model.find( filter )
    return messages
}
```

### Eliminar datos.

```javascript
// NETWORK
router.delete('/:id', (req, res) => {
    controller.deleteMessage(req.params.id)
        .then( () =>{
            response.success(req, res, `Usuario ${req.params.id} eliminado`, 204)
        })
        .catch(e => {
            response.error(req, res, 'Error Interno', 500, e)
        })
})
```

```javascript
// CONTROLLER
function deleteMessage(id) {
    return new Promise( (resolve, reject) => {
        if (!id){
            reject('Id invalido')
            return false
        } 

        store.remove(id)
            .then(() => {
                resolve()    
            })
            .catch( e => {
                reject(e)
            })
    })
}
```

```javascript
// STORE
function removeMessage(id) {
    return Model.deleteOne({
        _id: id
    })
}
```

## COMPARTIR CONEXION (DB)

```javascript
//DB.JS

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
```

```javascript
// SERVER

const db = require('./db')

const router = require('./network/routes')

db('mongodb+srv://claudio:america2010@telegrom-elgu0.mongodb.net/telegrom?retryWrites=true&w=majority')

```

## ESCALANDO ARQUITECTURA MULTIPLES ENTIDADES.

Básicamente el escalamiento es la creación de mas entidades. Para lo cual se siguen los siguientes pasos como se ha listado anteriormente.

- Crear el **Model**
- Crear el **Store**
- Crear el **Controller**
- Crear el **Network**
- Agregar el **Network** al **Routes**



## Relacionando entidades.



Las referencias se efectúan enviando el **ObjectId** con ref del tipo de dato que se crea con mongoose.

```javascript
// NWTWORK
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mySchema = new Schema({
    chat: {
        type: Schema.ObjectId,
        ref: 'Chat',
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User',
    },
    message: {
        type: String,
        required: true,
    },
    date: Date
});

const model = mongoose.model('Message', mySchema);
module.exports = model;
```

### Copulado.

El copular no es mas que decir oye si esto es una referencia a otro dato, búscalo e inserta la información.

```javascript
// STORE MESSAGES
async function getMessages(filterChat) {
    return new Promise((resolve, reject) => {
        let filter = {};
        if (filterChat !== null) {
            filter = { chat: filterChat };
        }
        
        Model.find(filter)
        // Busca dentro de todos los elementos que son Object id y busca por campo user
            .populate('user')
        // Para ejecutar el populado (no se ejecuta automaticamente.)
            .exec((error, populated) => {
                if (error) {
                    reject(error);
                    return false;
                }

                resolve(populated);
            });
    })
}
```

```javascript
// CONTROLLER MESSAGES

function addMessage(chat, user, message, file) {
    return new Promise((resolve, reject) => {
        if (!chat || !user || !message) {
            console.error('[messageController] No hay chat usuario o mensaje');
            reject('Los datos son incorrectos');
            return false;
        }

        const fullMessage = {
            chat: chat,
            user: user,
            message: message,
            date: new Date(),
        };
    
        store.add(fullMessage);

        resolve(fullMessage);
    });
}
```

```javascript
// NETWORK MESSAGES

router.post('/', function (req, res) {
    controller.addMessage(req.body.chat, req.body.user, req.body.message)
        .then((fullMessage) => {
            response.success(req, res, fullMessage, 201);
        })
        .catch(e => {
            response.error(req, res, 'Informacion invalida', 400, 'Error en el controlaor');
        });
});
```



## RECIBIR Y GUARDAR ARCHIVOS.

Se ocupa **Multer** como middleware para agregar archivos.

```javascript
// NETWORK MESSAGE

const express = require('express');
const multer = require('multer');
var path = require('path')
const response = require('../../network/response');
const controller = require('./controller');
const router = express.Router();

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/files/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
})

var upload = multer({ storage: storage });

router.post('/', upload.single('file'), function (req, res) {
    controller.addMessage(req.body.chat, req.body.user, req.body.message, req.file)
        .then((fullMessage) => {
            response.success(req, res, fullMessage, 201);
        })
        .catch(e => {
            response.error(req, res, 'Informacion invalida', 400, 'Error en el controlaor');
        });
});
```

```javascript
// CONTROLLER

function addMessage(chat, user, message, file) {
    return new Promise((resolve, reject) => {
        if (!chat || !user || !message) {
            console.error('[messageController] No hay chat usuario o mensaje');
            reject('Los datos son incorrectos');
            return false;
        }

        let fileUrl = '';
        if (file) {
            fileUrl = 'http://localhost:3000/app/files/' + file.filename;
        }

        const fullMessage = {
            chat: chat,
            user: user,
            message: message,
            date: new Date(),
            file: fileUrl,
        };
    
        store.add(fullMessage);

        resolve(fullMessage);
    });
}
```

```javascript
// Model
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mySchema = new Schema({
    chat: {
        type: Schema.ObjectId,
        ref: 'Chat',
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User',
    },
    message: {
        type: String,
        required: true,
    },
    date: Date,
    file: String,
});

const model = mongoose.model('Message', mySchema);
module.exports = model;
```

## SOCKETS



```javascript
// SERVER.JS
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
```

```javascript
// CREAR SOCKET.JS
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
```

```javascript
// CONTROLLER MESSAGES

const store = require('./store');
// 5.- Se importa el socket y solo se trae el socket usando .socket
const socket = require('../../socket').socket

function addMessage(chat, user, message, file) {
    return new Promise((resolve, reject) => {
        if (!chat || !user || !message) {
            console.error('[messageController] No hay chat usuario o mensaje');
            reject('Los datos son incorrectos');
            return false;
        }

        let fileUrl = '';
        if (file) {
            fileUrl = 'http://localhost:3000/app/files/' + file.filename;
        }

        const fullMessage = {
            chat: chat,
            user: user,
            message: message,
            date: new Date(),
            file: fileUrl,
        };
    
        store.add(fullMessage);

        // 5. Se emite el mensaje por medio del socket
        socket.io.emit('message', fullMessage)

        resolve(fullMessage);
    });
}

```



**Index.js** se debe acceder a este mediante **localhost:3000/app/index.html**

```
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="/socket.io/socket.io.js"></script>
</head>

<body>
    <h1> Mira la consola </h1>

    <script>

        var socket = io.connect('http://localhost:3000', {
            forceNew: true
        })

        socket.on('message', (data) => {
            console.log(data)
        })

    </script>
</body>

</html>
```



## CORS



```javascript
// SERVER JS
const cors = require('cors')
app.use(cors)
```

