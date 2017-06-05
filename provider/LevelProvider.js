/**
 * Created by Julian/Wolke on 14.05.2017.
 */
const LevelModel = require('../DB/level.mongo');
const GlobalLevelModel = require('../DB/globalData.mongo');
/**
 * Level Provider, responsible for preventing spam across instances and
 * updating the actual data
 */
class LevelProvider {
    constructor(options, redisCache) {
        options = this.checkOptions(options);
        this.options = options;
        this.redisCache = redisCache;
    }

    /**
     * Function that checks if all needed option keys are set,
     * throws error otherwise
     * @param options
     */
    checkOptions(options) {
        if (options.spamProtection) {
            if (!options.cooldown) {
                throw new Error('Option cooldown is required when spamProtection is set to true');
            }
        }
        if (!options.defaultXp) {
            throw new Error('Option defaultXp is missing');
        }
        return options;
    }

    /**
     * Gets the level of a user on a certain guild
     * @param {String} userId Id of the user
     * @param {String} guildId Id of the guild
     * */
    async getLevelGuild(userId, guildId) {
        let levelData = await this.redisCache.get(`${guildId}.${userId}`);
        if (levelData) {
            return levelData;
        }
        levelData = await LevelModel.findOne({userId, guildId}).lean().exec();
        if (levelData) {
            await this.redisCache.set(`${guildId}.${userId}`, levelData);
            return levelData;
        }
        throw new Error('There is no data for this set of ids');
    }

    /**
     * Gets the top 50 users of a guild
     * @param {String} guildId Id of the guild
     * @return {Promise}
     */
    async getTopGuild(guildId) {
        let guildData = await this.redisCache.get(`${guildId}.top50`);
        if (guildData) {
            return guildData;
        }
        guildData = await LevelModel.find({guildId}).select('userId xp').sort({xp: -1}).lean().exec();
        if (guildData) {
            await this.redisCache.set(`${guildId}.top50`, guildData);
            return guildData;
        }
        throw new Error('There is no data yet');
    }

    /**
     * Returns the global data of a user from that dataset, so essentially the
     * total xp
     * @param userId
     * @return {Promise}
     */
    async getLevelGlobal(userId) {
        let levelData = await this.redisCache.get(`global.${userId}`);
        if (levelData) {
            return levelData;
        }
        levelData = await GlobalLevelModel.findOne({userId}).lean().exec();
        if (levelData) {
            await this.redisCache.set(`global.${userId}`, levelData);
            return levelData;
        }
        throw new Error('There is no data for this set of ids');
    }

    /**
     * Returns an array of Users sorted by the totalXp, max 50 entries
     * @return {Promise.<void>}
     */
    async getTopGlobal() {
        let userData = await this.redisCache.get('global.top50');
        if (userData) {
            return userData;
        }
        userData = await GlobalLevelModel.find().select('userId xp').sort({totalXp: -1}).lean().exec();
        if (userData) {
            await this.redisCache.set(`global.top50`, userData);
            return userData;
        }
        throw new Error('There is no data yet');
    }

    /**
     * Increase the xp of the user by the default amount of xp
     * @param {String} userId Id of the user
     * @param {String} guildId Id of the guild
     * @param {String} accountId Id of the account which will be used as the
     * owner (owner of the datasetId)
     * @return {Promise}
     */
    async incLevelGuild(userId, guildId, accountId) {
        let levelData;
        let levelUp = false;
        try {
            levelData = await this.getLevelGuild(userId, guildId);
        } catch (e) {
            levelData = new LevelModel({
                userId,
                guildId,
                accountId,
                xp: 0,
                level: 1,
                totalXp: 2
            });
            await levelData.save();
            await this.redisCache.set(`${guildId}.${userId}`, levelData);
        }

        if (this.options.spamProctection) {
            if (levelData.b1nzy) {
                if (levelData.b1nzy > Date.now()) {
                    console.log('RATELIMITED');
                    return {levelData, levelUp};
                }
            }
            levelData.b1nzy = Date.now() + (this.options.cooldown * 1000);
        }
        levelData.xp += this.options.defaultXp;
        if (levelData.xp >= levelData.level * 100 * 1.2) {
            levelUp = true;
            levelData.xp = 0;
            levelData.level++;
        }
        let globalLevelData = await this.incGlobalLevel(userId, accountId);
        await LevelModel.update({guildId, userId}, {$set: {xp: levelData.xp, level: levelData.level}});
        await this.redisCache.set(`${guildId}.${userId}`, levelData);
        return {levelData, globalLevelData, levelUp};
    }

    /**
     * Increases the global experience points of a user
     * @param {String} userId Id of the user
     * @param {String} accountId Id of the account which will be used as the
     * owner (owner of the datasetId)
     * @return {Promise}
     */
    async incGlobalLevel(userId, accountId) {
        let levelData;
        try {
            levelData = await this.getLevelGlobal(userId);
        } catch (e) {
            levelData = new GlobalLevelModel({
                userId,
                accountId,
                xp: 0
            });
            await levelData.save();
            await this.redisCache.set(`global.${userId}`, levelData);
        }
        levelData.xp += this.options.defaultXp;
        await GlobalLevelModel.update({userId}, {$set: {xp: levelData.xp}});
        await this.redisCache.set(`global.${userId}`, levelData);
        return levelData;
    }
}
module.exports = LevelProvider;