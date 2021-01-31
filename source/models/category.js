
const connection = require('../config/database');

module.exports = {
    
    modelGetAllCategory: (name_category, sort, by, offset, limit) => {
        let query = 
        `SELECT DISTINCT * FROM (SELECT k.id_category, name_category AS category
            FROM kategori AS k LEFT JOIN produk AS p ON k.id_category = p.id_category) 
            AS joined`
        
        if(name_category != null) {
            query += ` WHERE joined.category LIKE '%${name_category}%'`;
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

    modelGetAllCategoryForRedis: (name_category, sort, by, offset, limit) => {
        let query = 
        `SELECT DISTINCT * FROM (SELECT k.id_category, name_category AS category
            FROM kategori AS k LEFT JOIN produk AS p ON k.id_category = p.id_category) 
            AS joined`
        
        if(name_category != null) {
            query += ` WHERE joined.category LIKE '%${name_category}%'`;
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

    modelTotalCategory: () => {
        return new Promise((resolve, reject) => {
        connection.query(`SELECT COUNT(*) as total FROM kategori`, (err, result) => {
            if(err){
                reject(new Error(err))
            } else {
                resolve(result)
                }
            })
        })
    },

    
    modelGetDetailCategory: (id_category) => {
        return new Promise ((resolve, reject) => {
            connection.query(`SELECT * FROM kategori WHERE id_category='${id_category}'`, (err, result) => {
                if(err) {
                    reject(new Error (err))
                } else {
                    resolve(result)
                }
            })
        })
    },

    modelInsertCategory: (data) => {
        return new Promise ((resolve, reject) => {
            connection.query(`INSERT INTO kategori (name_category) VALUES ('${data.name_category}')`, (err, result) => {
                if(err) {
                    reject(new Error (err))
                } else {
                    resolve(result)
                }
            })
        })
    },

    modelUpdateCategory: (data) => {
        console.log(data)
        return new Promise ((resolve, reject) => {
            connection.query(`UPDATE kategori SET id_category='${data.id_category}', 
            name_category='${data.name_category}' 
            WHERE id_category=${data.id_category}`, (err, result) => {
                if(err) {
                    reject(new Error (err))
                } else {
                    resolve(result)
                }
            })
        })
    },

    modelDeleteCategory: (id_category) => {
        return new Promise ((resolve, reject) => {
            connection.query(`DELETE FROM kategori WHERE id_category='${id_category}'`, (err, result) => {
                if(err) {
                    reject(new Error (err))
                } else {
                    resolve(result)
                }
            })
        })
    },
}