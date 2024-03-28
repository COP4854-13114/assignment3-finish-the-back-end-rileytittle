"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoList = void 0;
class TodoList {
    id;
    title;
    created_at;
    public_list;
    created_by;
    list_items = [];
    shared_with = [];
    constructor(id, title, public_list, created_by) {
        this.id = id;
        this.title = title;
        this.created_at = new Date();
        this.public_list = public_list;
        this.created_by = created_by;
    }
}
exports.TodoList = TodoList;
