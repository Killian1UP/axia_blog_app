const Post = require("../schema/postSchema")

// create a post
const createPost = async (req, res) => {
    const { title, message, image } = req.body
    const user = req.user
    console.log(user)
    if (!title|| !message) {
        res.status(400).json({ message: "All fields are required!" })
        return
    }
    try {
        const newPost = new Post({...req.body, userId: user._id})
        await newPost.save()
        res.status(200).json({message: "New post created successfully."})
    } catch (error) {
        res.status(500).json(error)
    }
}

// get all posts
const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('userId', "-password")
        if (posts.length === 0) {
            return res.status(200).json({
                message: "No post(s) was found, you must make a post."
            })
        }
        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

// get a post by id
const getPostById = async (req, res) => {
    try {
        const { id } = req.params
        const post = await Post.findById(id)
        if (!post) {
            return res.status(400).json({
                message: `Post with the id ${id} is not found`
            })
        }
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

// delete a post
const deletePost = async (req, res) => {

    try {
        const user = req.user
        const { id } = req.params

        const post = await Post.findById(id)
        if (!post) {
            return res.status(400).json({
                message: `Post with the id ${id} is not found`
            })
        }
        if (!post.userId.equals(user._id)) {
            return res.status(403).json({
                message: "You can only delete your posts"
            })
        }
        await post.deleteOne()
        res.status(200).json({
            message: "Post deleted successfully."
        })
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

// update a post
const updatePost = async (req, res) => {
    try {
        const user = req.user
        const { id } = req.params

        const post = await Post.findById(id)

        if (!post) {
            return res.status(404).json({
                message: `Post with the id ${id} is not found`
            })
        }

        if (!post.userId.equals(user._id)) {
            return res.status(403).json({
                message: "You can only update your own posts"
            })
        }

        // Update only allowed fields
        const updates = req.body

        Object.assign(post, updates)

        await post.save()

        res.status(200).json({
            message: "Product updated successfully.",
            post
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
module.exports = {
    getPosts,
    createPost,
    getPostById,
    deletePost,
    updatePost
}