// Core imports
import { readdir, writeFile } from "fs/promises";
import { extname, join, relative } from "path";

const excludeFiles = new Set(["exports.ts"]);
const includedExtensions = new Set([".ts"]);
const rootPath = join(import.meta.dirname, "src");
const writeFilePath = join(rootPath, "exports.ts");

(async () => {
  try {
    console.log("Starting create exports file at path : " + writeFilePath);
    // Getting the list of directory entry
    const dirents = await readdir(rootPath, {
      recursive: true,
      withFileTypes: true,
    });

    let exports: string[] = [];

    // Filtering the exports
    for (const dirent of dirents) {
      if (!dirent.isFile()) continue;
      if (!includedExtensions.has(extname(dirent.name))) continue;
      if (excludeFiles.has(dirent.name)) continue;

      exports.push(relative(rootPath, join(dirent.parentPath, dirent.name)));
    }

    writeFile(writeFilePath, exports.map((exp) => `export * from "./${exp}";`).join("\n"));
    console.log("Exports file successfully created at at path : " + writeFilePath);
  } catch (error) {
    console.log("Error occured while creating exports file at path : " + writeFilePath);
    console.log(`Error : ${error}`);
  }
})();
