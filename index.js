const app = require("express")();
const express = require("express");

require("dotenv").config();

const establishDbConnection = require("./db/init");
const routes = require("./routes");
const errorHandler = require("./error/handler");

const PORT = process.env.PORT || 8000;

establishDbConnection();
app.use(express.json());
app.use(express.urlencoded());
app.use("/api", routes);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
