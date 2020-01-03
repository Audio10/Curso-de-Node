// NODE COMOJS
const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const response = require('./network/response')
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
    response.success(req,res, "Lista de mensajes")
})

router.post('/message', function (req, res) {
    console.log(req.query)
    console.log(req.body)
    if ( req.query.error === 'ok'){
        response.error(req, res, 'Error simulado', 401)
    }else {
        response.success(req, res, "Creado correctamente", 201)
    }
})

app.listen(3000)
console.log('La aplicacion esta escuchando en http://localhost:3000')
