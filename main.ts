import Server from "./server";

const server = new Server("public");

function back(str: string) {
	return { name: str, verb: "do" };
}
server.routeFallback("", back);

server.serve();
