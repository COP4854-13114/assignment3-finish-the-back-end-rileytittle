import { TodoListItem } from "./todolistitem.model";

export class TodoList{
    id: number;
    title: string;
    createdAt: Date;
    publicList: boolean;
    createdBy: number;
    listItems: TodoListItem[] = [];
    sharedWith: [string, string][] = [];
    constructor(id: number, title: string, publicList: boolean, createdBy: number){
        this.id = id;
        this.title = title;
        this.createdAt = new Date();
        this.publicList = publicList;
        this.createdBy = createdBy;
    }
}