import serve from "./server";
import Router from "./router";

const dirName = __dirname + "\\public";

const router = new Router(dirName);

function back(str: string) {
	return { name: str, verb: "do" };
}
router.routeFallback("/", back);

serve(router, 8080);
