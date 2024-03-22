export class TodoListItem{
    id: number;
    task: string;
    completed: boolean;
    completed_date: Date | undefined;
    created_at: Date;
    updated_at: Date;
    due_date: Date | undefined;
    list_id: number
    completed_by_user: {email: string, name: string} | undefined;
    constructor(id: number, task: string, list_id: number){
        this.id = id;
        this.task = task;
        this.list_id = list_id;
        this.created_at = new Date();
        this.updated_at = new Date();
        this.completed = false;
    }
}