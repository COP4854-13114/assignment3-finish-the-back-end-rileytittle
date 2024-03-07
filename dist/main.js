"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const todolist_route_1 = require("./routes/todolist.route");
let app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/todo", todolist_route_1.app);
app.listen(3000);
