import express from "express";
import { deleteUser, getAllUsers, getUser, newUser } from "../controllers/user.js";
import { AdminOnly } from "../middlewares/auth.js";

const app = express.Router();

app.post("/new", newUser);

//Get all Users /api/v1/user/all
app.get("/all", AdminOnly, getAllUsers)

//Get all Users /api/v1/user/:id
app.get("/:id", getUser)

//Delete  User /api/v1/user/:id
app.delete("/:id", AdminOnly, deleteUser)

export default app;