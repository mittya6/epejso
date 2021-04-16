const fs = require("fs");
const ejs = require("ejs");
const marked = require("meta-marked");
const path = require('path');
const { Command } = require('commander');

const program = new Command();
program
  .option("-f, --filepath <value>", "markdown file path")
  .option("-e, --ejspath <value>", "ejs template file path")
  .option("-r, --rendererpath <value>", "renderer file path")
  .parse(process.argv);
if (!program.opts().filepath){
  throw new Error("-f required filepath")
}
const ejspath = (program.opts().ejspath)?program.opts().ejspath:'./template/default.ejs';
const rendererpath = (program.opts().rendererpath)?program.opts().rendererpath:'./renderer/defaultRenderer.js';

/** parse marked content start */
const renderer = (require(rendererpath))(path.dirname(program.opts().filepath));
const markedContents = marked(fs.readFileSync(program.opts().filepath, 'utf-8'), { renderer: renderer });
/** parse marked content end */


ejs.renderFile(ejspath, {

  title: markedContents['meta']['Title'],
  createDate: markedContents['meta']['CreatedDate'],
  updateDate: markedContents['meta']['UpdatedDate'],
  //temp.ejsに渡す値
  prismjs: fs.readFileSync('node_modules/prismjs/prism.js', 'utf-8'),
  prismtoolbarminjs: fs.readFileSync('node_modules/prismjs/plugins/toolbar/prism-toolbar.min.js', 'utf-8'),
  prismcopytoclipboardminjs: fs.readFileSync('node_modules/prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js', 'utf-8'),
  uikitminjs: fs.readFileSync('node_modules/uikit/dist/js/uikit.min.js', 'utf-8'),
  prismtoolbarcss: fs.readFileSync('node_modules/prismjs/plugins/toolbar/prism-toolbar.css', 'utf-8'),
  uikitmincss: fs.readFileSync('custom/my.uikit.css', 'utf-8'),
  prismcss: fs.readFileSync('node_modules/prism-themes/themes/prism-material-light.css', 'utf-8'),

  content: markedContents['html']

}, function (err, html) {
  if (err) {
    console.log(err);
    return;
  }
  // 出力ファイル名
  const file = path.dirname(program.opts().filepath) + '/index.html';
  // テキストファイルに書き込む
  fs.writeFileSync(file, html, 'utf8');
  console.log("完了")
});


