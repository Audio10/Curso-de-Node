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

