import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

let AuthChecker = (req: Request, res: Response, next: NextFunction)=>{
    if(req.headers["authorization"]){
        if(req.headers["authorization"].includes("Bearer")){
            let token = req.headers["authorization"].split(" ")[1];
            try{
                let tokenContent = jwt.verify(token, "SUPERKEY") as any;
                res.setHeader("currentuser", ["email="+tokenContent.email, "name="+tokenContent.name, "id="+tokenContent.id]);
                next();
            }
            catch(e){
                res.status(401).send({status:401, message:"Unauthorized"});
            }
        }
        else if(req.headers["authorization"].includes("Basic") && req.url == "/login"){
            next();
        }
        else{
            res.status(401).send({status:401, message:"Unauthorized"});
        }
    }
    else if(req.originalUrl == "/todo/" && req.method == "GET"){
        next();
    }
    else{
        res.status(401).send({status:401, message:"Unauthorized"});
    }
}

export { AuthChecker }