const app = require("express")();
const express = require("express");
var cors = require("cors");

require("dotenv").config();

const establishDbConnection = require("./db/init");
const routes = require("./routes");
const errorHandler = require("./error/handler");

const PORT = process.env.PORT || 8000;
app.use(cors());
establishDbConnection();
console.log("Connected");
app.use(express.json());
app.use(express.urlencoded());
app.use("/api", routes);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));

module.exports = app;
