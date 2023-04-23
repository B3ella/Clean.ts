import serve from "./server";
import Router from "./router";

const dirName = __dirname + "\\public";

const router = new Router(dirName);

function back(str: string) {
	return { name: str, verb: "do" };
}

router.routeFallback(dirName + "\\fallback.html", "/", back);

router.routes ? serve(router.routes, 8080) : null;
