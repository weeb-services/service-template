'use strict';
const BaseRouter = require('wapi-core').BaseRouter;
const HTTPCodes = require('wapi-core').Constants.HTTPCodes;

class ExampleRouter extends BaseRouter {
    constructor() {
        super();
        this.get('/memes', () => {
            return { status: HTTPCodes.OK, message: 'no u' };
        });
    }
}

module.exports = ExampleRouter;
