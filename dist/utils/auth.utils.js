"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthChecker = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let AuthChecker = (req, res, next) => {
    if (req.headers["authorization"]) {
        if (req.headers["authorization"].includes("Bearer")) {
            let token = req.headers["authorization"].split(" ")[1];
            try {
                let tokenContent = jsonwebtoken_1.default.verify(token, "SUPERKEY");
                res.setHeader("currentuser", ["email=" + tokenContent.email, "name=" + tokenContent.name, "id=" + tokenContent.id]);
                next();
            }
            catch (e) {
                res.status(401).send({ status: 401, message: "Unauthorized" });
            }
        }
        else if (req.headers["authorization"].includes("Basic") && req.url == "/login") {
            next();
        }
        else {
            res.status(401).send({ status: 401, message: "Unauthorized" });
        }
    }
    else if (req.originalUrl == "/todo/:list_id/item/:itemId" && req.method == "GET") {
        res.status(403).send({ status: 403, message: "Unauthorized" });
    }
    else if (req.originalUrl == "/todo/" && req.method == "GET") {
        next();
    }
    else if (req.originalUrl == "/todo/:list_id/items" && req.method == "GET") {
        next();
    }
    else {
        console.log(req.originalUrl);
        res.status(401).send({ status: 401, message: "Unauthorized" });
    }
};
exports.AuthChecker = AuthChecker;
