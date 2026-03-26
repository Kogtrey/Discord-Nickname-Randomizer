// handlers/readyHandler.js
const { startJobs } = require('../jobs/startJobs');

async function onReady(client) {
    client.logger.info(`Ready as ${client.user.tag}`);

    await Promise.all([
        client.repos.userRepo.createTable(),
        client.repos.nicknameRepo.createTable(),
        client.repos.guildUserRepo.createTable(),
        client.repos.guildUserNicknameRepo.createTable(),
    ]);

    await client.services.activityService.setInitialActivity();
    startJobs(client);
}

module.exports = { onReady };