// jobs/startJobs.js
const { isShard0 } = require('../util/shard');
const { createNicknameRotationJob } = require('./nicknameRotationJob');
const { createWorkActivityJob, createSleepActivityJob } = require('./activityJobs');

function startJobs(client) {
    if (!isShard0(client)) {
        client.logger.info('Not shard 0; scheduled jobs will not start on this shard.');
        return;
    }

    createNicknameRotationJob(client).start();
    createWorkActivityJob(client).start();
    createSleepActivityJob(client).start();

    client.logger.info('Scheduled jobs started (shard 0).');
}

module.exports = { startJobs };