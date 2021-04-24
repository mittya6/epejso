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

const ejspath =  config.get('ejs.template');
const rendererpath = config.get("marked.renderer");

const outputdir = (program.opts().outputdir) ? program.opts().outputdir : '../';

console.log("start md2runbook");
if (program.opts().filepath) {
  makehtml(program.opts().filepath);

} else {
  let tarMd = path.join(outputdir, '**/*.md');
  glob(path.resolve(tarMd), { 'ignore': ['**/md2runbook/**','**/node_modules/**', '**/README.md'] }, (err, files) => {
    files.forEach(mdfile => {
      console.log(`marked ${mdfile}`);
      makehtml(mdfile);
    });
  });
}

const makehtml = (tarMdfile) => {
  
  /** parse marked content start */
  const renderer = (require(rendererpath))(path.dirname(tarMdfile));
  const markedContents = marked(fs.readFileSync(tarMdfile, 'utf-8'), { renderer: renderer });
  if(!markedContents['meta']){
    markedContents['meta'] = [];
  }
  if(!markedContents['meta']['Title']){
    markedContents['meta']['Title'] = "no title";
  }
  /** parse marked content end */

  ejs.renderFile(ejspath, {

    title: markedContents['meta']['Title'],
    createDate: markedContents['meta']['CreatedDate'],
    updateDate: markedContents['meta']['UpdatedDate'],
    content: markedContents['html'],
    //temp.ejsに渡す値
    prismjs: fs.readFileSync('node_modules/prismjs/prism.js', 'utf-8'),
    prismtoolbarminjs: fs.readFileSync('node_modules/prismjs/plugins/toolbar/prism-toolbar.min.js', 'utf-8'),
    prismcopytoclipboardminjs: fs.readFileSync('node_modules/prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js', 'utf-8'),
    uikitminjs: fs.readFileSync('node_modules/uikit/dist/js/uikit.min.js', 'utf-8'),
    prismtoolbarcss: fs.readFileSync('node_modules/prismjs/plugins/toolbar/prism-toolbar.css', 'utf-8'),
    uikitmincss: fs.readFileSync('custom/my.uikit.css', 'utf-8'),
    prismcss: fs.readFileSync('node_modules/prism-themes/themes/prism-material-light.css', 'utf-8')

  }, function (err, html) {
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
