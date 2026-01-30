const jwt = require("jsonwebtoken")
const User = require("../schema/userSchema")

const authMiddleware = async (req, res, next) => {

    const token = req.cookies.token
    const jwtsecret = process.env.JWT_SECRET

    if (!token) {
        return res.status(401).json({ message: "Please login or register to continue." })
    }

    try {
        const verifiedToken = jwt.verify(token, jwtsecret)
        if (!verifiedToken) {
            return res.status(401).json({ message: "Secret is invalid!" })
        }

        const user = await User.findById(verifiedToken.id).select("-password")
        if (!user) {
            return res.status(401).json({ message: "Invalid user ID" })
        }

        req.user = user
        next()

    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" })
    }

}

module.exports = authMiddleware