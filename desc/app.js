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
import { program } from 'commander';
program
    .option("-d, --tarDir <value>", "target directory")
    .option("-w, --wait")
    .parse(process.argv);
// epejisoのルートディレクトリ
const __dirname = getDirname();
const ejspath = path.join(__dirname, './template/index.ejs');
// 監視モード時の一時htmlファイルの出力先
const tmpdir = './tmp';
const tarMd = path.join(".", '**/*.md');
const globpath = path.resolve(tarMd);
const watcher = chokidar.watch(globpath, {
    ignored: (path => path.includes('node_modules')),
    persistent: true
});
// waitオプションが
if (!program.opts().wait) {
    let targetDir;
    if (program.opts().tarDir) {
        targetDir = program.opts().tarDir;
    }
    else {
        targetDir = './target';
        fs.mkdirSync(targetDir);
    }
    if (!(fs.statSync(targetDir).isDirectory())) {
        throw new Error(`${targetDir} is not directory`);
    }
    //エクスポート処理
}
// 以下の処理はwatchモードの場合
else {
    if (!fs.existsSync(tmpdir)) {
        fs.mkdirSync(tmpdir);
    }
}
watcher.on('change', (mdFilepath) => __awaiter(void 0, void 0, void 0, function* () {
    const { metadata, content } = compile(mdFilepath);
    const htmlFilename = `${metadata.title}.html`;
    yield writeByEJS(path.join(tmpdir, htmlFilename), { metadata, content });
    if (!loaded.includes(htmlFilename)) {
        loaded.push(htmlFilename);
        load(htmlFilename, tmpdir);
    }
}));
function getDirname() {
    const __filename = path.join(fileURLToPath(import.meta.url), '../');
    return path.dirname(__filename);
}
/**
 * markdownを解析してデータを取得します。
 * @param mdpath markdownファイルパス
 * @returns コンパイルしたデータ
 */
function compile(mdpath) {
    const fileContent = fs.readFileSync(mdpath, { encoding: "utf8" });
    const { data, content } = matter(fileContent);
    const markedContents = marked(content, { renderer: getRenderer(path.dirname(mdpath)) });
    return {
        metadata: data,
        content: markedContents
    };
}
/**
 * ejsでレンダリングしたデータを書き込みます。
 * @param filepath
 * @param param1
 */
function writeByEJS(filepath, { metadata, content }) {
    return __awaiter(this, void 0, void 0, function* () {
        const mapping = {
            contents: content,
            metadata: metadata
        };
        const html = yield ejs.renderFile(ejspath, mapping, { async: true });
        fs.writeFileSync(filepath, html, 'utf8');
    });
}
const loaded = [];
function load(htmlpath, basedir) {
    const bs = browserSync.create();
    bs.init({
        server: { baseDir: basedir },
        startPath: htmlpath,
        notify: false
    });
    bs.watch('**/*.html').on('change', bs.reload);
}
//# sourceMappingURL=app.js.map