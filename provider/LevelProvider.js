/**
 * Created by Julian/Wolke on 14.05.2017.
 */
/**
 * Level Provider, responsible for preventing spam across instances
 */
class LevelProvider {
    constructor(options) {
        options = this.checkOptions(options);
        this.options = options;
    }

    /**
     * Function that checks if all needed option keys are set,
     * throws error otherwise
     * @param options
     */
    checkOptions(options) {
        throw new Error `checkOptions() is not implemented by ${this.constructor.name}`;
    }



}
module.exports = LevelProvider;