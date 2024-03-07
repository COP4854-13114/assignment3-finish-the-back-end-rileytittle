"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoListItem = void 0;
class TodoListItem {
    id;
    task;
    completed;
    createdAt;
    updatedAt;
    constructor(id, task) {
        this.id = id;
        this.task = task;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.completed = false;
    }
}
exports.TodoListItem = TodoListItem;
