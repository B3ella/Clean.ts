"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var node_fs_1 = require("node:fs");
function serve(_a, port) {
    var staticRoutes = _a.staticRoutes, dynamicRoutes = _a.dynamicRoutes;
    port = port !== null && port !== void 0 ? port : 8080;
    (0, http_1.createServer)(function (request, response) {
        var routeExist = false;
        function respondWithPageNotFound() {
            response.statusCode = 404;
            response.end("404, nothing to see here");
        }
        function resondWithPageFound(responseEnd) {
            routeExist = true;
            response.statusCode = 200;
            response.end(responseEnd);
        }
        if (!request.url) {
            respondWithPageNotFound();
            return;
        }
        var responseFile = staticRoutes[request.url];
        if (responseFile) {
            resondWithPageFound((0, node_fs_1.readFileSync)(responseFile));
            return;
        }
        var _a = getFallback(request.url), fallbackArg = _a.fallbackArg, fallbackUrl = _a.fallbackUrl;
        var dynamicResponse = dynamicRoutes[fallbackUrl];
        if (dynamicResponse) {
            var data = dynamicResponse.func(fallbackArg);
            var htmlResponse = htmlBuilder(dynamicResponse.file, data);
            resondWithPageFound(htmlResponse);
            return;
        }
        if (!routeExist)
            respondWithPageNotFound();
    }).listen(port);
    console.log("server on and listining on port", port);
}
exports.default = serve;
function getFallback(url) {
    var pivot = url.lastIndexOf("/") + 1;
    var fallbackArg = url.slice(pivot);
    var fallbackUrl = url.slice(0, pivot) + "fallback.html";
    return { fallbackArg: fallbackArg, fallbackUrl: fallbackUrl };
}
function htmlBuilder(fileAdress, querryData) {
    var file = (0, node_fs_1.readFileSync)(fileAdress).toString();
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
