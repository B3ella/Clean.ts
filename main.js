"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("./server");
var dirName = __dirname + "\\public";
var server = new server_1.default(dirName);
function back(str) {
    return { name: str, verb: "do" };
}
server.routeFallback("/", back);
server.serve();
