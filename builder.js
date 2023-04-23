"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.htmlDynamcBuilde = void 0;
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
function staticBuilder() { }
