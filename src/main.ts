import express from "express";
import { app as TodoRouter } from "./routes/todolist.route"
import { app as UserRouter } from "./routes/users.route"

let app = express();
app.use(express.json());

app.use("/user", UserRouter);
app.use("/todo", TodoRouter);
app.listen(3000);