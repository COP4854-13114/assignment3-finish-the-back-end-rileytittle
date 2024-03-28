export class TodoListItem{
    id: number;
    task: string;
    completed: boolean;
    completed_date: Date | null=null;
    created_at: Date;
    updated_at: Date;
    due_date: Date;
    list_id: number;
    completed_by: number | null=null;
    completed_by_user: {email: string, name: string} | null=null;
    constructor(id: number, task: string, list_id: number, due_date: Date){
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