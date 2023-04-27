"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staticBuilder = exports.htmlDynamcBuilde = void 0;
var fs_1 = require("fs");
function htmlDynamcBuilde(fileAdress, querryData) {
    var file = (0, fs_1.readFileSync)(fileAdress).toString();
    var startChar = "{{";
    var endChar = "}}";
    var numberStarts = file.split(startChar).length - 1;
    var numberOfEnds = file.split(endChar).length - 1;
    var allThatOpenCloses = numberOfEnds === numberStarts;
    if (!allThatOpenCloses)
        return "problem with server, sorry";
    var lastEnd = 0;
    for (var i = 0; i < numberStarts; i++) {
        var currStart = file.indexOf(startChar, lastEnd) + startChar.length;
        var currEnd = file.indexOf(endChar, currStart);
        var flag = file.slice(currStart, currEnd);
        var substitute = querryData[flag.trim()];
        var trigger = startChar + flag + endChar;
        file = file.replace(trigger, substitute);
    }
    return file;
}
exports.htmlDynamcBuilde = htmlDynamcBuilde;
function staticBuilder(fileObject, url) {
    var fileAdress = fileObject[url];
    var notHtml = !fileAdress.endsWith(".html");
    var isBuilt = url.includes("build");
    var nothingToBuild = !(0, fs_1.readFileSync)(fileAdress).toString().includes("{<");
    if (notHtml || isBuilt || nothingToBuild)
        return;
    var file = buildFile(fileAdress);
    var buildAdress = getBuildAdress(fileAdress);
    (0, fs_1.writeFileSync)(buildAdress, file);
    fileObject[url] = buildAdress;
}
exports.staticBuilder = staticBuilder;
function buildFile(fileAdress) {
    var file = (0, fs_1.readFileSync)(fileAdress).toString();
    var compStart = "{<";
    var compEnd = "/>}";
    var numberStarts = file.split(compStart).length - 1;
    var numberOfEnds = file.split(compEnd).length - 1;
    var sintaxError = numberOfEnds != numberStarts;
    if (sintaxError)
        return "error";
    var nothingToBuild = numberStarts == 0;
    if (nothingToBuild)
        return file;
    var lastEnd = 0;
    for (var i = 0; i < numberOfEnds; i++) {
        var currStart = file.indexOf(compStart, lastEnd) + compStart.length;
        var currEnd = file.indexOf(compEnd, currStart);
        var flag = file.slice(currStart, currEnd);
        var compontent = buildFile(getComponentAdress(flag, fileAdress));
        var trigger = compStart + flag + compEnd;
        file = file.replace(trigger, compontent);
        lastEnd = currEnd;
    }
    return file;
}
function getComponentAdress(flag, fileAdress) {
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
function getBuildAdress(fileAdress) {
    var dirPivot = fileAdress.lastIndexOf("/") + "/".length;
    var fileName = fileAdress.slice(dirPivot);
    var dirName = fileAdress.slice(0, dirPivot);
    return dirName + "build" + fileName;
}
