import fs from "fs";

console.log("Start");

 fs.readdir("./", { recursive: true, withFileTypes: true }, (err, files) => {
   if (err) console.log("Error occured reading file");
   files.forEach((fileEntry) => {
     console.log("Name: " + fileEntry.name, "Path : " + fileEntry.parentPath);
   });
 });

 


