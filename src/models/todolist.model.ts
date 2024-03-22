import { TodoListItem } from "./todolistitem.model";

export class TodoList{
    id: number;
    title: string;
    created_at: Date;
    public_list: boolean;
    created_by: number;
    list_items: TodoListItem[] = [];
    shared_with: {email: string, name: string}[] = [];
    constructor(id: number, title: string, public_list: boolean, created_by: number){
        this.id = id;
        this.title = title;
        this.created_at = new Date();
        this.public_list = public_list;
        this.created_by = created_by;
    }
}