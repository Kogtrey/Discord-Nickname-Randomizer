// jobs/activityJobs.js
const Cron = require('cron');

function createWorkActivityJob(client) {
    const expr = client.config.jobs?.workActivityCron ?? '0 6 * * *';
    const tz = client.config.jobs?.timezone ?? 'America/New_York';

    return new Cron.CronJob(expr, async () => {
        await client.services.activityService.setRandomizedActivity('work. [Work Noises]');
    }, null, false, tz);
}

function createSleepActivityJob(client) {
    const expr = client.config.jobs?.sleepActivityCron ?? '0 20 * * *';
    const tz = client.config.jobs?.timezone ?? 'America/New_York';

    return new Cron.CronJob(expr, async () => {
        await client.services.activityService.setRandomizedActivity('sleep. Zzzzzz');
    }, null, false, tz);
}

module.exports = { createWorkActivityJob, createSleepActivityJob };