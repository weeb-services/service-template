let mongoose = require('mongoose');
let levelSchema = mongoose.Schema({
    userId: String,
    guildId:String,
    xp: Number,
    level: Number,
    accountId: String,
    datasetId: String
});
let levelModel = mongoose.model('Levels', levelSchema);
module.exports = levelModel;