"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckListExists = void 0;
const todolist_route_1 = require("../routes/todolist.route");
let CheckListExists = (req, res, next) => {
    let id = parseInt(req.params.list_id);
    let index = 0;
    let listNotFound = true;
    for (let list of todolist_route_1.todoArray) {
        if (list.id == id) {
            res.setHeader("listid", id);
            listNotFound = false;
        }
        index++;
    }
    if (listNotFound) {
        res.status(404).send({ status: 404, message: "List not found" });
    }
    else {
        next();
    }
};
exports.CheckListExists = CheckListExists;
