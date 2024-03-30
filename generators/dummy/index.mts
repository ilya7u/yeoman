import { Generator } from '../../src/index.mjs';

export default class extends Generator {
    constructor(args, opts) {
        super(args, opts);
        // this.argument('name', { type: String, required: true });
        // this.log(this.options.name);
        // console.log('DUMMY');
    }

    async writing() {}
}
