const express = require("express");
const useRouter = require("./user/route");

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use("/api/users", useRouter);

module.exports = server;
