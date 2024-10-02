const { register } = require('module');
const user = require('../models/user_model');
const path = require('path');
const argon2 = require('argon2');
// Ariston


const users = {
    index: (req, res) =>{
        res.render('index')
    },
    login: (req, res) =>{
        
        res.render('login')
    },
    register: (req, res) =>{
        res.render('register')
    }
}

//Thiena


//Cael
module.exports = users