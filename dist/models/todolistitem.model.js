"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoListItem = void 0;
class TodoListItem {
    id;
    task;
    completed;
    completed_date;
    created_at;
    updated_at;
    due_date;
    list_id;
    completed_by_user;
    constructor(id, task, list_id) {
        this.id = id;
        this.task = task;
        this.list_id = list_id;
        this.created_at = new Date();
        this.updated_at = new Date();
        this.completed = false;
    }
}
exports.TodoListItem = TodoListItem;
