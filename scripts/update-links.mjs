import chalk from 'chalk';
import {
  readFile,
  readFileSync,
  readdir,
  readdirSync,
  writeFileSync,
} from 'fs';
import { extname, join } from 'path';

// Paths
const directoryPath = './';
const blackListPath = './src/black-list';
const packagePath = 'package.json';
const readme = 'README.md';

// jsdelivr + Github
const jsdelivrHost = 'https://cdn.jsdelivr.net/gh/onemoon';

// Get package's name
const packageContent = readFileSync(packagePath);
const projectName = JSON.parse(packageContent).name + '@latest';

// Get rule-set's path
const ruleSetFile = readdirSync(blackListPath).filter(
  (f) => extname(f) === '.yaml'
);

// Generate full path
const jsdelivrFullPaths = ruleSetFile.map((mdFile) => {
  return join(jsdelivrHost, projectName, blackListPath, mdFile);
});

// Generate jsdelivr link, and insert into README.md
readdir(directoryPath, (err, files) => {
  if (err) {
    console.error('Error reading directory', err);
    return;
  }

  // Filter the files to include only .md files
  const mdFiles = files
    .filter((file) => extname(file) === '.md')
    .filter((f) => f === readme);

  // Read the content of each .md file
  mdFiles.forEach((mdFile) => {
    const filePath = join(directoryPath, mdFile);

    const linksStr = jsdelivrFullPaths
      .map((link) => {
        const type = getType(link);
        return `### ${type}\n\n\`\`\`md\n${link}\n\`\`\``;
      })
      .join('\n\n');

    // console.log(linksStr);

    readFile(filePath, 'utf8', (err, mdContent) => {
      if (err) {
        console.error('Error reading file', filePath, err);
        return;
      }
      // # Rule sets
      const regex = /(?<=# Rule sets\n)[\s\S]*(?=\n## Software)/;
      const replacedContent = mdContent.replace(
        regex,
        `\n## jsdelivr link of Rule sets\n\n${linksStr}\n`
      );
      // console.log(replacedContent);
      writeFileSync(filePath, replacedContent, 'utf8');
      console.log(chalk.greenBright('Update readme successfully 🎉 ⚡️'));
    });
  });
});

function getType(str) {
  const match = str.match(/\.(\w+)\.yaml$/); // 匹配文件名中以 . 开头、以 .yaml 结尾的字段，例如 classical
  const extracted = match ? match[1] : ''; // 如果匹配成功，则提取匹配的内容；否则为 ''

  return extracted.charAt(0).toUpperCase() + extracted.slice(1); // 将首字母大写
}
