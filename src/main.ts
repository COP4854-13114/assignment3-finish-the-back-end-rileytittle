import express from "express";
import jwt from "jsonwebtoken";
import { app as TodoRouter } from "./routes/todolist.route"
import { app as UserRouter } from "./routes/users.route"
import { AuthChecker } from "./utils/auth.utils";

let app = express();
app.use(express.json());
/*
app.use("/", (req, res, next)=>{
    if(req.headers["authorization"]){
        if(req.headers["authorization"].includes("Bearer")){
            let token = req.headers["authorization"].split(" ")[1];
            try{
                let tokenContent = jwt.verify(token, "SUPERKEY") as any;
                res.setHeader("currentuser", tokenContent.email)
                next();
            }
            catch(e){
                res.status(401).send({status:401, message:"Unauthorized"});
            }
        }
        else if(req.headers["authorization"].includes("Basic") && req.url == "/user/login"){
            console.log("SEcond branch entered")
            next();
        }
        else{
            console.log("Failed where you think")
            res.status(401).send({status:401, message:"Unauthorized"});
        }
    }
    else{
        next();
    }
})
 */
app.use("/user", UserRouter);
app.use("/todo", TodoRouter);
app.listen(3000);