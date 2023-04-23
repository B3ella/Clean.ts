"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var Router = /** @class */ (function () {
    function Router(dir) {
        this.rootDir = dir;
        this.staticRoutes = this.routeDir(dir);
        this.dynamicRoutes = {};
    }
    Router.prototype.routeFallback = function (url, func) {
        var file = this.urlToRelativeFile(url);
        url = url + "fallback.html";
        this.dynamicRoutes[url] = { file: file, func: func };
    };
    Router.prototype.urlToRelativeFile = function (url) {
        var filePath = url.replace("/", dirDivision);
        url = this.rootDir + filePath + "fallback.html";
        return url;
    };
    Router.prototype.routeDir = function (dir) {
        var files = mapFilesIn(dir);
        var urls = files.map(function (file) { return getRoute(file, dir); });
        var routes = {};
        for (var i = 0; i < urls.length; i++) {
            var url = urls[i];
            var file = files[i];
            routes[url] = file;
        }
        return routes;
    };
    return Router;
}());
exports.default = Router;
var dirDivision = process.platform.startsWith("win") ? "\\" : "/";
function mapFilesIn(dir) {
    var items = (0, fs_1.readdirSync)(dir);
    var files = [];
    items.forEach(function (item) {
        var fullAdress = dir + dirDivision + item;
        if (isFile(item))
            files.push(fullAdress);
        else
            files.push.apply(files, mapFilesIn(fullAdress));
    });
    return files;
}
var isFile = function (adress) { return adress.includes("."); };
function getRoute(file, rootDir) {
    var relativeAdress = file.replace(rootDir, "");
    var url = formatUrl(relativeAdress);
    return url;
}
function formatUrl(url) {
    url = url.replace("\\", "/");
    url = url.includes("\\") ? formatUrl(url) : url;
    url = url.replace("index.html", "");
    return url;
}
