const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const { PrismaClient } = require("../generated/prisma/client.js");
const prisma = new PrismaClient();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send({ message: "Server is running" });
});





app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || "Internal Server Error");
});

module.exports = app;