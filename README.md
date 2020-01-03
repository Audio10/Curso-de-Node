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

