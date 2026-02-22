import { Project } from "ts-morph";
import { writeFile } from "fs";

const project = new Project({
  tsConfigFilePath: "./../utils/tsconfig.json",
});

const filesInfo = [];

project.getSourceFiles().forEach((file) => {
  const fileInfo = {
    name: file.getBaseName(),
    functions: [] as string[],
    classes: [] as string[],
  };

  file.getFunctions().forEach((functionEntry) => {
    fileInfo.functions.push(functionEntry.getName() ?? "Unknown function");
  });

  file.getClasses().forEach((classesEntry) => {
    fileInfo.classes.push(classesEntry.getName() ?? "Unknown class");
  });
  filesInfo.push(fileInfo);
});

writeFile("test.json", JSON.stringify(filesInfo), (err: any) => {});
