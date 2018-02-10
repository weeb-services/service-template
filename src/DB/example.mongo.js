const mongoose = require('mongoose')
const exampleSchema = mongoose.Schema({
  name: String,
  id: String
})
const exampleModel = mongoose.model('examples', exampleSchema)
module.exports = exampleModel
