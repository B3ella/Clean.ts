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
function staticBuilder(fileObject, url, dirDiv) {
    var fileAdress = fileObject[url];
    var notHtml = !fileAdress.endsWith(".html");
    if (notHtml)
        return;
    var file = (0, fs_1.readFileSync)(fileAdress).toString();
    var componentStart = "{<";
    var componentEnd = "/>}";
    var numberStarts = file.split(componentStart).length - 1;
    var numberOfEnds = file.split(componentEnd).length - 1;
    var sintaxError = numberOfEnds != numberStarts;
    var nothingToBuild = numberStarts == 0;
    if (sintaxError || nothingToBuild)
        return;
    var lastEnd = 0;
    for (var i = 0; i < numberOfEnds; i++) {
        var currStart = file.indexOf(componentStart, lastEnd) + componentStart.length;
        var currEnd = file.indexOf(componentEnd, currStart);
        var flag = file.slice(currStart, currEnd);
        var compontent = getComponent(flag);
        var trigger = componentStart + flag + componentEnd;
        file = file.replace(trigger, compontent);
        lastEnd = currEnd;
    }
    var dirPivot = fileAdress.lastIndexOf(dirDiv) + dirDiv.length;
    var fileName = fileAdress.slice(dirPivot);
    var dirName = fileAdress.slice(0, dirPivot);
    var buildAdress = dirName + "build" + fileName;
    (0, fs_1.writeFileSync)(buildAdress, file);
    fileObject[url] = buildAdress;
    function getComponent(flag) {
        var src = getSrc(flag);
        var dirPivot = fileAdress.lastIndexOf(dirDiv) + dirDiv.length;
        var dir = fileAdress.slice(0, dirPivot);
        var componentAdress = dir + src;
        return (0, fs_1.readFileSync)(componentAdress).toString();
    }
    function getSrc(flag) {
        var srcFlag = 'src="';
        var srcStart = flag.indexOf(srcFlag) + srcFlag.length;
        var srcEnd = flag.indexOf('"', srcStart);
        return flag.slice(srcStart, srcEnd);
    }
}
exports.staticBuilder = staticBuilder;
