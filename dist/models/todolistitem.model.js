"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoListItem = void 0;
class TodoListItem {
    id;
    task;
    completed;
    created_at;
    updatedAt;
    constructor(id, task) {
        this.id = id;
        this.task = task;
        this.created_at = new Date();
        this.updatedAt = new Date();
        this.completed = false;
    }
}
exports.TodoListItem = TodoListItem;
