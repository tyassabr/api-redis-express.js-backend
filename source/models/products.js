const connection = require('../config/database');

module.exports = {

        modelGetAllProducts: (name, sort, by, offset, limit) => {
            let query = 
            `SELECT * FROM (SELECT id, name, price, name_category AS category, image 
            FROM produk AS p LEFT JOIN kategori AS k ON p.id_category = k.id_category) 
            AS joined`
            
            if(name != null) {
                query += ` WHERE joined.name LIKE '%${name}%'`;
            }
            if(sort != null && by != null) {
                query += ` ORDER BY joined.${sort} ${by}`;
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

    modelGetAllProductsForRedis: () => {
        return new Promise ((resolve, reject) => {
            connection.query(`SELECT * FROM produk`, (err, result) => {
                if(err) {
                    reject(new Error (err))
                } else {
                    resolve(result)
                }
            })
        })
    },

    // modelGetAllProducts: (name, offset, limit) => {
    //     return new Promise((resolve, reject) => {
    //     connection.query(`SELECT * FROM produk WHERE name LIKE '%${name}%' LIMIT ${offset}, ${limit}`, 
    //     (err, result) => {
    //         if(err) {
    //             reject(new Error(err))
    //         } else {
    //             resolve(result)
    //             }
    //         })
    //     })
    // },

    modelTotalProducts: () => {
        return new Promise((resolve, reject) => {
        connection.query(`SELECT COUNT(*) as total FROM produk`, (err, result) => {
            if(err){
                reject(new Error(err))
            } else {
                resolve(result)
                }
            })
        })
    },

    modelGetDetailProducts: (id) => {
        return new Promise ((resolve, reject) => {
            connection.query(`SELECT * FROM produk WHERE id='${id}'`, (err, result) => {
                if(err) {
                    reject(new Error (err))
                } else {
                    resolve(result)
                }
            })
        })
    },

    modelInsertProducts: (data) => {
        return new Promise ((resolve, reject) => {
            connection.query(`INSERT INTO produk (name, price, image, id_category) VALUES ('${data.name}', 
            '${data.price}', '${data.image}', '${data.id_category}')`, (err, result) => {
                if(err) {
                    reject(new Error (err))
                } else {
                    resolve(result)
                }
            })
        })
    },

    modelUpdateProducts: (data, id) => {
        return new Promise ((resolve, reject) => {
            connection.query(`UPDATE produk SET name='${data.name}', price='${data.price}', image='${data.image}',
            id_category='${data.id_category}'
            WHERE id='${id}'`, (err, result) => {
                if(err) {
                    reject(new Error (err))
                } else {
                    resolve(result)
                }
            })
        })
    },

    
    modelDeleteProducts: (id) => {
        return new Promise ((resolve, reject) => {
            connection.query(`DELETE FROM produk WHERE id='${id}'`, (err, result) => {
                if(err) {
                    reject(new Error (err))
                } else {
                    resolve(result)
                }
            })
        })
    },

    modelGetHistories: () => {
        let query =  
        `SELECT GROUP_CONCAT(joined.name, '') AS names, SUM(joined.price) AS amount, joined.cashier FROM 
        (
            SELECT p.name, p.price, h.cashier 
            FROM produk AS p 
            LEFT JOIN histori AS h ON p.id = h.id_produk
        ) 
        AS joined 
        WHERE joined.cashier = 'cashier-1'`
        return new Promise ((resolve, reject) => {
            connection.query(query, (err, result) => {
                if(err) {
                    reject(new Error (err))
                } else {
                    resolve(result)
                }
            })
        })
    }
}