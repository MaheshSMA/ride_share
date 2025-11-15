const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

// Load env variables
dotenv.config();

// Connect Mongo
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
// app.use("/api/auth", require("./routes/authRoutes"));

const PORT = process.env.PORT || 5000;

app.get("/homepage",(req,res)=>{
    res.send("home page");
})

app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
});
