const express = require("express")
const { createUser, getUsers, getUserById, updateUser, deleteUser } = require("../controllers/userController")
const authMiddleware = require("../middlewares/authMiddleware")
const userRouter = express.Router()

userRouter
    .post('/register', createUser)

// get all users
    .get('/users', authMiddleware, getUsers)

// get a user
    .get('/user/:id', getUserById)

// update a user
    .put('/user/:id', authMiddleware, updateUser)

// delete a user
    .delete('/user/:id', authMiddleware, deleteUser)


module.exports = userRouter