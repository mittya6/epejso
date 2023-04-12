#!/usr/bin/env node

import ejs from 'ejs'
import matter from "gray-matter"
import { marked } from "marked"
import * as path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { getRenderer } from './renderer.js'
import browserSync from 'browser-sync'
import chokidar from 'chokidar'
import glob from 'glob'

// epejisoのルートディレクトリ
const __dirname = getDirname()

const ejspath = path.join(__dirname, './template/index.ejs')

const tmpdir = './tmp'
if (!fs.existsSync(tmpdir)) {
    fs.mkdirSync(tmpdir);
}


const tarMd = path.join(".", '**/*.md');


const globpath = path.resolve(tarMd);
const watcher = chokidar.watch(globpath, {
    ignored: (path => path.includes('node_modules')),
    persistent: true
})
watcher.on('change', async (path: string) => {
    const htmlpath: string = await makehtml(path, tmpdir)
    if (!loaded.includes(htmlpath)) {
        loaded.push(htmlpath)
        load(htmlpath, tmpdir)
    }
})


function getDirname() {
    const __filename = path.join(fileURLToPath(import.meta.url), '../')
    return path.dirname(__filename)
}

/**
* 指定されたmarkdownファイルからhtmlファイルを作成します。
* @param mdpath mdファイルパス
* @param basedir html出力先ディレクトリ
* @returns htmlファイル名
*/
async function makehtml(mdpath: string, basedir: string): Promise<string> {
    const fileContent = fs.readFileSync(mdpath, { encoding: "utf8" })
    const { data, content } = matter(fileContent)
    const markedContents = marked(content, { renderer: getRenderer(__dirname) })

    const mapping = {
        testText: markedContents,
        title: data.title
    }
    const html = await ejs.renderFile(ejspath, mapping, { async: true })
    const htmlpath = path.join(basedir, `${data.title}.html`)
    const htmlFilename = `${data.title}.html`
    fs.writeFileSync(path.join(basedir, htmlFilename), html, 'utf8')
    return htmlFilename
}


const loaded: Array<string> = []
function load(htmlpath: string, basedir: string) {
    const bs: browserSync.BrowserSyncInstance = browserSync.create();

    bs.init({
        server: { baseDir: basedir },
        startPath: htmlpath
    });
    bs.watch('**/*.html').on('change', bs.reload);
}
