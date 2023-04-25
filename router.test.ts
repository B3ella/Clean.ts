import Router from "./router.ts";
import { describe, expect, it } from "vitest";
import { staticBuilder } from "./builder.ts";

describe("#router", () => {
	it("static methods", () => {
		expect(Router.dirDivision).toBe("\\");

		expect(Router.mapFilesIn(__dirname + "\\test")[0]).toBe(
			__dirname + "\\test\\rand.txt"
		);

		expect(Router.isFile("."));
		expect(Router.isFile("")).toBe(false);

		expect(Router.formatUrl("this\\that\\done\\index.html")).toBe(
			"this/that/done/"
		);

		expect(Router.replaceAllOnFor("a", "aaaaaaaa", "b")).toBe("bbbbbbbb");
		expect(Router.replaceAllOnFor("a", "aaccaaaa", "b")).toBe("bbccbbbb");
	});
});
describe("#builder", () => {
	it("", () => {
		expect(staticBuilder({ a: "a.html" }, "a")).toBe("<h1>test</h1><h2>funciona</h2>");
	});
});
