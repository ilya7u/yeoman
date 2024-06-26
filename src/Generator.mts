import YeomanGenerator, { BaseOptions } from 'yeoman-generator';
import { Data as TemplateData, Options as TemplateOptions } from 'ejs';
import path from 'path';
import { inspect } from 'util';
import fs from 'fs';
import { createEnv } from 'yeoman-environment';

interface AnyProperties {
    [prop: string]: any;
}

export type CopyOptions = AnyProperties & {
    process?: (contents: string | Buffer, filepath: string, destination: string) => string | Buffer;
    processDestinationPath?: (string: any) => string;
};

export type Options = BaseOptions;

export interface CopyTemplatesOptions {
    context?: TemplateData;
    templateOptions?: TemplateOptions;
    copyOptions?: CopyOptions;
    replaceOptions?: any;
}

function getFiles(baseDir: string, subDirs: string[] = []) {
    const files: any[] = [];
    for (const item of fs.readdirSync(path.resolve(baseDir, ...subDirs), { withFileTypes: true })) {
        if (item.isDirectory()) {
            files.push(...getFiles(baseDir, [...subDirs, item.name]));
        } else {
            files.push([...subDirs, item.name]);
        }
    }
    return files;
}

export class Generator<O extends BaseOptions = BaseOptions> extends YeomanGenerator<O> {
    constructor(args, options) {
        super(args, options);
    }

    async test() {
        const env = createEnv();
        await env.lookupLocalPackages();
        await env.execute('dummy:dummy', []);
        // await env.run(['dummy:dummy']);

        // console.log(JSON.stringify(result, null, 4));
    }

    dump(data) {
        console.log(inspect(data, true, 5, true));
    }

    runSync(cmd: string) {
        const parts = cmd.split(/\s+/);
        if (parts.length === 0) {
            return;
        }
        const first: string = parts.shift() || '';
        this.spawnSync(first, parts);
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
