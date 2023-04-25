import { readdirSync } from "fs";
import {
	staticBuilder,
	type IDynamicRoutes,
	type StringHashmap,
} from "./builder";

export default class Router {
	urls: string[];
	staticRoutes: StringHashmap;
	dynamicRoutes: IDynamicRoutes;
	rootDir: string;
	static dirDivision = process.platform.startsWith("win") ? "\\" : "/";

	constructor(dir: string) {
		this.rootDir = dir;
		const { staticRoutes, urls } = this.routeDir();

		const dirDiv = Router.dirDivision;
		urls.forEach((url) => staticBuilder(staticRoutes, url, dirDiv));

		this.urls = urls;
		this.staticRoutes = staticRoutes;
		this.dynamicRoutes = {};
	}
	private routeDir() {
		const files = Router.mapFilesIn(this.rootDir);
		const urls = files.map((file) => this.getRoute(file));

		const routes = {} as StringHashmap;

		for (let i = 0; i < urls.length; i++) {
			const url = urls[i];
			const file = files[i];

			routes[url] = file;
		}

		return { staticRoutes: routes, urls };
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
		if (t == sub) return str;

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
