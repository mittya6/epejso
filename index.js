const fs = require("fs").promises;
const ejs = require("ejs");
const marked = require("marked");
const path = require('path');
const { Command } = require('commander');
//const Prism = require("prismjs");

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

let message;
(async () => {
    message = await fs.readFile(program.opts().filepath, 'utf-8');

    ejs.renderFile('./index.ejs', {

        //temp.ejsに渡す値
        content: marked(message)

    }, function (err, html) {
      if(err){
        console.log(err.stack);
        return;
      }
        // 出力ファイル名
        const file = path.dirname(program.opts().filepath) + '/index.html';
        // テキストファイルに書き込む
        fs.writeFile(file, html, 'utf8', (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('保存完了');
            }
        });
    });
})();


