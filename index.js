const express = require("express");
const { connection } = require("./config/db.js");
const UserRouter = require("./routes/user.route.js");
const auth = require("./middleware/authenticate.middleware.js");
const bookRouter = require("./routes/book.route.js");
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 5000;
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use("/user", UserRouter);
app.use("/book", auth, bookRouter);

app.get("/", (req, res) => {
  res.status(200).json({ Message: "Your Server Works Fine.." });
});

app.listen(PORT, async () => {
  try {
    await connection;
    console.log(`Server connected to the database`);
    console.log(`Server is running on the PORT ${PORT}`);
  } catch (error) {
    console.log("Server is not connected to database");
  }
});
