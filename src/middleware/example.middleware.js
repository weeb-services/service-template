'use strict';
const BaseMiddleware = require('wapi-core').BaseMiddleware;
const HTTPCodes = require('wapi-core').Constants.HTTPCodes;

class ExampleMiddleware extends BaseMiddleware {
    async exec(req, res) {
        // do stuff here
        return HTTPCodes.OK;
    }
}

module.exports = ExampleMiddleware;
