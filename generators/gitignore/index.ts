import { Generator } from '../../src';

export default class extends Generator {
    constructor(args, options) {
        super(args, options);
    }

    writing() {
        this.fs.copyTpl(this.templatePath('.gitignore'), this.destinationPath('.gitignore'));
    }
}
