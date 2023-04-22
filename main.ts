import serve from "./server";
import Router from "./router";

const dirName = __dirname + "\\public";

const router = new Router();

router.routeDir(dirName);

router.routes ? serve(router.routes, 8080) : null;
