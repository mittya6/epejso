#!/usr/bin/env node
import ejs from 'ejs';
import * as path from 'path';
import { fileURLToPath } from 'url';
const __filename = path.join(fileURLToPath(import.meta.url), '../');
const __dirname = path.dirname(__filename);
const ejspath = path.join(__dirname, './template/index.ejs');
ejs.renderFile(ejspath, {
    testText: "test",
    title: "hoge"
}, function (err, html) {
    if (err) {
        console.log("error start");
        console.log(err);
        return;
    }
    console.log(html);
});
//# sourceMappingURL=app.js.map