const express = require("express")
const login = require("../controllers/authController")
const authRouter = express.Router()

// logging in
authRouter
    .post("/user/login", login)

module.exports = authRouter