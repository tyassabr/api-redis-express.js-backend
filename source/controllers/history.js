const { 
    modelGetAllHistory,
    modelGetDetailHistory,
    modelInsertHistory,
    modelUpdateHistory,
    modelDeleteHistory,
    modelGetAllHistoryForRedis,
    modelTotalHistory
} = require('../models/history')

const { success, failed } = require('../helpers/response')
const redisClient = require('../config/redis')

module.exports = {
    setDataHistoryRedis: () => {
        modelGetAllHistoryForRedis()
        .then((response) => {
            const data = JSON.stringify(response)
            redisClient.set('dataHistory', data)
        })
        .catch((err) => {
            console.log(err)
        })
    },


    getAllHistory: async(req, res) => {
        try {
            const invoice  = req.query.invoice == null ? null : req.query.invoice.substring(3,)
            const sort     = req.query.sort ? req.query.sort:'ASC'
            const by       = req.query.by
            const limit    = req.query.limit ? req.query.limit:3
            const page     = req.query.page ? req.query.page:1
            const offset   = page === 1 ? 0: (page-1)*limit

            const responseTotal = await modelTotalHistory()

        modelGetAllHistory(invoice, sort, by, offset, limit)
        .then((response) => {
            if(response.length <= 0){
              // response not found
            } else {
                const arr = []
                response.forEach(element => {
                    arr.push({
                        id              : element.id,
                        id_produk       : element.id_produk,
                        name_history    : element.name_history,
                        cashier         : element.cashier,
                        date            : element.date,
                        amount          : element.amount
                })
            })

            const pagination = {
                page    : page,
                limit   : limit,
                total   : responseTotal[0].total,
                totalPage: Math.ceil(responseTotal[0].total/limit)
            }
                module.exports.setDataHistoryRedis()
                success(res, arr, pagination, 'Get all history from database has been succeeded!')
            }
        })
        .catch((err) => {
            failed(res, 'Internal server error', err)
            })
        } catch (error) {
            failed(res, 'Internal server error', [])
            }
    },


    // getAllHistory: (req, res) => {
    //     const invoice  = req.query.invoice == null ? null : req.query.invoice.substring(3,)
    //     const sort     = req.query.sort ? req.query.sort:'ASC'
    //     const by       = req.query.by ? req.query.by:'id'
    //     const limit    = req.query.limit ? req.query.limit:3
    //     const page     = req.query.page ? req.query.page:1
    //     const offset   = page === 1 ? 0: (page-1)*limit

    //     modelGetAllHistory(invoice, sort, by, offset, limit)
    //     .then((response) => {
    //         res.json(response)
    //     })
    //     .catch((err) => {
    //         console.log(err)
    //     }) 
    // },


    getDetailHistory: (req, res) => {
        const id = req.params.id

        modelGetDetailHistory(id)
        .then((response) => {
            module.exports.setDataHistoryRedis()
            success(res, response, {}, 'Get detail history has been succeeded!')
        })
        .catch((err) => {
            console.log(err)
        }) 
    },

    insertHistory: (req, res) => {
        const rareData = req.body
        const data = {
            name_history    : rareData.name_history,
            id_produk       : rareData.id_produk,
            cashier         : rareData.cashier,
            date            : rareData.date,
            amount          : rareData.amount
        }

        modelInsertHistory(data)
        .then((response) => {
            module.exports.setDataHistoryRedis()
            success(res, response, {}, 'Insert history has been succeeded')
        })
        .catch((err) => {
            console.log(err)
        }) 
    },

    
    updateHistory: (req, res) => {
        const id        = req.params.id
        const rareData  = req.body
        const data      = {
            name_history    : rareData.name_history,
            id_produk       : rareData.id_produk,
            cashier         : rareData.cashier,
            date            : rareData.date,
            amount          : rareData.amount
        } 

        modelUpdateHistory(data, id)
        .then((response) => {
            module.exports.setDataHistoryRedis()
            success(res, response, {}, 'Update history has been succeeded')
        })
        .catch((err) => {
            console.log(err)
        }) 
    },

    deleteHistory: (req, res) => {
        const id = req.params.id

        modelDeleteHistory(id)
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