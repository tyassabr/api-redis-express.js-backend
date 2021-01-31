module.exports = {
    success: (res, data, pagination, message) => {
    const response = {
        code: 200,
        message,
        pagination,
        data,
        }
        res.json(response)
    },

    notfound: (res, data, pagination, message) => {
    const response = {
        code: 404,
        message,
        pagination,
        data,
        }
        res.json(response)
    },

    failed: (res, message, data) => {
    const response = {
        code: 500,
        message,
        data
        }
        res.json(response)
    }
}