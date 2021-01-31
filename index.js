const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
app.use(cors())



const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

const routeProducts = require('./source/routes/products')
const routeCategory = require('./source/routes/category')
const routeHistory = require('./source/routes/history')
const userRoute = require('./source/routes/user')
app.use(routeProducts)
app.use(routeCategory)
app.use(routeHistory)
app.use(userRoute)
/
// open public route
app.use('/images', express.static('./public/images'))




app.listen (8000, () => {
  console.log(`Service running on PORT 8000`)
})











