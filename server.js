"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var node_fs_1 = require("node:fs");
var serverSideBuilder_1 = require("./serverSideBuilder");
function serve(_a, port) {
    var staticRoutes = _a.staticRoutes, dynamicRoutes = _a.dynamicRoutes;
    (0, http_1.createServer)(function (request, response) {
        function respondWith(htmlResponse) {
            response.statusCode = htmlResponse.code;
            response.end(htmlResponse.response);
        }
        var notFound = { code: 404, response: "" };
        if (!request.url) {
            respondWith(notFound);
            return;
        }
        var responseFile = staticRoutes.get(request.url);
        if (responseFile) {
            var response_1 = (0, node_fs_1.readFileSync)(responseFile);
            respondWith({ response: response_1, code: 200 });
            return;
        }
        var _a = getFallback(request.url), fallbackArg = _a.fallbackArg, fallbackUrl = _a.fallbackUrl;
        var dynamicResponse = dynamicRoutes.get(fallbackUrl);
        if (dynamicResponse) {
            if (!dynamicResponse.func) {
                var response_2 = (0, node_fs_1.readFileSync)(dynamicResponse.file);
                respondWith({ response: response_2, code: 200 });
                return;
            }
            var data = dynamicResponse.func(fallbackArg);
            var htmlResponse = (0, serverSideBuilder_1.default)(dynamicResponse.file, data);
            respondWith(htmlResponse);
            return;
        }
        respondWith(notFound);
    }).listen(port);
    console.log("server on and listining on port", port);
}
exports.default = serve;
function getFallback(url) {
    var pivot = url.lastIndexOf("/") + 1;
    var fallbackArg = url.slice(pivot);
    var fallbackUrl = url.slice(0, pivot) + "fallback/index.html";
    return { fallbackArg: fallbackArg, fallbackUrl: fallbackUrl };
}
