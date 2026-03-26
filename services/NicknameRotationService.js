// services/NicknameRotationService.js
const { pickDifferent } = require('../util/random');

class NicknameRotationService {
    constructor({ repos, discordMemberService, logger }) {
        this.repos = repos;
        this.discordMemberService = discordMemberService;
        this.logger = logger;
    }

    async rotateNicknamesAcrossGuilds(client) {
        const guilds = await client.guilds.fetch();
        if (guilds.size === 0) {
            this.logger.info('No registered guilds. Skipping nickname rotation.');
            return;
        }

        // Sequential to reduce rate limit pressure
        for (const [, guildRef] of guilds) {
            const guild = await client.guilds.fetch(guildRef.id);
            await this.rotateNicknamesInGuild(guild);
        }
    }

    async rotateNicknamesInGuild(guild) {
        const guildUsers = await this.repos.guildUserRepo.getGuildUserInfoByGuildId(guild.id);

        if (!guildUsers || guildUsers.length === 0) {
            this.logger.info(`No opted-in users in guild ${guild.id}. Skipping.`);
            return;
        }

        for (const guildUser of guildUsers) {
            await this.rotateNicknameForGuildUser(guild, guildUser);
        }
    }

    async rotateNicknameForGuildUser(guild, guildUser) {
        const member = await this.discordMemberService.fetchMember(guild, guildUser.userId, { name: guildUser.name });
        if (!member) return;

        let nicknameRows;
        if (guildUser.guildsync === 1) {
            nicknameRows = await this.repos.nicknameRepo.getNicknames(guildUser.userId);
        } else {
            nicknameRows = await this.repos.guildUserNicknameRepo.getGuildUserNicknames(guildUser.id);
        }

        if (!nicknameRows || nicknameRows.length === 0) {
            this.logger.info(`No nicknames for userId=${guildUser.userId} guild=${guild.id}. Skipping.`);
            return;
        }

        const pool = nicknameRows.map(r => r.nickname).filter(Boolean);
        const oldNickname = member.nickname; // null if none
        const newNickname = pickDifferent(oldNickname, pool);

        if (!newNickname) {
            this.logger.info(`No valid nickname change for userId=${guildUser.userId} guild=${guild.id}. Skipping.`);
            return;
        }

        const res = await this.discordMemberService.setNicknameSafe(member, newNickname, { name: guildUser.name });
        if (res.ok) {
            this.logger.info(
                `Changed nickname userId=${guildUser.userId} guild=${guild.id} to "${newNickname}" (was "${oldNickname}")`
            );
        }
    }
}

module.exports = { NicknameRotationService };