import Router from "./router";

const router = new Router("public");

function back(str: string) {
	return new Map().set("name", str).set("verb", "do");
}
router.routeFallback("", back);

router.routeFallback("/pasta");

router.serve();
