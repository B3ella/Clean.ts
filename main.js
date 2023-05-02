"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("./router");
var router = new router_1.default("public");
function back(str) {
    return new Map().set("name", str).set("verb", "do");
}
router.routeFallback("", back);
router.routeFallback("/pasta");
router.serve();
