import { Router } from "express"
import express from "express"
import { TodoList } from "../models/todolist.model"
import { TodoListItem } from "../models/todolistitem.model";
import { AuthChecker } from "../utils/auth.utils";
import { CheckListExists } from "../utils/checkforlist.utils";
import { userList } from "./users.route";
import { User } from "../models/user.model";
let todoIds = 0;
let itemIds = 0;
let app = Router();
app.use(express.json());

let todoArray: TodoList[]=[];

app.delete("/:list_id/share/:shared_user_email?", CheckListExists, AuthChecker, (req, res)=>{
    let currentUser = res.getHeader("currentuser") as string[];
    let theListIndex = checkListExists(parseInt(req.params.list_id))
    let theTodo = todoArray[theListIndex];
    if(theTodo.created_by == parseInt(currentUser[2].split("=")[1])){
        if(req.params.shared_user_email){
            let emailExists = false;
            let sharedUserIndex = 0
            for(let u of theTodo.shared_with){
                if(u.email == req.params.shared_user_email){
                    emailExists = true;
                    break;
                }
                sharedUserIndex++;
            }
            if(emailExists){
                theTodo.shared_with.splice(sharedUserIndex, 1);
                res.status(204).send({status:204, message:"Shared list removed"});
            }
            else{
                res.status(404).send({status:404, message:"User not found"});
            }
        }
        else{
            theTodo.shared_with = [];
            res.status(204).send({status:204, message:"Shared list removed"});
        }
    }
    else{
        res.status(403).send({status:403, message:"Unauthorized"});
    }
})
app.delete("/:list_id/item/:itemId", AuthChecker, (req, res)=>{
    let theListIndex = checkListExists(parseInt(req.params.list_id));
    if(theListIndex != -1){
        let theItemIndex = checkItemExists(parseInt(req.params.list_id), parseInt(req.params.itemId));
        if(theItemIndex != -1){
            todoArray[theListIndex].list_items.splice(theItemIndex, 1);
            res.status(204).send({status:204, message:"Todo list item deleted"});
        }
        else{
            res.status(404).send({status:404, messsage:"Todo list item not found"});
        }
    }
    else{
        res.status(404).send({status:404, message:"Todo list not found"});
    }
});

app.patch("/:list_id/item/:itemId", AuthChecker, (req, res)=>{
    let theListIndex = checkListExists(parseInt(req.params.list_id));
    if(theListIndex != -1){
        let theItemIndex = checkItemExists(parseInt(req.params.list_id), parseInt(req.params.itemId));
        if(theItemIndex != -1){
            todoArray[theListIndex].list_items[theItemIndex].task = req.body.task;
            todoArray[theListIndex].list_items[theItemIndex].completed = req.body.completed;
            res.status(204).send({status:204, message:"Todo list item updated"});
        }
        else{
            res.status(404).send({status:404, message:"Todo list item not found"});
        }
    }
    else{
        res.status(404).send({status:404, message:"Todo list not found"});
    }
});
app.get("/:list_id/item/:itemId", CheckListExists, AuthChecker, (req, res)=>{
    let currentUser = res.getHeader("currentuser") as string[];
    let theListIndex = checkListExists(parseInt(req.params.list_id))
    let theTodo = todoArray[theListIndex];
    if(theTodo.created_by == parseInt(currentUser[2].split("=")[1]) ||
        theTodo.shared_with.find((user) => user["email"] == currentUser[0].split("=")[1])){
            if(theListIndex != -1){
                let theItemIndex = checkItemExists(parseInt(req.params.list_id), parseInt(req.params.itemId));
                if(theItemIndex != -1){
                    res.status(200).send(todoArray[theListIndex].list_items[theItemIndex]);
                }
                else{
                    res.status(404).send({status:404, message:"Todo list item not found"});
                }
            }
            else{
                res.status(404).send({status:404, message:"Todo list not found"});
            }
    }
    else{
        res.status(403).send({status:403, message:"Unauthorized"});
    }
    
});
app.get("/:list_id/items", AuthChecker, CheckListExists, (req, res)=>{
    let currentUser = res.getHeader("currentuser") as string[];
    let theListIndex = checkListExists(parseInt(req.params.list_id))
    let theTodo = todoArray[theListIndex];
    let itemsToShare: TodoListItem[] = [];
    if(res.hasHeader("currentuser")){
        if(parseInt(currentUser[2].split("=")[1]) == theTodo.created_by){
            res.status(200).send(theTodo.list_items);
        }
        else{
            res.status(403).send({status:403, message:"Not authorized"});
        }
    }
    else if(theTodo.shared_with.find((user) => user["email"] == currentUser[0].split("=")[1])){
        res.status(200).send(theTodo.list_items);
    }
    else{
        if(theTodo.public_list){
            res.status(200).send(theTodo.list_items);
        }
        else{
            res.status(403).send({status:403, message:"Not authorized"});
        }
    }
});

