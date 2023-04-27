"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var node_fs_1 = require("node:fs");
var builder_1 = require("./builder");
var router_1 = require("./router");
var Server = /** @class */ (function () {
    function Server(dir, port) {
        this.port = port !== null && port !== void 0 ? port : 8080;
        this.rootDir = dir;
        var _a = this.routeDir(), staticRoutes = _a.staticRoutes, urls = _a.urls;
        urls.forEach(function (url) { return (0, builder_1.staticBuilder)(staticRoutes, url); });
        this.urls = urls;
        this.staticRoutes = staticRoutes;
        this.dynamicRoutes = {};
    }
    Server.prototype.routeDir = function () {
        var _this = this;
        var files = (0, router_1.mapFilesIn)(this.rootDir);
        var urls = files.map(function (file) { return _this.getRoute(file); });
        var routes = {};
        for (var i = 0; i < urls.length; i++) {
            var url = urls[i];
            var file = files[i];
            routes[url] = file;
        }
        return { staticRoutes: routes, urls: urls };
    };
    Server.prototype.getRoute = function (file) {
        var relativeAdress = file.replace(this.rootDir, "");
        return relativeAdress.replace("index.html", "");
    };
    Server.prototype.routeFallback = function (url, func) {
        url = url + "/fallback.html";
        var file = this.rootDir + url;
        this.dynamicRoutes[url] = { file: file, func: func };
    };
    Server.prototype.serve = function () {
        var _a = this, staticRoutes = _a.staticRoutes, dynamicRoutes = _a.dynamicRoutes;
        serve({ staticRoutes: staticRoutes, dynamicRoutes: dynamicRoutes }, this.port);
    };
    return Server;
}());
exports.default = Server;
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
            var htmlResponse = (0, builder_1.htmlDynamcBuilde)(dynamicResponse.file, data);
            resondWithPageFound(htmlResponse);
            return;
        }
        if (!routeExist)
            respondWithPageNotFound();
    }).listen(port);
    console.log("server on and listining on port", port);
}
function getFallback(url) {
    var pivot = url.lastIndexOf("/") + 1;
    var fallbackArg = url.slice(pivot);
    var fallbackUrl = url.slice(0, pivot) + "fallback.html";
    return { fallbackArg: fallbackArg, fallbackUrl: fallbackUrl };
}
