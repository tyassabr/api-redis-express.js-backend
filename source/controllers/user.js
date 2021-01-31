const bcrypt = require('bcrypt')
const { modelCheckEmail, modelRegister } = require('../models/user')
const jwt = require('jsonwebtoken')

module.exports = {
    login: async(req, res) => {
        const body = req.body
        modelCheckEmail(body.email)
        .then(async(response) => {
            if(response.length === 1) {
                const checkPassword = await bcrypt.compare(body.password, response[0].password)
                if(checkPassword) {
                const dataUser = {
                    email   : response[0].email,
                    id      : response[0].id,
                    access  : response[0].access
                }
                const token = jwt.sign(dataUser, process.env.JWT_SECRET)
                res.json({
                    message: 'login success',
                    token
                })
            } else {
                res.json({
                    message: 'login failed, please try again!'
                })
            }
        } else {
            res.json({
                message: 'email not found, please check yours again!'
            })
        }
    })
        .catch((err) => {
            res.json(err)
        })
    },

    register: async (req, res) => {
        const body = req.body
        modelCheckEmail(body.email)
        .then(async(response) => {
            if(response.length >= 1) {
                res.json({
                    message: 'Email has been registered!'
                })
            } else {
            const salt = await bcrypt.genSalt(7)
            const password = await bcrypt.hash(body.password, salt)
            const user = {
                name : body.name,
                email: body.email,
                access: body.access,
                password
            }
            modelRegister(user)
            .then(() => {
                res.json({
                    message: 'register success'
                })
            }) 
            .catch((err) => {
                res.json(err)
            }) 
                }
        })
        .catch((err) => {
            res.json(err)
        })
    }
}