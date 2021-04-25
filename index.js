const fs = require("fs");
const ejs = require("ejs");
const marked = require("meta-marked");
const path = require('path');
const { Command } = require('commander');
const glob = require('glob');
const config = require('config');

const program = new Command();
program
  .option("-f, --filepath <value>", "markdown file path")
  .option("-o, --outputdir <value>", "output directory")
  .option("-d, --tarDir <value>", "target directory")
  .parse(process.argv);

const ejspath = config.get('ejs.template');
const rendererpath = config.get("ejs.marked.renderer");

const outputdir = (program.opts().outputdir) ? program.opts().outputdir : '../';

console.log("start md2runbook");
if (program.opts().filepath) {
  makehtml(program.opts().filepath);

} else {
  let tarMd = path.join(outputdir, '**/*.md');
  glob(path.resolve(tarMd), { 'ignore': ['**/md2runbook/**', '**/node_modules/**', '**/README.md'] }, (err, files) => {
    files.forEach(mdfile => {
      console.log(`marked ${mdfile}`);
      makehtml(mdfile);
    });
  });
}


const includeFiles = {};
if (config.has('ejs.include.file')) {
  let obj = config.get('ejs.include.file');
  Object.keys(obj).forEach(function (key) {
    includeFiles[key] = fs.readFileSync(obj[key], 'utf-8');
  });
}


const makehtml = (tarMdfile) => {
  /** parse marked content start */
  const renderer = (require(rendererpath))(path.dirname(tarMdfile));
  const markedContents = marked(fs.readFileSync(tarMdfile, 'utf-8'), { renderer: renderer });
  if (!markedContents['meta']) {
    markedContents['meta'] = [];
  }
  if (!markedContents['meta']['Title']) {
    markedContents['meta']['Title'] = "no title";
  }
  /** parse marked content end */

  let ejsParams = {
    title: markedContents['meta']['Title'],
    createDate: markedContents['meta']['CreatedDate'],
    updateDate: markedContents['meta']['UpdatedDate'],
  }
  ejsParams[config.get("ejs.marked.ejsKey")] = markedContents['html'];

  ejs.renderFile(ejspath,
    Object.assign(ejsParams, includeFiles)
    , function (err, html) {
      if (err) {
        console.log(err);
        return;
      }
      // 出力ファイル名
      const file = path.join(outputdir, markedContents['meta']['Title'] + '.html');
      // テキストファイルに書き込む

      fs.writeFileSync(file, html, 'utf8');
      console.log(`output ${file}`);
    });
}
