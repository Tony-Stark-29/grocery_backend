require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const userRoute = require("./routes/userRouter");
const groceryRoute = require("./routes/groceryRouter");
const authenticate = require("./middleware/userAuth");
const app = express();

app.use(helmet());

// const whitelist = ["http://192.168.1.39:3000"];
// const corsOptions = {
//   origin: (origin, callback) => {
//     if (whitelist.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
// };

// app.use(cors(corsOptions));

app.use(express.json());
app.use("/", (req, res, next) => {
  console.log(`${req.method} - ${req.url}`);
  next();
});

app.use("/grocery", groceryRoute);
app.use("/user", authenticate, userRoute);

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
