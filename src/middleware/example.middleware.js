'use strict'
const BaseMiddleware = require('@weeb_services/wapi-core').BaseMiddleware
const HTTPCodes = require('@weeb_services/wapi-core').Constants.HTTPCodes

class ExampleMiddleware extends BaseMiddleware {
  async exec (req, res) {
    // do stuff here
    return HTTPCodes.OK
  }
}

module.exports = ExampleMiddleware
