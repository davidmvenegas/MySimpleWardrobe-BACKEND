const router = require("express").Router()
const User = require("../models/User")
const { verifyToken } = require("./verifyToken")

router.put("/:id", verifyToken, async (req, res) => {
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

module.exports = router