// services/DiscordMemberService.js
class DiscordMemberService {
    constructor({ logger }) {
        this.logger = logger;
    }

    async fetchMember(guild, userId, context = {}) {
        try {
            return await guild.members.fetch(userId);
        } catch (err) {
            this.logger.warn(
                `Failed to fetch member userId=${userId} guild=${guild.id}` +
                (context.name ? ` name=${context.name}` : '') +
                `. Reason: ${err.message}`
            );
            return null;
        }
    }

    async setNicknameSafe(member, nickname, context = {}) {
        try {
            await member.setNickname(nickname);
            return { ok: true };
        } catch (err) {
            this.logger.warn(
                `Failed to set nickname guild=${member.guild?.id} userId=${member.id}` +
                (context.name ? ` name=${context.name}` : '') +
                ` to="${nickname}". Reason: ${err.message}`
            );
            return { ok: false, err };
        }
    }
}

module.exports = { DiscordMemberService };