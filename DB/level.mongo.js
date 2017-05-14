let mongoose = require('mongoose');
let levelSchema = mongoose.Schema({
    id: String,
    guildId:String,
    xp: Number,
    level:Number
});
let levelModel = mongoose.model('Levels', levelSchema);
module.exports = levelModel;