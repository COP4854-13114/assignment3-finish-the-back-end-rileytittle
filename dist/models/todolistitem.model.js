"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoListItem = void 0;
class TodoListItem {
    id;
    task;
    completed;
    completed_date = null;
    created_at;
    updated_at;
    due_date;
    list_id;
    completed_by = null;
    completed_by_user = null;
    constructor(id, task, list_id, due_date) {
        this.id = id;
        this.task = task;
        this.list_id = list_id;
        this.created_at = new Date();
        this.updated_at = new Date();
        this.completed_date = new Date();
        this.completed = false;
        this.due_date = due_date;
    }
}
exports.TodoListItem = TodoListItem;
