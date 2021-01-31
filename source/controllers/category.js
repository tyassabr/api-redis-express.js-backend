const { 
    modelGetAllCategory,
    modelGetDetailCategory,
    modelInsertCategory,
    modelUpdateCategory,
    modelDeleteCategory,
    modelGetAllCategoryForRedis,
    modelTotalCategory
    } = require('../models/category')

    const { success, failed } = require('../helpers/response')
    const redisClient = require('../config/redis')
    
    module.exports = {
        setDataCategoryRedis: () => {
            modelGetAllCategoryForRedis()
            .then((response) => {
                const data = JSON.stringify(response)
                redisClient.set('dataCategory', data)
            })
            .catch((err) => {
                console.log(err)
            })
        },


        getAllCategory: async(req, res) => {
        try {  
            const name_category = req.query.name_category ? req.query.name_category:''
            const sort          = req.query.sort ? req.query.sort:'ASC'
            const by            = req.query.by ? req.query.by:''
            const limit         = req.params.limit ? req.query.limit:3
            const page          = req.query.page ? req.query.page:1
            const offset        = page === 1 ? 0: (page-1)*limit

            const responseTotal = await modelTotalCategory()

            modelGetAllCategory(name_category, sort, by, offset, limit)
            .then((response) => {
               if(response.length <= 0) {
                res.json({
                    message: 'Page Not Found'
                })
            } else {
                const arr = []
                response.forEach(element => {
                    arr.push({
                        id_category     : element.id_category,
                        name_category   : element.name_category
                })
            })

            const pagination = {
                page    : page,
                limit   : limit,
                total   : responseTotal[0].total,
                totalPage: Math.ceil(responseTotal[0].total/limit)
            }
                module.exports.setDataCategoryRedis()
                success(res, arr, pagination, 'Get all category from database has been succeeded!')
            }
        })
            .catch((err) => {
                failed(res, 'Internal server error', err)
            }) 
          } catch(error) {
            failed(res, 'Internal server error', [])
          }
        },
    
        getDetailCategory: (req, res) => {
            const id_category = req.params.id_category
    
            modelGetDetailCategory(id_category)
            .then((response) => {
                module.exports.setDataCategoryRedis()
                success(res, response, {}, 'Get detail category has been succeeded!')
            })
            .catch((err) => {
                console.log(err)
            }) 
        },
    
        insertCategory: (req, res) => {
            const rareData = req.body
            const data = {
                name_category    : rareData.name_category
            }
    
            modelInsertCategory(data)
            .then((response) => {
                module.exports.setCategoryRedis()
                success(res, response, {}, 'Insert category has been succeeded')
            })
            .catch((err) => {
                console.log(err)
            }) 
        },
    
        updateCategory: (req, res) => {
            const rareData           = req.body
            const data               = {
                id_category      : rareData.id_category,
                name_category    : rareData.name_category
            } 
    
            modelUpdateCategory(data)
            .then((response) => {
                module.exports.setDataCategoryRedis()
                success(res, response, {}, 'Update category has been succeeded')
            })
            .catch((err) => {
                console.log(err)
            }) 
        },
    
        deleteCategory: (req, res) => {
            const id_category = req.params.id_category
    
            modelDeleteCategory(id_category)
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
