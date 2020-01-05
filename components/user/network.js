const express = require('express')
const response = require('../../network/response')
const controller = require('./controller')
const router = express.Router()

router.get('/', function (req, res) {
    const filterUsers = req.query.user || null
    controller.getUsers(filterUsers)
        .then((userList) => {
            response.success(req, res, userList, 200)
        })
        .catch( e => {
            response.error(req, res, 'Unexpected Error', 500, e)
        })
})

router.post('/', (req, res) => {
    controller.addUser(req.body.name)
        .then( data => {
            response.success(req, res, data, 201)
        })
        .catch(error => {
            response.error(req, res, 'Internal error', 500, error)
        })
})

module.exports = router