const fs = require("fs");
const ejs = require("ejs");
const marked = require("marked");
const path = require('path');
const { Command } = require('commander');

const renderer = new marked.Renderer();
renderer.image = function(href, title, text) {   
  return `<div class="uk-width-1-5" uk-lightbox>
              <a class="uk-button uk-button-default" href="${href}"  data-caption="${text}">
                <img src="${href}" uk-img>
              </a>
          </div>`;
}

/*
marked.setOptions({
    breaks: true,
    langPrefix: "language-",
    highlight: (code, lang) => {
      console.log(lang)
      if (lang && lang.match(":")) {
        lang = lang.substring(0, lang.indexOf(":"));
      }
      if (lang in Prism.languages) {
        console.log(code);
        console.log(typeof(code));
       // code.setAttribute('data-prismjs-copy','copy');
      var hoge = Prism.highlight(code, Prism.languages[lang]);
      console.log(typeof(hoge));
        return Prism.highlight(code, Prism.languages[lang]);
      }
      return code;
    }
  });
  */

const program = new Command();
program.option("-f, --filepath <value>", "test option").parse(process.argv);

program.on('--help', () => {
  console.log()
  console.log('For more information, see')
  console.log('https://github.com/hktysk/resv')
  console.log()
});

const message = fs.readFileSync(program.opts().filepath, 'utf-8');
ejs.renderFile('./index.ejs', {

  //temp.ejsに渡す値
  prismjs: fs.readFileSync('node_modules/prismjs/prism.js','utf-8'),
  prismtoolbarminjs: fs.readFileSync('node_modules/prismjs/plugins/toolbar/prism-toolbar.min.js','utf-8'),
  prismcopytoclipboardminjs: fs.readFileSync('node_modules/prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js','utf-8'),
  uikitminjs: fs.readFileSync('node_modules/uikit/dist/js/uikit.min.js','utf-8'),
  inviewminjs: fs.readFileSync('node_modules/in-view/dist/in-view.min.js','utf-8'),
  prismtoolbarcss: fs.readFileSync('node_modules/prismjs/plugins/toolbar/prism-toolbar.css','utf-8'),
  uikitmincss: fs.readFileSync('node_modules/uikit/dist/css/uikit.my.uikit.min.css','utf-8'),
  prismcss: fs.readFileSync('node_modules/prismjs/themes/prism-tomorrow.css','utf-8'),  
  content: marked(message, { renderer: renderer })

}, function (err, html) {
  if (err) {
    console.log(err.stack);
    return;
  }
  // 出力ファイル名
  const file = path.dirname(program.opts().filepath) + '/index.html';
  // テキストファイルに書き込む
  fs.writeFileSync(file, html, 'utf8');
  console.log("完了")
});


