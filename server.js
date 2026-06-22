
const express = require('express')
const app = express()

const cors = require("cors")
const dotenv = require('dotenv')


dotenv.config()
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Bienvenue sur Aeey , votre plateforme digital de paiment")
})

const userRoutes = require("./routes/user.routes");
app.use("/user",  userRoutes)

const authRoutes = require("./routes/auth.routes")
app.use("/auth", authRoutes) 

const eventRoutes = require("./routes/event.routes")
app.use("/event", eventRoutes) 

const cardRoutes = require("./routes/card.routes")
app.use("/card", cardRoutes) 

const expenseRoutes = require("./routes/expense.routes")
app.use("/expense", expenseRoutes)

const memberRoutes = require("./routes/member.routes")
app.use("/member", memberRoutes)

const paymentRoutes = require("./routes/payment.routes")
app.use("/payment", paymentRoutes)

const port = process.env.PORT || 9000
app.listen(port, () => {
    console.log(`le server tourne sur le port: http://localhost:${port}`)
})