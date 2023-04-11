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

const rootDir = './target'
if (!fs.existsSync(rootDir)) {
    fs.mkdirSync(rootDir);
}



const tarMd = path.join(__dirname, '**/*.md');
const globpath = path.resolve(tarMd);
const watcher = chokidar.watch(globpath, {
    ignored: (path => path.includes('node_modules')),
    persistent: true
})
watcher.on('change', async (path: string) => {
    const htmlpath: string = await makehtml(path,rootDir)
    if(!loaded.includes(htmlpath)){
        loaded.push(htmlpath)
        load(htmlpath)
    }

})


function getDirname() {
    const __filename = path.join(fileURLToPath(import.meta.url), '../')
    return path.dirname(__filename)
}

/**
* 指定されたmarkdownファイルからhtmlファイルを作成します。
* @param mdpath 生成したhtmlパス
*/
async function makehtml(mdpath: string, basedir:string): Promise<string> {
    const fileContent = fs.readFileSync(mdpath, { encoding: "utf8" })
    const { data, content } = matter(fileContent)
    const markedContents = marked(content, { renderer: getRenderer(__dirname) })

    const mapping = {
        testText: markedContents,
        title: data.title
    }
    const html = await ejs.renderFile(ejspath, mapping, { async: true })
    const htmlpath = path.join(basedir,`${data.title}.html`)
    fs.writeFileSync(htmlpath, html, 'utf8')
    return htmlpath
}


const loaded:Array<string> = []
function load(htmlpath: string) {
    const bs: browserSync.BrowserSyncInstance = browserSync.create();

    bs.init({
        server: { baseDir: __dirname },
        startPath: htmlpath
    });
    bs.watch('*.html').on('change', bs.reload);
}
