const User = require("../schema/userSchema")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const login = async (req, res) => {
    try {

        const { email, password } = req.body
        if (!email || !password) {
            res.status(400).json({
                message: "Please provide all fields to login."
            })
            return
        } else {
            const user = await User.findOne({ email })
            if (!user) {
                res.status(401).json({ message: "User not found, please proceed to register first."})
                return          
            }
            const comparedPassword = await bcrypt.compare(password, user.password)
            if (!comparedPassword) {
                res.status(401).json({
                    message: "Email or password is incorrect, please try again!"
                })
                return
            }

            const getToken = (id) => {
                return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: "1h"})
            }

            const token = getToken(user._id)

            return res
                .cookie('token', token, {httpOnly: true, sameSite:'strict'})
                .status(200)
                .json({message: "Logged in successfully, Proceed to make a post"})

        }
    } catch (error) {
        res.status(500).json(({
            message: error.message
        }))
    }
}

module.exports = login