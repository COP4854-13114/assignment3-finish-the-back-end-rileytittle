export class TodoListItem{
    id: number;
    task: string;
    completed: boolean;
    created_at: Date;
    updatedAt: Date;
    constructor(id: number, task: string){
        this.id = id;
        this.task = task;
        this.created_at = new Date();
        this.updatedAt = new Date();
        this.completed = false;
    }
}