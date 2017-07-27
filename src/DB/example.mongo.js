let mongoose = require('mongoose');
let exampleSchema = mongoose.Schema({
    name: String,
    id: String,
});
let exampleModel = mongoose.model('examples', exampleSchema);
module.exports = exampleModel;
