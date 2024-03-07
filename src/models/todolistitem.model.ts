export class TodoListItem{
    id: number;
    task: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
    constructor(id: number, task: string){
        this.id = id;
        this.task = task;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.completed = false;
    }
}