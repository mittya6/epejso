#!/usr/bin/env node
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import ejs from 'ejs';
import matter from "gray-matter";
import { marked } from "marked";
import * as path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { getRenderer } from './renderer.js';
import browserSync from 'browser-sync';
import chokidar from 'chokidar';
// epejisoのルートディレクトリ
const __dirname = getDirname();
const ejspath = path.join(__dirname, './template/index.ejs');
const rootDir = './target';
if (!fs.existsSync(rootDir)) {
    fs.mkdirSync(rootDir);
}
const tarMd = path.join(__dirname, '**/*.md');
const globpath = path.resolve(tarMd);
const watcher = chokidar.watch(globpath, {
    ignored: (path => path.includes('node_modules')),
    persistent: true
});
watcher.on('change', (path) => __awaiter(void 0, void 0, void 0, function* () {
    const htmlpath = yield makehtml(path, rootDir);
    if (!loaded.includes(htmlpath)) {
        loaded.push(htmlpath);
        load(htmlpath);
    }
}));
function getDirname() {
    const __filename = path.join(fileURLToPath(import.meta.url), '../');
    return path.dirname(__filename);
}
/**
* 指定されたmarkdownファイルからhtmlファイルを作成します。
* @param mdpath 生成したhtmlパス
*/
function makehtml(mdpath, basedir) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileContent = fs.readFileSync(mdpath, { encoding: "utf8" });
        const { data, content } = matter(fileContent);
        const markedContents = marked(content, { renderer: getRenderer(__dirname) });
        const mapping = {
            testText: markedContents,
            title: data.title
        };
        const html = yield ejs.renderFile(ejspath, mapping, { async: true });
        const htmlpath = path.join(basedir, `${data.title}.html`);
        fs.writeFileSync(htmlpath, html, 'utf8');
        return htmlpath;
    });
}
const loaded = [];
function load(htmlpath) {
    const bs = browserSync.create();
    bs.init({
        server: { baseDir: __dirname },
        startPath: htmlpath
    });
    bs.watch('*.html').on('change', bs.reload);
}
//# sourceMappingURL=app.js.map