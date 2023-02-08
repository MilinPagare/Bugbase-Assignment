const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const todolistRoutes = require("./routes/todolist.routes");

const app = express();
const DB_URI = "mongodb://127.0.0.1:27017";
const PORT = 8082;
app.use(cors());
app.use(express.json());
app.use("/todolist", todolistRoutes);

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log("Successfully connnected to DB");
    app.listen(PORT, () => {
      console.log("Server Listening at ", PORT);
    });
  })
  .catch((err) => {
    console.log("Failed to connect DB ", err);
  });
