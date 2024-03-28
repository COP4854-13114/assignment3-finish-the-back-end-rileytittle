"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const todolist_route_1 = require("./routes/todolist.route");
const users_route_1 = require("./routes/users.route");
let app = (0, express_1.default)();
app.use(express_1.default.json());
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
app.use("/user", users_route_1.app);
app.use("/todo", todolist_route_1.app);
app.listen(3000);
