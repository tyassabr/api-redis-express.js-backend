const { 
    modelGetAllProducts, 
    modelGetDetailProducts, 
    modelInsertProducts, 
    modelUpdateProducts,
    modelDeleteProducts,
    modelGetAllProductsForRedis,
    modelTotalProducts
} = require('../models/products')

const { success, failed } = require('../helpers/response')
const redisClient = require('../config/redis')

module.exports = {
    setDataRedis: () => {
        modelGetAllProductsForRedis()
        .then((response) => {
            const data = JSON.stringify(response)
            redisClient.set('dataProducts', data)
        })
        .catch((err) => {
            console.log(err)
        })
    },

    getAllProducts: async(req, res) => {
        try {
            const name      = req.query.name ? req.query.name:'';
            const sort      = req.query.sort ? req.query.sort:'ASC'
            const by        = req.query.by ? req.query.by:''
            const limit     = req.query.limit ? req.query.limit:3
            const page      = req.query.page ? req.query.page:1
            const offset    = page===1 ? 0 : (page-1)*limit

            const responseTotal = await modelTotalProducts()

        modelGetAllProducts(name, sort, by, offset, limit)
        .then((response) => {
            if(response.length <= 0){
              // response not found
            } else {
                const arr = []
                response.forEach(element => {
                    arr.push({
                        id      : element.id,
                        name    : element.name,
                        price   : element.price,
                        image   : element.image
                })
            })

            const pagination = {
                page    : page,
                limit   : limit,
                total   : responseTotal[0].total,
                totalPage: Math.ceil(responseTotal[0].total/limit)
            }
                module.exports.setDataRedis()
                success(res, arr, pagination, 'Get all products from database has been succeeded!')
            }
        })
        .catch((err) => {
            failed(res, 'Internal server error', err)
            })
        } catch (error) {
            failed(res, 'Internal server error', [])
            }
    },

    // getAllProducts: (req, res) => {
    //     const name     = req.query.name
    //     const sort     = req.query.sort
    //     const by       = req.query.by
    //     const limit    = req.query.limit ? req.query.limit:3
    //     const page     = req.query.page ? req.query.page:1
    //     const offset   = page === 1 ? 0: (page-1)*limit

    //     modelGetAllProducts(name, sort, by, offset, limit)
    //     .then((response) => {
    //         res.json(response)
    //     })
    //     .catch((err) => {
    //         console.log(err)
    //     }) 
    // },


    getDetailProducts: (req, res) => {
        const id = req.params.id

        modelGetDetailProducts(id)
        .then((response) => {
            const result = {
                name : response[0].name,
                price: response[0].price
            }
            module.exports.setDataRedis()
            success(res, result, {}, 'Get detail products has been succeeded!')
        })
        .catch((err) => {
            console.log(err)
        }) 
    },

    insertProducts: (req, res) => {
        const rareData = req.body

        if(rareData.name === '' || rareData.price === '') {
            failed(res, 'All of the text field is required!', [])
        } else {
            const data = {
                name    : rareData.name,
                price   : rareData.price,
                image   : req.file.filename, //from multer single upload
                id_category: rareData.id_category
            }
    
            modelInsertProducts(data)
            .then((response) => {
                module.exports.setDataRedis()
                success(res, response, {}, 'Insert products has been succeeded')
            })
            .catch((err) => {
                console.log(err)
            })
        }
    },

    
    updateProducts: (req, res) => {
        const id        = req.params.id
        const rareData  = req.body
        const data      = {
            name    : rareData.name,
            price   : rareData.price,
            image   : rareData.image,
            id_category: rareData.id_category
        } 

        modelUpdateProducts(data, id)
        .then((response) => {
            module.exports.setDataRedis()
            success(res, response, {}, 'Update products has been succeeded')
        })
        .catch((err) => {
            console.log(err)
        }) 
    },

    deleteProducts: (req, res) => {
        const id = req.params.id

        modelDeleteProducts(id)
        .then(() => {
            res.json({
                status: `Data has been deleted!`
            })
        })
        .catch((err) => {
            console.log(err)
        }) 
    }
}