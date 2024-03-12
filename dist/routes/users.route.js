"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = require("express");
const user_model_1 = require("../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
let app = (0, express_1.Router)();
exports.app = app;
let saltRounds = 10;
let userList = [];
app.post("/", (req, res, next) => {
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
