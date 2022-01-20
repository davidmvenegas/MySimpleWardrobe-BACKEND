const router = require("express").Router()
const User = require("../models/User")
const CryptoJS = require("crypto-js")
const JWT = require("jsonwebtoken")

router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_SECRET).toString(),
        isAdmin: req.body.isAdmin
    })
    try {
        const savedUser = await newUser.save()
        return res.status(201).json(savedUser)
    } catch(e) {
        return res.status(500).json(e)
    }
})

router.post("/login", async (req, res) => {
    try {
        // CHECK USERNAME
        const user = await User.findOne({username: req.body.username})
        if (!user) return res.status(401).json("Username not found")
        // CHECK PASSWORD
        const originalPassword = CryptoJS.AES.decrypt(user.password, process.env.PASSWORD_SECRET).toString(CryptoJS.enc.Utf8)
        if (originalPassword !== req.body.password) return res.status(401).json("Wrong password")
        // SIGN TOKEN
        const accessToken = JWT.sign({id: user._id, isAdmin: user.isAdmin}, process.env.JWT_SECRET, {expiresIn: "3d"})
        // SEND RESPONSE
        const {password, ...otherUserData} = user._doc;
        return res.status(200).json({accessToken, ...otherUserData})
    } catch(error) {
        return res.status(500).json(error)
    }
})

module.exports = router