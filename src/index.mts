import fs from 'fs';
import path from 'path';
// import {
//     File,
//     Ini,
//     Json,
//     Lines,
//     Markdown,
//     Template,
//     Yaml,
//     file,
//     ini,
//     json,
//     lines,
//     markdown,
//     template,
//     yaml,
// } from 'mrm-core';

// export { File, Ini, Json, Lines, Markdown, Template, Yaml, file, ini, json, lines, markdown, template, yaml };

const BEGIN = `'use strict';

module.exports = {
`;

const END = `};
`;

export * from './Generator.mjs';

export const generateIndex = (generatorsPath: string, indexPath: string) => {
    if (!indexPath.endsWith('index.js')) {
        indexPath = path.resolve(indexPath, 'index.js');
    }

    const dirs = fs
        .readdirSync(generatorsPath, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);
    let text = BEGIN;
    for (const dir of dirs) {
        text += `    ${dir}: require.resolve('./generators/${dir}'),\r\n`;
    }

    text += END;

    fs.writeFileSync(indexPath, text);
};
