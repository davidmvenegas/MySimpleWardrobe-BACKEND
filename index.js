const mongoose = require("mongoose")
const express = require("express")
const dotenv = require("dotenv")
const app = express()
dotenv.config()

const authRoute = require("./routes/auth")
const usersRoute = require("./routes/users")
const productsRoute = require("./routes/products")
const cartRoute = require("./routes/cart")
const ordersRoute = require("./routes/orders")

mongoose.connect(process.env.MONGO_URL).then(console.log("CONNECTED")).catch((error) => console.error(error))

app.use(express.json())
app.use("/api/auth", authRoute)
app.use("/api/users", usersRoute)
app.use("/api/products", productsRoute)
app.use("/api/cart", cartRoute)
app.use("/api/orders", ordersRoute)

app.listen(process.env.PORT || 5000, () => console.log("listening..."))