const mongoose = require("mongoose")
const express = require("express")
const dotenv = require("dotenv")
const app = express()
dotenv.config()

const authRoute = require("./routes/auth")
const userRoute = require("./routes/user")

mongoose.connect(process.env.MONGO_URL).then(console.log("CONNECTED")).catch((error) => console.error(error))

app.use(express.json())
app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)

app.listen(process.env.PORT || 5000, () => console.log("listening..."))