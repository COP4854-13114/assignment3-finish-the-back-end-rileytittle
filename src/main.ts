import express from "express";
import { app as TodoRouter } from "./routes/todolist.route"

let app = express();
app.use(express.json());
app.use("/todo", TodoRouter)
app.listen(3000);