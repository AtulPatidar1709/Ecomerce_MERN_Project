import express from "express";
import { AdminOnly } from "../middlewares/auth.js";
import { getBarCharts, getDashboardStats, getLineCharts, getPieCharts } from "../controllers/stats.js";

const app = express.Router();

//Get all Users /api/v1/dashboard/stats
app.get("/stats", AdminOnly, getDashboardStats);

//Get all Users /api/v1/dashboard/pie
app.get("/pie", AdminOnly, getPieCharts);

//Get all Users /api/v1/dashboard/pie
app.get("/bar", AdminOnly, getBarCharts);

//Get all Users /api/v1/dashboard/pie
app.get("/line", AdminOnly, getLineCharts);

export default app;