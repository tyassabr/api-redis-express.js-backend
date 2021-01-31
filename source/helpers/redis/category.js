const client = require('../../config/redis')
const _ = require('lodash')
const { success, notfound } = require('../response')

module.exports = {
    getAllCategory: (req, res, next) => {
      client.get('dataCategory', (err, result) => {
          if(err) {
              console.log(err)
          } else {
              if(result) {
                  const response        = JSON.parse(result)
                  const name_category   = req.query.name_category ? req.query.name_category:'category'
                  const search          = req.query.search ? req.query.search:''
                  const sort            = req.query.sort ? req.query.sort:'ASC'
                  const by              = req.query.by ? req.query.by:''
                  const limit           = req.params.limit ? req.query.limit:3
                  const page            = req.query.page ? req.query.page:1
                  const offset          = page === 1 ? 0: (page-1)*limit

                  const filterData = _.filter(response, (item) => {
                    return item[name_category].toString().toLowerCase().includes(search)
                })

                const sortData = _.orderBy(filterData, by, sort)
                if (filterData.length>0) {
                    const paginationData = _.slice(sortData, offset, offset+limit)
                    const pagination = {
                      page: page,
                      limit: limit,
                      totalData: filterData.length,
                      totalPage: Math.ceil(filterData.length/limit)
                    }
                    success(res, paginationData, pagination, 'Get all category from redis has been succeeded!')
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