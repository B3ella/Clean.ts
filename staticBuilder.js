"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var buildFile_1 = require("./buildFile");
function staticBuilder(fileAdress) {
    if (!fileAdress || nothingToBuild(fileAdress))
        return fileAdress;
    var buildAdress = getBuildAddress(fileAdress);
    var file = (0, buildFile_1.default)(fileAdress);
    (0, fs_1.writeFileSync)(buildAdress, file);
    return buildAdress;
}
exports.default = staticBuilder;
function nothingToBuild(fileAdress) {
    var notHtml = !fileAdress.endsWith(".html");
    var isBuilt = fileAdress.includes("build");
    if (notHtml || isBuilt)
        return true;
    var noComponents = !readToString(fileAdress).includes("{<");
    return noComponents;
}
function readToString(fileAdress) {
    return (0, fs_1.readFileSync)(fileAdress).toString();
}
function getBuildAddress(fileAdress) {
    var dirPivot = fileAdress.lastIndexOf("/") + "/".length;
    var fileName = fileAdress.slice(dirPivot);
    var dirName = fileAdress.slice(0, dirPivot);
    return dirName + "build" + fileName;
}
