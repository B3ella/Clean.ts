import { readFileSync } from "fs";

import type { HTMLResponse } from "./server";

export default function buildSeverSide(
	fileAdress: string,
	querryData: any
): HTMLResponse {
	let file = readFileSync(fileAdress).toString();

	const startChar = "{{";
	const endChar = "}}";

	const numberStarts = file.split(startChar).length - 1;
	const numberOfEnds = file.split(endChar).length - 1;

	const allThatOpenCloses = numberOfEnds === numberStarts;

	if (!allThatOpenCloses) {
		return { code: 500, response: "problem with server, sorry" };
	}

	let lastEnd = 0;
	for (let i = 0; i < numberStarts; i++) {
		const currStart = file.indexOf(startChar, lastEnd) + startChar.length;
		const currEnd = file.indexOf(endChar, currStart);
		const flag = file.slice(currStart, currEnd);
		const substitute = querryData[flag.trim()];
		const trigger = startChar + flag + endChar;
		file = file.replace(trigger, substitute);
	}

	return { code: 200, response: file };
}
