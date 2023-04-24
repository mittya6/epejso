import { marked } from "marked"
import fs from 'fs'
import * as path from 'path'

export function getRenderer(mddir: string) {

  const renderer = new marked.Renderer();

  renderer.image = function (href: string, title, text) {

    let imageFilepath = path.join(mddir, href);
    const dataURI = fs.existsSync(imageFilepath) ? parseAsDataURL(imageFilepath) : href;
    return `<a>
              <img src="${dataURI}" title="${title}" alt="${text}">
            </a>`;
  }

  renderer.link = function (href, title, text) {
    return `<a href="${href}" title="${title}" target="_blank">${text}</a>`
  }


  renderer.code = function (code, str) {

    const values = str?.split(':')
    if (!values) {
      return `<pre><code>${code}</code></pre>`
    }

    const lang = values[0]
    if(values.length < 2){
      return `<pre><code class="language-${lang}">${code}</code></pre>`
    }

    const title = values[1]
    return `<pre><div class="title">${title}</div><code class="language-${lang}">${code}</code></pre>`
  }

  return renderer;
}

function parseAsDataURL(file: string) {
  const base64ed = fs.readFileSync(file, { encoding: "base64" });
  return `data:image/${path.extname(file).replace('.', '')};base64,${base64ed}`;
}

