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
import { program } from 'commander'
import glob from 'glob'


program
    .option("-e, --export [type]", "target directory")
    .option("-c, --create [type]", "create markdown Template")
    .parse(process.argv)



// epejisoのルートディレクトリ
const __dirname = getDirname()

const ejspath = path.join(__dirname, './template/index.ejs')

// 監視モード時の一時htmlファイルの出力先
const tmpdir = './tmp'

const tarMd = path.join(".", '**/*.md');


if (program.opts().create) {

    const title = (function () {
        if (program.opts().create === true) {
            return 'no-title'
        }
        return program.opts().create
    })()
    



} else if (program.opts().export) {

    let targetDir;
    if (program.opts().export === true) {
        targetDir = './target'
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir)
        }
    } else {
        targetDir = program.opts().export
    }

    if (!fs.statSync(targetDir)) {
        throw new Error(`${targetDir} is not directory`)
    }
    //エクスポート処理
    exportHTMLs(targetDir)

} else {
    console.log('epejso observer mode')

    const globpath = path.resolve(tarMd);
    const watcher = chokidar.watch(globpath, {
        ignored: (path => path.includes('node_modules')),
        persistent: true
    })

    if (!fs.existsSync(tmpdir)) {
        fs.mkdirSync(tmpdir)
    }
    watcher.on('change', async (mdFilepath: string) => {
        const { metadata, content } = compile(mdFilepath)
        const htmlFilename = metadata.file ? `${metadata.file}.html` : `${metadata.title}.html`

        await writeByEJS(path.join(tmpdir, htmlFilename), { metadata, content })
        if (!loaded.includes(htmlFilename)) {
            loaded.push(htmlFilename)
            load(htmlFilename, tmpdir)
        }
    })
}



function getDirname() {
    const __filename = path.join(fileURLToPath(import.meta.url), '../')
    return path.dirname(__filename)
}


type compiledData = {
    metadata: { [key: string]: any; },
    content: string
}

/**
 * markdownを解析してデータを取得します。
 * @param mdpath markdownファイルパス
 * @returns コンパイルしたデータ
 */
function compile(mdpath: string): compiledData {
    const fileContent = fs.readFileSync(mdpath, { encoding: "utf8" })
    const { data, content } = matter(fileContent)
    const markedContents = marked(content, { renderer: getRenderer(path.dirname(mdpath)) })
    return {
        metadata: data,
        content: markedContents
    }
}

/**
 * ejsでレンダリングしたデータを書き込みます。
 * @param filepath 
 * @param param1 
 */
async function writeByEJS(filepath: string, { metadata, content }: compiledData): Promise<void> {
    const mapping = {
        contents: content,
        metadata: metadata
    }
    const html = await ejs.renderFile(ejspath, mapping, { async: true })
    fs.writeFileSync(filepath, html, 'utf8')
}


const loaded: Array<string> = []
function load(htmlpath: string, basedir: string) {
    const bs: browserSync.BrowserSyncInstance = browserSync.create();

    bs.init({
        server: { baseDir: basedir },
        startPath: htmlpath,
        notify: false
    });
    bs.watch('**/*.html').on('change', bs.reload)
}


async function exportHTMLs(exportDir: string): Promise<void> {

    const mdfiles: string[] = await glob('**/*.md', { 'ignore': ['**/node_modules/**'] })

    mdfiles.forEach(async mdfile => {
        mdfile = path.resolve(mdfile)
        console.log(`marked ${mdfile}`)
        const { metadata, content } = compile(mdfile)
        const htmlFilename = metadata.file ? `${metadata.file}.html` : `${metadata.title}.html`
        console.log(exportDir)
        console.log(`output ${path.join(exportDir, htmlFilename)}`)
        await writeByEJS(path.join(exportDir, htmlFilename), { metadata, content })
    })
}