const connection = require('../config/database');

module.exports = {

        modelGetAllHistory: (invoice, sort, by, offset, limit) => {  
            
            let query = `SELECT id, name_history, CONCAT('#000', id) as invoice, date, cashier, amount FROM histori` 

            if(invoice != null) {
                query += ` WHERE id LIKE '%${invoice}%'`;
            }
            if(sort != null && by != null) {
                query += ` ORDER BY ${sort} ${by}`;
            }
            if(offset >= 0) {
                query += ` LIMIT ${offset}, ${limit}`;
            }
            return new Promise ((resolve, reject) => {
                connection.query(query, (err, result) => {
                    if(err) {
                        reject(new Error (err))
                    } else {
                        resolve(result)
                    }
                })
            })
        },

        modelGetAllHistoryForRedis: (invoice, sort, by, offset, limit) => {  
            
            let query = `SELECT id, name_history, CONCAT('#000', id) as invoice, date, cashier, amount FROM histori` 

            if(invoice != null) {
                query += ` WHERE id LIKE '%${invoice}%'`;
            }
            if(sort != null && by != null) {
                query += ` ORDER BY ${sort} ${by}`;
            }
            if(offset >= 0) {
                query += ` LIMIT ${offset}, ${limit}`;
            }
            return new Promise ((resolve, reject) => {
                connection.query(query, (err, result) => {
                    if(err) {
                        reject(new Error (err))
                    } else {
                        resolve(result)
                    }
                })
            })
        },

        // modelGetAllHistoryForRedis: () => {
        //     return new Promise ((resolve, reject) => {
        //         connection.query(`SELECT * FROM histori`, (err, result) => {
        //             if(err) {
        //                 reject(new Error (err))
        //             } else {
        //                 resolve(result)
        //             }
        //         })
        //     })
        // },

        modelTotalHistory: () => {
            return new Promise((resolve, reject) => {
            connection.query(`SELECT COUNT(*) as total FROM histori`, (err, result) => {
                if(err){
                    reject(new Error(err))
                } else {
                    resolve(result)
                    }
                })
            })
        },


    modelGetDetailHistory: (id) => {
        return new Promise ((resolve, reject) => {
            connection.query(`SELECT * FROM histori WHERE id='${id}'`, (err, result) => {
                if(err) {
                    reject(new Error (err))
                } else {
                    resolve(result)
                }
            })
        })
    },

    modelInsertHistory: (data) => {
        return new Promise ((resolve, reject) => {
            connection.query(`INSERT INTO histori (name_history, id_produk, cashier, date, amount) VALUES 
            ('${data.name_history}', '${data.id_produk}', '${data.cashier}', '${data.date}', '${data.amount}')`, (err, result) => {
                if(err) {
                    reject(new Error (err))
                } else {
                    resolve(result)
                }
            })
        })
    },

    modelUpdateHistory: (data, id) => {
        return new Promise ((resolve, reject) => {
            connection.query(`UPDATE histori SET name_history='${data.name_history}', 
            id_produk='${data.id_produk}', cashier='${data.cashier}', date='${data.date}', amount='${data.amount}' 
            WHERE id='${id}'`, (err, result) => {
                if(err) {
                    reject(new Error (err))
                } else {
                    resolve(result)
                }
            })
        })
    },

    
    modelDeleteHistory: (id) => {
        return new Promise ((resolve, reject) => {
            connection.query(`DELETE FROM histori WHERE id='${id}'`, (err, result) => {
                if(err) {
                    reject(new Error (err))
                } else {
                    resolve(result)
                }
            })
        })
    }
}