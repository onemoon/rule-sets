import { writeFile, readFile, readFileSync, readdirSync } from "fs";
import { extname, join } from "path";

// paths
const directoryPath = "/";
const blackListPath = "./black-list";
const packagePath = "package.json";

// jsdelivr + Github
const jsdelivrHost = "https://cdn.jsdelivr.net/gh/onemoon";

// get package's name
const packageContent = readFileSync(packagePath);
const projectName = JSON.parse(packageContent).name;

// get rule-set's path
const ymlFiles = readdirSync(blackListPath).filter(
  (f) => extname(f) === ".yaml"
);

// Generate full path
const jsdelivrFullPaths = ymlFiles.map((mdFile) => {
  return join(jsdelivrHost, projectName, blackListPath, mdFile);
});

console.log("jsdelivrFullPaths", jsdelivrFullPaths);

// generate jsdelivr link, and insert into README.md
readdirSync(directoryPath, (err, files) => {
  if (err) {
    console.error("Error reading directory", err);
    return;
  }

  // Filter the files to include only .md files
  const mdFiles = files
    .filter((file) => extname(file) === ".md")
    .filter((f) => f === "test.md");

  // Read the content of each .md file
  mdFiles.forEach((mdFile) => {
    const filePath = join(directoryPath, mdFile);
    console.log({ filePath });

    readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading file", filePath, err);
        return;
      }
      console.log(data); // Do something with the file content
    });
  });
});
