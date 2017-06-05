let mongoose = require('mongoose');
let levelSchema = mongoose.Schema({
    userId: String,
    xp: Number,
    accountId: String
});
let levelModel = mongoose.model('Globallevels', levelSchema);
module.exports = levelModel;