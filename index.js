const fs = require("fs");
const ejs = require("ejs");
const marked = require("meta-marked");
const path = require('path');
const { Command } = require('commander');

const program = new Command();
program.option("-f, --filepath <value>", "test option").parse(process.argv);

program.on('--help', () => {
  console.log()
  console.log('For more information, see')
  console.log('https://github.com/hktysk/resv')
  console.log()
});

/** parse marked content start */
const renderer = new marked.Renderer();
renderer.image =  function (href, title, text) {
  const dataURI = parseAsDataURL(path.join(path.dirname(program.opts().filepath),href));
  return `<div class="uk-width-1-5" uk-lightbox>
            <a class="uk-button uk-button-default" href="${dataURI}"  data-caption="${text}" data-type="image">
              <img src="${dataURI}" uk-img>
            </a>
        </div>`;
}
renderer.table = function(header, body) {
  return `<table class="uk-table uk-table-divider">'
            <thead>${header}</thead>
            <tbody>${body}</tbody>
          </table>`;
};
const markedContents = marked(fs.readFileSync(program.opts().filepath, 'utf-8'), { renderer: renderer });
/** parse marked content end */


ejs.renderFile('./index.ejs', {

  title: markedContents['meta']['Title'],
  //temp.ejsに渡す値
  prismjs: fs.readFileSync('node_modules/prismjs/prism.js', 'utf-8'),
  prismtoolbarminjs: fs.readFileSync('node_modules/prismjs/plugins/toolbar/prism-toolbar.min.js', 'utf-8'),
  prismcopytoclipboardminjs: fs.readFileSync('node_modules/prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js', 'utf-8'),
  uikitminjs: fs.readFileSync('node_modules/uikit/dist/js/uikit.min.js', 'utf-8'),
  prismtoolbarcss: fs.readFileSync('node_modules/prismjs/plugins/toolbar/prism-toolbar.css', 'utf-8'),
  uikitmincss: fs.readFileSync('node_modules/uikit/dist/css/uikit.my.uikit.min.css', 'utf-8'),
  prismcss: fs.readFileSync('node_modules/prismjs/themes/prism-tomorrow.css', 'utf-8'),

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


function parseAsDataURL(file) {
  const base64ed = fs.readFileSync(file,{ encoding: "base64" });
  return `data:image/${path.extname(file).replace('.','')};base64,${base64ed}`;
}