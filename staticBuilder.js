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
    var compontentBody = getHeadAndBody(compontent).body;
    var trigger = compStart + flag + compEnd;
    file = file.replace(trigger, compontentBody);
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
function getHeadAndBody(compontent) {
    var containHead = compontent.includes("<head>");
    var head = containHead ? getHead(compontent) : undefined;
    var containBody = compontent.includes("<body>");
    var body = containBody ? getBody(compontent) : compontent;
    return { head: head, body: body };
}
function getHead(compontent) {
    var headStart = compontent.indexOf("<head>") + "<head>".length;
    var headEnd = compontent.indexOf("</head>");
    return compontent.slice(headStart, headEnd);
}
function getBody(compontent) {
    var bodyStart = compontent.indexOf("<body>") + "<body>".length;
    var bodyEnd = compontent.indexOf("</body>");
    return compontent.slice(bodyStart, bodyEnd);
}
