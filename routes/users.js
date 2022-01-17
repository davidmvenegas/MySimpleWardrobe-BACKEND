const router = require("express").Router()
const User = require("../models/User")
const { tokenAuthorization, adminAuthorization } = require("./verifyToken")

// USER STATS
router.get("/stats", adminAuthorization, async (req, res) => {
    const date = new Date()
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))
    try {
        const data = await User.aggregate([
            {$match: {createdAt: {$gte: lastYear}}},
            {$project: {month: {$month: "$createdAt"}}},
            {$group: {_id: "$month", total: {$sum: 1}}}
        ])
        res.status(200).json(data)
    } catch (error) {
        return res.status(500).json(error)
    }
})

// UPDATE USER
router.put("/:id", tokenAuthorization, async (req, res) => {
    if(req.body.password) req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_SECRET).toString()
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true})
        return res.status(200).json(updatedUser)
    } catch (error) {
        return res.status(500).json(error)
    }
})

// DELETE USER
router.delete("/:id", tokenAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        return res.status(200).json("User has been deleted")
    } catch (error) {
        return res.status(500).json(error)
    }
})

// GET USER
router.get("/:id", adminAuthorization, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const {password, ...otherUserData} = user._doc;
        return res.status(200).json(otherUserData)
    } catch (error) {
        return res.status(500).json(error)
    }
})

// GET ALL USERS
router.get("/", adminAuthorization, async (req, res) => {
    const query = req.query.new
    try {
        const users = query ? await User.find().sort({_id: -1}).limit(5) : await User.find()
        return res.status(200).json(users)
    } catch (error) {
        return res.status(500).json(error)
    }
})

module.exports = router