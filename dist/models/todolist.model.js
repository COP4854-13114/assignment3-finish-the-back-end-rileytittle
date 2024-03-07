"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoList = void 0;
class TodoList {
    id;
    title;
    createdAt;
    listItems = [];
    constructor(id, title) {
        this.id = id;
        this.title = title;
        this.createdAt = new Date();
    }
}
exports.TodoList = TodoList;
