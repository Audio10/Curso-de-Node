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

## STORE CON MOC.

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



## MONGODB

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

