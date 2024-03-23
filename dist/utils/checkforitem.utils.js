"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckItemExists = void 0;
const todolist_route_1 = require("../routes/todolist.route");
let CheckItemExists = (req, res, next) => {
    let listId = parseInt(req.params.list_id);
    let id = parseInt(req.params.itemId);
    let itemNotFound = true;
    let list = todolist_route_1.todoArray.find(i => i.id === listId);
    if (list) {
        let itemIndex = 0;
        for (let item of list.list_items) {
            if (item.id == id) {
                itemNotFound = false;
            }
            itemIndex++;
        }
        if (itemNotFound) {
            res.status(404).send({ status: 404, message: "Item not found" });
        }
        else {
            next();
        }
    }
    if (itemNotFound) {
        res.status(404).send({ status: 404, message: "Item not found" });
    }
    else {
        next();
    }
};
exports.CheckItemExists = CheckItemExists;
