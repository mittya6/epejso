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
        const dataURI = fs.existsSync(imageFilepath) ? this.parseAsDataURL(imageFilepath) : href;
        return `<div class="w-7/12" onclick="const instance = basicLightbox.create(this.cloneNode(true)).show();"><img src="${dataURI}" class="object-contain w-full border-2 cursor-pointer"></div>`;
    }

    renderer.table = function (header, body) {
        return `
          <table class="table-auto">
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
            label = `<span class="text-red-500 bg-white overflow-hidden shadow-lg border-2 p-1 absolute top-2 left-2" title="${langs[1]}">${langs[1]}</span>`;
        }
        return `<div style="position:relative">
                <pre>${label}<code style="padding-top:56px;">${code}</code></pre>
                </div>`;
    }

    return renderer;
}