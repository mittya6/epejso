import { marked } from "marked";
import fs from 'fs';
import * as path from 'path';
export function getRenderer(mddir) {
    const renderer = new marked.Renderer();
    renderer.image = function (href, title, text) {
        let imageFilepath = path.join(mddir, href);
        const dataURI = fs.existsSync(imageFilepath) ? parseAsDataURL(imageFilepath) : href;
        return `<a>
              <img src="${dataURI}" title="${title}" alt="${text}">
            </a>`;
    };
    renderer.link = function (href, title, text) {
        return `<a href="${href}" title="${title}" target="_blank">${text}</a>`;
    };
    return renderer;
}
function parseAsDataURL(file) {
    const base64ed = fs.readFileSync(file, { encoding: "base64" });
    return `data:image/${path.extname(file).replace('.', '')};base64,${base64ed}`;
}
//# sourceMappingURL=renderer.js.map