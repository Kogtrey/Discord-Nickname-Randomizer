// bot.js
const { Intents } = require('discord.js');
const config = require('./config.json');

const AppClient = require('./client/AppClient');
const logger = require('./util/logger');

const DBM = require('./data/dbmanager');
const UserRepo = require('./data/Tables/UserRepo');
const NicknameRepo = require('./data/Tables/NicknameRepo');
const GuildUserRepo = require('./data/Tables/GuildUserRepo');
const GuildUserNicknameRepo = require('./data/Tables/GuildUserNicknameRepo');

const { loadCommands } = require('./handlers/commandLoader');
const { registerInteractionHandler } = require('./handlers/interactionHandler');
const { onReady } = require('./handlers/readyHandler');

const { DiscordMemberService } = require('./services/DiscordMemberService');
const { NicknameRotationService } = require('./services/NicknameRotationService');
const { ActivityService } = require('./services/ActivityService');

async function main() {
    const dbm = new DBM('./data/db.sqlite3', {
        busyTimeoutMs: 5000,
        enableWAL: true,
        synchronous: 'NORMAL',
    });

    const repos = {
        userRepo: new UserRepo(dbm),
        nicknameRepo: new NicknameRepo(dbm),
        guildUserRepo: new GuildUserRepo(dbm),
        guildUserNicknameRepo: new GuildUserNicknameRepo(dbm),
    };

    const client = new AppClient({
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MEMBERS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
            Intents.FLAGS.DIRECT_MESSAGES,
            Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
            Intents.FLAGS.GUILD_VOICE_STATES,
        ],
        partials: ['CHANNEL'], // DM support in v13
        config,
        repos,
        services: {},
        logger,
    });

    // Services
    const discordMemberService = new DiscordMemberService({ logger });
    const nicknameRotationService = new NicknameRotationService({ repos, discordMemberService, logger });
    const activityService = new ActivityService({ client, repos, config, logger });

    client.services.discordMemberService = discordMemberService;
    client.services.nicknameRotationService = nicknameRotationService;
    client.services.activityService = activityService;

    // Handlers
    loadCommands(client);
    registerInteractionHandler(client);
    client.once('ready', () => onReady(client));

    await client.login(config.token);

    process.on('SIGINT', async () => {
        logger.info('SIGINT received, shutting down...');
        try { await client.destroy(); } catch { }
        try { await dbm.close(); } catch { }
        process.exit(0);
    });

    process.on('SIGTERM', async () => {
        logger.info('SIGTERM received, shutting down...');
        try { await client.destroy(); } catch { }
        try { await dbm.close(); } catch { }
        process.exit(0);
    });

    process.on('unhandledRejection', (reason)=> {
        logger.error({reason}, 'Unhandled Promise Rejection');
    })

    process.on('uncaughtException', (err) => {
        logger.fatal({err}, 'Uncaught Exception');
        process.exit(1);
    });
}

main().catch((err) => {
    logger.error('Fatal startup error:', err);
    process.exit(1);
});