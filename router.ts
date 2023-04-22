import { readdirSync } from "fs";
import type { Iroute } from "./server";

export default class Router {
	routes: Iroute[] | undefined;

	routeFallback(file: string, url: string, func: (arg: string) => object) {
		url = url + "fallback.html";

		const route = { file, url, backendFunc: func } as Iroute;

		this.routes = this.routes ? [...this.routes, route] : [route];
	}

	routeDir(dir: string) {
		const files = mapFilesIn(dir);
		const routes = files.map((file) => getRoute(file, dir));

		this.routes = this.routes ? [...this.routes, ...routes] : routes;
	}
}

function mapFilesIn(dir: string) {
	const items = readdirSync(dir);
	const files: string[] = [];

	items.forEach((item) => {
		const dirDivision = process.platform.startsWith("win") ? "\\" : "/";
		const fullAdress = dir + dirDivision + item;

		if (isFile(item)) files.push(fullAdress);
		else files.push(...mapFilesIn(fullAdress));
	});

	return files;
}

const isFile = (adress: string) => adress.includes(".");

function getRoute(file: string, rootDir: string): Iroute {
	const relativeAdress = file.replace(rootDir, "");
	const url = formatUrl(relativeAdress);

	return { file, url };
}

function formatUrl(url: string): string {
	url = url.replace("\\", "/");
	url = url.includes("\\") ? formatUrl(url) : url;

	url = url.replace("index.html", "");

	return url;
}
