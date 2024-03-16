import YeomanGenerator, { GeneratorOptions } from 'yeoman-generator';
import path from 'path';
import { inspect } from 'util';
import fs from 'fs';

function getFiles(baseDir: string, subDirs: string[] = []) {
    const files = [];
    for (const item of fs.readdirSync(path.resolve(baseDir, ...subDirs), { withFileTypes: true })) {
        if (item.isDirectory()) {
            files.push(...getFiles(baseDir, [...subDirs, item.name]));
        } else {
            files.push([...subDirs, item.name]);
        }
    }
    return files;
}

export class Generator<T extends GeneratorOptions = GeneratorOptions> extends YeomanGenerator<T> {
    constructor(args, options) {
        super(args, options);
    }

    dump(data) {
        console.log(inspect(data, true, 5, true));
    }

    copyTemplates(data: any = {}) {
        const files = getFiles(this.templatePath());
        for (const file of files) {
            const dirName = path.dirname(path.resolve(this.destinationPath(), ...file));
            if (!fs.existsSync(dirName)) {
                fs.mkdirSync(dirName, { recursive: true });
            }
            this.fs.copyTpl(this.templatePath(...file), this.destinationPath(...file), data);
        }
    }
}
