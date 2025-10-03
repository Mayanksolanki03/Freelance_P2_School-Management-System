const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
// const bodyParser = require("body-parser")

const app = express();
const Routes = require("./routes/route.js");

const PORT = process.env.PORT || 5001;

// ✅ Proper CORS configuration
app.use(cors({
  origin: "http://localhost:3000", // Allow frontend origin
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

// ✅ Body parser (modern way)
app.use(express.json({ limit: "10mb" }));
// app.use(bodyParser.json({ limit: '10mb', extended: true }))
// app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("❌ NOT CONNECTED TO NETWORK", err));

// ✅ Routes
app.use("/", Routes);

// ✅ Server listener
app.listen(PORT, () => {
  console.log(`🚀 Server started at port no. ${PORT}`);
});
