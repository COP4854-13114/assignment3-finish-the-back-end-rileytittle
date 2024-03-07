"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const todolist_model_1 = require("./models/todolist.model");
const todolistitem_model_1 = require("./models/todolistitem.model");
let todoIds = 0;
let itemIds = 0;
let app = (0, express_1.default)();
app.use(express_1.default.json());
let todoArray = [];
app.delete("/todo/:list_id/item/:itemId", (req, res) => {
    let theListIndex = checkListExists(parseInt(req.params.list_id));
    if (theListIndex != -1) {
        let theItemIndex = checkItemExists(parseInt(req.params.list_id), parseInt(req.params.itemId));
        if (theItemIndex != -1) {
            todoArray[theListIndex].listItems.splice(theItemIndex, 1);
            res.status(204).send({ status: 204, message: "Todo list item deleted" });
        }
        else {
            res.status(404).send({ status: 404, messsage: "Todo list item not found" });
        }
    }
    else {
        res.status(404).send({ status: 404, message: "Todo list not found" });
    }
});
app.patch("/todo/:list_id/item/:itemId", (req, res) => {
    let theListIndex = checkListExists(parseInt(req.params.list_id));
    if (theListIndex != -1) {
        let theItemIndex = checkItemExists(parseInt(req.params.list_id), parseInt(req.params.itemId));
        if (theItemIndex != -1) {
            todoArray[theListIndex].listItems[theItemIndex].task = req.body.task;
            todoArray[theListIndex].listItems[theItemIndex].completed = req.body.completed;
            res.status(204).send({ status: 204, message: "Todo list item updated" });
        }
        else {
            res.status(404).send({ status: 404, message: "Todo list item not found" });
        }
    }
    else {
        res.status(404).send({ status: 404, message: "Todo list not found" });
    }
});
app.get("/todo/:list_id/item/:itemId", (req, res) => {
    let theListIndex = checkListExists(parseInt(req.params.list_id));
    if (theListIndex != -1) {
        let theItemIndex = checkItemExists(parseInt(req.params.list_id), parseInt(req.params.itemId));
        if (theItemIndex != -1) {
            res.status(200).send(todoArray[theListIndex].listItems[theItemIndex]);
        }
        else {
            res.status(404).send({ status: 404, message: "Todo list item not found" });
        }
    }
    else {
        res.status(404).send({ status: 404, message: "Todo list not found" });
    }
});
app.get("/todo/:list_id/items", (req, res) => {
    let theListIndex = checkListExists(parseInt(req.params.list_id));
    if (theListIndex != -1) {
        res.status(200).send(todoArray[theListIndex].listItems);
    }
    else {
        res.status(404).send({ status: 404, message: "Todo list not found" });
    }
});
// Fix HERE
app.post("/todo/:list_id/item", (req, res) => {
    let theListIndex = checkListExists(parseInt(req.params.list_id));
    if (theListIndex != -1) {
        if (req.body.task) {
            todoArray[theListIndex].listItems.length;
            let newListItem = new todolistitem_model_1.TodoListItem(itemIds, req.body.task);
            todoArray[theListIndex].listItems.push(newListItem);
            itemIds++;
            res.status(201).send(newListItem);
        }
        else {
            res.status(400).send({ status: 400, message: "Task is required" });
        }
    }
    else {
        res.status(404).send({ status: 404, message: "Todo list not found" });
    }
});
app.get("/todo/:list_id", (req, res) => {
    let theListIndex = checkListExists(parseInt(req.params.list_id));
    if (theListIndex != -1) {
        res.status(200).send(todoArray[theListIndex]);
    }
    else {
        res.status(404).send({ status: 404, message: "List not found" });
    }
});
app.delete("/todo/:list_id", (req, res) => {
    let theListIndex = checkListExists(parseInt(req.params.list_id));
    if (theListIndex != -1) {
        todoArray.splice(theListIndex, 1);
        res.status(204).send({ status: 204, message: "Todo list deleted" });
    }
    else {
        res.status(404).send({ status: 404, message: "Todo list not found" });
    }
});
app.patch("/todo/:list_id", (req, res) => {
    if (req.body.title) {
        console.log("title exists");
        let theListIndex = checkListExists(parseInt(req.params.list_id));
        if (theListIndex != -1) {
            todoArray[theListIndex].title = req.body.title;
            res.status(204).send({ status: 204, message: "Todo list updated" });
        }
        else {
            console.log("todo doesnt exist");
            res.status(404).send({ status: 404, message: "Todo list not found" });
        }
    }
    else {
        res.status(400).send({ status: 400, message: "Title is required" });
    }
});
app.get("/todo", (req, res) => {
    res.status(200).send(todoArray);
});
app.post("/todo", (req, res) => {
    if (req.body.title) {
        let title = req.body.title;
        let newTodoList = new todolist_model_1.TodoList(todoIds, title);
        todoArray.push(newTodoList);
        todoIds++;
        res.status(201).send(newTodoList);
    }
    else {
        res.status(400).send({ status: 400, message: "Title is required" });
    }
});
app.use("/", (req, res) => {
    res.send("Hi Mom");
});
app.listen(3000);
function checkItemExists(listId, id) {
    let list = todoArray.find(i => i.id === listId);
    if (list) {
        let itemIndex = 0;
        for (let item of list.listItems) {
            if (item.id == id) {
                return itemIndex;
            }
            itemIndex++;
        }
        return -1;
    }
    return -1;
}
function checkListExists(id) {
    let index = 0;
    for (let list of todoArray) {
        if (list.id == id) {
            return index;
        }
        index++;
    }
    return -1;
}
