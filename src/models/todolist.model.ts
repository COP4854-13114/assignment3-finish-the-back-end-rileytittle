import { TodoListItem } from "./todolistitem.model";

export class TodoList{
    id: number;
    title: string;
    createdAt: Date;
    listItems: TodoListItem[] = []
    constructor(id: number, title: string){
        this.id = id;
        this.title = title;
        this.createdAt = new Date();
    }
}