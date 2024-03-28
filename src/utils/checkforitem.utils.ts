import { Request, Response, NextFunction } from "express";
import { TodoList } from "../models/todolist.model";
import { todoArray } from "../routes/todolist.route";

let CheckItemExists = (req: Request, res: Response, next: NextFunction)=>{
    let listId = parseInt(req.params.list_id);
    let id = parseInt(req.params.itemId);
    let itemNotFound = true;
    let list = todoArray.find(i => i.id === listId)
    if(list){
        let itemIndex = 0
        for(let item of list.list_items){
            if(item.id == id){
                itemNotFound = false;
            }
            itemIndex++;
        }
        if(itemNotFound){
            res.status(404).send({status:404, message:"Item not found"});
        }
        else{
            next();
        }
    }
    if(itemNotFound){
        res.status(404).send({status:404, message:"Item not found"});
    }
    else{
        next();
    }
}

export { CheckItemExists }