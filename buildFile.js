"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
function buildFile(fileAdress, file) {
    file = file !== null && file !== void 0 ? file : (0, fs_1.readFileSync)(fileAdress).toString();
    if (nothingToBuild(file))
        return file;
    var compontentElement = getComponentElement(file);
    var compontent = buildComponent(compontentElement, fileAdress);
    file = file.replace(compontentElement, compontent);
    return buildFile(fileAdress, file);
}
exports.default = buildFile;
function nothingToBuild(file) {
    var noOpen = !file.includes("{<div");
    var noClose = !file.includes("/>}");
    return noOpen || noClose;
}
function getComponentElement(file) {
    var compStart = "{<div";
    var compEnd = "/>}";
    var compStartIndex = file.indexOf(compStart);
    var compEndIndex = file.indexOf(compEnd, compStartIndex) + compEnd.length;
    var element = file.slice(compStartIndex, compEndIndex);
    return element;
}
function buildComponent(element, addrs) {
    var atributes = isAutoClose(element)
        ? getAtributes(element)
        : getAtributesWithChildren(element);
    var src = getDirAdress(addrs) + getSrc(element);
    var compontent = (0, fs_1.readFileSync)(src).toString();
    var compontentBody = getHeadAndBody(compontent).body;
    compontent = mountComponent(compontentBody, atributes);
    return buildFile(addrs, compontent);
}
//To-do
function isAutoClose(element) {
    return true;
}
//To-do
function getAtributes(element) {
    return new Map();
}
//To-do
function getAtributesWithChildren(element) {
    return new Map();
}
function getDirAdress(fileAddress) {
    var dirPivot = fileAddress.lastIndexOf("/") + "/".length;
    var dirAddress = fileAddress.slice(0, dirPivot);
    return dirAddress;
}
function getSrc(element) {
    var srcFlag = 'src="';
    var srcStart = element.indexOf(srcFlag) + srcFlag.length;
    var srcEnd = element.indexOf('"', srcStart);
    return element.slice(srcStart, srcEnd);
}
function getHeadAndBody(compontent) {
    var containHead = compontent.includes("<head>");
    var head = containHead ? getElement(compontent, "head") : undefined;
    var containBody = compontent.includes("<body>");
    var body = containBody ? getElement(compontent, "body") : compontent;
    return { head: head, body: body };
}
function getElement(compontent, elementName) {
    var elementOpenTag = "<".concat(elementName, ">");
    var elementCloseTag = "</".concat(elementName, ">");
    var elementStart = compontent.indexOf(elementOpenTag) + elementOpenTag.length;
    var elementEnd = compontent.indexOf(elementCloseTag);
    return compontent.slice(elementStart, elementEnd);
}
function mountComponent(compontent, atributes) {
    var _a;
    var nothingToBuild = noAtributesNecessary(compontent);
    if (nothingToBuild)
        return compontent;
    var _b = getFirstAtribute(compontent), atribute = _b.atribute, trigger = _b.trigger;
    var value = (_a = atributes.get(atribute)) !== null && _a !== void 0 ? _a : "";
    compontent = compontent.replace(trigger, value);
    return mountComponent(compontent, atributes);
}
function noAtributesNecessary(compontent) {
    var noOpen = !compontent.includes("{{");
    var noClose = !compontent.includes("}}");
    return noOpen || noClose;
}
function getFirstAtribute(compontent) {
    var start = compontent.indexOf("{{") + 2;
    var end = compontent.indexOf("}}");
    var atribute = compontent.slice(start, end);
    var trigger = "{{".concat(atribute, "}}");
    return { atribute: atribute, trigger: trigger };
}
