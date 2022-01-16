const router = require("express").Router()
const User = require("../models/User")
const CryptoJS = require("crypto-js")

router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_SECRET)
    })
    try {
        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
    } catch(e) {
        res.status(500).json(e)
    }
})

router.post("/login", async (req, res) => {
    try {
        // CHECK USERNAME
        const user = await User.findOne({username: req.body.username})
        !user && res.status(401).json("Username not found")
        // CHECK PASSWORD
        const originalPassword = CryptoJS.AES.decrypt(user.password, process.env.PASSWORD_SECRET).toString(CryptoJS.enc.Utf8)
        originalPassword !== req.body.password && res.status(401).json("Wrong password")
        // SEND RESPONSE
        const {password, ...other} = user._doc;
        res.status(200).json(other)
    } catch(error) {
        res.status(500).json(error)
    }
})


module.exports = router