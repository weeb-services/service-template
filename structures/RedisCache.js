class RedisCache {
    constructor(redisClient) {
        this.client = redisClient;
    }

    /**
     * Loads a value from cache via passed id
     * @param {String} id Key of value in cache
     * @return {Promise}
     */
    async get(id) {
        let val = await this.client.getAsync(id);
        //uwu
        return JSON.parse(val);
    }

    /**
     * Sets a value in the cache via passed id
     * @param {String} id Key of value in cache
     * @param {Object} value Value of the data that is to be cached
     * @return {Promise}
     */
    async set(id, value) {
        let val = JSON.stringify(value);
        await this.client.setAsync(id, val);
        return this.client.expireAsync(id, 60 * 60);
    }

    /**
     * Removes a value from cache via passed id
     * @param {String} id Key of value in cache
     * @return {Promise}
     */
    async remove(id) {
        return this.client.delAsync(id);
    }

    /**
     * Returns a boolean if the passed id is cached
     * @param {String} id Key of value in cache
     * @return {Promise}
     */
    async exists(id) {
        return this.client.existsAsync(id);
    }
}
module.exports = RedisCache;