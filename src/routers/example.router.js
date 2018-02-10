'use strict'
const BaseRouter = require('@weeb_services/wapi-core').BaseRouter
const HTTPCodes = require('@weeb_services/wapi-core').Constants.HTTPCodes

class ExampleRouter extends BaseRouter {
  constructor () {
    super()
    this.get('/memes', () => {
      return {status: HTTPCodes.OK, message: 'no u'}
    })
  }
}

module.exports = ExampleRouter
