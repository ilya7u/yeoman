import YeomanGenerator from 'yeoman-generator';
import { Data as TemplateData, Options as TemplateOptions } from 'ejs';
import path from 'path';
import { inspect } from 'util';
import fs from 'fs';

interface AnyProperties {
    [prop: string]: any;
}

export type CopyOptions = AnyProperties & {
    processDestinationPath?: (string: any) => string;
};

export interface CopyTemplatesOptions {
    context?: TemplateData;
    templateOptions?: TemplateOptions;
    copyOptions?: CopyOptions;
    replaceOptions?: any;
}

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

    dump(data) {
        console.log(inspect(data, true, 5, true));
    }

    copyTemplates(options: CopyTemplatesOptions = {}) {
        options.replaceOptions = options.replaceOptions || {};
        const files = getFiles(this.templatePath());
        for (const file of files) {
            const newFile = [...file];
            for (const rData of Object.entries(options.replaceOptions)) {
                const idx = newFile.indexOf(rData[0]);
                if (idx != -1) {
                    newFile[idx] = rData[1];
                }
            }
            const dirName = path.dirname(path.resolve(this.destinationPath(), ...newFile));
            if (!fs.existsSync(dirName)) {
                fs.mkdirSync(dirName, { recursive: true });
            }
            this.fs.copyTpl(
                this.templatePath(...file),
                this.destinationPath(...newFile),
                options.context,
                options.templateOptions,
                options.copyOptions,
            );
        }
    }
}
