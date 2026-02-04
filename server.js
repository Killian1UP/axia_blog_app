const express = require("express")
const userRouter = require("./routers/userRouter")
const connectDB = require("./mongodb/dbconnection")
const cookieParser = require("cookie-parser")
const postRouter = require("./routers/postRouter")
const authRouter = require("./routers/authRouter")

require('dotenv').config()
connectDB()

const server = express()
const port = process.env.PORT 

// middlewares
server.use(express.json())
server.use(express.urlencoded({extended: true}))
server.use(cookieParser())

server.use('/api', userRouter)
server.use('/api', postRouter)
server.use('/api', authRouter)

server.listen(port, () => {
    console.log(`Server is listening to port ${port}`)
})