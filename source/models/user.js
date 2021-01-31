const connection = require('../config/database')

module.exports = {
    modelLogin: () => {
        return
    },
    modelCheckEmail: (email) => {
        return new Promise ((resolve, reject) => {
            connection.query(`SELECT * FROM user WHERE email='${email}'`, (err, result) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            } )
        })
    },

    modelRegister: (dataUser) => {
        return new Promise ((resolve, reject) => {
            connection.query(`INSERT INTO user SET ?`, dataUser, (err, result) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        })
    }
}