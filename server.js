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
