const marked = require("meta-marked");
const path = require('path');
const fs = require("fs");

module.exports = (mddir) => {

  const renderer = new marked.Renderer();

  renderer.parseAsDataURL = (file) => {
    const base64ed = fs.readFileSync(file, { encoding: "base64" });
    return `data:image/${path.extname(file).replace('.', '')};base64,${base64ed}`;
  }

<<<<<<< HEAD
    renderer.image = function (href, title, text) {
        const dataURI = this.parseAsDataURL(path.join(mddir, href));
        return `<div class="uk-width-1-3 uk-text-center" uk-lightbox>
=======
  renderer.image = function (href, title, text) {
    const dataURI = this.parseAsDataURL(path.join(mddir, href));
    return `<div class="uk-width-1-3 uk-text-center" uk-lightbox>
>>>>>>> d590f82a4b6ad83c05ae2690b9b7d1883f23858e
            <div class="uk-inline-clip uk-transition-toggle" tabindex="0">
              <a class="uk-button uk-button-default" href="${dataURI}"  data-caption="${text}" data-type="image">
                <img src="${dataURI}" uk-img>
                <div class="uk-transition-fade uk-position-cover uk-position-small uk-overlay uk-overlay-default uk-flex uk-flex-center uk-flex-middle">
                  <p class="uk-h4 uk-margin-remove">${text}</p>
                </div>
              </a>
            </div>
          </div>`;
<<<<<<< HEAD
    }
    renderer.table = function (header, body) {
        return `<div class="uk-card uk-card-default uk-card-body uk-width-2-3@m">
          <table class="uk-table uk-table-divider">'
            <thead>${header}</thead>
            <tbody>${body}</tbody>
          </table>
          </div>`;
    };

    renderer.code = function (code, lang) {

      let langs = [];
      let label = "";
      let language = "";
      if(lang){
        langs = lang.split(':');
      }
      if(langs.length > 0){
        language = `language-${langs[1]}`;
      }
      if(langs.length > 1){
        label = `<span class="uk-label uk-label-warning filename">${langs[1]}</span>`;
      }
      return `${label}
      <pre><code class="${language}">${code}</code></pre>`;
    }

    return renderer;
=======
  }
  renderer.table = function (header, body) {
    return `<div class="uk-card uk-card-default uk-card-body uk-width-2-3">
          <table class="uk-table uk-table-divider">'
            <thead>${header}</thead>
            <tbody>${body}</tbody>
          </table></div>`;
  };

  return renderer;
>>>>>>> d590f82a4b6ad83c05ae2690b9b7d1883f23858e
}