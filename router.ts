import { readdirSync } from "fs";
import type { IDynamicRoutes, IStaticRoutes } from "./builder";

export default class Router {
	staticRoutes: IStaticRoutes;
	dynamicRoutes: IDynamicRoutes;

	constructor(dir: string) {
		this.staticRoutes = this.routeDir(dir);
		this.dynamicRoutes = {};
	}

	routeFallback(
		file: string,
		url: string,
		func: (arg: string) => { [key: string]: string }
	) {
		url = url + "fallback.html";

		this.dynamicRoutes[url] = { file, func };
	}

	private routeDir(dir: string) {
		const files = mapFilesIn(dir);
		const urls = files.map((file) => getRoute(file, dir));

		const routes = {} as IStaticRoutes;

		for (let i = 0; i < urls.length; i++) {
			const url = urls[i];
			const file = files[i];

			routes[url] = file;
		}

		return routes;
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
