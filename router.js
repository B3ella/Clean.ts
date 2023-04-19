"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var http_1 = require("http");
function routeDir(dirAdress, port) {
    var files = mapFileRoutes(dirAdress);
    var routes = files.map(function (file) { return getRoute(file, dirAdress); });
    routeFiles(routes, port);
}
exports.default = routeDir;
function mapFileRoutes(dir) {
    var items = (0, fs_1.readdirSync)(dir);
    var files = [];
    items.forEach(function (item) {
        var dirDivision = process.platform.startsWith("win") ? "\\" : "/";
        var fullAdress = dir + dirDivision + item;
        if (isFile(item))
            files.push(fullAdress);
        else
            files.push.apply(files, mapFileRoutes(fullAdress));
    });
    return files;
}
var isFile = function (adress) { return adress.includes("."); };
function getRoute(fileAbsolutAdress, rootDir) {
    var relativeAdress = fileAbsolutAdress.replace(rootDir, "");
    var urlRelativeAdress = formatUrl(relativeAdress);
    return { fileAbsolutAdress: fileAbsolutAdress, urlRelativeAdress: urlRelativeAdress };
}
function formatUrl(url) {
    url = url.replace("\\", "/");
    url = url.includes("\\") ? formatUrl(url) : url;
    url = url.replace("index.html", "");
    return url;
}
function routeFiles(routes, port) {
    port = port !== null && port !== void 0 ? port : 8080;
    (0, http_1.createServer)(function (request, response) {
        var routeExist = false;
        routes.forEach(function (route) {
            if (request.url == route.urlRelativeAdress) {
                routeExist = true;
                response.statusCode = 200;
                response.end((0, fs_1.readFileSync)(route.fileAbsolutAdress));
            }
        });
        if (!routeExist) {
            response.statusCode = 404;
            response.end("404, nothing to see here");
        }
    }).listen(port);
    console.log("server on and listining on port", port);
}
