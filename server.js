require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const userRoute = require("./routes/userRouter");
const groceryRoute = require("./routes/groceryRouter");
const app = express();
const authenticate = require("./middleware/userAuth");

app.use(express.json());

app.use("/", (req, res, next) => {
  console.log(`${req.method} - ${req.url}`);
  next();
});

app.use("/grocery", groceryRoute);

 
app.use("/user",authenticate ,userRoute);

app.get("*", (req, res) => {
  res.status(404).json({ message: "Invalid endpoint" });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected");
  })
  .catch((error) => {
    console.log(error);
  });
app.listen(process.env.PORT || 4000, (req, res) => {
  console.log("server started at ", process.env.PORT || 4000);
});
