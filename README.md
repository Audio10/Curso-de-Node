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

