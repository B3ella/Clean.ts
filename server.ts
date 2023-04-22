import { createServer } from "http";
import { readFileSync } from "node:fs";

export interface Iroute {
	file: string;
	url: string;
	backendFunc?: (arg: string) => object;
}

export default function serve(routes: Iroute[], port?: number) {
	port = port ?? 8080;

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

		routes.forEach((route) => {
			if (route.url === request.url) {
				const responseFile = readFileSync(route.file);
				resondWithPageFound(responseFile);
			}
		});

		if (routeExist) return;

		const { fallbackArg, fallbackUrl } = getFallback(request.url);

		routes.forEach((route) => {
			if (route.url === fallbackUrl && route.backendFunc) {
				const data = route.backendFunc(fallbackArg);

				const htmlResponse = htmlBuilder(route.file, data);

				resondWithPageFound(htmlResponse);
				return;
			}
		});

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

function htmlBuilder(fileAdress: string, querryData: any) {
	let file = readFileSync(fileAdress).toString();

	const startChar = "{{";
	const endChar = "}}";

	const numberStarts = file.split(startChar).length - 1;
	const numberOfEnds = file.split(endChar).length - 1;

	const allThatOpenCloses = numberOfEnds === numberStarts;

	if (!allThatOpenCloses) return "problem with server, sorry";

	let lastEnd = 0;
	for (let i = 0; i < numberStarts; i++) {
		const currStart = file.indexOf(startChar, lastEnd) + startChar.length;
		const currEnd = file.indexOf(endChar, currStart);
		const flag = file.slice(currStart, currEnd);
		const substitute = querryData[flag.trim()];
		const trigger = startChar + flag + endChar;
		file = file.replace(trigger, substitute);
	}

	return file;
}
