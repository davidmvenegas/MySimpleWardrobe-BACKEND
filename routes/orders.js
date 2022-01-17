const router = require("express").Router()
const Order = require("../models/Order")
const { verifyToken, adminAuthorization } = require("./verifyToken")

router.get("/revenue", adminAuthorization, async (req, res) => {
    const date = new Date()
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1))
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1))
    try {
        const revenue = await Order.aggregate([
            {$match: {createdAt: {$gte: previousMonth}}},
            {$project: {month: {$month: "$createdAt"}, sales: "$amount"}},
            {$group: {_id: "$month", total: {$sum: "$sales"}}}
        ])
        return res.status(200).json(revenue)
    } catch (error) {
        return res.status(500).json(error)
    }
})

router.post("/", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body)
    try {
        const savedOrder = await newOrder.save()
        return res.status(200).json(savedOrder)
    } catch (error) {
        return res.status(500).json(error)
    }
})

router.put("/:id", adminAuthorization, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true})
        return res.status(200).json(updatedOrder)
    } catch (error) {
        return res.status(500).json(error)
    }
})

router.delete("/:id", adminAuthorization, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id)
        return res.status(200).json("Order has been deleted")
    } catch (error) {
        return res.status(500).json(error)
    }
})

router.get("/:userId", async (req, res) => {
    try {
        const orders = await Order.find({userId: req.params.userId})
        return res.status(200).json(orders)
    } catch (error) {
        return res.status(500).json(error)
    }
})

router.get("/", adminAuthorization, async (req, res) => {
    try {
        const orders = await Order.find()
        return res.status(200).json(orders)
    } catch (error) {
        return res.status(500).json(error)
    }
})

module.exports = router