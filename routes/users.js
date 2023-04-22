const express = require("express");
const userRouter = express.Router();
const { getUsers, getUser, createUser } = require("../controllers/users");



userRouter.get("/users", getUsers);

userRouter.get("/users/:id", getUser);

userRouter.post("/users", createUser);

module.exports = userRouter;
