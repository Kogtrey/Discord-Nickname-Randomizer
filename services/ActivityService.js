// services/ActivityService.js
const { pickRandom } = require('../util/random');

class ActivityService {
    constructor({ client, repos, config, logger }) {
        this.client = client;
        this.repos = repos;
        this.config = config;
        this.logger = logger;
    }

    async setInitialActivity() {
        await this.setRandomizedActivity('float through space. [space non-noises]');
    }

    async setRandomizedActivity(activityText) {
        const sourceUserId = this.config.activity?.nicknameSourceUserId;

        if (!sourceUserId) {
            this.client.user.setActivity(activityText, { type: 'WATCHING' });
            return;
        }

        const rows = await this.repos.nicknameRepo.getNicknames(sourceUserId);
        const nick = rows?.length ? pickRandom(rows).nickname : null;

        const finalText = nick ? `${nick} ${activityText}` : activityText;
        this.client.user.setActivity(finalText, { type: 'WATCHING' });
        this.logger.info(`Set activity: ${finalText}`);
    }
}

module.exports = { ActivityService };