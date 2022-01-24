const router = require("express").Router()
const Wishlist = require("../models/Wishlist")
const { verifyToken, tokenAuthorization, adminAuthorization } = require("./verifyToken")

// CREATE WISHLIST
router.post("/", verifyToken, async (req, res) => {
    const newWishlist = new Wishlist(req.body)
    try {
        const savedWishlist = await newWishlist.save()
        res.status(200).json(savedWishlist)
    } catch (error) {
        return res.status(500).json(error)
    }
})

// UPDATE WISHLIST
router.put("/:id", tokenAuthorization, async (req, res) => {
    try {
        const updatedWishlist = await Wishlist.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true})
        return res.status(200).json(updatedWishlist)
    } catch (error) {
        return res.status(500).json(error)
    }
})

// DELETE WISHLIST
router.delete("/:id", tokenAuthorization, async (req, res) => {
    try {
        await Wishlist.findByIdAndDelete(req.params.id)
        return res.status(200).json("Wishlist has been deleted")
    } catch (error) {
        return res.status(500).json(error)
    }
})

// GET USERS WISHLIST
router.get("/:userId", tokenAuthorization, async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({userId: req.params.userId})
        return res.status(200).json(wishlist)
    } catch (error) {
        return res.status(500).json(error)
    }
})

// GET ALL WISHLISTS
router.get("/", adminAuthorization, async (req, res) => {
    try {
        const wishlists = await Wishlist.find()
        res.status(200).json(wishlists)
    } catch (error) {
        return res.status(500).json(error)
    }
})

module.exports = router