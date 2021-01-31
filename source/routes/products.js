const express = require('express')
const route = express.Router()
const { 
    getAllProducts, 
    getDetailProducts, 
    insertProducts, 
    updateProducts,
    deleteProducts
} = require('../controllers/products')

const { 
    authentication,
    authorizationAdmin,
    authorizationCashier
  } = require('../helpers/middleware/auth')
  
const { getAllProducts: redisProducts } = require('../helpers/redis/products')

const singleUpload = require('../helpers/middleware/upload')

route
.get('/products', authentication, authorizationAdmin, redisProducts, getAllProducts)
.get('/product/:id', authentication, authorizationCashier, getDetailProducts)
.post('/products', authentication, singleUpload, insertProducts)
.put('/products/:id', authentication, updateProducts)
.delete('/products/:id', authentication, deleteProducts)

module.exports = route