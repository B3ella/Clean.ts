import { createServer } from "http";
import { readFileSync } from "node:fs";
import staticBuilder, { type StringHashmap } from "./staticBuilder";
import htmlDynamcBuilde from "serverSideBuilder";
import mapFilesIn from "./mapFiles";

interface IDynamicRoutes {
	[key: string]: {
		file: string;
		func: (arg: string) => StringHashmap;
	};
}
export default class Server {
	port: number;
	urls: string[];
	staticRoutes: StringHashmap;
	dynamicRoutes: IDynamicRoutes;
	rootDir: string;

	constructor(dir: string, port?: number) {
		this.port = port ?? 8080;
		this.rootDir = dir;
		const { staticRoutes, urls } = this.routeDir();

		urls.forEach((url) => staticBuilder(staticRoutes, url));

		this.urls = urls;
		this.staticRoutes = staticRoutes;
		this.dynamicRoutes = {};
	}
	private routeDir() {
		const files = mapFilesIn(this.rootDir);
		const urls = files.map((file) => this.getRoute(file));

		const routes = {} as StringHashmap;

		for (let i = 0; i < urls.length; i++) {
			const url = urls[i];
			const file = files[i];

			routes[url] = file;
		}

		return { staticRoutes: routes, urls };
	}
	getRoute(file: string) {
		const relativeAdress = file.replace(this.rootDir, "");
		return relativeAdress.replace("index.html", "");
	}

	routeFallback(url: string, func: (arg: string) => StringHashmap) {
		url = url + "/fallback.html";
		const file = this.rootDir + url;

		this.dynamicRoutes[url] = { file, func };
	}

	serve() {
		const { staticRoutes, dynamicRoutes } = this;
		serve({ staticRoutes, dynamicRoutes }, this.port);
	}
}

interface IServeParams {
	staticRoutes: StringHashmap;
	dynamicRoutes: IDynamicRoutes;
}
function serve({ staticRoutes, dynamicRoutes }: IServeParams, port: number) {
	createServer((request, response) => {
		let routeExist = false;

		function respondWithPageNotFound() {
			response.statusCode = 404;
			response.end("404, nothing to see here");
		}

		function resondWithPageFound(responseEnd: string | Buffer) {
			routeExist = true;
			response.statusCode = 200;
			response.end(responseEnd);
		}

		if (!request.url) {
			respondWithPageNotFound();
			return;
		}

		const responseFile = staticRoutes[request.url];

		if (responseFile) {
			resondWithPageFound(readFileSync(responseFile));
			return;
		}

		const { fallbackArg, fallbackUrl } = getFallback(request.url);

		const dynamicResponse = dynamicRoutes[fallbackUrl];

		if (dynamicResponse) {
			const data = dynamicResponse.func(fallbackArg);
			const htmlResponse = htmlDynamcBuilde(dynamicResponse.file, data);

			resondWithPageFound(htmlResponse);
			return;
		}

		if (!routeExist) respondWithPageNotFound();
	}).listen(port);

	console.log("server on and listining on port", port);
}

function getFallback(url: string) {
	const pivot = url.lastIndexOf("/") + 1;
	const fallbackArg = url.slice(pivot);
	const fallbackUrl = url.slice(0, pivot) + "fallback.html";

	return { fallbackArg, fallbackUrl };
}
