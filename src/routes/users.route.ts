import { Router } from "express";
import { User } from "../models/user.model";
import bcrypt from "bcrypt";
let app = Router();
let saltRounds = 10;

let userList: User[] = []

app.post("/", (req, res, next)=>{
    let emailValid = true;
    for(let u of userList){
        if(u.email == req.body.email){
            emailValid = false;
        }
    }
    if(emailValid){
        let newUser = new User();
        bcrypt.genSalt(saltRounds, (err, salt)=>{
            bcrypt.hash(req.body.password, salt, (err, hash)=>{
                newUser.id = Date.now();
                newUser.email = req.body.email;
                newUser.name = req.body.name;
                newUser.password = hash;
                userList.push(newUser);
                res.status(201).send({"id":newUser.id, "name":newUser.name, "email":newUser.email});
            })
        })
    }
    else{
        res.status(400).send({status:400, message:"Email already in use"});
    }
});

export { app }