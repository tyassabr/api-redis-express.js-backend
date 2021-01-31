const express = require('express');
// const redisClient = require('../config/redis');
const route = express.Router()
const { 
    getAllHistory,
    getDetailHistory,
    insertHistory,
    updateHistory,
    deleteHistory
} = require('../controllers/history')

const { 
    authentication,
    authorizationAdmin,
    authorizationCashier
} = require('../helpers/middleware/auth')

const { getAllHistory: redisHistory } = require('../helpers/redis/history')

route
.get('/histories', authentication, authorizationAdmin, redisHistory, getAllHistory)
.get('/histories/:id', authentication, authorizationCashier, getDetailHistory)
.post('/histories', authentication, insertHistory)
.put('/histories/:id', authentication, updateHistory)
.delete('/histories/:id', authentication, deleteHistory)

module.exports = route