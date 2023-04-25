import { readdirSync } from "fs";
import {
	staticBuilder,
	type IDynamicRoutes,
	type StringHashmap,
} from "./builder";

export default class Router {
	urls: string[] | undefined;
	staticRoutes: StringHashmap;
	dynamicRoutes: IDynamicRoutes;
	rootDir: string;
	static dirDivision = process.platform.startsWith("win") ? "\\" : "/";

	constructor(dir: string) {
		this.rootDir = dir;
		this.staticRoutes = this.routeDir();
		this.dynamicRoutes = {};

		this.urls?.forEach((url) => {
			staticBuilder(this.staticRoutes, url, Router.dirDivision);
		});
	}
	private routeDir() {
		const dir = this.rootDir;
		const files = Router.mapFilesIn(dir);
		const urls = files.map((file) => this.getRoute(file));

		this.urls = urls;

		const routes = {} as StringHashmap;

		for (let i = 0; i < urls.length; i++) {
			const url = urls[i];
			const file = files[i];

			routes[url] = file;
		}

		return routes;
	}
	static mapFilesIn(dir: string) {
		const items = readdirSync(dir);
		const files: string[] = [];

		items.forEach((item) => {
			const fullAdress = dir + Router.dirDivision + item;

			if (Router.isFile(item)) files.push(fullAdress);
			else files.push(...this.mapFilesIn(fullAdress));
		});

		return files;
	}
	static isFile(adress: string) {
		return adress.includes(".");
	}
	getRoute(file: string) {
		const rootDir = this.rootDir;
		const relativeAdress = file.replace(rootDir, "");
		const url = Router.formatUrl(relativeAdress);

		return url;
	}
	static formatUrl(url: string): string {
		url = Router.replaceAllOnFor("\\", url, "/");
		return url.replace("index.html", "");
	}
	static replaceAllOnFor(t: string, str: string, sub: string): string {
		str = str.replace(t, sub);
		return str.includes(t) ? this.replaceAllOnFor(t, str, sub) : str;
	}

	routeFallback(url: string, func: (arg: string) => StringHashmap) {
		const file = this.urlToRelativeFile(url);

		url = url + "fallback.html";

		this.dynamicRoutes[url] = { file, func };
	}
	urlToRelativeFile(url: string) {
		const filePath = Router.replaceAllOnFor("/", url, Router.dirDivision);
		return this.rootDir + filePath + "fallback.html";
	}
}
