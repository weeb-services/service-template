/**
 * Created by Julian on 06.05.2017.
 */
let router = require('express').Router();
//get information about one user
router.get('/users/:userid', async (req, res) => {

});
//get the top 50 of a certain guild
router.get('/:guildid', async (req, res) => {

});
//reset levels for a whole guild
router.post('/:guildId/reset',async(req,res) => {

});
//get information for a certain user on a certain guild
router.get('/:guildid/:userid', async (req, res) => {

});
//increase xp for one user
router.post('/:guildid/:userid/inc', async (req, res) => {

});
//reset level for a user
router.post('/:guildid/:userid/reset', async (req, res) => {

});
module.exports = router;