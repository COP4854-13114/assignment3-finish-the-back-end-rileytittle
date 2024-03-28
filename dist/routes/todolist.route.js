"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.todoArray = exports.app = void 0;
const express_1 = require("express");
const express_2 = __importDefault(require("express"));
const todolist_model_1 = require("../models/todolist.model");
const todolistitem_model_1 = require("../models/todolistitem.model");
const auth_utils_1 = require("../utils/auth.utils");
const checkforlist_utils_1 = require("../utils/checkforlist.utils");
const checkforitem_utils_1 = require("../utils/checkforitem.utils");
const users_route_1 = require("./users.route");
let todoIds = 0;
let itemIds = 0;
let app = (0, express_1.Router)();
exports.app = app;
app.use(express_2.default.json());
let todoArray = [];
exports.todoArray = todoArray;
app.delete("/:list_id/share/:shared_user_email?", checkforlist_utils_1.CheckListExists, auth_utils_1.AuthChecker, (req, res) => {
    let currentUser = res.getHeader("currentuser");
    let theListIndex = checkListExists(parseInt(req.params.list_id));
    let theTodo = todoArray[theListIndex];
    if (theTodo.created_by == parseInt(currentUser[2].split("=")[1])) {
        if (req.params.shared_user_email) {
            let emailExists = false;
            let sharedUserIndex = 0;
            for (let u of theTodo.shared_with) {
                if (u.email == req.params.shared_user_email) {
                    emailExists = true;
                    break;
                }
                sharedUserIndex++;
            }
            if (emailExists) {
                theTodo.shared_with.splice(sharedUserIndex, 1);
                res.status(204).send({ status: 204, message: "Shared list removed" });
            }
            else {
                res.status(404).send({ status: 404, message: "User not found" });
            }
        }
        else {
            theTodo.shared_with = [];
            res.status(204).send({ status: 204, message: "Shared list removed" });
        }
    }
    else {
        res.status(403).send({ status: 403, message: "Unauthorized" });
    }
});
app.delete("/:list_id/item/:itemId", checkforlist_utils_1.CheckListExists, checkforitem_utils_1.CheckItemExists, auth_utils_1.AuthChecker, (req, res) => {
    let currentUser = res.getHeader("currentuser");
    let theListIndex = checkListExists(parseInt(req.params.list_id));
    let theTodo = todoArray[theListIndex];
    if (theTodo.created_by == parseInt(currentUser[2].split("=")[1]) ||
        theTodo.shared_with.find((user) => user["email"] == currentUser[0].split("=")[1])) {
        let theItemIndex = checkItemExists(parseInt(req.params.list_id), parseInt(req.params.itemId));
        if (theItemIndex != -1) {
            todoArray[theListIndex].list_items.splice(theItemIndex, 1);
            res.status(204).send({ status: 204, message: "Todo list item deleted" });
        }
        else {
            res.status(404).send({ status: 404, messsage: "Todo list item not found" });
        }
    }
    else {
        res.status(403).send({ status: 403, message: "Unauthorized" });
    }
});
app.patch("/:list_id/item/:itemId", checkforlist_utils_1.CheckListExists, checkforitem_utils_1.CheckItemExists, auth_utils_1.AuthChecker, (req, res) => {
    let currentUser = res.getHeader("currentuser");
    let theListIndex = checkListExists(parseInt(req.params.list_id));
    let theTodo = todoArray[theListIndex];
    let theItemIndex = checkItemExists(parseInt(req.params.list_id), parseInt(req.params.itemId));
    if (theItemIndex != -1) {
        if (theTodo.created_by == parseInt(currentUser[2].split("=")[1]) ||
            theTodo.shared_with.find((user) => user["email"] == currentUser[0].split("=")[1])) {
            if ("completed" in req.body) {
                if (!(typeof req.body.completed == "boolean")) {
                    res.status(400).send({ status: 400, message: "Invalid input" });
                }
                if (req.body.completed) {
                    theTodo.list_items[theItemIndex].completed_by_user = { email: currentUser[0].split("=")[1], name: currentUser[1].split("=")[1] };
                    theTodo.list_items[theItemIndex].completed_date = new Date();
                }
            }
            if (req.body.due_date) {
                let dueDate = new Date(req.body.due_date);
                if (!(dueDate.toISOString() === req.body.due_date)) {
                    res.status(400).send({ status: 400, message: "Invalid input" });
                }
                else {
                    theTodo.list_items[theItemIndex].due_date = dueDate;
                }
            }
            todoArray[theListIndex].list_items[theItemIndex].task = req.body.task;
            todoArray[theListIndex].list_items[theItemIndex].completed = req.body.completed;
            res.status(204).send({ status: 204, message: "Todo list item updated" });
        }
        else {
            res.status(403).send({ status: 403, message: "Unauthorized" });
        }
    }
    else {
        res.status(404).send({ status: 404, message: "Todo list item not found" });
    }
});
app.get("/:list_id/item/:itemId", checkforlist_utils_1.CheckListExists, checkforitem_utils_1.CheckItemExists, auth_utils_1.AuthChecker, (req, res) => {
    let currentUser = res.getHeader("currentuser");
    let theListIndex = checkListExists(parseInt(req.params.list_id));
    let theTodo = todoArray[theListIndex];
    if (theTodo.created_by == parseInt(currentUser[2].split("=")[1]) ||
        theTodo.shared_with.find((user) => user["email"] == currentUser[0].split("=")[1])) {
        if (theListIndex != -1) {
            let theItemIndex = checkItemExists(parseInt(req.params.list_id), parseInt(req.params.itemId));
            if (theItemIndex != -1) {
                res.status(200).send(todoArray[theListIndex].list_items[theItemIndex]);
            }
            else {
                res.status(404).send({ status: 404, message: "Todo list item not found" });
            }
        }
        else {
            res.status(404).send({ status: 404, message: "Todo list not found" });
        }
    }
    else {
        res.status(403).send({ status: 403, message: "Unauthorized" });
    }
});
app.get("/:list_id/items", checkforlist_utils_1.CheckListExists, auth_utils_1.AuthChecker, (req, res) => {
    let currentUser = res.getHeader("currentuser");
    let theListIndex = checkListExists(parseInt(req.params.list_id));
    let theTodo = todoArray[theListIndex];
    let itemsToShare = [];
    if (res.hasHeader("currentuser")) {
        if (parseInt(currentUser[2].split("=")[1]) == theTodo.created_by) {
            res.status(200).send(theTodo.list_items);
        }
        else {
            res.status(403).send({ status: 403, message: "Not authorized" });
        }
    }
    else if (theTodo.shared_with.find((user) => user["email"] == currentUser[0].split("=")[1])) {
        res.status(200).send(theTodo.list_items);
    }
    else {
        if (theTodo.public_list) {
            res.status(200).send(theTodo.list_items);
        }
        else {
            res.status(403).send({ status: 403, message: "Not authorized" });
        }
    }
});
app.post("/:list_id/item", checkforlist_utils_1.CheckListExists, auth_utils_1.AuthChecker, (req, res) => {
    let currentUser = res.getHeader("currentuser");
    let theListIndex = checkListExists(parseInt(req.params.list_id));
    let theTodo = todoArray[theListIndex];
    if (theTodo.created_by == parseInt(currentUser[2].split("=")[1]) ||
        theTodo.shared_with.find((user) => user["email"] == currentUser[0].split("=")[1])) {
        if (req.body.task) {
            if ("completed" in req.body) {
                if (typeof req.body.completed == "boolean") {
                    todoArray[theListIndex].list_items.length;
                    let newListItem = new todolistitem_model_1.TodoListItem(itemIds, req.body.task, todoArray[theListIndex].id, req.body.due_date);
                    newListItem.completed = false;
                    todoArray[theListIndex].list_items.push(newListItem);
                    itemIds++;
                    res.status(201).send(newListItem);
                }
                else {
                    res.status(400).send({ status: 400, message: "Completed must be boolean" });
                }
            }
            else {
                todoArray[theListIndex].list_items.length;
                let newListItem = new todolistitem_model_1.TodoListItem(itemIds, req.body.task, todoArray[theListIndex].id, req.body.due_date);
                newListItem.completed = false;
                todoArray[theListIndex].list_items.push(newListItem);
                itemIds++;
                res.status(201).send(newListItem);
            }
        }
        else {
            res.status(400).send({ status: 400, message: "Task is required" });
        }
    }
    else {
        res.status(403).send({ status: 403, message: "Unauthorized" });
    }
});
app.post("/:list_id/share", checkforlist_utils_1.CheckListExists, auth_utils_1.AuthChecker, (req, res) => {
    let currentUser = res.getHeader("currentuser");
    let theListIndex = checkListExists(parseInt(req.params.list_id));
    let theTodo = todoArray[theListIndex];
    if (theTodo.created_by == parseInt(currentUser[2].split("=")[1])) {
        if (req.body.email) {
            let emailExists = false;
            let sharedUser = undefined;
            for (let u of users_route_1.userList) {
                if (u.email == req.body.email) {
                    emailExists = true;
                    sharedUser = u;
                    break;
                }
            }
            if (emailExists) {
                if (sharedUser) {
                    theTodo.shared_with.push({ email: sharedUser.email, name: sharedUser.name });
                    res.status(201).send(theTodo);
                }
            }
            else {
                res.status(404).send({ status: 404, message: "Email not in system" });
            }
        }
        else {
            res.status(400).send({ status: 400, message: "Email must be supplied" });
        }
    }
    else {
        res.status(403).send({ status: 403, message: "Unauthorized" });
    }
});
app.get("/:list_id", checkforlist_utils_1.CheckListExists, auth_utils_1.AuthChecker, (req, res) => {
    let currentUser = res.getHeader("currentuser");
    let theListIndex = checkListExists(parseInt(req.params.list_id));
    let theTodo = todoArray[theListIndex];
    if (parseInt(currentUser[2].split("=")[1]) == theTodo.created_by) {
        res.status(200).send(todoArray[theListIndex]);
    }
    else if (theTodo.shared_with.find((element) => element["email"] == currentUser[0].split("=")[1])) {
        res.status(200).send({ id: theTodo.id, title: theTodo.title, public_list: theTodo.public_list,
            created_by: theTodo.created_at, created_at: theTodo.created_at, list_items: theTodo.list_items });
    }
    else if (theTodo.public_list) {
        res.status(200).send({ id: theTodo.id, title: theTodo.title, public_list: theTodo.public_list,
            created_by: theTodo.created_at, created_at: theTodo.created_at, list_items: theTodo.list_items });
    }
    else {
        res.status(401).send({ status: 401, message: "Unauthorized" });
    }
});
app.delete("/:list_id", auth_utils_1.AuthChecker, checkforlist_utils_1.CheckListExists, (req, res) => {
    let currentUser = res.getHeader("currentuser");
    let theListIndex = checkListExists(parseInt(req.params.list_id));
    let theTodo = todoArray[theListIndex];
    if (theTodo.created_by == parseInt(currentUser[2].split("=")[1])) {
        todoArray.splice(theListIndex, 1);
        res.status(204).send({ status: 204, message: "Todo list deleted" });
    }
    else {
        res.status(403).send({ status: 403, message: "Not authorized to delete todo list" });
    }
});
app.patch("/:list_id", auth_utils_1.AuthChecker, checkforlist_utils_1.CheckListExists, (req, res) => {
    let currentUser = res.getHeader("currentuser");
    let theListIndex = checkListExists(parseInt(req.params.list_id));
    let theTodo = todoArray[theListIndex];
    if (theTodo.created_by == parseInt(currentUser[2].split("=")[1]) || theTodo.shared_with.find((element) => element["email"] == currentUser[0].split("=")[1])) {
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
    }
    else {
        res.status(403).send({ status: 403, message: "Unauthorized" });
    }
});
app.get("/", auth_utils_1.AuthChecker, (req, res) => {
    let todosToShow = [];
    if (res.hasHeader("currentuser")) {
        let currentUser = res.getHeader("currentuser");
        for (let todo of todoArray) {
            if (todo.created_by == parseInt(currentUser[2].split("=")[1])) {
                todosToShow.push(todo);
            }
            else if (todo.shared_with.find((element) => element["email"] == currentUser[0].split("=")[1])) {
                todosToShow.push(todo);
            }
            else if (todo.public_list) {
                todosToShow.push(todo);
            }
        }
    }
    else {
        for (let todo of todoArray) {
            if (todo.public_list) {
                todosToShow.push(todo);
            }
        }
    }
    let formattedTodos = todosToShow.map(({ id, title, created_at, created_by, public_list }) => ({
        id,
        title,
        created_at,
        created_by,
        public_list
    }));
    res.status(200).send(formattedTodos);
});
app.post("/", auth_utils_1.AuthChecker, (req, res) => {
    if (req.body.title) {
        let loggedInUserInfo = res.getHeader("currentuser");
        let title = req.body.title;
        let newTodoList = new todolist_model_1.TodoList(todoIds, title, req.body.public_list, parseInt(loggedInUserInfo[2].split("=")[1]));
        todoArray.push(newTodoList);
        todoIds++;
        //console.log(newTodoList.shared_with[0][0])
        res.status(201).send({ id: newTodoList.id, title: newTodoList.title, created_at: newTodoList.created_at,
            public_list: newTodoList.public_list, created_by: newTodoList.created_by, list_items: newTodoList.list_items });
    }
    else {
        res.status(400).send({ status: 400, message: "Title is required" });
    }
});
function checkItemExists(listId, id) {
    let list = todoArray.find(i => i.id === listId);
    if (list) {
        let itemIndex = 0;
        for (let item of list.list_items) {
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