app.post("/:list_id/item", CheckListExists, AuthChecker, (req, res)=>{
    let currentUser = res.getHeader("currentuser") as string[];
    let theListIndex = checkListExists(parseInt(req.params.list_id));
    let theTodo = todoArray[theListIndex];
    if(theTodo.created_by == parseInt(currentUser[2].split("=")[1]) ||
        theTodo.shared_with.find((user) => user["email"] == currentUser[0].split("=")[1])){
            if(req.body.task){
                if(typeof req.body.completed == "boolean")
                {
                    todoArray[theListIndex].list_items.length
                    let newListItem = new TodoListItem(itemIds, req.body.task, todoArray[theListIndex].id);
                    todoArray[theListIndex].list_items.push(newListItem);
                    itemIds++;
                    res.status(201).send(newListItem);
                }
                else{
                    res.status(400).send({status:400, message:"Completed must be boolean"})
                }
            }
            else{
                res.status(400).send({status:400, message:"Task is required"});
            }
        }
    else{
        res.status(403).send({status:403, message:"Unauthorized"});
    }
});

app.post("/:list_id/share", CheckListExists, AuthChecker, (req, res)=>{
    let currentUser = res.getHeader("currentuser") as string[];
    let theListIndex = checkListExists(parseInt(req.params.list_id))
    let theTodo = todoArray[theListIndex];
    if(theTodo.created_by == parseInt(currentUser[2].split("=")[1])){
        if(req.body.email){
            let emailExists = false;
            let sharedUser: User | undefined=undefined;
            for(let u of userList){
                if(u.email == req.body.email){
                    emailExists = true;
                    sharedUser = u;
                    break;
                }
            }
            if(emailExists){
                if(sharedUser){
                    theTodo.shared_with.push({email: sharedUser.email, name: sharedUser.name});
                    res.status(201).send(theTodo);
                }
            }
            else{
                res.status(404).send({status:404, message:"Email not in system"});
            }
        }
        else{
            res.status(400).send({status:400, message:"Email must be supplied"});
        }
    }
    else{
        res.status(403).send({status:403, message:"Unauthorized"});
    }
})

app.get("/:list_id", CheckListExists, AuthChecker, (req, res)=>{
    let currentUser = res.getHeader("currentuser") as string[];
    let theListIndex = checkListExists(parseInt(req.params.list_id))
    let theTodo = todoArray[theListIndex];
    if(parseInt(currentUser[2].split("=")[1]) == theTodo.created_by){
        res.status(200).send(todoArray[theListIndex]);
    }
    else if(theTodo.shared_with.find((element) => element["email"] == currentUser[0].split("=")[1])){
        res.status(200).send({id: theTodo.id, title: theTodo.title, public_list: theTodo.public_list,
            created_by: theTodo.created_at, created_at: theTodo.created_at, list_items: theTodo.list_items})
    }
    else if(theTodo.public_list){
        res.status(200).send({id: theTodo.id, title: theTodo.title, public_list: theTodo.public_list,
            created_by: theTodo.created_at, created_at: theTodo.created_at, list_items: theTodo.list_items})
    }
    else{
        res.status(401).send({status:401, message:"Unauthorized"});
    }
});

