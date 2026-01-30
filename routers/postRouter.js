const express = require("express")
const { createPost, getPosts, getPostById, updatePost, deletePost } = require("../controllers/postController")
const authMiddleware = require("../middlewares/authMiddleware")
const postRouter = express.Router()

postRouter
    .post('/post', authMiddleware, createPost)

// get all users
    .get('/posts', authMiddleware, getPosts)

// get a user
    .get('/post/:id', getPostById)

// update a user
    .put('/post/:id', authMiddleware, updatePost)

// delete a user
    .delete('/post/:id', authMiddleware, deletePost)


module.exports = postRouter