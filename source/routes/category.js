const express = require('express');
const route = express.Router()
const { 
    getAllCategory,
    getDetailCategory,
    insertCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/category')

const { 
    authentication,
    authorizationAdmin,
    authorizationCashier
  } = require('../helpers/middleware/auth')

const { getAllCategory: redisCategory } = require('../helpers/redis/category')

route
.get('/categorys', authentication, authorizationAdmin, redisCategory, getAllCategory)
.get('/category/:id_category', authentication, authorizationCashier, getDetailCategory)
.post('/categorys', authentication, insertCategory)
.put('/categorys/:id_category',authentication, updateCategory)
.delete('/categorys/:id_category', authentication, deleteCategory)

module.exports = route