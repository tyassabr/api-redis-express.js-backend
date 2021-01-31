const client = require('../../config/redis')
const _ = require('lodash')
const { success, notfound } = require('../response')

module.exports = {
    getAllProducts: (req, res, next) => {
        client.get('dataProducts', (err, result) => {
            if(err) {
                console.log(err)
            } else {
                if(result) {
                    const response  = JSON.parse(result)
                    const name      = req.query.name ? req.query.name:'name'
                    const search    = req.query.search ? req.query.search:''
                    const sort      = req.query.sort ? req.query.sort:'ASC'
                    const by        = req.query.by ? req.query.by:'id'
                    const limit     = req.query.limit ? req.query.limit:3
                    const page      = req.query.page ? req.query.page:1
                    const offset    = page === 1 ? 0: (page-1)*limit

                    const filterData = _.filter(response, (item) => {
                        return item[name].toString().toLowerCase().includes(search)
                    })

                    if(filterData.length >= 1) {
                        const sortData = _.orderBy(filterData, by, sort)
                        const paginationData = _.slice(sortData, offset, offset+limit)
                        const pagination = {
                            page: page,
                            limit: limit,
                            totalData: filterData.length,
                            totalPage: Math.ceil(filterData.length / limit)
                        }
                        success(res, paginationData, pagination, 'Get all products from redis has been succeeded!')
                    } else {
                        notfound(res,"Data unavailable", {}) 
                    }

                } else {
                    next()
                }
            }
        })
    }
}

