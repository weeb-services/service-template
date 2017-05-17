/**
 * Created by Julian/Wolke on 14.05.2017.
 */
const LevelModel = require('../DB/level.mongo');
/**
 * Level Provider, responsible for preventing spam across instances
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
     * @param {String} datasetId Id of the dataset (used for sharing data between accounts)
     * */
    async getLevelGuild(userId, guildId, datasetId) {
        let levelData = await this.redisCache.get(`${guildId}.${userId}.${datasetId}`);
        if (levelData) {
            return levelData;
        }
        levelData = await LevelModel.findOne({userId, guildId, datasetId}).lean().exec();
        if (levelData) {
            await this.redisCache.set(`${guildId}.${userId}.${datasetId}`, levelData);
            return levelData;
        }
        throw new Error('There is no data for this set of ids');
    }

    /**
     * Increase the xp of the user by the default amount of xp
     * @param {String} userId Id of the user
     * @param {String} guildId Id of the guild
     * @param {String} datasetId Id of the dataset (used for sharing data between accounts)
     * @param {String} accountId Id of the account which will be used as the owner (owner of the datasetId)
     * @return {Promise}
     */
    async incLevelGuild(userId, guildId, datasetId, accountId) {
        let levelData;
        let levelUp = false;
        try {
            levelData = await this.getLevelGuild(userId, guildId, datasetId);
        } catch (e) {
            levelData = new LevelModel({
                userId,
                guildId,
                datasetId,
                accountId,
                xp: 0,
                level: 1,
                totalXp: 0
            });
            await levelData.save();
            await this.redisCache.set(`${guildId}.${userId}.${datasetId}`, levelData);
        }
        if (this.options.spamProctection) {
            if (levelData.b1nzy) {
                if (levelData.b1nzy > Date.now()) {
                    return {levelData, levelUp};
                }
            }
            levelData.b1nzy = Date.now() + (this.options.cooldown * 1000);
        }
        levelData.xp += this.options.defaultXp;
        levelData.totalXp += this.options.defaultXp;
        if (levelData.xp >= levelData.level * 100 * 1.2) {
            levelUp = true;
            levelData.xp = 0;
            levelData.level++;
        }
        LevelModel.update({guildId, userId, datasetId});
        return {levelData, levelUp};
    }
}
module.exports = LevelProvider;