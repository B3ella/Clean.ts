"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("./server");
var router_1 = require("./router");
var dirName = __dirname + "\\public";
var router = new router_1.default(dirName);
function back(str) {
    return { name: str, verb: "do" };
}
router.routeFallback(dirName + "\\fallback.html", "/", back);
router.routes ? (0, server_1.default)(router.routes, 8080) : null;