app.delete("/:list_id", AuthChecker, CheckListExists, (req, res)=>{
    let currentUser = res.getHeader("currentuser") as string[];
    let theListIndex = checkListExists(parseInt(req.params.list_id));
    let theTodo = todoArray[theListIndex];
    if(theTodo.created_by == parseInt(currentUser[2].split("=")[1])){
        todoArray.splice(theListIndex, 1);
        res.status(204).send({status:204, message:"Todo list deleted"});
    }
    else{
        res.status(403).send({status:403, message:"Not authorized to delete todo list"});
    }
});

app.patch("/:list_id", AuthChecker, CheckListExists, (req, res)=>{
    let currentUser = res.getHeader("currentuser") as string[];
    let theListIndex = checkListExists(parseInt(req.params.list_id))
    let theTodo = todoArray[theListIndex];
    if(theTodo.created_by == parseInt(currentUser[2].split("=")[1]) || theTodo.shared_with.find((element) => element["email"] == currentUser[0].split("=")[1])){
        if(req.body.title){
            console.log("title exists")
            let theListIndex = checkListExists(parseInt(req.params.list_id))
            if(theListIndex != -1){
                todoArray[theListIndex].title = req.body.title;
                res.status(204).send({status:204, message:"Todo list updated"});
            }
            else{
                console.log("todo doesnt exist")
                res.status(404).send({status:404, message:"Todo list not found"});
            }
        }
        else{
            res.status(400).send({status:400, message:"Title is required"});
        }
    }
    else{
        res.status(403).send({status:403, message:"Unauthorized"});
    }
});

app.get("/", AuthChecker, (req, res)=>{
    let todosToShow: TodoList[]=[];
    if(res.hasHeader("currentuser")){
        let currentUser = res.getHeader("currentuser") as string[];
        for(let todo of todoArray){
            if(todo.created_by == parseInt(currentUser[2].split("=")[1])){
                todosToShow.push(todo);
            }
            else if(todo.shared_with.find((element) => element["email"] == currentUser[0].split("=")[1])){
                todosToShow.push(todo);
            }
            else if(todo.public_list){
                todosToShow.push(todo);
            }
        }
    }
    else{
        for(let todo of todoArray){
            if(todo.public_list){
                todosToShow.push(todo);
            }
        }
    }
    let formattedTodos = todosToShow.map(({id, title, created_at, created_by, public_list})=>({
        id,
        title,
        created_at,
        created_by, 
        public_list
    }));
    res.status(200).send(formattedTodos);
});

app.post("/", AuthChecker, (req, res)=>{
    if(req.body.title){
        let loggedInUserInfo = res.getHeader("currentuser") as string[];
        let title = req.body.title;
        let newTodoList = new TodoList(todoIds, title, req.body.public_list, parseInt(loggedInUserInfo[2].split("=")[1]));
        todoArray.push(newTodoList);
        todoIds++;
        //console.log(newTodoList.shared_with[0][0])
        res.status(201).send({id: newTodoList.id, title: newTodoList.title, created_at: newTodoList.created_at,
            public_list: newTodoList.public_list, created_by: newTodoList.created_by, list_items: newTodoList.list_items});
    }
    else{
        res.status(400).send({status:400, message:"Title is required"});
    }
});

function checkItemExists(listId: number, id: number){
    let list = todoArray.find(i => i.id === listId)
    if(list){
        let itemIndex = 0
        for(let item of list.list_items){
            if(item.id == id){
                return itemIndex;
            }
            itemIndex++;
        }
        return -1
    }
    return -1
}
function checkListExists(id: number){
    let index = 0
    for(let list of todoArray){
        if(list.id == id){
            return index;
        }
        index++;
    }
    return -1
}
export { app, todoArray }