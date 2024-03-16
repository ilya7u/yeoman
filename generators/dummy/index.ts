import { Generator } from '../../src';

export default class extends Generator {
    constructor(args, opts) {
        super(args, opts);
        // this.argument('name', { type: String, required: true });
        // this.log(this.options.name);
    }

    async writing() {}
}
