import YeomanGenerator from 'yeoman-generator';
import path from 'path';
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

export class Generator extends YeomanGenerator {
    constructor(args, options) {
        super(args, options);
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
