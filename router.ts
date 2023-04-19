import { readFileSync, readdirSync } from "fs";
import { createServer } from "http";

interface Iroute {
	fileAbsolutAdress: string;
	urlRelativeAdress: string;
}

export default function routeDir(dirAdress: string, port?: number) {
	const files = mapFileRoutes(dirAdress);

	const routes = files.map((file) => getRoute(file, dirAdress));

	routeFiles(routes, port);
}

function mapFileRoutes(dir: string) {
	const items = readdirSync(dir);
	const files: string[] = [];

	items.forEach((item) => {
		const dirDivision = process.platform.startsWith("win") ? "\\" : "/";
		const fullAdress = dir + dirDivision + item;

		if (isFile(item)) files.push(fullAdress);
		else files.push(...mapFileRoutes(fullAdress));
	});

	return files;
}

const isFile = (adress: string) => adress.includes(".");

function getRoute(fileAbsolutAdress: string, rootDir: string): Iroute {
	const relativeAdress = fileAbsolutAdress.replace(rootDir, "");
	const urlRelativeAdress = formatUrl(relativeAdress);

	return { fileAbsolutAdress, urlRelativeAdress };
}

function formatUrl(url: string): string {
	url = url.replace("\\", "/");
	url = url.includes("\\") ? formatUrl(url) : url;

	url = url.replace("index.html", "");

	return url;
}

function routeFiles(routes: Iroute[], port?: number) {
	port = port ?? 8080;
	createServer((request, response) => {
		let routeExist = false;

		routes.forEach((route) => {
			if (request.url == route.urlRelativeAdress) {
				routeExist = true;
				response.statusCode = 200;
				response.end(readFileSync(route.fileAbsolutAdress));
			}
		});

		if (!routeExist) {
			response.statusCode = 404;
			response.end("404, nothing to see here");
		}
	}).listen(port);

	console.log("server on and listining on port", port);
}
