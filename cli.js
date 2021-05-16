#!/usr/bin/env node

const fs = require("fs");
const ejs = require("ejs");
const marked = require("meta-marked");
const path = require('path');
const { Command } = require('commander');
const glob = require('glob');

// specify config directroy
process.env.NODE_CONFIG_DIR = path.join(__dirname,'config');
const config = require('config');



// parse Start argument start
const program = new Command();
program
  .option("-f, --filepath <value>", "markdown file path")
  .option("-o, --outputdir <value>", "output directory", './')
  .option("-d, --tarDir <value>", "target directory")
  .parse(process.argv);
// parse Start argument end

const ejspath = path.join(__dirname ,config.get('ejs.template'));
const rendererpath = path.join(__dirname ,config.get("ejs.marked.renderer"));

console.log("start md2runbook");

const includeFiles = {};
if (config.has('ejs.include.file')) {
  let obj = config.get('ejs.include.file');
  Object.keys(obj).forEach(function (key) {
    includeFiles[key] = fs.readFileSync(path.join(__dirname,obj[key]), 'utf-8');
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

  const ejsParams = {};
  ejsParams[config.get("ejs.marked.ejsKey")] = markedContents['html'];
  ejs.renderFile(ejspath,
    Object.assign(ejsParams, includeFiles, markedContents['meta'])
    , function (err, html) {
      if (err) {
        console.log(err);
        return;
      }
      // 出力ファイル名
      const file = path.join(program.opts().outputdir, markedContents['meta']['Title'] + '.html');
      // テキストファイルに書き込む

      fs.writeFileSync(file, html, 'utf8');
      console.log(`output ${file}`);
    });
}


if (program.opts().filepath) {
  makehtml(program.opts().filepath);
  return;
}


let tarMd = path.join(program.opts().outputdir, '**/*.md');
glob(path.resolve(tarMd), { 'ignore': ['**/md2runbook/**', '**/node_modules/**', '**/README.md'] }, (err, mdfiles) => {
  mdfiles.forEach(mdfile => {
    console.log(`marked ${mdfile}`);
    makehtml(mdfile);
  });
});


