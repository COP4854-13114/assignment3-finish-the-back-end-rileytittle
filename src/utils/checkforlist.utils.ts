import { Request, Response, NextFunction } from "express";
import { TodoList } from "../models/todolist.model";
import { todoArray } from "../routes/todolist.route";

let CheckListExists = (req:Request, res:Response, next:NextFunction) => {
    let id = parseInt(req.params.list_id);
    let index = 0
    let listNotFound = true;
    for(let list of todoArray){
        if(list.id == id){
            res.setHeader("listid", id);
            listNotFound = false;
        }
        index++;
    }
    if(listNotFound){
        res.status(404).send({status:404, message:"List not found"});
    }
    else{
        next();
    }
};

export { CheckListExists }