"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
function staticBuilder(fileAdress) {
    if (!fileAdress || nothingToBuild(fileAdress))
        return fileAdress;
    var buildAdress = getBuildAddress(fileAdress);
    var file = buildFile(fileAdress);
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
function buildFile(fileAdress, file) {
    file = file !== null && file !== void 0 ? file : readToString(fileAdress);
    var compStart = "{<div";
    var compEnd = "/>}";
    var hasComponent = file.includes(compStart) && file.includes(compEnd);
    if (!hasComponent)
        return file;
    var flag = getComponentFlag(file, { compEnd: compEnd, compStart: compStart });
    var compontentAddress = getComponentAddress(flag, fileAdress);
    var compontent = buildFile(compontentAddress);
    var trigger = compStart + flag + compEnd;
    file = file.replace(trigger, compontent);
    return buildFile(fileAdress, file);
}
function getComponentFlag(file, _a) {
    var compStart = _a.compStart, compEnd = _a.compEnd;
    var compStartIndex = file.indexOf(compStart) + compStart.length;
    var compEndIndex = file.indexOf(compEnd, compStartIndex);
    var flag = file.slice(compStartIndex, compEndIndex);
    return flag;
}
function getComponentAddress(flag, fileAdress) {
    var src = getSrc(flag);
    var dirPivot = fileAdress.lastIndexOf("/") + "/".length;
    var dir = fileAdress.slice(0, dirPivot);
    var componentAdress = dir + src;
    return componentAdress;
}
function getSrc(flag) {
    var srcFlag = 'src="';
    var srcStart = flag.indexOf(srcFlag) + srcFlag.length;
    var srcEnd = flag.indexOf('"', srcStart);
    return flag.slice(srcStart, srcEnd);
}
