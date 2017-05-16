/**
 * Created by Julian/Wolke on 14.05.2017.
 */
const LevelModel = require('../DB/level.mongo');
/**
 * Level Provider, responsible for preventing spam across instances
 */
class LevelProvider {
    constructor(options, redis) {
        options = this.checkOptions(options);
        this.options = options;
        this.redis = redis;
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
    async getLevel(userId, guildId, datasetId) {

    }

}
module.exports = LevelProvider;