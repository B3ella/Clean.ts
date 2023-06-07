import { readFileSync, writeFileSync } from "fs";
import buildFile from "./buildFile";

export default function staticBuilder(fileAdress: string): string {
	if (!fileAdress || nothingToBuild(fileAdress)) return fileAdress;

	const buildAdress = getBuildAddress(fileAdress);
	const file = buildFile(fileAdress);

	writeFileSync(buildAdress, file);
	return buildAdress;
}

function nothingToBuild(fileAdress: string): boolean {
	const notHtml = !fileAdress.endsWith(".html");
	const isBuilt = fileAdress.includes("build");
	if (notHtml || isBuilt) return true;

	const noComponents = !readToString(fileAdress).includes("{<");
	return noComponents;
}
function readToString(fileAdress: string): string {
	return readFileSync(fileAdress).toString();
}

function getBuildAddress(fileAdress: string): string {
	const dirPivot = fileAdress.lastIndexOf("/") + "/".length;
	const fileName = fileAdress.slice(dirPivot);
	const dirName = fileAdress.slice(0, dirPivot);

	return dirName + "build" + fileName;
}

const testApi = {getBuildAddress, readToString, staticBuilder, nothingToBuild}