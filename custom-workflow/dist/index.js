"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
console.log("Start");
fs_1.default.readdir("./", { recursive: true, withFileTypes: true }, (err, files) => {
    if (err)
        console.log("Error occured reading file");
    files.forEach((fileEntry) => {
        console.log("Name: " + fileEntry.name, "Path : " + fileEntry.parentPath);
    });
});
