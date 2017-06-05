/**
 * Created by Julian on 06.05.2017.
 */
let router = require('express').Router();
const winston = require('winston');
//get top 50 globally
router.get('/users/', async (req, res) => {
    try {
        if (req.provider.auth.needToken()) {
            if (!req.headers.authorization) {
                return res.status(401).json({
                    status: 401,
                    message: `This route requires authorization via a authorization header with a token`
                });
            }
            let auth = await req.provider.auth.checkToken(req.headers.authorization, `/users/`, 'get');
            if (!auth) {
                return res.status(401).json({
                    status: 401,
                    message: `The provided token is not valid or does not have enough permissions for this route`
                });
            }
        }
        let topUsers;
        try {
            topUsers = await req.provider.level.getTopGlobal();
        } catch (e) {
            winston.error(e);
            return res.status(404).json({status: 404, message: 'No data found for this query'});
        }
        return res.status(200).json({
            status: 200,
            data: topUsers,
            message: 'Fetched data successfully'
        });
    } catch (e) {
        winston.error(e);
        return res.status(500).json({status: 500, message: 'Internal error'});
    }
});
//get information about one user
router.get('/users/:userid', async (req, res) => {
    try {
        if (req.provider.auth.needToken()) {
            if (!req.headers.authorization) {
                return res.status(401).json({
                    status: 401,
                    message: `This route requires authorization via a authorization header with a token`
                });
            }
            let auth = await req.provider.auth.checkToken(req.headers.authorization, `/users/${req.params.userid}/`, 'get');
            if (!auth) {
                return res.status(401).json({
                    status: 401,
                    message: `The provided token is not valid or does not have enough permissions for this route`
                });
            }
        }
        if (!req.params.userid) {
            return res.status(400).json({status: 400, message: 'Missing parameters'});
        }
        let levelData;
        try {
            levelData = await req.provider.level.getLevelGlobal(req.params.userid);
        } catch (e) {
            return res.status(404).json({status: 404, message: 'No data found for this query'});
        }
        return res.status(200).json({
            status: 200,
            data: {xp: levelData.xp, userId: levelData.userId},
            message: 'Fetched data successfully'
        });
    } catch (e) {
        winston.error(e);
        return res.status(500).json({status: 500, message: 'Internal error'});
    }
});
//get the top 50 of a certain guild
router.get('/guilds/:guildid', async (req, res) => {
    try {
        if (req.provider.auth.needToken()) {
            if (!req.headers.authorization) {
                return res.status(401).json({
                    status: 401,
                    message: `This route requires authorization via a authorization header with a token`
                });
            }
            let auth = await req.provider.auth.checkToken(req.headers.authorization, `/guilds/${req.params.guildid}/`, 'get');
            if (!auth) {
                return res.status(401).json({
                    status: 401,
                    message: `The provided token is not valid or does not have enough permissions for this route`
                });
            }
        }
        if (!req.params.guildid) {
            return res.status(400).json({status: 400, message: 'Missing parameters'});
        }
        let topUsers;
        try {
            topUsers = await req.provider.level.getTopGuild(req.params.guildid);
        } catch (e) {
            winston.error(e);
            return res.status(404).json({status: 404, message: 'No data found for this query'});
        }
        return res.status(200).json({
            status: 200,
            data: topUsers,
            message: 'Fetched data successfully'
        });
    } catch (e) {
        winston.error(e);
        return res.status(500).json({status: 500, message: 'Internal error'});
    }
});
//reset levels for a whole guild
router.post('/guilds/:guildid/reset', async (req, res) => {

});
//get information for a certain user on a certain guild
router.get('/guilds/:guildid/:userid', async (req, res) => {
    try {
        if (req.provider.auth.needToken()) {
            if (!req.headers.authorization) {
                return res.status(401).json({
                    status: 401,
                    message: `This route requires authorization via a authorization header with a token`
                });
            }
            let auth = await req.provider.auth.checkToken(req.headers.authorization, `/guilds/${req.params.guildid}/${req.params.userid}/`, 'get');
            if (!auth) {
                return res.status(401).json({
                    status: 401,
                    message: `The provided token is not valid or does not have enough permissions for this route`
                });
            }
        }
        if (!req.params.guildid || !req.params.userid) {
            return res.status(400).json({status: 400, message: 'Missing parameters'});
        }
        // if (req.provider.data.needDatasetIdVerify()) {
        //
        // }
        let levelData;
        try {
            levelData = await req.provider.level.getLevelGuild(req.params.userid, req.params.guildid);
        } catch (e) {
            return res.status(404).json({status: 404, message: 'No data found for this query'});
        }
        return res.status(200).json({
            status: 200,
            data: {level: levelData.level, xp: levelData.xp, userId: levelData.userId, guildId: levelData.guildId},
            message: 'Fetched data successfully'
        });
    } catch (e) {
        winston.error(e);
        return res.status(500).json({status: 500, message: 'Internal error'});
    }
});
//increase xp for one user
router.post('/guilds/:guildid/:userid/inc', async (req, res) => {
    try {
        if (!req.params.guildid) {
            return res.status(400).json({status: 400, message: 'Missing parameters, you need to add a guildid'});
        }
        if (!req.params.userid) {
            return res.status(400).json({status: 400, message: 'Missing parameters, you need to add a userid'});
        }
        let accountData = {id: req.params.datasetid};
        if (req.provider.auth.needToken()) {
            if (!req.headers.authorization) {
                return res.status(401).json({
                    status: 401,
                    message: `This route requires authentization via a authorization header with a token`
                });
            }
            let auth = await req.provider.auth.checkToken(req.headers.authorization, `/guilds/${req.params.guildid}/${req.params.userid}/inc`, 'post');
            if (!auth) {
                return res.status(401).json({
                    status: 401,
                    message: `The provided token is not valid or does not have enough permissions for this route`
                });
            }
            let user = await req.provider.auth.getUser(req.headers.authorization);
            // accountData = {id: user.id};
        }
        let incResult = await req.provider.level.incLevelGuild(req.params.userid, req.params.guildid, accountData.id);
        console.log(incResult);
        return res.status(200).json({
            status: 200,
            data: {
                level: incResult.levelData.level,
                levelUp: incResult.levelUp,
                xp: incResult.levelData.xp,
                totalXp: incResult.globalLevelData.xp,
                userId: incResult.levelData.userId,
                guildId: incResult.levelData.guildId
            },
            message: "Updated level successfully"
        })
    } catch (e) {
        winston.error(e);
        return res.status(500).json({status: 500, message: 'Internal error'});
    }
});
//reset level for a user
router.post('/guilds/:guildid/:userid/reset', async (req, res) => {

});
module.exports = router;