'use strict';

const BaseRouter = require('./base.router');
const packageJson = require('../../package.json');

class GenericRouter extends BaseRouter {
    constructor() {
        super();

        this.all('/', async () => ({ version: packageJson.version, message: `Welcome to the ${packageJson.name}` }));
    }
}

module.exports = GenericRouter;
