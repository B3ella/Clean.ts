"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
function mapFilesIn(dir) {
    var items = (0, fs_1.readdirSync)(dir);
    var files = [];
    items.forEach(function (item) {
        var fullAdress = dir + "/" + item;
        if (isFile(item))
            files.push(fullAdress);
        else
            files.push.apply(files, mapFilesIn(fullAdress));
    });
    return files;
}
exports.default = mapFilesIn;
function isFile(adress) {
    return adress.includes(".");
}
