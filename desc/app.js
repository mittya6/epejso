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
import ejs from "ejs";
import matter from "gray-matter";
import { marked } from "marked";
import * as path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { getRenderer } from "./renderer.js";
import browserSync from "browser-sync";
import chokidar from "chokidar";
import { program } from "commander";
import glob from "glob";
import os from "os";
program
    .option("-o, --observe [type]", "target directory", "./")
    .option("-e, --export [type]", "target directory")
    .parse(process.argv);
// epejisoのルートディレクトリ
const __dirname = getDirname();
const ejspath = path.join(__dirname, "./template/index.ejs");
const tarMd = path.join(program.opts().observe, "**/*.md");
if (program.opts().export) {
    let targetDir;
    if (program.opts().export === true) {
        targetDir = "./target";
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir);
        }
    }
    else {
        targetDir = program.opts().export;
    }
    if (!fs.statSync(targetDir)) {
        throw new Error(`${targetDir} is not directory`);
    }
    //エクスポート処理
    exportHTMLs(targetDir);
}
else {
    console.log("epejso observer mode");
    // 監視モード時の一時htmlファイルの出力先
    const tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), "tmp"));
    const globpath = path.resolve(tarMd);
    const watcher = chokidar.watch(globpath, {
        ignored: (path) => path.includes("node_modules"),
        persistent: true,
    });
    watcher.on("change", (mdFilepath) => __awaiter(void 0, void 0, void 0, function* () {
        const { metadata, content } = compile(mdFilepath);
        const htmlFilename = metadata.file
            ? `${metadata.file}.html`
            : `${path.basename(mdFilepath, ".md")}.html`;
        metadata.title = metadata.title
            ? metadata.title
            : `${path.basename(mdFilepath, ".md")}`;
        yield writeByEJS(path.join(tmpdir, htmlFilename), { metadata, content });
        if (!loaded.includes(htmlFilename)) {
            loaded.push(htmlFilename);
            load(htmlFilename, tmpdir);
        }
    }));
}
function getDirname() {
    const __filename = path.join(fileURLToPath(import.meta.url), "../");
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
    const markedContents = marked(content, {
        renderer: getRenderer(path.dirname(mdpath)),
    });
    return {
        metadata: data,
        content: markedContents,
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
            metadata: metadata,
        };
        const html = yield ejs.renderFile(ejspath, mapping, { async: true });
        fs.writeFileSync(filepath, html, "utf8");
    });
}
const loaded = [];
function load(htmlfileName, basedir) {
    const bs = browserSync.create();
    bs.init({
        server: { baseDir: basedir },
        startPath: htmlfileName,
        notify: false,
    });
    //bs.watch(path.join(basedir,'*.html')).on('change', bs.reload)
    bs.watch(path.join(basedir, htmlfileName)).on("change", bs.reload);
}
function exportHTMLs(exportDir) {
    return __awaiter(this, void 0, void 0, function* () {
        const mdfiles = yield glob("**/*.md", {
            ignore: ["**/node_modules/**"],
        });
        mdfiles.forEach((mdfile) => __awaiter(this, void 0, void 0, function* () {
            mdfile = path.resolve(mdfile);
            console.log(`marked ${mdfile}`);
            const { metadata, content } = compile(mdfile);
            const htmlFilename = metadata.file
                ? `${metadata.file}.html`
                : `${path.basename(mdfile, ".md")}.html`;
            metadata.title = metadata.title
                ? metadata.title
                : `${path.basename(mdfile, ".md")}`;
            console.log(`output ${path.join(exportDir, htmlFilename)}`);
            yield writeByEJS(path.join(exportDir, htmlFilename), { metadata, content });
        }));
    });
}
//# sourceMappingURL=app.js.map