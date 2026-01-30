const User = require("../schema/userSchema")
const bcrypt = require("bcrypt")

// create a user
const createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required!"
            })
        } else {
            const user = await User.findOne({ email })
            if (user) {
                res.status(409).json({ message: "User is already registered, proceed to login." })
                return
            }
            const hashedPassword = await bcrypt.hash(password, 10)
            const newUser = new User ({ username, email, password: hashedPassword })
            await newUser.save()
            res.status(200).json(newUser)           
        }
        
    } catch (error) {
        res.status(500).json(({
            message: error.message
        }))
    }
}

// get all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find()
        if (users.length === 0) {
            return res.status(200).json({
                message: "No user(s) was found, you must register or sign-in as a user."
            })
        }
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

// get a user by id
const getUserById = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id)
        if (!user) {
            return res.status(400).json({
                message: `User with the id ${id} is not found`
            })
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

// delete a user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params

        //ownership check
        if (req.user._id.toString() !== req.params.id) {
            return res.status(403).json({ message: "You can only modify your own account" })
        }

        const user = await User.findByIdAndDelete(id)
        if (!user) {
            return res.status(400).json({
                message: `User with the id ${id} is not found`
            })
        }

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

// update a user
const updateUser = async (req, res) => {
    try {
        const { username, email, password } = req.body
        const { id } = req.params

        //ownership check
        if (req.user._id.toString() !== req.params.id) {
            return res.status(403).json({ message: "You can only modify your own account" })
        }

        let updatedData = { username, email }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10)
            updatedData.password = hashedPassword
        }

        const user = await User.findByIdAndUpdate(
            id,
            updatedData,
            { new: true }
        )

        if (!user) {
            return res.status(400).json({
                message: `User with the id ${id} is not found`
            })
        }

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


module.exports = {
    getUsers,
    createUser,
    getUserById,
    deleteUser,
    updateUser
}