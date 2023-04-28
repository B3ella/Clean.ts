"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("./server");
var server = new server_1.default("public");
function back(str) {
    return { name: str, verb: "do" };
}
server.routeFallback("", back);
server.serve();
