"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceAllOnFor = exports.formatUrl = exports.isFile = exports.mapFilesIn = exports.dirDivision = void 0;
var fs_1 = require("fs");
var dirDivision = process.platform.startsWith("win") ? "\\" : "/";
exports.dirDivision = dirDivision;
function mapFilesIn(dir) {
    var items = (0, fs_1.readdirSync)(dir);
    var files = [];
    items.forEach(function (item) {
        var fullAdress = dir + dirDivision + item;
        if (isFile(item))
            files.push(fullAdress);
        else
            files.push.apply(files, mapFilesIn(fullAdress));
    });
    return files;
}
exports.mapFilesIn = mapFilesIn;
function isFile(adress) {
    return adress.includes(".");
}
exports.isFile = isFile;
function formatUrl(url) {
    url = replaceAllOnFor("\\", url, "/");
    return url.replace("index.html", "");
}
exports.formatUrl = formatUrl;
function replaceAllOnFor(t, str, sub) {
    if (t == sub)
        return str;
    str = str.replace(t, sub);
    return str.includes(t) ? replaceAllOnFor(t, str, sub) : str;
}
exports.replaceAllOnFor = replaceAllOnFor;
