import { Generator, Options } from '../../src/index.mjs';

type GeneratorOptions = Options & {
    appname?: string;
};

export default class extends Generator<GeneratorOptions> {
    constructor(args, opts) {
        super(args, opts);

        // this.argument('appname', { type: String, required: true });

        // And you can then access it later; e.g.
        // this.log(this.options.appname);

        // this.argument('name', { type: String, description: 'Name of project', optional: true });

        // this.log(this.options.name);
        // this.log.writeln(this.options.name);
        // console.log(this.options.appname);
    }

    async writing() {
        this.copyTemplates({
            replaceOptions: {
                aaa: 'bbb',
                project: 'blabla',
            },
        });
        // this.fs.copyTpl(this.templatePath('.gitignore'), this.destinationPath('.gitignore'));
    }
}
