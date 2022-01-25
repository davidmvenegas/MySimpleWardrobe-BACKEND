const mongoose = require("mongoose")

const ReviewSchema = new mongoose.Schema({
    reviews: {type: Array, required: true},
}, {timestamps: true})

module.exports = mongoose.model("Review", ReviewSchema)