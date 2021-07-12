const marked = require("meta-marked");
const path = require('path');
const fs = require("fs");

module.exports = (mddir) => {

  const renderer = new marked.Renderer();

  renderer.parseAsDataURL = (file) => {
    const base64ed = fs.readFileSync(file, { encoding: "base64" });
    return `data:image/${path.extname(file).replace('.', '')};base64,${base64ed}`;
  }

  renderer.image = function (href, title, text) {

    let imageFilepath = path.join(mddir, href);
    const dataURI = fs.existsSync(imageFilepath)?this.parseAsDataURL(imageFilepath):href;
    return `<div class="uk-width-1-3 uk-text-center" uk-lightbox>
            <div class="uk-inline-clip uk-transition-toggle" tabindex="0">
              <a class="uk-button uk-button-default" href="${dataURI}"  data-caption="${text}" data-type="image">
                <img src="${dataURI}" uk-img>
                <div class="uk-transition-fade uk-position-cover uk-position-small uk-overlay uk-overlay-default uk-flex uk-flex-center uk-flex-middle">
                  <p class="uk-h4 uk-margin-remove">${text}</p>
                </div>
              </a>
            </div>
          </div>`;
  }
  renderer.table = function (header, body) {
    return `
          <table class="uk-table uk-table-divider uk-table-striped">
            <thead>${header}</thead>
            <tbody>${body}</tbody>
          </table>
          `;
  };

  renderer.code = function (code, lang) {

    let langs = [];
    let label = "";
    let language = "";
    if (lang) {
      langs = lang.split(':');
    }
    if (langs.length > 0) {
      language = `language-${langs[1]}`;
    }
    if (langs.length > 1) {
      label = `<span class="uk-label uk-label-warning filename">${langs[1]}</span>`;
    }
    return `<div style="position:relative">
              ${label}
              <pre><code class="${language}">${code}</code></pre>
            </div>`;
  }

  return renderer;
}