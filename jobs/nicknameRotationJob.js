// jobs/nicknameRotationJob.js
const Cron = require('cron');

function createNicknameRotationJob(client) {
    const expr = client.config.jobs?.nicknameRotationCron ?? '1 18 * * *';
    const tz = client.config.jobs?.timezone ?? 'America/New_York';

    return new Cron.CronJob(expr, async () => {
        client.logger.info('Starting scheduled nickname rotation...');
        await client.services.nicknameRotationService.rotateNicknamesAcrossGuilds(client);
    }, null, false, tz);
}

module.exports = { createNicknameRotationJob };