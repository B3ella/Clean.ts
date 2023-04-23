import { readdirSync } from "fs";
import type { IDynamicRoutes, StringHashmap } from "./builder";

export default class Router {
	staticRoutes: StringHashmap;
	dynamicRoutes: IDynamicRoutes;
	rootDir: string;

	constructor(dir: string) {
		this.rootDir = dir;
		this.staticRoutes = this.routeDir(dir);
		this.dynamicRoutes = {};
	}

	routeFallback(url: string, func: (arg: string) => StringHashmap) {
		const file = this.urlToRelativeFile(url);

		url = url + "fallback.html";

		this.dynamicRoutes[url] = { file, func };
	}

	urlToRelativeFile(url: string) {
		const filePath = url.replace("/", dirDivision);

		url = this.rootDir + filePath + "fallback.html";

		return url;
	}

	private routeDir(dir: string) {
		const files = mapFilesIn(dir);
		const urls = files.map((file) => getRoute(file, dir));

		const routes = {} as StringHashmap;

		for (let i = 0; i < urls.length; i++) {
			const url = urls[i];
			const file = files[i];

			routes[url] = file;
		}

		return routes;
	}
}

const dirDivision = process.platform.startsWith("win") ? "\\" : "/";

function mapFilesIn(dir: string) {
	const items = readdirSync(dir);
	const files: string[] = [];

	items.forEach((item) => {
		const fullAdress = dir + dirDivision + item;

		if (isFile(item)) files.push(fullAdress);
		else files.push(...mapFilesIn(fullAdress));
	});

	return files;
}

const isFile = (adress: string) => adress.includes(".");

function getRoute(file: string, rootDir: string) {
	const relativeAdress = file.replace(rootDir, "");
	const url = formatUrl(relativeAdress);

	return url;
}

function formatUrl(url: string): string {
	url = url.replace("\\", "/");
	url = url.includes("\\") ? formatUrl(url) : url;

	url = url.replace("index.html", "");

	return url;
}
