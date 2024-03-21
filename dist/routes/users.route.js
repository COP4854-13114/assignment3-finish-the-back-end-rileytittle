"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = require("express");
const user_model_1 = require("../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_utils_1 = require("../utils/auth.utils");
let app = (0, express_1.Router)();
exports.app = app;
let saltRounds = 10;
let userList = [];
app.post("/login", auth_utils_1.AuthChecker, (req, res, next) => {
    //console.log(userList);
    //console.log("Login entered")
    if (req.headers["authorization"]) {
        let userInfo = req.headers["authorization"].split(" ")[1];
        let decodedInfo = atob(userInfo);
        let userEmail = decodedInfo.split(":")[0];
        let userPassword = decodedInfo.split(":")[1];
        let currentUser = undefined;
        for (let u of userList) {
            if (u.email == userEmail) {
                currentUser = u;
            }
        }
        if (currentUser) {
            bcrypt_1.default.compare(userPassword, currentUser.password, (err, result) => {
                if (result) {
                    let token = jsonwebtoken_1.default.sign({ email: currentUser?.email, name: currentUser?.name, id: currentUser?.id }, "SUPERKEY");
                    res.status(200).send({ token: token });
                }
                else {
                    console.log("second if failed");
                    res.status(401).send({ status: 401, message: "Not authorized" });
                }
            });
        }
        else {
            //console.log("third if failed");
            res.status(401).send({ status: 401, message: "Not authorized" });
        }
    }
    else {
        //console.log("first if failed");
        res.status(401).send({ status: 401, message: "Not authorized" });
    }
});
app.patch("/", auth_utils_1.AuthChecker, (req, res, next) => {
    let emailValid = true;
    //console.log(res.getHeader("currentuser"))
    //console.log(loggedInUserInfo)
    let loggedInUserInfo = res.getHeader("currentuser");
    let loggedInUser = userList.find((user) => user.email == loggedInUserInfo[0].split("=")[1]);
    if (req.body.email) {
        for (let u of userList) {
            if (u.email == req.body.email) {
                emailValid = false;
            }
        }
        if (emailValid) {
            if (loggedInUser) {
                loggedInUser.email = req.body.email;
            }
        }
        else {
            res.status(400).send({ status: 400, message: "Email already in use" });
        }
    }
    if (req.body.password) {
        bcrypt_1.default.genSalt(saltRounds, (err, salt) => {
            bcrypt_1.default.hash(req.body.password, salt, (err, hash) => {
                if (loggedInUser) {
                    loggedInUser.password = hash;
                }
            });
        });
    }
    if (req.body.name) {
        if (loggedInUser) {
            loggedInUser.name = req.body.name;
        }
    }
    res.status(200).send({ id: loggedInUser?.id, name: loggedInUser?.name, email: loggedInUser?.email });
    //console.log(res.getHeader("currentuser")) use this to access email
});
app.post("/", (req, res, next) => {
    //console.log("Actually post a user")
    let emailValid = true;
    for (let u of userList) {
        if (u.email == req.body.email) {
            emailValid = false;
        }
    }
    if (emailValid) {
        let newUser = new user_model_1.User();
        bcrypt_1.default.genSalt(saltRounds, (err, salt) => {
            bcrypt_1.default.hash(req.body.password, salt, (err, hash) => {
                newUser.id = Date.now();
                newUser.email = req.body.email;
                newUser.name = req.body.name;
                newUser.password = hash;
                userList.push(newUser);
                res.status(201).send({ "id": newUser.id, "name": newUser.name, "email": newUser.email });
            });
        });
    }
    else {
        res.status(400).send({ status: 400, message: "Email already in use" });
    }
});
