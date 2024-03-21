"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoList = void 0;
class TodoList {
    id;
    title;
    createdAt;
    publicList;
    createdBy;
    listItems = [];
    sharedWith = [];
    constructor(id, title, publicList, createdBy) {
        this.id = id;
        this.title = title;
        this.createdAt = new Date();
        this.publicList = publicList;
        this.createdBy = createdBy;
    }
}
exports.TodoList = TodoList;
