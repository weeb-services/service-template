'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const winston = require('winston')
const cors = require('cors')
const mongoose = require('mongoose')
mongoose.Promise = Promise

const pkg = require('../package.json')
const permNodes = require('./permNodes.json')

const GenericRouter = require('@weeb_services/wapi-core').GenericRouter
const WildcardRouter = require('@weeb_services/wapi-core').WildcardRouter

const AuthMiddleware = require('@weeb_services/wapi-core').AccountAPIMiddleware

winston.remove(winston.transports.Console)
winston.add(winston.transports.Console, {
  timestamp: true,
  colorize: true
})

const init = async () => {
  let config
  try {
    config = require('../config/main.json')
  } catch (e) {
    winston.error(e)
    winston.error('Failed to require config.')
    return process.exit(1)
  }
  winston.info('Config loaded.')

  try {
    await mongoose.connect(config.dburl, {useMongoClient: true})
  } catch (e) {
    winston.error('Unable to connect to Mongo Server.')
    return process.exit(1)
  }
  winston.info('MongoDB connected.')

  // Initialize express
  const app = express()

  // Middleware for config
  app.use((req, res, next) => {
    req.config = config
    next()
  })

  // Some other middleware
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({extended: true}))
  app.use(cors())

    // Auth middleware
    app.use(new AuthMiddleware('http://localhost:9010', `${pkg.name}/${pkg.version}`).middleware());

  // Routers
  app.use(new GenericRouter(pkg.version, `Welcome to the ${pkg.name}`, `${pkg.name}-${config.env}`, permNodes).router())

  // add custom routers here:

  // Always use this last
  app.use(new WildcardRouter().router())

  app.listen(config.port, config.host)
  winston.info(`Server started on ${config.host}:${config.port}`)
}

init()
  .catch(e => {
    winston.error(e)
    winston.error('Failed to initialize.')
    process.exit(1)
  })
