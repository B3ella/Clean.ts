import Server from "./server";

const dirName = __dirname + "\\public";

const server = new Server(dirName);

function back(str: string) {
	return { name: str, verb: "do" };
}
server.routeFallback("/", back);

server.serve();
