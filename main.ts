import Router from "./router";

const router = new Router("public");

function back(str: string) {
	return { name: str, verb: "do" };
}
router.routeFallback("", back);

router.routeFallback("/pasta");

router.serve();
