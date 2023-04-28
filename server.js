"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStringHashmap = void 0;
var http_1 = require("http");
var node_fs_1 = require("node:fs");
var serverSideBuilder_1 = require("./serverSideBuilder");
function serve(_a, port) {
    var staticRoutes = _a.staticRoutes, dynamicRoutes = _a.dynamicRoutes;
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
            var htmlResponse = (0, serverSideBuilder_1.default)(dynamicResponse.file, data);
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
function createStringHashmap(keys, values) {
    var hashmap = {};
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var value = values[i];
        hashmap[key] = value;
    }
    return hashmap;
}
exports.createStringHashmap = createStringHashmap;
