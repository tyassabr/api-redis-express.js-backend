const { login, register } = require('../controllers/user')
const express = require('express')

const Router = express.Router()


Router
  .post('/login', login)
  .post('/register', register)

module.exports = Router