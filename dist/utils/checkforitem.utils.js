"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckItemExists = void 0;
const todolist_route_1 = require("../routes/todolist.route");
let CheckItemExists = (req, res, next) => {
    let listId = parseInt(req.params.list_id);
    let itemId = parseInt(req.params.itemId);
    let list = todolist_route_1.todoArray.find(i => i.id === listId);
    if (list) {
        let itemIndex = 0;
        for (let item of list.list_items) {
            if (item.id == itemId) {
                return itemIndex;
            }
            itemIndex++;
        }
        return -1;
    }
    return -1;
};
exports.CheckItemExists = CheckItemExists;
